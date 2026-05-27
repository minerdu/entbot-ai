# Entbot AI Website Image Prompt Frameworks v5

This file is the default image-production standard for the new Entbot AI website.

The website positioning is: growth consulting plus AI growth solutions. Generated assets must support real business explanation, not generic article covers, decorative abstractions, stock imagery, or empty SaaS diagrams.

## v5 Production Rules

- A1 visuals are produced directly with HTML/CSS/SVG deterministic composition. Do not generate a `gpt-image-2` reference for PPT-like consulting/framework visuals unless the user explicitly requests it.
- A2 visuals use real AI-APP screenshots first, then HTML/CSS framing. Do not generate fake UI or use image generation as a substitute for a real screenshot unless the user explicitly asks for a concept image.
- B visuals use real client/case photos first. If no real source exists, generate with `gpt-image-2`.
- C visuals are client-supplied files such as QR codes and real case assets. Do not regenerate them unless requested.
- Type A visuals must benchmark the local Claude reference pages in `claude参考网页/`: large demo areas, strong whitespace, readable product/workflow content, restrained icons, and real interface-like modules.
- Type A visuals must contain real Chinese content from the current website page, approved concise rewrites, or real AI-APP screenshots. English is not allowed inside the image except necessary terms such as `Agent`, `Skill`, `AI APP`.
- Pure abstract placeholder lines are no longer acceptable for Type A. If an image has text areas, they must be meaningful and readable.
- Before creating an asset, always confirm format, aspect ratio, display size, export size, production route, template constraints, and text whitelist.
- Add a copy-quality gate before export: all visible copy must match the new website tone of "growth consulting plus AI growth solutions". Prefer current page H1, subtitle, section headings, product names, and approved concise rewrites. Avoid colloquial, low-end, anxiety-driven, or boss-command phrasing.
- Preserve the current page mockup/template as the design contract. The macro structure and the primary internal module structure are both binding: left/right, left/middle/right, top/bottom relationships, card count, dominant card hierarchy, color system, rounded corners, shadow style, spacing rhythm, and overall visual tone must stay consistent with the approved mockup. Content can be replaced, micro-layout can be adjusted, and small supporting elements can be added only when they do not change the template's main structure.
- Use the approved homepage Hero and final Skill-method image font scale as the default readability baseline for all later A1/A2 website images. For `2360px`-wide source compositions, important module titles should generally use `46-52px`, large card titles `30-36px`, readable body copy `22-26px`, UI labels/tags `17-22px`, and small support labels no smaller than `16-18px`. Card descriptions, screenshot-like UI descriptions, and AI-APP card subtext are not "small support labels"; they should usually be `22-24px`, with `22px` as the minimum. At the website display width of about `1180-1280px`, core text should still read clearly: module titles around `23-28px`, card titles around `16-20px`, body copy around `12-15px`, and labels at least `9-12px`.
- Font changes must not reduce business information quality. If larger text causes wrapping, overlap, or crowded modules, first adjust module width, height, grid tracks, spacing, or content hierarchy. Only shorten copy when it still preserves the original business meaning and the user has approved the shorter wording.
- Do not invent a new structure when a module already has a preset mockup. Each image must first inspect and follow the target module's own template, then replace the content based on that module's title, body copy, background context, and target explanation. Template fidelity comes before visual novelty.

## Approved Homepage Baseline

The first three homepage image groups are now the reference baseline for later images:

- `home-hero-growth-loop`: final source ratio `2360 x 1440`; two-column macro structure; warm peach stage; left dark consulting/workflow module; right white execution dashboard; bottom iteration and industry band.
- `home-challenge-factory-growth-flow` and `home-challenge-chain-growth-flow`: final source ratio `2360 x 1320`; light page-specific background; large white diagnostic board; left/middle workflow diagnosis; right black diagnosis conclusion card; bottom three-step process.
- `home-skill-agent-method`: final source ratio `2360 x 1320`; three-column method visual; left dark benchmark input; center Benchmark Skill asset library; right Skill calling and AI APP execution; bottom method flow.

Use these as style and quality references, not as templates to copy. Later modules must keep the same professional level of layout, typography, color restraint, and alignment, while choosing a structure that fits their own content.

### HTML/CSS Composition Standards From The Approved Images

- Format: build deterministic HTML/CSS/SVG compositions for A1/A2 final assets when visible Chinese text, exact alignment, or responsive WebP delivery matters.
- Aspect ratio: lock the ratio before design. Homepage Hero is now `2360 x 1440`; current homepage challenge and Skill method images remain `2360 x 1320`. Do not assume all homepage images share one ratio.
- Layout: preserve the page slot's macro shell and primary internal module structure, such as left/right, top/bottom, three-column, card stack, or tab image structure. Redesign only the content inside those modules, and only make measured geometry changes when readability, alignment, or content fit requires it.
- Alignment: key modules must align by measured coordinates, not by visual guesswork. If a left module should match three right-side cards, calculate the card track heights and gaps, then set the left module height and position to match exactly.
- Spacing: avoid both cramped layouts and accidental empty gaps. Main content blocks need clear rhythm; bottom process bands need enough vertical distance from the main modules so they do not feel attached.
- Font: use the final Hero and final Skill method images as readability references. At `2360px` source width, card titles should usually be `30-36px`, body copy `22-26px`, AI APP subtext and screenshot-like descriptions at least `22px`, and labels usually `17-22px`.
- Text: image text should be Chinese and should come from the current page, approved concise rewrites, or real AI-APP screenshots. Avoid punctuation at the end of short title labels unless the page copy specifically requires it.
- Color: use paper white, warm gray, soft black, and restrained AI APP accents. Dark modules need enough contrast between card background, section background, border, and text; do not let nested cards blend into the parent.
- Four AI APP color mapping: AI 引流 blue, AI 招商 green, AI 运营 orange, AI 培训 purple. Icons and accents should reflect product function, not generic charts.
- Final check: inspect at actual website display width around `1180-1280px`, not only at source resolution. If text or modules feel tight, adjust geometry first.

### Direct HTML/CSS Workflow

For every new A1/A2 image, follow this sequence:

1. Read the module title, subtitle, body copy, nearby tabs/buttons, page context, and existing mockup slot.
2. Inspect the existing mockup/template and record the non-negotiable structure: column count, card positions, main module hierarchy, background, color, shadow, radius, and spacing rhythm.
3. Extract only the information relevant to Entbot AI's growth consulting plus AI growth solution from source files or case materials. Do not turn the image into a generic client project summary.
4. Fill the correct preset framework with the real page content, allowed text, locked spec, and template fidelity rules.
5. Build the final asset directly in HTML/CSS/SVG or screenshot composite using accurate Chinese text, measured alignment, approved font scale, and the current page style.
6. Export PNG source, inspect, then generate WebP candidates after user approval.
7. Ask for confirmation at the agreed review checkpoint before moving to the next page or next batch.

## Default Workflow

For each image:

1. Read the target page, module title, body copy, nearby buttons, tabs, labels, and existing UI text.
2. Inspect the current mockup for the target image slot and record non-negotiable layout constraints.
3. Decide the production route:
   - `A1`: HTML/CSS consulting/framework visual with real Chinese content.
   - `A2`: real AI-APP screenshot composite.
   - `B`: real-photo-first or gpt-image-2 industry/case visual.
   - `C`: client-supplied real image or QR code.
4. Lock the asset spec before generation:
   - path
   - format
   - aspect ratio
   - display size
   - export size
   - source inputs
   - exact Chinese text allowed in the image
5. Create a concise Chinese image brief.
6. Fill the preset prompt framework using the module title, page copy, background context, allowed text, and locked spec.
7. For A1/A2 final delivery, create or update an HTML/CSS composition or real screenshot composite directly from the approved website style, module template, and source content. For B, use real photos first or generate final image2 output only when no real source exists.
8. Preserve the module's preset template. Replace content and tune spacing, but do not introduce a different main layout unless the user approves a redesign.
9. Generate or capture one asset at a time.
10. Inspect the result for module-specific concept fit, template fidelity, measured alignment, text language, text accuracy, copy tone, business meaning, visual style, ratio, and crop safety.
11. Place the asset in `assets/images/**`, update references only after it passes review.

## Shared Website Context

- Brand: 蔚为 / Entbot AI.
- Positioning: 增长咨询 + AI 增长解决方案.
- Core method: 诊断增长问题 -> 沉淀标杆 Skill -> Agent 执行 -> 落到 AI APP -> 复盘迭代.
- Product system: AI 引流, AI 招商, AI 运营, AI 培训.
- Target audience: 企业老板、增长负责人、品牌工厂、跨境电商团队、美业医美连锁、本地连锁总部、AI 解决方案采购者.
- Visual tone: 简洁、克制、专业、温暖、咨询感、真实业务感、Claude 官网式大图演示区.
- Palette: paper white, warm gray, soft black, restrained blue, green, orange, and purple accents for the four AI APP lines.
- Avoid: sci-fi neon, AI brain icons, robot/chatbot mascots, random code streams, cheap stock photos, exaggerated 3D icons, fake logos, fake QR codes, empty placeholder diagrams, English UI labels, unreadable text blocks.
- Copy tone: use restrained, professional, growth-consulting language. Avoid phrases like "老板目标", "每天催人", "本月要增长", "搞流量", "爆单", "降本增效" as empty slogans, or any phrasing that feels low-end, coercive, or inconsistent with the new website.
- Template fidelity: current page mockups define the macro shell, not the exact internal composition. For example, the homepage Hero image must preserve the two-column relationship, warm peach stage background, left dark content area, right white execution area, rounded corners, shadows, and spacing. Inside the left and right areas, modules, cards, diagrams, process strips, and business content can be freely reorganized to better express the business idea.
- Font baseline: the final approved homepage Hero, Skill-method, and Lizi case image are the readability benchmark. Future images must not go back to the earlier small-text scale. For `2360px` source-width compositions, meaningful Chinese text should follow this scale: primary in-image titles `76-92px`, secondary titles `38-46px`, major card titles `46-68px`, body copy `23-29px`, card descriptions/task rows/AI APP rows `21-24px`, pills/tabs/status labels/diagnosis rows/flow-node main text `20-24px`, and radar/chart labels or secondary flow text `18-21px`. Only decorative metadata can use `16-17px`. Text must be judged at actual webpage display width (`1280px` desktop), not only at source resolution.

## Claude Reference Baseline

Reference folder: `claude参考网页/`.

Borrow these patterns:

- Large centered or near-centered demo visuals below strong headings.
- Real content inside product or workflow panels, not decorative shapes only.
- Sparse page rhythm, large whitespace, warm off-white backgrounds.
- Thin line icons and small visual symbols supporting the main point.
- Product screenshots or screenshot-like panels with readable interface content.
- Bottom bands that summarize audiences, workflows, resources, or feedback loops with small icons and short labels.
- Large rounded demo containers, usually 16:9, 16:10, or 4:3 depending on the page module.

Do not copy Claude branding, colors, logos, wording, or page content.

## A1: Consulting Framework Visual With Real Chinese Content

Use this for homepage hero, about-page method visuals, service-page frameworks, and any image whose job is to express a business view, growth logic, operating model, or consulting framework.

### Chinese Brief Framework

```text
【类型】
A1：中文增长咨询框架图

【角色】
你是一位资深 B2B 官网视觉设计师，长期服务企业咨询、SaaS、AI 解决方案公司。你的任务不是做抽象装饰图，而是把蔚为官网当前页面的真实文案，转化成一张可阅读、有信息量、有咨询观点、有产品落地感的官网大图。

【官网背景】
蔚为提供增长咨询 + AI 增长解决方案。核心方法是：从企业增长问题出发，诊断业务流程和标杆差距，把有效经验沉淀为 Skill，让 Agent 在明确边界内执行，最后落到 AI 引流、AI 招商、AI 运营、AI 培训四个 AI APP 中，并通过复盘持续迭代。

【页面信息】
页面：{{page}}
模块标题：{{section_title}}
模块文案：{{section_copy}}
图片用途：{{asset_purpose}}
页面已有可用文字：{{allowed_chinese_text}}
当前模拟模板：{{current_mockup_structure}}
目标受众：企业老板、增长负责人、连锁总部、AI 解决方案采购者

【规格先定】
格式：{{format}}
比例：{{aspect_ratio}}
网页显示尺寸：{{display_size}}
输出尺寸：{{export_size}}
裁切安全区：{{crop_safe_area}}
生产方式：{{production_route}}，A1 默认 HTML/CSS 确定性排版
模板保真要求：{{template_fidelity_rules}}

【需要先输出的图片说明】
1. 核心观点：这张图要表达的增长判断。
2. 业务结构：3-6 个清晰节点，例如“增长目标 -> 蔚为拆解 -> Agent + Skill -> AI APP -> 复盘迭代”。
3. 真实内容：列出画面中允许出现的中文标题、模块名、标签和短句，必须来自官网当前页面或 AI-APP 真实界面。
4. 视觉形式：选择经营地图、增长飞轮、分层架构、流程管线、指挥看板、策略矩阵或 Claude 式产品演示舞台。
5. 页面适配：说明留白、视觉重心、可裁切区域、底部信息带是否需要保留。
6. 模板保真：列出必须保持不变的宏观结构、主要内部模块、卡片数量、配色、卡片层级和关键比例；同时列出只允许微调的位置，避免把图片做成另一个版式。

【视觉要求】
- 基准风格：简洁、浅色、克制、纸感背景、细线图标、轻量阴影、模块化界面。
- 对标 Claude 官网的大图演示区：真实内容、真实界面感、清晰留白，不要做纯示意图。
- 必须严格继承当前页面模拟图的模板结构和设计系统：例如左右、左中右、上下关系，主卡片数量，卡片堆叠方式，配色、圆角、阴影、留白节奏和整体风格不变。内部内容要替换为当前模块的真实内容，但不能把主要结构改成另一个设计。
- 可以做的调整：改文字、改模块内的信息层级、替换图标、调整列宽和高度、增加少量底部或局部辅助信息。不能做的调整：改变左中右关系、改变主卡数量、把原本的卡片堆叠改成全新看板、把既定模板变成另一张咨询框架图。
- 中文文字必须可读，且必须使用“页面已有可用文字”里的内容；不得编造英文标签或无关口号。
- 字号必须参照已确认的首页 Hero 与 Skill 方法图小字增强版基准：源图宽度约 2360px 时，核心模块标题约 46-52px，卡片标题约 30-36px，正文约 22-26px，标签约 17-22px，小辅助文字不低于 16-18px。卡片说明、截图式 UI 说明、AI APP 卡片副说明不属于“小辅助文字”，通常使用 22-24px，最低不低于 22px；网页显示到 1180-1280px 宽时仍要清晰可读。
- 如果字号放大导致换行、重叠或拥挤，优先通过增加模块高度、调整列宽、减少无效留白、重新排列卡片来解决；不要为了适配字号直接删掉关键信息。
- 文案必须符合新官网调性：增长咨询 + AI 增长解决方案。优先使用页面大标题、副标题、模块标题、产品名和经过压缩的正式表达；避免口语化、低端、焦虑式、老板命令式表达。
- 必要英文术语只允许：Agent、Skill、AI APP。
- AI-APP 相关画面优先使用真实截图或真实截图风格，不做完全虚构的软件界面。
- 底部可使用类似“复盘与迭代 / 下一轮迭代 / 洞察反馈 / 品牌工厂 / 跨境电商 / 美业医美 / 本地连锁”的信息带。
- 避免科幻霓虹、机器人头像、AI 大脑、随机代码、握手图、过度 3D、密集不可读小字。

【最终输出】
先输出 HTML/CSS 构图说明、画面文字白名单、模板保真清单和导出规格。除非用户明确要求，不再为 A1/A2 先生成 image2 参考图；最终官网图以 HTML/CSS 确定性排版保证中文文字和对齐准确。
```

### Chinese Prompt Framework

```text
为蔚为 Entbot AI 官网生成一张 {{asset_purpose}} 图片，生产方式优先为 HTML/CSS 确定性排版。

图片类型：A1 中文增长咨询框架图。
输出规格：{{format}}，{{aspect_ratio}}，{{export_size}}。
网页显示：{{display_size}}，重要内容必须留在 {{crop_safe_area}} 内。

业务观点：
{{core_thesis}}

画面要表达的业务结构：
{{business_structure}}

画面内容与布局：
- 使用简洁、浅色、克制的 Claude 官网式大图演示区风格。
- 画面不是纯抽象示意图，而是一张有真实中文内容的信息型官网视觉。
- 严格保留当前页面模拟图的大结构模板：{{template_fidelity_rules}}。
- 内容区只能在预设模板的主结构内替换和微调：保留主卡位置、卡片数量、核心视觉重心和模块关系；判断标准是“仍然是当前模板，只是内容更新”，不是“同风格的新图”。
- 如果旧模板局部区域出现空缺、拥挤或模块关系不协调，优先调整该区域内部的宽高、字号、行距和卡片间距；只有在不破坏主结构时，才允许增加底部小流程或局部辅助信息。
- 主体结构：{{composition_format}}。
- 左侧/上层表现：{{left_or_top_content}}。
- 中心表现：{{center_content}}。
- 右侧/下层表现：{{right_or_bottom_content}}。
- 底部信息带：{{bottom_band_content}}。
- 如涉及 AI-APP，界面必须接近真实企业后台或使用真实 AI-APP 截图作为基础，不能凭空做虚假产品。

画面文字白名单：
{{allowed_chinese_text}}

文字规则：
- 画面内所有可读文字必须为中文，且只能来自“画面文字白名单”。
- 只允许保留必要英文术语：Agent、Skill、AI APP。
- 不要出现英文标题、英文行业标签、英文按钮、英文段落、假品牌名、假 Logo、假二维码。
- 中文文字要短、清晰、像真实官网/产品界面，不要密集堆字。
- 字号以最终确认的首页 Hero 与 Skill 方法图小字增强版为基准：源图宽度约 2360px 时，核心模块标题约 46-52px，卡片标题约 30-36px，正文约 22-26px，标签约 17-22px，小辅助文字不低于 16-18px。卡片说明、截图式 UI 说明、AI APP 卡片副说明通常使用 22-24px，最低不低于 22px。后续 A1/A2 图不能回到更小的早期字号。
- 字号和信息量同时检查：如发生换行、重叠或拥挤，优先调整模块宽高、列宽、卡片间距和内容层级；只在不损失业务含义时压缩文字。
- 导出前必须做文案检查：标题、卡片、标签、说明文字都要符合“增长咨询 + AI 增长解决方案”的专业语气；不使用口语化、低端、焦虑式、催促式表达。

视觉风格：
- 纸白和暖灰背景，柔和黑色信息层。
- 少量蓝、绿、橙、紫作为 AI 引流、AI 招商、AI 运营、AI 培训的识别色。
- 细线图标、轻量数据图表、真实卡片、流程线、可读模块标题、克制阴影。
- 留白充足，信息层级清楚，整体像高端 B2B 官网的产品演示图和咨询框架图结合。
- 当前模块已有的大结构、主要内部模块、配色、圆角、阴影和留白节奏是设计基准；内容表达要基于模块文案更新，但主结构不能大改。局部布局只做必要微调，避免两个模块硬拼或留下明显空缺。

禁止：
- 禁止科幻霓虹、AI 大脑、机器人头像、聊天机器人吉祥物、代码雨、握手素材、廉价 3D 图标。
- 禁止纯占位线条图，禁止全英文界面，禁止编造不在白名单里的文字。
- 禁止视觉杂乱，禁止小到无法阅读的文字。

目标：
让企业访客能通过这张图看懂：蔚为如何把增长目标、业务诊断、Agent、Skill、AI APP 和复盘迭代连接成一个真实可执行的增长系统。
```

## A2: AI-APP Screenshot Composite

Use this for homepage product previews, product pages, and any visual that should show real AI-APP product capability.

### Production Rule

Primary source is browser screenshot from the local AI-APP interfaces. Do not generate fake UI from scratch if a real interface exists.

Steps:

1. Open the target AI-APP route in browser.
2. Set viewport based on the locked export size.
3. Capture a clean screenshot.
4. Fill the preset prompt framework with the module title, page copy, real screenshot context, locked export spec, and template fidelity rules.
5. Crop or frame the real screenshot into the website visual size using HTML/CSS or image composition. Preserve the real Chinese UI content and the module's preset template.

### Prompt Framework

```text
基于提供的 AI-APP 真实界面截图，生成一张用于蔚为官网的产品演示图。

输出规格：{{format}}，{{aspect_ratio}}，{{export_size}}。
必须保持截图中的中文界面内容、模块结构、产品逻辑和主要数据，不要重写、翻译或发明界面文字。

视觉处理：
- 参考 Claude 官网产品演示区，使用大尺寸浅色演示舞台。
- 保留真实界面作为主体，只增加克制的背景、阴影、边框、局部放大或轻量注释。
- 色彩与对应产品一致：AI 引流蓝、AI 招商绿、AI 运营橙、AI 培训紫。
- 画面要真实、可读、像企业官网里的产品截图，而不是概念海报。

禁止：
- 不要把中文界面变成英文。
- 不要重绘成虚假软件。
- 不要添加假 Logo、假二维码、无关人物或科幻元素。
```

## B: Industry Scenario Evidence Visual

Use this for case-page generated supplements and specific industry visuals whose job is to make a business scene feel concrete, credible, and related to the growth workflow.

### Chinese Brief Framework

```text
【类型】
B：行业场景证据图

【角色】
你是一位资深商业图片设计师，擅长为 B2B 官网设计可信、克制、真实的行业场景图。你的任务是把蔚为案例中的业务流程、行业场景和 AI 工作流表达成一张企业客户相信的图片。

【页面信息】
页面：{{page}}
案例/模块：{{case_or_section}}
标题：{{title}}
文案：{{copy}}
行业场景：{{industry_scene}}
图片用途：{{asset_purpose}}
真实素材：{{real_sources}}
允许出现的中文文字：{{allowed_chinese_text}}

【规格先定】
格式：{{format}}
比例：{{aspect_ratio}}
网页显示尺寸：{{display_size}}
输出尺寸：{{export_size}}
生产方式：{{production_route}}

【视觉要求】
- 真实行业场景优先；如果客户提供真实图片，优先使用真实图片。
- 可以使用轻量 UI 叠层表现 AI 辅助，但 UI 文字必须是中文，并来自白名单或真实截图。
- 人物如出现，必须自然、真实、不过度摆拍。
- 适合企业官网案例页，不做消费品广告大片。
- 不要出现错误品牌 Logo、夸大医疗效果、科幻机器人城市、假二维码、英文界面或密集小字。

【最终输出】
输出一段可直接给 gpt-image-2 使用的中文详细提示词，并附上“画面文字白名单”。
```

### Prompt Framework

```text
为蔚为 Entbot AI 官网生成一张行业案例视觉。

图片类型：B 行业场景证据图。
输出规格：{{format}}，{{aspect_ratio}}，{{export_size}}。

行业场景：
{{industry_scene}}

核心业务动作：
{{business_action}}

AI 工作流痕迹：
{{ai_trace}}

真实素材使用方式：
{{real_sources_usage}}

画面文字白名单：
{{allowed_chinese_text}}

视觉风格：
- 真实、干净、可信、企业级。
- 参考 Claude 官网案例/解决方案页的克制留白和清晰内容表达。
- 保持纸白、暖灰、柔和黑色信息层，少量蓝/绿/橙/紫点缀。
- UI 叠层必须轻，不遮挡真实业务场景。

文字规则：
- 可读文字必须是中文，且只能来自白名单或真实截图。
- 必要英文术语只允许 Agent、Skill、AI APP。

禁止：
- 不要消费广告感，不要科幻感，不要机器人，不要假 Logo，不要假二维码。
- 不要夸大医疗、美容、教育、经营效果。
- 不要编造客户名称、数字、认证、奖项。
```

## C: Client-Supplied Real Images And QR Codes

Use this for real case images, QR codes, client screenshots, and source photos provided by the user.

Rules:

- Do not regenerate QR codes unless the user explicitly asks.
- Do not alter real case evidence in a way that changes factual meaning.
- For website integration, only crop, resize, compress, frame, or lightly color-match.
- Store originals in `assets/images/_source/` and final optimized files in the target page folder.
