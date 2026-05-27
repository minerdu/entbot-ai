import { SYSTEM_PROMPT } from "../_shared/growthAdvisorPrompt.mjs";

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function isProductInfoQuestion(message) {
  const value = String(message || "").replace(/\s+/g, "");
  return (
    /什么是AI?(引流|招商|运营|培训)/i.test(value) ||
    /AI?(引流|招商|运营|培训)(是什么|能做什么|介绍|功能|怎么用)/i.test(value) ||
    /(介绍|说明|讲讲).{0,8}AI?(引流|招商|运营|培训)/i.test(value)
  );
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

async function requestAiCompletion({ aiBaseUrl, apiKey, aiModel, messages, maxTokens = 900 }) {
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

export async function onRequestPost(context) {
  const env = context.env || {};
  const apiKey = env.TOKEN_PLAN_API_KEY;
  const aiBaseUrl = (env.TOKEN_PLAN_BASE_URL || "https://token-plan-cn.xiaomimimo.com/v1").replace(/\/$/, "");
  const aiModel = env.TOKEN_PLAN_MODEL || "mimo-v2.5-pro";

  if (!apiKey) {
    return json({ error: "TOKEN_PLAN_API_KEY is not configured" }, 500);
  }

  const payload = await context.request.json().catch(() => ({}));
  const message = String(payload.message || "").trim();
  const intent = String(payload.intent || "diagnosis").slice(0, 40);
  const history = Array.isArray(payload.history) ? payload.history.slice(-10) : [];

  if (!message) {
    return json({ error: "message is required" }, 400);
  }

  const turnPolicy = buildTurnPolicy(history, message);
  const messages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n当前入口意图：${intent}` },
    { role: "system", content: turnPolicy },
    ...history
      .filter((item) => item && ["user", "assistant"].includes(item.role) && item.content)
      .map((item) => ({ role: item.role, content: String(item.content).slice(0, 1200) })),
    { role: "user", content: message.slice(0, 2000) }
  ];

  let { upstream, data } = await requestAiCompletion({ aiBaseUrl, apiKey, aiModel, messages });

  if (!upstream.ok) {
    return json({ error: data.error?.message || "upstream AI request failed" }, upstream.status);
  }

  let reply = normalizeAiReply(data.choices?.[0]?.message?.content || "");

  if (isLikelyIncompleteReply(reply)) {
    const repairMessages = [
      { role: "system", content: "上一轮模型输出疑似不完整或提前中断。请忽略不完整文本，重新回答最后一条用户消息。仍然必须遵守本轮强制规则：不要套固定话术，不要连续追问，围绕官网产品知识和客户当前问题给出完整中文答复，并自然收尾。" },
      ...messages
    ];
    const repaired = await requestAiCompletion({ aiBaseUrl, apiKey, aiModel, messages: repairMessages, maxTokens: 1100 });
    if (repaired.upstream.ok) {
      const repairedReply = normalizeAiReply(repaired.data.choices?.[0]?.message?.content || "");
      if (repairedReply) {
        reply = repairedReply;
        data = repaired.data;
      }
    }
  }

  return json({
    reply,
    model: data.model || aiModel
  });
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }

  return json({ error: "Method not allowed" }, 405);
}
