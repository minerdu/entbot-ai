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
  const detailIntent = /(详细|完整|系统|方案|解决方案|规划|计划|报告|拆解|拆一下|拆一拆|落地|实施|路径|打法|策略|路线图|sop|诊断书|建议书|执行步骤|落地步骤|怎么做|如何做|帮我做|出一份|设计|制定|搭建|longplan)/i.test(value);
  const aiWorkflow = /(ai引流|ai招商|ai运营|ai培训|aiapp|ai解决|招商ai|引流ai|运营ai|培训ai|增长ai|增长方案|招商方案|获客方案|运营方案|培训方案|私域方案|转化方案)/i.test(value);
  const workflowPlanIntent = /(方案|解决|详细|完整|拆|落地|实施|规划|路径|怎么做|如何做|帮我做|出一份|设计|制定|搭建|打法|策略)/i.test(value);
  return detailIntent || (aiWorkflow && workflowPlanIntent);
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

async function requestAiCompletion({ aiBaseUrl, apiKey, aiModel, aiTemperature, aiThinkingType, messages, maxTokens = 900, timeoutMs }) {
  const controller = timeoutMs ? new AbortController() : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : undefined;
  const requestBody = {
    model: aiModel,
    messages,
    max_tokens: maxTokens
  };

  if (aiThinkingType && aiThinkingType !== "default") {
    requestBody.thinking = { type: aiThinkingType };
  }

  if (Number.isFinite(aiTemperature) && aiThinkingType !== "disabled") {
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

export async function onRequestPost(context) {
  const env = context.env || {};
  const apiKey = env.TOKEN_PLAN_API_KEY;
  const aiBaseUrl = (env.TOKEN_PLAN_BASE_URL || "https://api.moonshot.cn/v1").replace(/\/$/, "");
  const aiModel = env.TOKEN_PLAN_MODEL || "kimi-k2.6";
  const aiTemperature =
    env.TOKEN_PLAN_TEMPERATURE === undefined || String(env.TOKEN_PLAN_TEMPERATURE).trim() === ""
      ? undefined
      : Number(env.TOKEN_PLAN_TEMPERATURE);
  const aiThinkingType = String(env.TOKEN_PLAN_THINKING || "disabled").trim();
  const aiDeepThinkingType = String(env.TOKEN_PLAN_DEEP_THINKING || "enabled").trim();
  const aiDeepMaxTokens = readPositiveNumber(env.TOKEN_PLAN_DEEP_MAX_TOKENS, 5000);
  const aiDeepThinkingTimeoutMs = readPositiveNumber(env.TOKEN_PLAN_DEEP_THINKING_TIMEOUT_MS, 30000);

  if (!apiKey) {
    return json({ error: "TOKEN_PLAN_API_KEY is not configured" }, 500);
  }

  const payload = await context.request.json().catch(() => ({}));
  const message = String(payload.message || "").trim();
  const intent = String(payload.intent || "diagnosis").slice(0, 40);
  const history = Array.isArray(payload.history) ? payload.history.slice(-10) : [];
  const longPlan = Boolean(payload.longPlan) || isLongPlanRequest(message);
  const deepDiagnosis = !longPlan && (Boolean(payload.deepDiagnosis) || isDeepDiagnosticRequest(message));

  if (!message) {
    return json({ error: "message is required" }, 400);
  }

  const turnPolicy = buildTurnPolicy(history, message, { deepDiagnosis, longPlan });
  const messages = [
    { role: "system", content: `${SYSTEM_PROMPT}\n当前入口意图：${intent}` },
    { role: "system", content: turnPolicy },
    ...history
      .filter((item) => item && ["user", "assistant"].includes(item.role) && item.content)
      .map((item) => ({ role: item.role, content: String(item.content).slice(0, 1200) })),
    { role: "user", content: message.slice(0, 2000) }
  ];

  const longPlanThinkingType = aiDeepThinkingType && aiDeepThinkingType !== "disabled" ? aiDeepThinkingType : "enabled";
  const completionOptions = longPlan
    ? {
      maxTokens: aiDeepMaxTokens,
      aiThinkingType: longPlanThinkingType,
      timeoutMs: aiDeepThinkingTimeoutMs
    }
    : deepDiagnosis
      ? { maxTokens: 1200, aiThinkingType: "disabled" }
    : {};
  let upstream;
  let data;

  try {
    ({ upstream, data } = await requestAiCompletion({
      aiBaseUrl,
      apiKey,
      aiModel,
      aiTemperature,
      aiThinkingType,
      messages,
      ...completionOptions
    }));
  } catch (error) {
    if (!longPlan) throw error;
    ({ upstream, data } = await requestAiCompletion({
      aiBaseUrl,
      apiKey,
      aiModel,
      aiTemperature,
      aiThinkingType,
      messages,
      ...completionOptions
    }));
  }

  if (longPlan && !upstream.ok) {
    ({ upstream, data } = await requestAiCompletion({
      aiBaseUrl,
      apiKey,
      aiModel,
      aiTemperature,
      aiThinkingType,
      messages,
      ...completionOptions
    }));
  }

  if (!upstream.ok) {
    return json({ error: data.error?.message || "upstream AI request failed" }, upstream.status);
  }

  let reply = normalizeAiReply(data.choices?.[0]?.message?.content || "");

  if (isLikelyIncompleteReply(reply)) {
    const repairMessages = [
      { role: "system", content: "上一轮模型输出疑似不完整或提前中断。请忽略不完整文本，重新回答最后一条用户消息。仍然必须遵守本轮强制规则：不要套固定话术，不要连续追问，围绕官网产品知识和客户当前问题给出完整中文答复，并自然收尾。" },
      ...messages
    ];
    const repaired = await requestAiCompletion({
      aiBaseUrl,
      apiKey,
      aiModel,
      aiTemperature,
      aiThinkingType,
      messages: repairMessages,
      ...(longPlan ? completionOptions : { maxTokens: 1100 })
    });
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
