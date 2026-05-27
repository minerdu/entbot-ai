const http = require("http");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

const root = __dirname;
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

const port = Number(process.env.PORT || 4188);
const aiBaseUrl = (process.env.TOKEN_PLAN_BASE_URL || "https://token-plan-cn.xiaomimimo.com/v1").replace(/\/$/, "");
const aiModel = process.env.TOKEN_PLAN_MODEL || "mimo-v2.5-pro";
const apiKey = process.env.TOKEN_PLAN_API_KEY;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

const blockedStaticSegments = new Set(["docs", "functions", "node_modules", "scripts"]);
const blockedStaticFiles = new Set(["server.js", "package.json", "package-lock.json"]);

function isBlockedStaticPath(safePath) {
  const segments = safePath.split(/[\\/]+/).filter(Boolean);
  if (!segments.length) return false;

  if (segments.some((segment) => segment.startsWith(".") || segment === "_source" || segment === "_exports")) {
    return true;
  }

  if (segments.some((segment) => blockedStaticSegments.has(segment))) {
    return true;
  }

  const fileName = segments[segments.length - 1].toLowerCase();
  return blockedStaticFiles.has(fileName) || /\.(log|md|map)$/i.test(fileName);
}

let cachedSystemPrompt;

async function loadSystemPrompt() {
  if (!cachedSystemPrompt) {
    const promptUrl = pathToFileURL(path.join(root, "functions", "_shared", "growthAdvisorPrompt.mjs")).href;
    const promptModule = await import(promptUrl);
    cachedSystemPrompt = promptModule.SYSTEM_PROMPT;
  }
  return cachedSystemPrompt;
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        request.destroy();
        reject(new Error("request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function isProductInfoQuestion(message) {
  const value = String(message || "").replace(/\s+/g, "");
  return /什么是AI?(引流|招商|运营|培训)/i.test(value) ||
    /AI?(引流|招商|运营|培训)(是什么|能做什么|介绍|功能|怎么用)/i.test(value) ||
    /(介绍|说明|讲讲).{0,8}AI?(引流|招商|运营|培训)/i.test(value);
}

function isFirstConsultation(history, message) {
  return (!Array.isArray(history) || history.length === 0) && String(message || "").trim().length > 0;
}

function hasAskedDiagnosticQuestion(history) {
  return Array.isArray(history) && history.some((item) => item && item.role === "assistant" && /[?？]/.test(String(item.content || "")));
}

function buildTurnPolicy(history, message) {
  const lastAssistant = [...history].reverse().find((item) => item && item.role === "assistant" && item.content);
  const lastAssistantAsked = /[?？]/.test(String(lastAssistant?.content || ""));
  if (isProductInfoQuestion(message)) {
    return [
      "## 本轮强制规则",
      "用户在询问产品概念或功能。请基于官网产品知识直接解释，不要复用上一轮的业务方案。",
      "解释时要说明它解决什么业务问题、主要模块是什么、与 Agent + Skill 和 AI APP 工作流的关系。",
      "回复要完整收尾，避免过长列表。"
    ].join("\n");
  }

  if (isFirstConsultation(history, message)) {
    return [
      "## 本轮强制规则",
      "这是新客户首次咨询。先简短复述你理解到的行业/目标，再只问一个最关键的需求确认问题。",
      "不要直接给完整实施方案；本轮重点是把客户需求从泛泛目标确认到一个主要卡点。",
      "问题必须具体，且只能问一个。"
    ].join("\n");
  }

  if (lastAssistantAsked || hasAskedDiagnosticQuestion(history)) {
    return [
      "## 本轮强制规则",
      "客户已经回应过需求确认。不要连续追问。",
      "本轮必须按照“需求判断 -> AI 解决方案 -> 实施建议 -> 服务/合作建议”的思路回答。",
      "可以在最后给一个很轻的下一步建议，但不要再抛新的诊断问题。",
      "回复要完整收尾，优先控制在 220-420 个中文字符。"
    ].join("\n");
  }

  return [
    "## 本轮强制规则",
    "根据客户本轮问题自然回答。优先给判断和方案；只有确实缺一个关键事实时，才允许最后问一个问题。"
  ].join("\n");
}

function normalizeAiReply(reply) {
  const cleaned = String(reply || "")
    .replace(/\*\*/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .trim();

  return paragraphizeReply(cleaned);
}

function compactLength(text) {
  return String(text || "").replace(/\s+/g, "").length;
}

function splitIntoSentenceUnits(text) {
  const units = [];
  const sentenceParts = String(text || "").match(/[^。！？!?；;]+[。！？!?；;]?/g) || [text];

  for (const sentence of sentenceParts) {
    if (compactLength(sentence) <= 130) {
      units.push(sentence.trim());
      continue;
    }

    const clauseParts = sentence.match(/[^，、,:：]+[，、,:：]?/g) || [sentence];
    for (const clause of clauseParts) {
      if (clause.trim()) units.push(clause.trim());
    }
  }

  return units.filter(Boolean);
}

function paragraphizeLongBlock(block) {
  if (compactLength(block) <= 180 || /^\s*\d+[.、]/m.test(block)) return block.trim();

  const units = splitIntoSentenceUnits(block);
  const paragraphs = [];
  let current = "";

  for (const unit of units) {
    const next = current ? `${current}${unit}` : unit;
    if (current && compactLength(next) > 220 && compactLength(current) >= 100) {
      paragraphs.push(current.trim());
      current = unit;
    } else {
      current = next;
    }
  }

  if (current.trim()) paragraphs.push(current.trim());

  if (paragraphs.length > 1 && compactLength(paragraphs[paragraphs.length - 1]) < 35) {
    const tail = paragraphs.pop();
    paragraphs[paragraphs.length - 1] = `${paragraphs[paragraphs.length - 1]}${tail}`;
  }

  return paragraphs.join("\n\n");
}

function paragraphizeReply(reply) {
  const blocks = String(reply || "")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, "\n").trim())
    .filter(Boolean);

  return blocks.map(paragraphizeLongBlock).join("\n\n").trim();
}

function isLikelyIncompleteReply(reply) {
  const value = String(reply || "").trim();
  if (!value) return true;

  const hasTerminalPunctuation = /[。！？.!?]$/.test(value);
  if (!hasTerminalPunctuation && value.length < 260) return true;
  if (value.length < 40 && !hasTerminalPunctuation) return true;

  return /(因为|没有|需要|通过|建议|包括|核心在于|通常是|可以先|先把|拆成|而是|不是)$/u.test(value);
}

async function requestAiCompletion(messages, maxTokens = 900) {
  const upstream = await fetch(`${aiBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: aiModel,
      messages,
      temperature: 0.24,
      max_tokens: maxTokens
    })
  });

  const data = await upstream.json().catch(() => ({}));
  return { upstream, data };
}

async function handleChat(request, response) {
  if (!apiKey) {
    sendJson(response, 500, { error: "TOKEN_PLAN_API_KEY is not configured" });
    return;
  }

  const raw = await readBody(request);
  const payload = raw ? JSON.parse(raw) : {};
  const message = String(payload.message || "").trim();
  const intent = String(payload.intent || "diagnosis").slice(0, 40);
  const history = Array.isArray(payload.history) ? payload.history.slice(-10) : [];

  if (!message) {
    sendJson(response, 400, { error: "message is required" });
    return;
  }

  const systemPrompt = await loadSystemPrompt();
  const turnPolicy = buildTurnPolicy(history, message);
  const messages = [
    { role: "system", content: `${systemPrompt}\n当前入口意图：${intent}` },
    { role: "system", content: turnPolicy },
    ...history
      .filter((item) => item && ["user", "assistant"].includes(item.role) && item.content)
      .map((item) => ({ role: item.role, content: String(item.content).slice(0, 1200) })),
    { role: "user", content: message.slice(0, 2000) }
  ];

  let { upstream, data } = await requestAiCompletion(messages);

  if (!upstream.ok) {
    sendJson(response, upstream.status, { error: data.error?.message || "upstream AI request failed" });
    return;
  }

  let reply = normalizeAiReply(data.choices?.[0]?.message?.content || "");

  if (isLikelyIncompleteReply(reply)) {
    const repairMessages = [
      { role: "system", content: "上一轮模型输出疑似不完整或提前中断。请忽略不完整文本，重新回答最后一条用户消息。仍然必须遵守本轮强制规则：不要套固定话术，不要连续追问，围绕官网产品知识和客户当前问题给出完整中文答复，并自然收尾。" },
      ...messages
    ];
    const repaired = await requestAiCompletion(repairMessages, 1100);
    if (repaired.upstream.ok) {
      const repairedReply = normalizeAiReply(repaired.data.choices?.[0]?.message?.content || "");
      if (repairedReply) {
        reply = repairedReply;
        data = repaired.data;
      }
    }
  }

  sendJson(response, 200, {
    reply,
    model: data.model || aiModel
  });
}

function serveStatic(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);
  const safePath = path
    .normalize(pathname)
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");

  if (isBlockedStaticPath(safePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const filePath = path.join(root, safePath ? safePath : "index.html");

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500);
      response.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url.startsWith("/api/chat")) {
      await handleChat(request, response);
      return;
    }

    if (request.method === "GET" || request.method === "HEAD") {
      serveStatic(request, response);
      return;
    }

    response.writeHead(405);
    response.end("Method not allowed");
  } catch (error) {
    sendJson(response, 500, { error: error.message || "server error" });
  }
});

server.listen(port, () => {
  console.log(`entbot-ai preview server: http://127.0.0.1:${port}`);
});
