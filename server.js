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
const aiBaseUrl = (process.env.TOKEN_PLAN_BASE_URL || "https://api.moonshot.cn/v1").replace(/\/$/, "");
const aiModel = process.env.TOKEN_PLAN_MODEL || "kimi-k2.6";
const aiTemperature =
  process.env.TOKEN_PLAN_TEMPERATURE === undefined || process.env.TOKEN_PLAN_TEMPERATURE.trim() === ""
    ? undefined
    : Number(process.env.TOKEN_PLAN_TEMPERATURE);
const aiThinkingType = (process.env.TOKEN_PLAN_THINKING || "disabled").trim();
const aiDeepThinkingType = (process.env.TOKEN_PLAN_DEEP_THINKING || "disabled").trim();
const aiDeepMaxTokens = readPositiveNumber(process.env.TOKEN_PLAN_DEEP_MAX_TOKENS, 1800);
const aiDeepFallbackMaxTokens = readPositiveNumber(process.env.TOKEN_PLAN_DEEP_FALLBACK_MAX_TOKENS, 1600);
const aiDeepThinkingTimeoutMs = readPositiveNumber(process.env.TOKEN_PLAN_DEEP_THINKING_TIMEOUT_MS, 9000);
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

function readPositiveNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function isDeepDiagnosticRequest(message) {
  const value = String(message || "").replace(/\s+/g, "").toLowerCase();
  return /深度诊断|诊断判断|真正卡在哪|卡在哪个增长环节|优先用哪类ai|优先用哪个ai|优先切入|增长卡点|deepdiagnosis|deepdiagnose/i.test(value);
}

function isLongPlanRequest(message) {
  const value = String(message || "").replace(/\s+/g, "").toLowerCase();
  return /详细方案|完整方案|详细诊断|完整诊断|详细报告|完整报告|系统方案|完整规划|完整分析|深入分析|深度方案|实施计划书|写一份方案|帮我拆解|拆解一下|拆解方案|longplan/i.test(value);
}

function buildTurnPolicy(history, message, options = {}) {
  const lastAssistant = [...history].reverse().find((item) => item && item.role === "assistant" && item.content);
  const lastAssistantAsked = /[?？]/.test(String(lastAssistant?.content || ""));

  if (options.longPlan) {
    return [
      "## 本轮强制规则",
      "用户正在请求详细方案或完整报告，本轮允许输出较完整的方案。",
      "不要输出思考过程、reasoning_content、内部推理或模型参数，只输出适合官网访客阅读的最终答案。",
      "请基于最近上下文和当前问题，按“需求判断 -> 优先卡点 -> AI 解决方案 -> 落地步骤 -> 服务/合作建议”的思路回答。",
      "方案要结合蔚为的 AI 引流、AI 招商、AI 运营、AI 培训、Agent、Skill 和 AI APP 工作流。",
      "如果信息不足，先给可判断部分，最后只列最多 3 个必须补充的问题；不要把整篇回复变成问卷。",
      "回复要具体、可执行，优先控制在 700-1200 个中文字符。"
    ].join("\n");
  }

  if (options.deepDiagnosis) {
    return [
      "## 本轮强制规则",
      "用户请求的是洞察式诊断，不是长篇报告。不要把深度理解成字数更多。",
      "本轮必须给出一个明确判断：客户表面问题是什么，背后更可能卡在哪个增长环节。",
      "必须说明为什么优先从这个环节切入，而不是平均展开所有产品。",
      "必须推荐一个最优先的 AI APP 或 AI 工作流切口，并说明它负责解决哪一段业务动作。",
      "可以提到第二优先级，但不能写成产品清单。",
      "如果信息不足，也要先基于常见模式给假设判断，再最后只问 1 个最关键确认问题。",
      "回复控制在 350-650 个中文字符，语气像顾问做判断，不要写成完整方案或项目计划。"
    ].join("\n");
  }

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

async function requestAiCompletion(messages, options = {}) {
  const maxTokens = options.maxTokens ?? 900;
  const thinkingType = options.thinkingType === undefined ? aiThinkingType : options.thinkingType;
  const controller = options.timeoutMs ? new AbortController() : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), options.timeoutMs) : undefined;
  const requestBody = {
    model: aiModel,
    messages,
    max_tokens: maxTokens
  };

  if (thinkingType && thinkingType !== "default") {
    requestBody.thinking = { type: thinkingType };
  }

  if (Number.isFinite(aiTemperature) && thinkingType !== "disabled") {
    requestBody.temperature = aiTemperature;
  }

  try {
    const upstream = await fetch(`${aiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller?.signal
    });

    const data = await upstream.json().catch(() => ({}));
    return { upstream, data };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
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
  const longPlan = Boolean(payload.longPlan) || isLongPlanRequest(message);
  const deepDiagnosis = !longPlan && (Boolean(payload.deepDiagnosis) || isDeepDiagnosticRequest(message));

  if (!message) {
    sendJson(response, 400, { error: "message is required" });
    return;
  }

  const systemPrompt = await loadSystemPrompt();
  const turnPolicy = buildTurnPolicy(history, message, { deepDiagnosis, longPlan });
  const messages = [
    { role: "system", content: `${systemPrompt}\n当前入口意图：${intent}` },
    { role: "system", content: turnPolicy },
    ...history
      .filter((item) => item && ["user", "assistant"].includes(item.role) && item.content)
      .map((item) => ({ role: item.role, content: String(item.content).slice(0, 1200) })),
    { role: "user", content: message.slice(0, 2000) }
  ];

  const completionOptions = longPlan
    ? {
      maxTokens: aiDeepMaxTokens,
      thinkingType: aiDeepThinkingType,
      ...(aiDeepThinkingType !== "disabled" ? { timeoutMs: aiDeepThinkingTimeoutMs } : {})
    }
    : deepDiagnosis
      ? { maxTokens: 1200, thinkingType: "disabled" }
    : {};
  let upstream;
  let data;

  try {
    ({ upstream, data } = await requestAiCompletion(messages, completionOptions));
  } catch (error) {
    if (!longPlan || aiDeepThinkingType === "disabled") throw error;
    ({ upstream, data } = await requestAiCompletion(messages, {
      maxTokens: aiDeepFallbackMaxTokens,
      thinkingType: "disabled"
    }));
  }

  if (longPlan && !upstream.ok && aiDeepThinkingType !== "disabled") {
    ({ upstream, data } = await requestAiCompletion(messages, {
      maxTokens: aiDeepFallbackMaxTokens,
      thinkingType: "disabled"
    }));
  }

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
    const repaired = await requestAiCompletion(
      repairMessages,
      longPlan ? completionOptions : { maxTokens: 1100 }
    );
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
