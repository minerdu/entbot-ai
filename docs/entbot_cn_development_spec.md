# entbot.cn 中文官网开发说明文档

版本：v1.2  
更新时间：2026-05-10  
适用站点：entbot.cn 中文官网  
关联需求：`entbot_cn_website_requirements_detailed.md`  
文档用途：作为进入开发阶段的页面、组件、数据、样式、资产和验收执行说明

> 本文档中的页面结构、文案内容和验收标准以需求文档为准。本文档只补充技术实现细节、组件拆分、数据结构和开发阶段说明。如两份文档出现冲突，以需求文档为准。

### 变更记录

| 版本 | 日期 | 变更内容 |
| --- | --- | --- |
| v1.0 | 2026-05-08 | 初始版本 |
| v1.1 | 2026-05-09 | 增加文档权威说明、案例数据结构补全、services.ts 定义、移除 faq.ts、说明 lib/cn.ts、增加部署说明 |
| v1.2 | 2026-05-10 | 基于粒子空间与新实体连锁 AI 材料，补充旗舰案例数据结构、真实项目验收、静态页实现策略和品牌命名修正 |

## 1. 开发目标

第一阶段开发一个可上线的中文官网，服务中国市场客户，重点完成：

- 首页；
- 产品页；
- 案例页；
- 增长服务页；
- 关于页；
- 联系页；
- 隐私政策页。

第一阶段不追求 CMS、复杂后台、在线支付、完整诊断算法。重点是完成高质量静态官网和清晰转化路径。

## 2. 站点命名规范

### 2.1 官网名称

- 中文官网对外品牌：蔚为
- 中文官网域名：entbot.cn
- 英文官网：Synva.ai

代码和 SEO 可以使用 `entbot.cn` 作为域名标识，但页面可见主品牌、Logo、Hero 和 CTA 文案应使用“蔚为”。页面 title 建议使用“页面主题｜蔚为｜entbot.cn”。

### 2.2 文案禁用

中文站不应出现以下作为官网名称的表达：

- Synva AI 新官网；
- Agent.AI；
- AI Sales 英文站；
- Synva-ai 中文站。

如确需提到英文站，写作：

> 英文官网 Synva.ai

### 2.3 产品名称

中文站产品名称统一：

- AI 引流；
- AI 招商；
- AI 运营；
- AI 培训。

代码中可使用英文 slug：

- `ai-growth`；
- `ai-fran`；
- `ai-ops`；
- `ai-train`。

## 3. 推荐技术栈

第一阶段允许使用静态 HTML/CSS/JS 完成页面确认、布局确认、内容确认和设计确认。当前阶段重点是让客户能看到完整官网，不要求立即接 CMS、后端和复杂诊断逻辑。

后续如果从空目录重新工程化，推荐使用：

- Next.js App Router；
- React；
- TypeScript；
- Tailwind CSS；
- 静态内容数据文件；
- Cloudflare Pages 或同类静态/边缘部署。

原因：

- 官网内容以静态展示为主；
- 需要较强组件化和响应式；
- 后续可扩展诊断表单、案例详情、多语言和 SEO；
- 当前多个 AI APP 项目已有 Next.js 生态经验。

静态页阶段要求：

- 所有需要图片先使用模拟图、CSS 模拟界面或占位 SVG；
- Tab 切换、案例筛选、移动端菜单用原生 JS 完成；
- 文案、页面结构和视觉方向确认后，再决定是否迁移 Next.js；
- 静态页也必须保留清晰的数据语义，方便未来拆分到 `content/` 数据文件。

## 4. 推荐目录结构

建议 entbot-ai 项目采用以下结构：

```text
entbot-ai/
  docs/
    entbot_cn_website_requirements_detailed.md
    entbot_cn_development_spec.md
  public/
    images/
      hero/
      products/
        ai-growth/
        ai-fran/
        ai-ops/
        ai-train/
      cases/
      industries/
      logos/
      diagrams/
  src/
    app/
      page.tsx
      products/
        page.tsx
      cases/
        page.tsx
      services/
        page.tsx
      about/
        page.tsx
      contact/
        page.tsx
      privacy/
        page.tsx
      layout.tsx
      globals.css
    components/
      layout/
        Header.tsx
        Footer.tsx
        MobileNav.tsx
      sections/
        HeroSection.tsx
        ChallengeTabs.tsx
        MethodSection.tsx
        ProductMatrixTabs.tsx
        IndustrySolutions.tsx
        StarterScenarios.tsx
        CasePreview.tsx
        ServiceProcess.tsx
        TrustSection.tsx
        FinalCta.tsx
      ui/
        Button.tsx
        SectionHeader.tsx
        TabSwitcher.tsx
        ScreenshotFrame.tsx
        MetricCard.tsx
        CaseCard.tsx
        FormField.tsx
    content/
      site.ts
      navigation.ts
      products.ts
      industries.ts
      cases.ts
      services.ts
      seo.ts
    lib/
      cn.ts
```

说明：

- `content/` 目录存放纯数据文件，页面内容和组件从此处读取，方便后续内容维护；
- `lib/cn.ts` 是 CSS class 合并工具函数（类似 `classnames`），用于组合条件类名。

如果实际项目已经存在其他结构，应优先保持现有工程习惯，但必须保留清晰的内容数据层和组件拆分。

当前静态页阶段可以采用：

```text
entbot-ai/
  index.html
  products.html
  cases.html
  services.html
  about.html
  contact.html
  privacy.html
  assets/
    css/styles.css
    js/main.js
    images/mock/
  docs/
    entbot_cn_website_requirements_detailed.md
    entbot_cn_development_spec.md
```

静态页不需要强行创建 React 目录，但页面模块命名、CSS class 和数据结构应尽量对应本文档，避免后续迁移时全部重写。

## 5. 路由说明

### 5.1 必备路由

| 路由 | 页面 | 优先级 |
| --- | --- | --- |
| `/` | 首页 | P0 |
| `/products` | 产品矩阵 | P0 |
| `/cases` | 案例 | P0 |
| `/services` | 增长服务 | P0 |
| `/about` | 关于 | P1 |
| `/contact` | 联系我们 | P0 |
| `/privacy` | 隐私政策 | P1 |

第一阶段不单独建设 `/diagnosis` 页面，所有"预约增长诊断"CTA 统一指向 `/contact`。

### 5.2 第二阶段路由

| 路由 | 页面 |
| --- | --- |
| `/diagnosis` | AI 增长诊断（独立问卷和结果页） |
| `/products/ai-growth` | AI 引流详情 |
| `/products/ai-fran` | AI 招商详情 |
| `/products/ai-ops` | AI 运营详情 |
| `/products/ai-train` | AI 培训详情 |
| `/cases/[slug]` | 案例详情 |
| `/resources` | 资源中心 |

第一阶段可以不做独立详情页，但数据结构应预留 slug。

## 6. 全站布局

### 6.1 Header

左侧：

- 蔚为 logo 或文字标识，副标题可写“AI 增长解决方案”。

中间导航：

- 首页；
- 产品；
- 案例；
- 增长服务；
- 关于。

右侧：

- 预约增长诊断。

移动端：

- 使用汉堡菜单；
- 打开后展示同样导航和 CTA；
- 不要让菜单遮挡或溢出屏幕。

### 6.2 Footer

Footer 包含：

- 蔚为简短定位；
- 快速导航；
- 产品入口；
- 行业方向；
- 联系方式；
- 英文官网 Synva.ai 链接；
- 隐私政策；
- 版权信息。

### 6.3 全站 CTA

主 CTA 统一文案：

> 预约增长诊断

链接优先指向：

- `/contact`，如暂未实现诊断问卷；
- `/diagnosis`，如已实现诊断问卷。

## 7. 内容数据结构

### 7.1 `site.ts`

建议字段：

```ts
export const siteConfig = {
  brandName: "蔚为",
  domain: "entbot.cn",
  name: "蔚为 AI 增长解决方案",
  englishSiteName: "Synva.ai",
  url: "https://www.entbot.cn",
  description:
    "蔚为专注品牌工厂、跨境电商、美业医美与本地连锁，通过 AI Agent + Skill 重构销售、运营、招商与培训流程。",
  primaryCta: "预约增长诊断",
};
```

### 7.2 `products.ts`

建议字段：

```ts
export type Product = {
  id: "ai-growth" | "ai-fran" | "ai-ops" | "ai-train";
  name: string;
  englishName: string;
  shortTitle: string;
  description: string;
  businessProblem: string;
  targetTeams: string[];
  scenarios: string[];
  screenshots: {
    label: string;
    src: string;
    alt: string;
  }[];
};
```

四个产品必须都有：

- 一句话定位；
- 典型场景；
- 目标团队；
- 至少 1 张截图占位，后续替换真实截图。

### 7.3 `industries.ts`

建议字段：

```ts
export type IndustrySolution = {
  id: "brand-ecommerce" | "beauty-local-chain";
  name: string;
  summary: string;
  customerTypes: string[];
  pains: string[];
  workflows: string[];
  recommendedProducts: string[];
  starterScenarios: string[];
};
```

只允许两个主行业方向：

- `brand-ecommerce`：品牌工厂与跨境电商；
- `beauty-local-chain`：美业医美与本地连锁。

教育培训与知识服务不得放入首页主行业数据，只能放在案例分类。

### 7.4 `cases.ts`

建议字段：

```ts
export type CaseStudy = {
  slug: string;
  title: string;
  category:
    | "brand-ecommerce"
    | "beauty-local-chain"
    | "education-knowledge";
  customerType: string;
  challenge: string;
  aiWorkflow: string;
  products: string[];
  result: string;
  summary: string;
  logo?: string;
  image?: string;
  featured?: boolean;
  sourceDocs?: string[];
  disclosureLevel?: "public" | "anonymous" | "internal-only";
  metricStatus?: "verified" | "in-validation" | "demo" | "to-validate";
  aiAppMapping?: {
    productId: "ai-growth" | "ai-fran" | "ai-ops" | "ai-train";
    role: string;
    workflows: string[];
  }[];
  businessLoop?: string[];
  skillExamples?: string[];
  // 以下字段第一阶段可选，但数据结构中应预留
  background?: string;            // 客户背景
  agents?: string[];              // 使用的 Agent
  implementationProcess?: string; // 落地过程
  reusableExperience?: string;    // 可复用经验
  nextSteps?: string;             // 下一步优化方向
};
```

首批至少准备 5 个案例占位：

- 粒子空间；
- 美妆工厂；
- 智能硬件/机器人品牌；
- 医美连锁；
- 连锁眼镜店；
- 中山大学继续教育学院。

粒子空间应作为 `featured: true` 的旗舰案例。即使第一阶段不做详情页，也要在数据中保留完整的业务闭环和公开边界。

示例：

```ts
export const liziSpaceCase: CaseStudy = {
  slug: "lizi-space",
  featured: true,
  title: "粒子空间：让 AI 接住精准护肤新实体连锁的增长闭环",
  category: "beauty-local-chain",
  customerType: "AI 精准护肤 / 新实体连锁项目",
  challenge:
    "产品、点位、私域和招商模式已有雏形，但获客、状态解释、首购、复购、招商和培训需要一套可持续执行的系统。",
  aiWorkflow:
    "将进站、AI 测肤、状态解释、粒子组合、Skin ID 建档、私域复购和招商复制拆成 Agent + Skill 流程。",
  products: ["AI 引流", "AI 招商", "AI 运营", "AI 培训"],
  result: "样板期验证指标：进站率、体验完成率、首购转化率、入私域率、30/60/90 日复购率。",
  summary:
    "用四个 AI APP 把精准护肤项目从商业计划拆成可落地、可训练、可复盘的增长流程。",
  disclosureLevel: "anonymous",
  metricStatus: "to-validate",
  sourceDocs: [
    "AI精准护肤粒子空间商业计划书V4.docx",
    "LC粒子空间商业计划.pdf",
    "新实体连锁AI.pdf",
  ],
  businessLoop: [
    "进站",
    "AI 测肤",
    "状态解释",
    "粒子组合",
    "Skin ID 建档",
    "私域复购",
    "招商复制",
  ],
  skillExamples: [
    "状态解释话术",
    "9.9 新客肌肤体验包 SOP",
    "复购触发规则",
    "招商异议处理",
    "店长/顾问培训题库",
  ],
};
```

### 7.5 `services.ts`

建议字段：

```ts
export type ServiceStep = {
  order: number;
  title: string;
  description: string;
};

export type Deliverable = {
  title: string;
  description: string;
};

export type CooperationMode = {
  title: string;
  description: string;
  timeline?: string;
};

export type AiImplementationPrinciple = {
  title: string;
  description: string;
  example?: string;
};

export const serviceSteps: ServiceStep[] = [
  { order: 1, title: "AI 增长诊断", description: "..." },
  { order: 2, title: "业务流程拆解", description: "..." },
  { order: 3, title: "Agent + Skill 搭建", description: "..." },
  { order: 4, title: "AI APP 部署与团队培训", description: "..." },
  { order: 5, title: "数据复盘与持续优化", description: "..." },
];
```

服务内容还需要维护新实体连锁 AI 的三类收益结构：

```ts
export const newRetailAiOutcomes = [
  {
    title: "多赚钱",
    points: ["提升复购", "提升到店", "提升客单", "提升招商转化"],
  },
  {
    title: "少浪费",
    points: ["减少流失", "减少无效跟进", "减少培训成本", "减少老板盯人"],
  },
  {
    title: "可复制",
    points: ["复制优秀顾问", "复制优秀店长", "复制招商话术", "复制门店 SOP"],
  },
];
```

## 8. 页面开发说明

## 8.1 首页 `/`

### 模块顺序

1. `HeroSection`
2. `ChallengeTabs`
3. `MethodSection`
4. `ProductMatrixTabs`
5. `IndustrySolutions`
6. `StarterScenarios`
7. `FlagshipCaseAnchor`
8. `CasePreview`
9. `ServiceProcess`
10. `TrustSection`
11. `FinalCta`

### HeroSection

必须包含：

- 主标题；
- 副标题；
- 两个行业标签；
- 主 CTA；
- 副 CTA；
- 四个 AI APP 产品矩阵视觉。

主标题：

> 蔚为 AI 增长解决方案

副标题：

> 把品牌工厂、跨境电商、美业医美与本地连锁的销售、运营、招商和培训流程，交给 AI Agent 持续执行。

版式要求：

- 首屏使用居中大标题，不采用普通左文右图；
- CTA 居中；
- 首屏下方使用大幅产品/流程视觉；
- 移动端标题需要自然换行，不能压缩到难读。

### ChallengeTabs

两个标签：

- 品牌工厂与跨境电商；
- 美业医美与本地连锁。

每个标签展示：

- 4 个痛点；
- 2-3 个业务影响；
- 对应的 AI 化方向。

### MethodSection

展示 Agent + Skill 结构：

- 业务目标；
- AI Agent；
- Skill；
- AI APP。

建议使用横向流程或分层结构，不要用复杂技术架构图。

### ProductMatrixTabs

产品标签：

- AI 引流；
- AI 招商；
- AI 运营；
- AI 培训。

每个标签展示：

- 产品截图；
- 一句话定位；
- 3 个场景；
- 适合团队；
- 查看产品矩阵链接。

交互要求：

- 桌面端点击标签切换内容；
- 移动端可改为分段列表或 accordion；
- 切换不得造成明显布局跳动；
- 截图容器固定比例，建议 `16 / 10` 或 `4 / 3`。

### IndustrySolutions

只展示两个行业方案。不要新增第三个行业卡片。

每个方案展示：

- 适合客户；
- 重点流程；
- 适配产品；
- 入口 CTA。

### CasePreview

首页最多展示 3 个案例：

- 粒子空间旗舰案例；
- 一个美业医美与本地连锁；
- 一个教育培训与知识服务。

案例卡片要突出“流程如何被 AI 改造”，不要只展示客户名称。

### FlagshipCaseAnchor

用于首页和服务页之间的真实项目锚点。

必须展示：

- 项目名称：粒子空间；
- 项目类型：AI 精准护肤 / 新实体连锁；
- 业务闭环：进站、AI 测肤、状态解释、粒子组合、Skin ID 建档、私域复购、招商复制；
- 四个产品如何参与；
- 指标为样板期验证指标，不作为已实现承诺。

推荐可视化：

- 左侧为项目业务闭环；
- 右侧为 AI APP / Agent / Skill 对应关系；
- 或使用横向流程图，不使用普通三栏功能卡。

## 8.2 产品页 `/products`

### 页面模块

1. 产品页 Hero；
2. 四个 APP 总览；
3. 大型产品标签展示；
4. Agent + Skill 架构；
5. 行业组合建议；
6. 产品图库；
7. CTA。

### 实现重点

- 产品截图必须足够大；
- 文案围绕业务场景，不围绕技术能力；
- 不做复杂价格表；
- 不引导用户直接购买，主要引导预约演示和增长诊断。

## 8.3 案例页 `/cases`

### 页面模块

1. 案例页 Hero；
2. 粒子空间旗舰案例大图/视频位；
3. 分类筛选；
4. 案例列表；
5. 结果指标说明；
6. CTA。

### 分类筛选

分类：

- 全部；
- 品牌工厂与跨境电商；
- 美业医美与本地连锁；
- 教育培训与知识服务。

筛选可以首期用客户端状态完成，不需要后端。

### 案例卡片

每张卡片包含：

- 标题；
- 客户类型；
- 原问题；
- AI 介入流程；
- 使用产品；
- 结果指标。

粒子空间卡片额外显示：

- “旗舰样板案例”标签；
- 业务闭环缩略图；
- “样板期验证指标”提示；
- 不展示敏感财务预测和未授权专利细节。

## 8.4 增长服务页 `/services`

### 页面模块

1. 服务页 Hero；
2. AI 项目失败原因；
3. 蔚为落地原则；
4. 新实体连锁 AI 方法论；
5. 五步实施流程；
6. 可交付物；
7. 首批启动场景；
8. 项目合作方式；
9. CTA。

### 五步流程

1. 增长诊断；
2. 流程拆解；
3. Agent + Skill 搭建；
4. APP 部署与团队培训；
5. 数据复盘与持续优化。

### 新实体连锁 AI 方法论

服务页需要把“AI 主动执行团队”讲清楚：

- 不是软件，不是工具，不是功能菜单；
- 老板/负责人可以用自然语言下达目标；
- 系统拆成客户跟进、复购提醒、招商推进、员工训练、内容生成、数据复盘等任务；
- 有效打法沉淀为 Skill 后复制到更多门店、点位和员工。

展示结构建议：

- 多赚钱：提升复购、提升到店、提升客单、提升招商转化；
- 少浪费：减少流失、减少无效跟进、减少培训成本、减少老板盯人；
- 可复制：复制优秀顾问、优秀店长、优秀招商话术和门店 SOP。

## 8.5 关于页 `/about`

### 页面模块

1. 公司定位；
2. 专注两个行业方向的原因；
3. Agent + Skill 方法；
4. 客户与案例背书；
5. 中文官网和英文官网说明；
6. 联系 CTA。

### 英文站说明

可在页面底部或 Footer 写：

> 英文官网：Synva.ai

不要把 Synva.ai 写成中文站名称。

## 8.6 联系页 `/contact`

### 表单字段

必填：

- 姓名；
- 公司；
- 手机/微信；
- 所属行业方向；
- 当前最想解决的问题。

选填：

- 职位；
- 公司规模；
- 是否希望预约产品演示；
- 备注。

### 第一阶段提交处理

如果暂未接后端，表单可以：

- 前端校验；
- 提交后显示成功反馈；
- 同时预留 API 接口位置。

后续再接：

- 企业微信机器人；
- 邮件通知；
- CRM；
- 数据库。

## 9. 组件开发说明

### 9.1 `Button`

需要支持：

- `primary`；
- `secondary`；
- `ghost`。

按钮文字不能溢出，移动端需要允许换行或收缩。

### 9.2 `TabSwitcher`

用于：

- 行业痛点切换；
- 产品矩阵切换；
- 产品场景切换。

要求：

- 支持键盘操作；
- 当前选中态清晰；
- 移动端可横向滚动；
- 不依赖 URL 参数。

### 9.3 `ScreenshotFrame`

用于展示产品截图。

要求：

- 固定宽高比例；
- 图片 `object-fit: cover` 或 `contain` 根据实际截图决定；
- 支持空状态占位；
- 不使用过厚阴影；
- 不把截图放进多层卡片。

### 9.4 `CaseCard`

字段：

- category；
- title；
- customerType；
- challenge；
- aiWorkflow；
- result；
- products。

卡片高度尽量一致，移动端单列。

### 9.5 `SectionHeader`

统一处理：

- eyebrow；
- title；
- description。

标题不要过大，除 Hero 外避免使用 hero 级字号。

### 9.6 `FlagshipCaseBlock`

用于首页、案例页和服务页展示粒子空间样板项目。

字段：

- title；
- projectType；
- businessLoop；
- aiAppMapping；
- metricStatus；
- image；
- cta。

要求：

- 明确标注指标状态；
- 不展示未授权敏感数据；
- 视觉上更接近大图案例模块，不做普通小卡片。

### 9.7 `BeforeAfterFlow`

用于展示传统流程与 AI 化流程对比。

适用：

- 传统护肤购买逻辑 vs 粒子空间购买逻辑；
- 人工门店运营 vs AI 主动执行系统；
- 传统招商跟进 vs AI 招商跟进。

要求：

- 左右或上下对比；
- 每侧 3-5 个步骤；
- 移动端纵向展示；
- 文案必须短，避免表格过密。

### 9.8 `MetricStatusBadge`

用于案例指标旁边标注：

- 已验证；
- 验证中；
- 演示口径；
- 待验证。

粒子空间第一阶段默认使用“待验证”或“样板期验证指标”，除非业务团队提供可公开结果。

## 10. 视觉规范

### 10.1 色彩方向

整体应克制、专业、偏企业级。避免全站被单一蓝紫渐变控制。

建议：

- 背景：白色、浅灰、极浅冷色；
- 主文字：近黑；
- 辅助文字：中性灰；
- 强调色：可使用蓝、青、绿色中的一种，但不要大面积铺满；
- CTA：稳定清晰，不使用过度渐变。

四个 AI APP 的色彩可作为产品线识别：

- AI 引流：蓝色；
- AI 招商：绿色；
- AI 运营：橙色；
- AI 培训：紫色。

粒子空间相关页面或模块可以使用粉/浅玫瑰作为轻量点缀，但不得让官网整体变成美妆品牌站。官网主体仍然是蔚为的企业级 AI 增长解决方案。

### 10.2 字体与排版

中文优先使用系统字体：

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
  "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
```

要求：

- 不用视口宽度动态缩放字体；
- 字间距保持正常，不使用负字距；
- 移动端标题需要可读；
- 按钮和卡片内文字不能溢出。

### 10.3 布局

桌面端：

- 内容最大宽度建议 1120-1240px；
- 页面分区清晰；
- 避免卡片套卡片；
- 产品截图区域要大。
- Hero 首屏优先采用居中大标题 + 下方大图；
- Tab 区域优先采用胶囊标签 + 大幅截图/流程图；
- 结构化表达优先使用三条横向行、流程图、指标组，而不是大量卡片。

移动端：

- 单列为主；
- 导航收起；
- 标签可横向滚动；
- 截图保持比例，不压缩到不可读。

## 11. 图片与资产规范

### 11.1 图片路径

建议：

```text
public/images/hero/
public/images/products/ai-growth/
public/images/products/ai-fran/
public/images/products/ai-ops/
public/images/products/ai-train/
public/images/cases/
public/images/industries/
public/images/diagrams/
```

### 11.2 命名规范

使用英文小写和短横线：

```text
ai-growth-dashboard.png
ai-fran-leads.png
ai-ops-competitor-monitor.png
ai-train-roleplay.png
hero-product-matrix.png
agent-skill-architecture.png
lizi-space-business-loop.png
lizi-space-case-cover.png
new-retail-ai-method.png
```

### 11.3 图片要求

- 产品截图优先使用真实 APP 界面；
- 截图不要包含敏感客户数据；
- 如果数据敏感，需打码或使用演示数据；
- hero 图可使用生成图，但产品页必须尽量使用真实截图；
- 图片需压缩后再提交。

粒子空间和新实体连锁 AI 资产建议：

```text
public/images/cases/lizi-space/
  case-cover.png
  business-loop.png
  before-after-flow.png
  ai-app-mapping.png
public/images/diagrams/
  new-retail-ai-method.png
  ai-active-execution-team.png
```

不要直接使用商业计划书截图作为官网最终图。应重绘为官网统一风格的占位图或正式视觉，避免泄露敏感内容和造成风格割裂。

## 12. SEO 与元数据

### 12.1 首页 metadata

title：

> 蔚为 AI 增长解决方案｜entbot.cn

description：

> 蔚为通过 AI Agent + Skill 帮助品牌工厂、跨境电商、美业医美与本地连锁重构销售、运营、招商与培训流程，让现有团队承载更高增长。

### 12.2 页面 title 建议

- 产品：`AI APP 产品矩阵｜蔚为｜entbot.cn`
- 案例：`AI 增长案例｜蔚为｜entbot.cn`
- 增长服务：`AI 增长服务｜蔚为｜entbot.cn`
- 关于：`关于蔚为｜entbot.cn`
- 联系：`预约增长诊断｜蔚为｜entbot.cn`

### 12.3 结构化建议

第一阶段至少完成：

- 每页唯一 title；
- 每页 description；
- 图片 alt；
- 语义化 heading；
- robots.txt；
- sitemap.xml，可后补。

## 13. 表单与线索

### 13.1 表单验证

必须校验：

- 姓名不能为空；
- 公司不能为空；
- 手机/微信不能为空；
- 当前问题不能为空。

行业方向可用下拉：

- 品牌工厂与跨境电商；
- 美业医美与本地连锁；
- 教育培训与知识服务；
- 其他。

“其他”只出现在表单，不作为首页主行业。

### 13.2 线索数据结构

```ts
export type LeadPayload = {
  name: string;
  company: string;
  role?: string;
  contact: string;
  industry: string;
  companySize?: string;
  painPoint: string;
  wantsDemo?: boolean;
  message?: string;
  sourcePage: string;
};
```

### 13.3 后端预留

提交函数建议封装：

```ts
async function submitLead(payload: LeadPayload) {
  // TODO: connect to backend, CRM, email, or enterprise WeChat webhook.
}
```

不要把后端逻辑写死在组件里。

## 14. 响应式与可访问性

### 14.1 断点

建议：

- mobile：小于 768px；
- tablet：768px 到 1024px；
- desktop：1024px 以上。

### 14.2 必查项

- 375px 宽度无横向滚动；
- 768px 宽度布局不拥挤；
- 1440px 宽度内容不过度拉伸；
- 导航可键盘访问；
- 标签可键盘切换；
- 图片有 alt；
- 表单错误信息可读。

## 15. 开发阶段拆分

### 阶段 0：准备

- 确认技术栈；
- 初始化项目；
- 建立 docs、content、components、public 目录；
- 准备产品截图占位。

### 阶段 1：基础框架

- 全局样式；
- Header；
- Footer；
- Layout；
- SEO metadata；
- 按钮和基础 UI。

### 阶段 2：首页

- Hero；
- 行业痛点标签；
- Agent + Skill 方法；
- 产品矩阵标签；
- 行业方案；
- 案例预览；
- 服务流程；
- CTA。

### 阶段 3：核心页面

- 产品页；
- 案例页；
- 增长服务页。

### 阶段 4：信任与转化

- 关于页；
- 联系页；
- 隐私政策；
- 表单校验和提交反馈。

### 阶段 5：QA 与上线

- 桌面端检查；
- 移动端检查；
- build；
- 链接检查；
- 文案和命名检查；
- 部署 entbot.cn。

## 16. 开发验收清单

### 16.1 命名验收

- 中文官网全站主品牌统一为“蔚为”；
- entbot.cn 只作为域名、title 后缀、SEO 和 Footer 信息；
- 英文官网统一为 Synva.ai；
- 不再出现旧官网名称混用；
- 产品中文名和英文 slug 对应正确。

### 16.2 内容验收

- 首页只突出两个核心行业方向；
- 教育培训只出现在案例或表单中；
- 机器人归入智能硬件/品牌工厂方向；
- 连锁眼镜归入美业医美与本地连锁方向；
- 文案面向老板和业务负责人。
- 粒子空间作为旗舰案例出现在案例页，并能解释完整业务闭环；
- 服务页能解释新实体连锁 AI 的“主动执行团队”逻辑；
- 案例指标必须标注状态，不把待验证指标写成已实现结果。

### 16.3 交互验收

- 导航链接正常；
- 移动端菜单正常；
- 产品标签切换正常；
- 行业标签切换正常；
- 案例筛选正常；
- 表单验证正常；
- CTA 指向正确。

### 16.4 视觉验收

- 产品截图清晰可见；
- 页面不被抽象科技图形主导；
- 没有文字重叠；
- 没有按钮文字溢出；
- 没有卡片套卡片的臃肿结构；
- 移动端没有横向滚动。

### 16.5 技术验收

- `npm run build` 通过；
- 无明显控制台错误；
- 图片 alt 完整；
- metadata 完整；
- 404 页面可后补，但不影响第一阶段上线；
- 部署后主要页面可访问。

## 17. 后续扩展

第一阶段上线后，建议逐步增加：

- 案例详情页；
- 诊断问卷和初步结果页；
- 客户案例视频；
- 行业报告下载；
- 资源中心；
- 中文站与英文站的清晰跳转；
- 表单接入企业微信或 CRM；
- 访问数据分析。

## 18. 开发原则

开发过程中必须遵守：

- 先把核心信息讲清楚，再考虑动效；
- 先使用真实产品截图，再考虑装饰图；
- 先保证移动端可读，再做复杂桌面效果；
- 先完成转化路径，再扩展资源内容；
- 不新增复杂一级导航；
- 不把官网做成 AI 功能大全；
- 不把中文站和英文站命名混用。

## 19. 部署与上线

### 19.1 部署目标

推荐使用 Cloudflare Pages、Vercel 或同类静态/边缘部署平台。如使用 Next.js，也可使用 Node.js 服务器部署。

### 19.2 上线前检查清单

- entbot.cn 域名已注册并完成实名认证；
- ICP 备案已通过（中国大陆访问必须）；
- DNS 解析指向部署平台；
- HTTPS 证书已配置；
- 所有页面可正常访问；
- 表单提交功能正常；
- robots.txt 和 sitemap.xml 部署后可访问；
- 移动端测试通过。

### 19.3 ICP 备案说明

中国大陆用户访问的网站必须完成 ICP 备案。备案主体应与“蔚为”的实际公司主体一致；如营业执照全称另行确认，以最终法务信息为准。备案完成后，需在 Footer 底部展示备案号并链接到工信部查询页面。

## 20. 内容更新与维护

### 20.1 当前阶段内容更新方式

由于第一阶段使用静态 HTML/CSS/JS，内容更新需要：

1. 修改对应的 HTML 文件；
2. 提交代码并重新部署。

如后续迁移到 Next.js + 数据文件方案，内容更新只需修改 `content/` 目录下的 `.ts` 数据文件。

### 20.2 内容更新责任

- 案例增加和更新：业务团队提供素材，开发团队更新文件；
- 产品截图替换：产品团队提供截图，开发团队替换图片文件；
- 文案修改：市场团队提出修改，开发团队更新。
