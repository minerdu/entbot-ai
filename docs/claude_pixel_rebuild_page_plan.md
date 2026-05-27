# entbot.cn 页面级重构方案

版本：v0.1  
日期：2026-05-10  
适用范围：首页、产品页、案例页、增长服务页、关于页、联系页、隐私页  
设计目标：先按 Claude 页面结构和比例复刻，再替换为蔚为与 AI-APP 系列视觉风格

## 1. 重构结论

当前 `entbot-ai` 根目录下的静态页面已经不能作为下一版官网的设计基底。下一轮应直接重建页面结构和样式系统，只保留以下内容作为参考或依据：

- `docs/entbot_cn_website_requirements_detailed.md`：内容和需求权威依据；
- `docs/entbot_cn_development_spec.md`：开发与验收依据；
- `claude参考网页/`：页面布局、比例、标题尺度、Tab 交互、大图区域的主要参考；
- `Agent-AI/`：仅借鉴原官网的信息结构、场景分组、行业页导航、Footer 信息密度，不继承暗色科技视觉；
- 已生成或后续补充的 AI-APP 截图、模拟图、粒子空间与新实体连锁 AI 图形资产。

重建时不继续在旧版 HTML/CSS 上修补。旧版静态实现包括 `index.html`、`products.html`、`cases.html`、`services.html`、`about.html`、`contact.html`、`privacy.html`、`assets/css/styles.css`、`assets/js/main.js` 和 `assets/images/mock/`，后续执行阶段可以整体删除或归档后重写。

## 2. 复刻原则

本轮不是“参考 Claude 气质”，而是先复刻 Claude 的页面骨架：

1. 页面宽度、标题比例、留白、Tab 高度、大图区域比例先按 Claude 处理；
2. 不使用普通 SaaS 左文右图首屏，首页必须采用居中大标题、短副标题、集中 CTA、下方大幅产品/流程视觉；
3. 每个核心页面都要有一个 Claude 式主视觉模块：大标题 + 小图形符号 + 大图/视频/演示区；
4. 产品展示不做小卡片堆叠，优先使用胶囊 Tab + 大尺寸演示舞台；
5. 结构化说明优先采用三条横向行、前后对比、流程图、指标组，不用密集功能卡；
6. 先还原 Claude 的布局和节奏，再将色彩、图形、模拟界面替换成 AI-APP 系列风格。

## 3. 桌面端基准比例

Claude 参考图宽度为 2741px，可视为约 1370px CSS 宽度的高倍截图。开发时采用以下桌面基准：

- 设计基准视口：1440px；
- 内容最大宽度：1180-1240px；
- 窄文本宽度：680-760px；
- 顶部导航高度：64-72px；
- 首屏上方留白：96-132px；
- 大区块上下间距：120-180px；
- 小区块上下间距：72-96px；
- 大图演示区宽度：1180-1240px；
- 大图演示区常用比例：16:9、16:10 或 4:3；
- 大图演示区圆角：24-32px；
- Tab 胶囊高度：52-60px；
- Tab 胶囊外层圆角：16-22px；
- 正文行高：1.45-1.65；
- 大标题行高：0.95-1.08。

移动端基准：

- 设计基准视口：390px；
- 页面左右边距：20-24px；
- 大标题字号降为 42-56px；
- Tab 横向滚动，不挤压文字；
- 大图区域保持比例，允许横向内容简化，但不压缩到不可读。

## 4. 字体与文字比例

Claude 的核心识别来自大标题比例。中文站应采用“标题宋体/衬线 + 正文系统无衬线”的组合。

建议字体：

- Display：`"Songti SC", "Noto Serif SC", "STSong", "SimSun", serif`
- Body：`-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif`

字号规则：

- 首页 H1：88-112px，移动端 46-56px；
- 其他页面 H1：96-128px，移动端 48-60px；
- 核心区块大标题：64-84px，移动端 40-48px；
- 二级标题：34-44px；
- 行标题：24-30px；
- 正文大段说明：22-26px；
- 普通正文：16-18px；
- 标签、按钮、说明文字：14-16px。

文字颜色：

- 主文字：接近黑色，建议 `#141414`；
- 正文辅助：中性灰，建议 `#5f5b55`；
- 弱说明：`#7a746c`；
- 分割线：`#e8e4dc`；
- 深色 Footer：`#111111` 背景，文字 `#f7f4ee`。

## 5. AI-APP 视觉皮肤

页面骨架按 Claude，视觉皮肤按蔚为和四个 AI-APP：

- 页面底色：白色、极浅灰、极浅暖白，建议 `#fbfaf7`、`#f7f7f4`、`#ffffff`；
- 模块底色：大面积保持克制，不用蓝紫渐变铺满；
- AI 引流：蓝色，建议 `#2563eb`；
- AI 招商：绿色，建议 `#07c160`；
- AI 运营：橙色，建议 `#ff8c00`；
- AI 培训：紫色，建议 `#7c3aed`；
- 粒子空间：可少量使用浅玫瑰/粉色，但只能作为案例点缀，不把官网做成美妆品牌站；
- 图形风格：线稿、流程图、模拟 APP 界面、数据看板、Prompt 卡片、任务卡片；
- 禁止：大面积科技蓝紫渐变、抽象 AI 光效、密集卡片、卡片套卡片、无业务含义的装饰图。

## 6. 全站基础结构

### Header

对标 Claude 的轻量导航：

- 高度 64-72px；
- 背景接近页面底色；
- 底部 1px 分割线；
- 左侧 Logo：`蔚为`，可加小字 `AI 增长解决方案`；
- 中间导航：首页、产品、案例、增长服务、关于；
- 右侧 CTA：`预约增长诊断`；
- 不做大型下拉菜单；
- 移动端使用菜单按钮展开。

### Footer

吸收原官网 Footer 信息密度，但视觉对标 Claude 深色 Footer：

- 深黑背景；
- 大标题 CTA；
- 产品、行业、案例、服务、关于、联系分栏；
- Footer 中可以出现 `entbot.cn` 和 `英文官网 Synva.ai`；
- 版权：`© 2026 蔚为 entbot.cn`；
- 备案信息预留。

## 7. 首页页面计划

参考页面：`claude-pricing-enterprise.png`、`claude-product-cowork.png`  
内容依据：需求文档 5.1-5.11，开发说明 8.1

### 7.1 Hero

结构：

1. 顶部小线稿符号，约 64-88px；
2. 居中 H1：`蔚为 AI 增长解决方案`；
3. 居中副标题，宽度 720-820px；
4. 标签行：品牌工厂与跨境电商、美业医美与本地连锁、Agent + Skill、AI 增长诊断；
5. CTA：主按钮 `预约增长诊断`，副按钮 `查看 AI APP 产品矩阵`；
6. 下方大幅产品矩阵视觉。

比例：

- H1 距导航顶部约 120px；
- H1 字号 96-112px；
- 副标题 22-26px；
- CTA 距副标题 28-36px；
- 大图距 CTA 72-96px；
- 大图 CSS 尺寸约 1180 x 660px。

图片预留：

- `hero-product-matrix.png`
- CSS 显示尺寸：1180 x 660px；
- 2x 原图建议：2360 x 1320px；
- 内容：四个 AI-APP 模拟手机/后台界面组合，不使用纯抽象图。

### 7.2 经营挑战 Tab

参考 Claude 的胶囊 Tab + 大演示区。

结构：

- 居中大标题：`增长不是缺少工具，而是关键流程还停留在人工经验里`
- 双 Tab：品牌工厂与跨境电商 / 美业医美与本地连锁；
- 大演示区：左侧问题流程，右侧 AI 化方向；
- 底部 2-3 个业务影响指标。

比例：

- 区块顶部留白 150px；
- 标题宽度 860px，字号 64-76px；
- Tab 宽度 580-720px，高度 56px；
- 演示区 1180 x 620px。

图片/图形预留：

- `challenge-brand-factory.png`
- `challenge-local-chain.png`

### 7.3 AI 增长方法

参考 Claude Enterprise 的“三条结构化收益”区。

结构：

- 小线稿图标；
- 居中大标题：`把优秀团队的经验沉淀成 Skill，再交给 AI Agent 持续调用`
- 左侧小型故事/案例卡：粒子空间业务片段；
- 右侧三条横向行：业务目标、AI Agent、Skill、AI APP；
- 每行左侧图标 + 标题，右侧解释。

比例：

- 标题 64-84px；
- 行高 140-180px；
- 每行顶部 1px 分割线；
- 左侧卡片宽 280-340px；
- 右侧内容宽 720-820px。

### 7.4 四个 AI APP 产品矩阵

参考 Claude Product Cowork 的 `Power through tedious tasks` Tab 演示。

结构：

- 小图标；
- 居中标题：`四个 AI APP，覆盖企业增长关键流程`
- 短副标题；
- 胶囊 Tab：AI 引流、AI 招商、AI 运营、AI 培训；
- 大演示舞台：不同 Tab 切换不同模拟产品界面；
- 下方两列说明：一句话定位 + 三个典型场景。

比例：

- Tab 高 56px；
- 大演示舞台 1180 x 700px；
- 舞台圆角 32px；
- 舞台底色根据产品线浅色变化。

图片预留：

- `product-ai-growth-stage.png`
- `product-ai-fran-stage.png`
- `product-ai-ops-stage.png`
- `product-ai-train-stage.png`

### 7.5 两大行业方案

结构：

- 大标题：`先专注两个高频增长场景，再持续沉淀可复制方法`
- 两个大横向方案块，不做三栏卡片；
- 每个方案包含适合客户、重点流程、适配 APP、CTA；
- 视觉上使用流程图或业务链路图。

比例：

- 每个方案块高度 420-520px；
- 左右布局，但避免普通小卡片感；
- 模块底色为浅灰/浅暖白。

### 7.6 首批落地场景

结构：

- 标题：`不必一次完成 AI 转型，先跑通最值得 AI 化的流程`
- 左右两组场景清单；
- 每条场景用小图标 + 一句话，不做重卡片。

### 7.7 粒子空间旗舰案例锚点

参考 Claude 的大视频/案例主视觉。

结构：

- 大标题：`一个真实项目，如何从想法变成 AI 可执行流程`
- 大图/视频占位；
- 下方三列或三行：交易闭环、运营闭环、招商闭环；
- 指标统一标注：样板期验证指标。

图片预留：

- `cases/lizi-space/case-cover.png`，显示 1180 x 664px；
- `cases/lizi-space/business-loop.png`；
- `cases/lizi-space/ai-app-mapping.png`。

### 7.8 案例预览、服务流程、可信模块、最终 CTA

案例预览：

- 只展示 3 个，不堆叠；
- 粒子空间必须作为第一个；
- 使用大图 + 简短结构化文字。

服务流程：

- 采用五步横向流程或纵向大行；
- 不做普通服务卡片。

可信模块：

- 用三条横向说明表达企业知识可控、AI 输出可审、关键决策由人把关。

最终 CTA：

- 深色或极浅色大区块；
- 一句话 + 两个按钮。

## 8. 产品页页面计划

参考页面：`claude-product-cowork.png`  
内容依据：需求文档第 6 章，开发说明 8.2

结构：

1. Hero：居中大标题或 Claude 式宽松双区布局，强调“四个 AI-APP 是增长工作台”；
2. 四个 APP 总览：用一行产品标识，不做密集卡片；
3. 中心大标题：`让 AI 接住重复、分散、低转化的经营动作`；
4. 大型产品 Tab：四个 APP 切换；
5. Agent + Skill 架构：使用分层图，不使用复杂技术架构图；
6. 粒子空间产品映射：四个 APP 如何参与真实项目；
7. 产品图库：每个 APP 3 张大图占位；
8. CTA。

关键比例：

- Hero H1 88-112px；
- 主 Tab 演示区 1180 x 700px；
- 产品图库单图最小显示宽度 520px；
- 不出现小于 360px 的产品截图。

图片预留：

- `products/ai-growth/dashboard.png`
- `products/ai-growth/content-strategy.png`
- `products/ai-growth/campaign-plan.png`
- `products/ai-fran/leads.png`
- `products/ai-fran/follow-up.png`
- `products/ai-fran/deal-review.png`
- `products/ai-ops/monitor.png`
- `products/ai-ops/task-board.png`
- `products/ai-ops/review.png`
- `products/ai-train/roleplay.png`
- `products/ai-train/knowledge.png`
- `products/ai-train/training-plan.png`

## 9. 案例页页面计划

参考页面：`claude-solutions-customer-support.png`  
内容依据：需求文档第 7 章，开发说明 8.3

结构：

1. Hero：小线稿图标 + 居中大标题 + 短副标题 + CTA；
2. 行业/客户类型 Logo 云：可用文字占位；
3. 粒子空间大视频/大图位；
4. 粒子空间案例拆解：传统逻辑 vs AI 逻辑、交易闭环、运营闭环、招商闭环；
5. 分类筛选：全部、品牌工厂与跨境电商、美业医美与本地连锁、教育培训与知识服务；
6. 案例列表；
7. 指标说明：已验证、验证中、演示口径、待验证；
8. CTA。

关键比例：

- Hero H1 88-112px；
- 视频/大图位 1180 x 664px；
- 案例拆解区不低于 720px 高；
- 筛选 Tab 高 52-56px。

粒子空间文案边界：

- 可以讲业务流程 AI 化；
- 可以讲进站、AI 测肤、状态解释、Skin ID、私域复购、招商复制；
- 不承诺护肤功效；
- 不展示商业计划敏感财务预测；
- 所有指标标注状态。

图片预留：

- `cases/lizi-space/case-cover.png`
- `cases/lizi-space/before-after-flow.png`
- `cases/lizi-space/business-loop.png`
- `cases/lizi-space/metrics-dashboard.png`
- 其他案例封面若未提供，先使用统一占位图。

## 10. 增长服务页页面计划

参考页面：`claude-agents.png`  
内容依据：需求文档第 8 章，开发说明 8.4

结构：

1. Hero：超大标题 `让 AI Agent 成为你的增长执行力`；
2. 左侧线稿图形 + 右侧短说明和 CTA，保持 Claude Agents 的松散大版式；
3. 为什么 AI 项目容易失败：三条横向结构；
4. 蔚为落地原则：不是工具，而是流程重构；
5. 新实体连锁 AI 方法论：输入层、能力层、执行层、迭代层；
6. 三类收益：多赚钱、少浪费、可复制；
7. 五步实施流程；
8. 可交付物；
9. 合作方式；
10. CTA。

关键比例：

- Hero H1 104-128px，允许两行；
- 首屏线稿图约 360 x 360px；
- 三条横向结构每行 150-190px；
- 方法论大图 1180 x 650px；
- 五步流程可使用 5 行或横向流程，移动端改单列。

图片/图形预留：

- `diagrams/ai-active-execution-team.png`
- `diagrams/new-retail-ai-method.png`
- `diagrams/service-process.png`

## 11. 关于页页面计划

参考页面：`anthropic-company.png`  
内容依据：需求文档第 9 章，开发说明 8.5

结构：

1. 极简 Hero：`关于蔚为` 或 `我们帮助高增长型企业把关键业务流程 AI 化`；
2. 左侧小标签 + 右侧大段使命文案；
3. 为什么专注两个行业方向；
4. Agent + Skill 方法；
5. 客户与案例背书；
6. 中文官网与英文官网说明；
7. CTA。

关键比例：

- Hero H1 96-128px；
- Editorial 文案字号 34-48px；
- 左侧标签列宽 220-280px；
- 右侧正文列宽 760-880px；
- 图片和团队素材未准备前，不强行放人物照，可用案例/方法图替代。

## 12. 联系页与隐私页

联系页：

- 不需要复杂设计；
- 沿用 Claude 简洁布局；
- 左侧说明，右侧表单；
- 表单字段按开发说明 8.6；
- CTA 与全站保持一致。

隐私页：

- 纯文本页面；
- 宽度 760-860px；
- 使用清晰标题层级；
- 不参与主要视觉复刻。

## 13. 文案执行规则

1. 主标题短，副标题解释，不在标题里塞完整业务说明；
2. 每屏只讲一个核心问题；
3. 面向老板和业务负责人，不堆 AI 技术词；
4. 首页不做产品功能列表；
5. 产品页必须看到真实或模拟产品界面；
6. 案例页必须回答真实项目问题；
7. 服务页必须讲清楚“AI 主动执行团队”不是单点工具；
8. 粒子空间指标必须标注状态；
9. 不出现 `Agent.AI`、`Synva AI 中文站`、`entbot.cn AI 增长解决方案` 作为主品牌；
10. 主品牌统一为 `蔚为`，`entbot.cn` 只作为域名和 SEO 后缀。

## 14. 开发执行计划

### 阶段 0：清理与重建准备

- 归档或删除旧版静态页面和旧版 CSS/JS；
- 保留 `docs/`、`claude参考网页/`、`Agent-AI/`；
- 新建干净的静态页面结构；
- 建立新的设计 token、字体、布局、Tab、演示舞台组件。

### 阶段 1：全站样式系统

- Header；
- Footer；
- Display 标题系统；
- Section spacing；
- Button；
- Pill Tabs；
- Large Demo Stage；
- Editorial Rows；
- Metric Badge；
- Placeholder Image Frame。

### 阶段 2：首页重建

- 先完成 Hero、ChallengeTabs、ProductMatrixTabs 三个核心模块；
- 用浏览器截图对比 Claude 比例；
- 再补齐行业、粒子空间、服务流程和 CTA。

### 阶段 3：产品页、案例页、服务页

- 产品页按 Cowork 结构；
- 案例页按 Customer Support 结构；
- 服务页按 Agents 结构；
- 每页至少一个大图/视频/演示舞台。

### 阶段 4：关于、联系、隐私

- 关于页按 Anthropic Company editorial 结构；
- 联系页完成表单与 CTA；
- 隐私页完成基础文字和 Footer。

### 阶段 5：视觉 QA

桌面端检查：

- 1440px；
- 1280px；
- 1920px。

移动端检查：

- 390px；
- 430px；
- 768px。

验收项：

- 标题比例是否接近 Claude；
- 区块留白是否足够；
- Tab 高度和位置是否协调；
- 大图演示区是否足够大；
- 产品截图是否可读；
- 页面是否仍然有 AI-APP 色彩识别；
- 粒子空间内容是否符合公开边界；
- 是否仍出现旧品牌或旧风格。

## 15. 本轮图片清单

第一阶段全部可用模拟图占位，但必须按最终尺寸预留。

| 图片 | 建议显示尺寸 | 建议原图尺寸 | 用途 |
| --- | --- | --- | --- |
| `hero-product-matrix.png` | 1180 x 660 | 2360 x 1320 | 首页首屏 |
| `challenge-brand-factory.png` | 1180 x 620 | 2360 x 1240 | 首页挑战 Tab |
| `challenge-local-chain.png` | 1180 x 620 | 2360 x 1240 | 首页挑战 Tab |
| `product-ai-growth-stage.png` | 1180 x 700 | 2360 x 1400 | 首页/产品页 Tab |
| `product-ai-fran-stage.png` | 1180 x 700 | 2360 x 1400 | 首页/产品页 Tab |
| `product-ai-ops-stage.png` | 1180 x 700 | 2360 x 1400 | 首页/产品页 Tab |
| `product-ai-train-stage.png` | 1180 x 700 | 2360 x 1400 | 首页/产品页 Tab |
| `lizi-space-case-cover.png` | 1180 x 664 | 2360 x 1328 | 案例页主视觉 |
| `lizi-space-business-loop.png` | 1180 x 620 | 2360 x 1240 | 业务闭环 |
| `lizi-space-before-after-flow.png` | 1180 x 620 | 2360 x 1240 | 前后对比 |
| `new-retail-ai-method.png` | 1180 x 650 | 2360 x 1300 | 服务页方法论 |
| `ai-active-execution-team.png` | 1180 x 650 | 2360 x 1300 | 服务页主动执行团队 |

## 16. 吸收原官网的部分

原官网可吸收内容：

- 产品/Agent 分组逻辑；
- 行业场景拆分方式；
- 业务流程从问题到 AI 改造的叙事；
- 行业页左侧锚点导航可用于后续案例详情；
- Footer 信息密度。

原官网不继承内容：

- 暗黑科技风；
- 蓝紫大渐变；
- 密集卡片；
- 过多下拉导航；
- 旧品牌 `Agent.AI`；
- 把页面做成产品功能清单。

## 17. 执行判断

本方案确认后，下一步不是继续微调旧页面，而是按阶段 0 进入重建。第一版重建的成败标准不是内容是否已经最终完美，而是：

- 页面比例像 Claude；
- 模块节奏像 Claude；
- Tab 和大图演示区像 Claude；
- 视觉色彩属于蔚为和 AI-APP；
- 内容逻辑符合最新需求文档；
- 粒子空间能作为真实项目主线解释官网。
