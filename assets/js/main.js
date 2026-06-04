const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("mobile-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("mobile-open");
      document.body.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const buttons = Array.from(tabs.querySelectorAll("[data-tab-target]"));
  const panels = Array.from(tabs.querySelectorAll("[data-tab-panel]"));

  const activate = (target) => {
    buttons.forEach((button) => {
      const active = button.getAttribute("data-tab-target") === target;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.getAttribute("data-tab-panel") === target;
      panel.classList.toggle("active", active);
      panel.toggleAttribute("hidden", !active);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activate(button.getAttribute("data-tab-target")));
  });

  const firstActive = buttons.find((button) => button.classList.contains("active")) || buttons[0];
  if (firstActive) activate(firstActive.getAttribute("data-tab-target"));
});

const parsePairs = (value) =>
  String(value || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, result] = item.split("|");
      return {
        label: String(label || "").trim(),
        result: String(result || "").trim(),
      };
    });

const parseList = (value) =>
  String(value || "")
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

const makeTextElement = (tagName, className, text) => {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
};

document.querySelectorAll("[data-shot-group]").forEach((group) => {
  const screen = group.querySelector("[data-shot-screen]");
  const buttons = Array.from(group.querySelectorAll("[data-shot-target]"));

  if (!screen || !buttons.length) return;

  const renderShot = (activeButton) => {
    const type = activeButton.getAttribute("data-screen-type") || "board";
    const kicker = activeButton.getAttribute("data-screen-kicker") || "";
    const title = activeButton.getAttribute("data-screen-title") || "";
    const image = activeButton.getAttribute("data-shot-image") || "";
    const imageAlt = activeButton.getAttribute("data-shot-alt") || title || kicker || "产品界面截图";
    const metrics = parsePairs(activeButton.getAttribute("data-screen-metrics"));
    const items = parseList(activeButton.getAttribute("data-screen-items"));

    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    screen.setAttribute("data-screen-type", type);
    screen.classList.remove("has-real-shot");
    screen.classList.toggle("has-workspace-shot", Boolean(image));
    screen.textContent = "";

    const frame = document.createElement("div");
    frame.className = "screen-frame";

    const top = document.createElement("div");
    top.className = "screen-top";
    top.appendChild(makeTextElement("span", "screen-kicker", kicker));

    const dots = document.createElement("span");
    dots.className = "screen-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.appendChild(document.createElement("i"));
    dots.appendChild(document.createElement("i"));
    dots.appendChild(document.createElement("i"));
    top.appendChild(dots);
    frame.appendChild(top);

    const titleArea = document.createElement("div");
    titleArea.className = "screen-title-area";
    titleArea.appendChild(makeTextElement("h3", "", title));

    const toolbar = document.createElement("span");
    toolbar.className = "screen-toolbar";
    toolbar.setAttribute("aria-hidden", "true");
    toolbar.appendChild(document.createElement("i"));
    toolbar.appendChild(document.createElement("i"));
    titleArea.appendChild(toolbar);
    frame.appendChild(titleArea);

    const workspace = document.createElement("div");
    workspace.className = "screen-workspace";

    if (image) {
      workspace.classList.add("has-screen-shot");
      const img = document.createElement("img");
      img.className = "screen-workspace-image";
      img.src = image;
      img.alt = imageAlt;
      img.loading = "lazy";
      img.decoding = "async";
      workspace.appendChild(img);
      frame.appendChild(workspace);
      screen.appendChild(frame);
      return;
    }

    const sidebar = document.createElement("div");
    sidebar.className = "screen-sidebar";
    sidebar.appendChild(makeTextElement("span", "", "工作台"));
    items.slice(0, 5).forEach((item) => {
      sidebar.appendChild(makeTextElement("span", "", item));
    });
    workspace.appendChild(sidebar);

    const main = document.createElement("div");
    main.className = "screen-main";

    const metricRow = document.createElement("div");
    metricRow.className = "screen-metrics";
    metrics.slice(0, 3).forEach((metric) => {
      const metricCard = document.createElement("div");
      metricCard.className = "screen-metric";
      metricCard.appendChild(makeTextElement("small", "", metric.label));
      metricCard.appendChild(makeTextElement("strong", "", metric.result));
      metricRow.appendChild(metricCard);
    });
    main.appendChild(metricRow);

    const body = document.createElement("div");
    body.className = "screen-body";

    const graphic = document.createElement("div");
    graphic.className = "screen-graphic";
    for (let index = 0; index < 8; index += 1) {
      graphic.appendChild(document.createElement("i"));
    }
    body.appendChild(graphic);

    const list = document.createElement("ul");
    list.className = "screen-list";
    items.slice(0, 4).forEach((item) => {
      list.appendChild(makeTextElement("li", "", item));
    });
    body.appendChild(list);
    main.appendChild(body);
    workspace.appendChild(main);
    frame.appendChild(workspace);

    screen.appendChild(frame);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => renderShot(button));
  });

  renderShot(buttons.find((button) => button.classList.contains("active")) || buttons[0]);
});

const filterButtons = Array.from(document.querySelectorAll("[data-case-filter]"));
const caseCards = Array.from(document.querySelectorAll("[data-case-category]"));

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-case-filter");
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    caseCards.forEach((card) => {
      const match = filter === "all" || card.getAttribute("data-case-category") === filter;
      card.classList.toggle("hidden", !match);
    });
  });
});

const leadForm = document.querySelector("[data-lead-form]");

if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const requiredFields = Array.from(leadForm.querySelectorAll("[data-required]"));
    let hasError = false;

    requiredFields.forEach((field) => {
      const wrapper = field.closest(".field");
      const error = wrapper ? wrapper.querySelector(".error-text") : null;
      const isEmpty = !String(field.value || "").trim();
      hasError = hasError || isEmpty;
      field.setAttribute("aria-invalid", String(isEmpty));
      if (error) error.textContent = isEmpty ? "请填写此项" : "";
    });

    const success = leadForm.querySelector("[data-success-message]");
    if (!hasError && success) {
      success.classList.add("show");
      leadForm.reset();
      requiredFields.forEach((field) => field.setAttribute("aria-invalid", "false"));
    }
  });
}

const chatIntentStarters = {
  diagnosis:
    "直接说你的行业和现在最卡的增长环节就行。我会先判断掉在哪一步，再看适合从哪个 AI 流程切入。",
  service:
    "蔚为通常不是先讲工具，而是先做增长诊断，再把流程拆成 Skill 和 AI APP 里的执行动作。",
  demo:
    "可以直接说你想看的场景，比如招商、引流、运营或培训。我会帮你判断该看哪个 AI APP。",
  product:
    "如果不确定看哪个产品，先说你的业务流程。我会按引流、招商、运营、培训四类给你做初步匹配。",
  case:
    "说一下你想对标的行业或增长问题，我会用案例方式讲清楚 AI 通常从哪个流程切入。",
  privacy:
    "关于隐私和资料使用，我可以先说明：你提供的信息只用于诊断、沟通和服务评估，客户案例公开前需要授权。"
};

const chatQuickPrompts = {
  diagnosis: "我想预约一次增长诊断",
  service: "请说明蔚为的服务方式",
  demo: "我想看 AI APP 产品演示",
  product: "帮我判断适合哪个 AI APP",
  case: "我想了解类似案例",
  privacy: "我想了解隐私政策",
  deepDiagnosis: "请帮我做一次诊断判断：我真正卡在哪个增长环节，应该优先用哪类 AI APP 切入？"
};

const chatInputPlaceholders = {
  diagnosis: "描述你的行业、目标和增长卡点...",
  service: "描述你想了解的服务方式...",
  demo: "描述你想看的产品场景...",
  product: "描述你想匹配的产品场景...",
  case: "描述你想对标的行业或案例...",
  privacy: "描述你关心的数据或资料使用问题..."
};

const footerPromptTopics = {
  diagnosis: {
    label: "增长诊断",
    intent: "diagnosis",
    questions: [
      "我们线索不少，但转化率低，蔚为会先诊断哪些环节？",
      "品牌工厂想提升招商转化，应该先落地哪类 AI 流程？",
      "本地连锁获客和复购都不稳定，增长诊断会怎么拆问题？"
    ]
  },
  service: {
    label: "服务方式",
    intent: "service",
    questions: [
      "蔚为从增长诊断到 AI APP 落地通常需要多久？",
      "如果接入企微、CRM 或订单系统，服务流程怎么推进？",
      "顾问、Agent、Skill 和 AI APP 分别承担什么工作？"
    ]
  },
  cases: {
    label: "案例咨询",
    intent: "case",
    questions: [
      "有没有品牌工厂用 AI 招商提升跟进效率的案例？",
      "美业医美连锁可以参考哪些 AI 获客和复购场景？",
      "我想按自己的行业对标案例，应该先提供哪些信息？"
    ]
  }
};

function getChatReply(text, intent) {
  const value = String(text || "").toLowerCase();
  const has = (words) => words.some((word) => value.includes(word));

  if (has(["隐私", "数据", "资料", "授权", "保密"])) {
    return "蔚为只会把你提供的信息用于联系、增长诊断、产品演示、服务沟通和合作评估。客户名称、业务数据、项目内容和案例指标在公开前都需要获得授权。";
  }

  if (has(["邮箱", "地址", "微信", "公众号", "视频号", "联系"])) {
    return "你可以通过邮箱 Agent@wwznt.com、本页企业微信二维码、公众号和视频号联系蔚为。地址为广州市天河区珠江新城 IFP 32层。";
  }

  if (has(["服务", "周期", "报价", "合作", "实施", "陪跑"])) {
    return "蔚为通常先做 1-2 周增长诊断，确认目标、流程和首批场景；再用 4-8 周完成 Agent、Skill 和 AI APP 工作流落地；后续按月或阶段进行复盘迭代。";
  }

  if (has(["产品", "演示", "app", "引流", "招商", "运营", "培训"])) {
    return "蔚为当前重点围绕四类 AI APP：AI 引流、AI 招商、AI 运营和 AI 培训。你可以描述最想自动化的流程，我会帮你判断应该先看哪一类产品界面。";
  }

  if (has(["品牌", "工厂", "跨境", "电商", "招商"])) {
    return "品牌工厂和跨境电商通常先看市场洞察、内容选题、招商线索分层、跟进话术和团队复盘。适合先把内容与招商流程沉淀成 Skill。";
  }

  if (has(["美业", "医美", "门店", "连锁", "复购", "私域"])) {
    return "美业医美和本地连锁通常先看获客承接、顾问咨询、私域复购、门店 SOP 和员工培训。适合从一个高频门店流程开始跑通。";
  }

  if (has(["预约", "诊断", "咨询", "聊聊", "沟通"])) {
    return "可以。请继续补充姓名、公司、手机或微信、所属行业，以及当前最想解决的问题。蔚为顾问可以基于这些信息继续确认诊断时间和沟通方式。";
  }

  if (intent && chatIntentStarters[intent]) {
    return `${chatIntentStarters[intent]} 你也可以直接输入：行业、公司规模、当前瓶颈、希望达成的增长目标。`;
  }

  return "我会先从业务目标、现有流程、团队执行和可衡量指标四个方面帮你梳理。请描述你的行业和当前增长问题。";
}

function compactChatValue(text) {
  return String(text || "").replace(/\s+/g, "").toLowerCase();
}

function isDeepDiagnosisRequest(text, options = {}) {
  if (options.deepDiagnosis) return true;
  const value = compactChatValue(text);
  return /深度诊断|诊断判断|真正卡在哪|卡在哪个增长环节|优先用哪类ai|优先用哪个ai|优先切入|增长卡点|deepdiagnosis|deepdiagnose/i.test(value);
}

function isLongPlanRequest(text, options = {}) {
  if (options.longPlan) return true;
  const value = compactChatValue(text);
  return /详细方案|完整方案|详细诊断|完整诊断|详细报告|完整报告|系统方案|完整规划|完整分析|深入分析|深度方案|实施计划书|写一份方案|帮我拆解|拆解一下|拆解方案|longplan/i.test(value);
}

const chatLoadingSteps = {
  longPlan: [
    "正在建立诊断假设...",
    "正在拆解增长流程...",
    "正在匹配 AI APP 与 Skill...",
    "正在整理落地步骤...",
    "正在生成最终建议..."
  ],
  insight: [
    "我正在识别表面问题和真实卡点...",
    "正在判断优先切入环节...",
    "正在匹配最适合的 AI APP..."
  ],
  product: [
    "我正在匹配对应的 AI APP...",
    "正在确认它解决哪段业务流程...",
    "正在整理适合官网访客的简短说明..."
  ],
  service: [
    "我正在整理服务路径...",
    "正在对齐诊断、实施和复盘阶段...",
    "正在压缩成清晰回复..."
  ],
  case: [
    "我正在对照案例场景...",
    "正在判断可参考的行业路径...",
    "正在提炼可落地的部分..."
  ],
  privacy: [
    "我正在核对资料使用边界...",
    "正在确认哪些信息会用于诊断沟通...",
    "正在整理隐私和授权说明..."
  ],
  contact: [
    "我正在整理联系和预约入口...",
    "正在确认下一步需要补充的信息...",
    "正在准备沟通建议..."
  ],
  diagnosis: [
    "我正在判断关键增长卡点...",
    "正在对齐行业和业务流程...",
    "正在整理优先切入建议..."
  ],
  general: [
    "我正在理解你的问题...",
    "正在匹配官网信息和服务路径...",
    "正在整理回复..."
  ]
};

function getChatMode(text, intent, options = {}) {
  if (isLongPlanRequest(text, options)) {
    return "longPlan";
  }

  if (isDeepDiagnosisRequest(text, options)) {
    return "insight";
  }

  const value = compactChatValue(text);

  if (/(隐私|数据|资料|授权|保密)/u.test(value) || intent === "privacy") {
    return "privacy";
  }

  if (/(预约|联系|微信|电话|手机|邮箱|地址|公众号|视频号|二维码|沟通)/u.test(value)) {
    return "contact";
  }

  if (/(服务|周期|报价|合作|实施|陪跑|交付|顾问)/u.test(value) || intent === "service") {
    return "service";
  }

  if (/(案例|对标|同行|参考)/u.test(value) || intent === "case") {
    return "case";
  }

  if (/(产品|演示|aiapp|app|功能|工具)/i.test(value) || /ai?(引流|招商|运营|培训)/i.test(value) || ["demo", "product"].includes(intent)) {
    return "product";
  }

  if (/(增长|诊断|卡点|转化|线索|获客|复购|招商|门店|私域|培训|运营|行业)/u.test(value) || intent === "diagnosis") {
    return "diagnosis";
  }

  return "general";
}

function getChatLoadingConfig(text, intent, options = {}) {
  const mode = getChatMode(text, intent, options);
  return {
    mode,
    steps: chatLoadingSteps[mode] || chatLoadingSteps.general,
    showProcess: mode === "longPlan"
  };
}

function normalizeChatReply(text) {
  return String(text || "")
    .replace(/\*\*/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderChatText(bubble, text) {
  const existing = bubble.querySelector(".chat-content");
  if (existing) existing.remove();
  const loading = bubble.querySelector(".chat-loading");
  if (loading) loading.remove();

  const content = document.createElement("div");
  content.className = "chat-content";

  const paragraphs = normalizeChatReply(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  (paragraphs.length ? paragraphs : [""]).forEach((paragraph) => {
    const item = document.createElement("p");
    item.textContent = paragraph;
    content.appendChild(item);
  });

  bubble.appendChild(content);
}

function setChatLoadingStep(row, config = {}, index = 0) {
  if (!row) return;
  const steps = Array.isArray(config.steps) && config.steps.length ? config.steps : chatLoadingSteps.general;
  const activeIndex = Math.max(0, Math.min(index, steps.length - 1));
  const status = row.querySelector(".chat-loading-status");
  if (status) status.textContent = steps[activeIndex];

  row.querySelectorAll(".chat-loading-step").forEach((item, stepIndex) => {
    item.classList.toggle("is-active", stepIndex === activeIndex);
    item.classList.toggle("is-done", stepIndex < activeIndex);
  });

  const messages = row.closest("[data-chat-messages]");
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function renderChatLoading(bubble, config = {}) {
  const existing = bubble.querySelector(".chat-content");
  if (existing) existing.remove();
  const previous = bubble.querySelector(".chat-loading");
  if (previous) previous.remove();

  const steps = Array.isArray(config.steps) && config.steps.length ? config.steps : chatLoadingSteps.general;
  const loading = document.createElement("div");
  loading.className = "chat-loading";
  loading.setAttribute("data-chat-loading-mode", config.mode || "general");

  const line = document.createElement("div");
  line.className = "chat-loading-line";

  const status = document.createElement("span");
  status.className = "chat-loading-status";
  status.textContent = steps[0];
  line.appendChild(status);

  const dots = document.createElement("span");
  dots.className = "chat-loading-dots";
  dots.setAttribute("aria-hidden", "true");
  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement("i");
    dots.appendChild(dot);
  }
  line.appendChild(dots);
  loading.appendChild(line);

  if (config.showProcess) {
    const process = document.createElement("ol");
    process.className = "chat-loading-process";
    steps.forEach((step, index) => {
      const item = document.createElement("li");
      item.className = "chat-loading-step";
      if (index === 0) item.classList.add("is-active");
      item.textContent = step.replace(/\.{3}$|…$/u, "");
      process.appendChild(item);
    });
    loading.appendChild(process);
  }

  bubble.appendChild(loading);
}

function stopChatLoading(row) {
  if (!row) return;
  if (row._chatLoadingTimer) {
    window.clearInterval(row._chatLoadingTimer);
    row._chatLoadingTimer = null;
  }
  row._chatLoadingIndex = 0;
  row._chatLoadingConfig = null;
}

function startChatLoading(row, config = {}) {
  if (!row) return;
  stopChatLoading(row);

  const steps = Array.isArray(config.steps) && config.steps.length ? config.steps : chatLoadingSteps.general;
  row._chatLoadingConfig = { ...config, steps };
  row._chatLoadingIndex = 0;
  setChatLoadingStep(row, row._chatLoadingConfig, 0);

  const interval = config.showProcess ? 3200 : 2400;
  row._chatLoadingTimer = window.setInterval(() => {
    if (!row.isConnected) {
      stopChatLoading(row);
      return;
    }

    const current = Number.isFinite(row._chatLoadingIndex) ? row._chatLoadingIndex : 0;
    const next = config.showProcess ? Math.min(current + 1, steps.length - 1) : (current + 1) % steps.length;
    row._chatLoadingIndex = next;
    setChatLoadingStep(row, row._chatLoadingConfig, next);
  }, interval);
}

function chatTextLength(text) {
  return String(text || "").replace(/\s+/g, "").length;
}

function getChatParagraphs(text) {
  return normalizeChatReply(text)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getChatParagraphMode(paragraph, index) {
  if (index === 0) return "judgment";
  if (/^(具体来说|具体可以|真正的|这里要先|可以先做|建议先做|建议可以|落地时|执行上|实施上|第一步|先做|如果先从)/.test(paragraph)) {
    return "actions";
  }
  if (/^\s*\d+[.、]/.test(paragraph)) return "actions";
  if (/^(在蔚为|在蔚为这里|在蔚为这边|对应到蔚为|这些都会放进|所有这些任务|AI\s*招商可以|Agent|Skill)/i.test(paragraph)) {
    return "workflow";
  }
  if (/^(这个场景|下一步|如果继续|可以先把|建议你们可以先|如果要继续)/.test(paragraph)) {
    return "next";
  }
  return "same";
}

function splitChatReplyIntoMessages(text) {
  const paragraphs = getChatParagraphs(text);
  if (paragraphs.length <= 1 && chatTextLength(text) <= 220) return [normalizeChatReply(text)];

  const chunks = [];
  let current = [];
  let currentMode = "judgment";

  const pushCurrent = () => {
    if (!current.length) return;
    chunks.push(current.join("\n\n").trim());
    current = [];
  };

  paragraphs.forEach((paragraph, index) => {
    const mode = getChatParagraphMode(paragraph, index);
    const normalizedMode = mode === "same" || mode === "next" ? currentMode : mode;
    const currentText = current.join("\n\n");
    const combinedLength = chatTextLength(currentText) + chatTextLength(paragraph);
    const modeChanged = current.length && normalizedMode !== currentMode;
    const shouldSplitByLength =
      current.length &&
      currentMode !== "actions" &&
      normalizedMode !== "actions" &&
      combinedLength > 240 &&
      chatTextLength(currentText) >= 100;

    if (modeChanged || shouldSplitByLength) {
      pushCurrent();
      currentMode = normalizedMode;
    }

    current.push(paragraph);
    if (mode !== "same" && mode !== "next") currentMode = normalizedMode;
  });

  pushCurrent();

  if (chunks.length <= 1 && chatTextLength(text) > 260) {
    const fallback = [];
    let currentFallback = [];
    paragraphs.forEach((paragraph) => {
      const currentText = currentFallback.join("\n\n");
      if (currentFallback.length && chatTextLength(currentText) + chatTextLength(paragraph) > 220) {
        fallback.push(currentText);
        currentFallback = [];
      }
      currentFallback.push(paragraph);
    });
    if (currentFallback.length) fallback.push(currentFallback.join("\n\n"));
    return fallback.filter(Boolean);
  }

  if (chunks.length > 4) {
    const merged = [];
    chunks.forEach((chunk) => {
      const previous = merged[merged.length - 1] || "";
      if (previous && chatTextLength(previous) < 120 && chatTextLength(previous) + chatTextLength(chunk) <= 260) {
        merged[merged.length - 1] = `${previous}\n\n${chunk}`;
      } else {
        merged.push(chunk);
      }
    });
    return merged;
  }

  return chunks.filter(Boolean);
}

function appendChatMessage(widget, role, text, options = {}) {
  const messages = widget.querySelector("[data-chat-messages]");
  if (!messages) return null;

  const row = document.createElement("div");
  row.className = `chat-message ${role}`;
  if (options.pending) row.setAttribute("data-chat-pending", "true");

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";

  if (role === "bot") {
    const speaker = document.createElement("span");
    speaker.className = "chat-speaker";
    speaker.textContent = "蔚为 AI 增长顾问";
    bubble.appendChild(speaker);
  }

  if (options.pending && options.loading) {
    renderChatLoading(bubble, options.loading);
  } else {
    renderChatText(bubble, text);
  }

  row.appendChild(bubble);
  messages.appendChild(row);
  if (options.pending && options.loading) startChatLoading(row, options.loading);
  messages.scrollTop = messages.scrollHeight;
  return row;
}

function updateChatMessage(row, text) {
  if (!row) return;
  stopChatLoading(row);
  const bubble = row.querySelector(".chat-bubble");
  if (bubble) renderChatText(bubble, text);
  row.removeAttribute("data-chat-pending");
}

function updateChatReplyMessages(widget, pendingRow, text) {
  const chunks = splitChatReplyIntoMessages(text);
  const [firstChunk, ...restChunks] = chunks.length ? chunks : [text];

  updateChatMessage(pendingRow, firstChunk);
  restChunks.forEach((chunk) => appendChatMessage(widget, "bot", chunk));
}

function setChatIntent(widget, intent) {
  if (!intent) return;
  widget.setAttribute("data-chat-intent", intent);
  const input = widget.querySelector("[data-chat-input]");
  if (input) {
    input.placeholder = chatInputPlaceholders[intent] || chatInputPlaceholders.diagnosis;
  }
  appendChatMessage(widget, "bot", chatIntentStarters[intent] || chatIntentStarters.diagnosis);
}

async function requestAiReply(widget, text, intent, options = {}) {
  if (window.location.protocol === "file:") {
    throw new Error("真实 AI 对话需要通过本地服务或线上站点访问，当前 file:// 页面无法调用 /api/chat。");
  }

  const history = Array.isArray(widget._chatHistory) ? widget._chatHistory.slice(-10) : [];
  const deepDiagnosis = isDeepDiagnosisRequest(text, options);
  const longPlan = isLongPlanRequest(text, options);
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, intent, history, deepDiagnosis, longPlan })
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || "AI 服务暂时不可用");
  }

  const payload = await response.json();
  return String(payload.reply || "").trim();
}

async function submitChatPrompt(widget, text, options = {}) {
  const value = String(text || "").trim();
  if (!value) return;
  const intent = widget.getAttribute("data-chat-intent") || "diagnosis";
  const deepDiagnosis = isDeepDiagnosisRequest(value, options);
  const longPlan = isLongPlanRequest(value, options);
  appendChatMessage(widget, "user", value);

  widget._chatHistory = Array.isArray(widget._chatHistory) ? widget._chatHistory : [];
  widget._chatHistory.push({ role: "user", content: value });

  const loading = getChatLoadingConfig(value, intent, { deepDiagnosis, longPlan });
  const pending = appendChatMessage(widget, "bot", loading.steps[0], { pending: true, loading });

  try {
    const reply = await requestAiReply(widget, value, intent, { deepDiagnosis, longPlan });
    if (!reply) throw new Error("AI 服务没有返回有效内容");
    const finalReply = normalizeChatReply(reply);
    updateChatReplyMessages(widget, pending, finalReply);
    widget._chatHistory.push({ role: "assistant", content: finalReply });
  } catch (error) {
    const detail = error && error.message ? `：${error.message}` : "";
    const message =
      window.location.protocol === "file:"
        ? `AI 服务连接失败${detail} 请通过 http://127.0.0.1 本地服务或线上部署页面访问。`
        : `AI 服务连接失败${detail} 请稍后再试，或通过企业微信、邮箱联系蔚为。`;
    updateChatMessage(pending, message);
    widget._chatHistory.push({ role: "assistant", content: message });
  }
}

function initChatWidget(widget) {
  if (!widget || widget.getAttribute("data-chat-ready") === "true") return;
  widget.setAttribute("data-chat-ready", "true");

  const form = widget.querySelector("[data-chat-form]");
  const input = widget.querySelector("[data-chat-input]");

  if (form && input) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitChatPrompt(widget, input.value);
      input.value = "";
      input.focus();
    });
  }

  widget.querySelectorAll("[data-chat-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      const intent = button.getAttribute("data-chat-intent");
      const deepDiagnosis = button.getAttribute("data-chat-deep") === "true";
      const longPlan = button.getAttribute("data-chat-long-plan") === "true";
      if (intent) widget.setAttribute("data-chat-intent", intent);
      submitChatPrompt(widget, button.getAttribute("data-chat-prompt") || button.textContent, { deepDiagnosis, longPlan });
    });
  });
}

function createChatOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "ai-chat-overlay";
  overlay.setAttribute("data-chat-overlay", "");
  overlay.innerHTML = `
    <div class="ai-chat-backdrop" data-chat-close></div>
    <section class="ai-chat-widget ai-chat-drawer" data-ai-chat-widget data-chat-intent="diagnosis" role="dialog" aria-modal="true" aria-label="蔚为 AI 增长顾问">
      <div class="chat-window-head">
        <div>
          <span class="chat-kicker">AI Growth Advisor</span>
          <h2>和蔚为 AI 增长顾问聊聊</h2>
        </div>
        <button class="chat-close" type="button" aria-label="关闭对话" data-chat-close>×</button>
      </div>
      <div class="chat-messages" data-chat-messages>
        <div class="chat-message bot">
          <div class="chat-bubble">
            <span class="chat-speaker">蔚为 AI 增长顾问</span>
            <p>直接说你的行业和现在最卡的增长环节，我会先判断掉在哪一步，再看适合哪条 AI 流程。</p>
          </div>
        </div>
      </div>
      <div class="chat-quick-actions">
        <button type="button" data-chat-intent="diagnosis" data-chat-prompt="${chatQuickPrompts.diagnosis}">预约诊断</button>
        <button type="button" data-chat-intent="service" data-chat-prompt="${chatQuickPrompts.service}">服务方式</button>
        <button type="button" data-chat-intent="demo" data-chat-prompt="${chatQuickPrompts.demo}">产品演示</button>
        <button type="button" data-chat-intent="diagnosis" data-chat-deep="true" data-chat-prompt="${chatQuickPrompts.deepDiagnosis}">深度诊断</button>
      </div>
      <form class="chat-input-row" data-chat-form>
        <input type="text" data-chat-input placeholder="描述你的行业和增长问题..." aria-label="输入增长问题" />
        <button type="submit">发送</button>
      </form>
    </section>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll("[data-chat-close]").forEach((button) => {
    button.addEventListener("click", () => overlay.classList.remove("show"));
  });
  initChatWidget(overlay.querySelector("[data-ai-chat-widget]"));
  return overlay;
}

let chatOverlay;

document.querySelectorAll("[data-ai-chat-widget]").forEach(initChatWidget);

function buildContactPromptUrl(question, intent) {
  const params = new URLSearchParams();
  params.set("q", question);
  params.set("intent", intent || "diagnosis");
  return `contact.html?${params.toString()}`;
}

function clearFooterTopic(menu, panel) {
  if (!menu || !panel) return;
  panel.hidden = true;
  panel.replaceChildren();
  menu.querySelectorAll("[data-footer-topic]").forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-expanded", "false");
  });
}

function showFooterTopic(menu, panel, topicKey) {
  const topic = footerPromptTopics[topicKey];
  if (!topic || !menu || !panel) return;

  menu.querySelectorAll("[data-footer-topic]").forEach((button) => {
    const active = button.getAttribute("data-footer-topic") === topicKey;
    button.classList.toggle("active", active);
    button.setAttribute("aria-expanded", String(active));
  });

  panel.replaceChildren();

  const head = document.createElement("div");
  head.className = "footer-topic-head";
  head.appendChild(makeTextElement("span", "footer-topic-title", topic.label));

  const close = document.createElement("button");
  close.className = "footer-topic-close";
  close.type = "button";
  close.setAttribute("aria-label", "关闭问题列表");
  close.textContent = "×";
  close.addEventListener("click", () => clearFooterTopic(menu, panel));
  head.appendChild(close);

  const questions = document.createElement("div");
  questions.className = "footer-topic-questions";
  topic.questions.forEach((question) => {
    const link = document.createElement("a");
    link.href = buildContactPromptUrl(question, topic.intent);
    link.textContent = question;
    questions.appendChild(link);
  });

  panel.append(head, questions);
  panel.hidden = false;
}

document.querySelectorAll("[data-footer-prompt-menu]").forEach((menu) => {
  const panel = menu.parentElement?.querySelector("[data-footer-topic-panel]");
  if (!panel) return;

  menu.querySelectorAll("[data-footer-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const topicKey = button.getAttribute("data-footer-topic");
      const isOpen = button.classList.contains("active") && !panel.hidden;
      if (isOpen) {
        clearFooterTopic(menu, panel);
        return;
      }
      showFooterTopic(menu, panel, topicKey);
    });
  });
});

const contactParams = new URLSearchParams(window.location.search);
const contactQuery = contactParams.get("q");
const contactIntent = contactParams.get("intent") || "diagnosis";
const contactWidgetFromQuery = document.querySelector(".contact-ai-chat[data-ai-chat-widget]");
if (contactQuery && contactWidgetFromQuery) {
  setChatIntent(contactWidgetFromQuery, contactIntent);
  window.setTimeout(() => submitChatPrompt(contactWidgetFromQuery, contactQuery), 250);
}

document.querySelectorAll("[data-chat-open]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    const intent = trigger.getAttribute("data-chat-intent") || "diagnosis";
    const contactWidget = document.querySelector(".contact-ai-chat[data-ai-chat-widget]");

    if (contactWidget) {
      contactWidget.scrollIntoView({ behavior: "smooth", block: "center" });
      setChatIntent(contactWidget, intent);
      const input = contactWidget.querySelector("[data-chat-input]");
      if (input) window.setTimeout(() => input.focus(), 260);
      return;
    }

    chatOverlay = chatOverlay || createChatOverlay();
    chatOverlay.classList.add("show");
    const overlayWidget = chatOverlay.querySelector("[data-ai-chat-widget]");
    setChatIntent(overlayWidget, intent);
    const input = overlayWidget.querySelector("[data-chat-input]");
    if (input) window.setTimeout(() => input.focus(), 120);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatOverlay) {
    chatOverlay.classList.remove("show");
  }
});
