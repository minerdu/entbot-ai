# Entbot AI Image Generation And Delivery Plan v4

This plan replaces v3 for image delivery. The creative production rules from v3 still apply.

## 1. Delivery Principle

- 官网图片统一使用 `WebP` 作为线上主格式。
- 二维码只使用 `PNG`，不转 WebP、AVIF 或 JPEG，避免边缘压缩影响扫码。
- PNG 不再作为普通页面图片的默认线上格式，只作为源稿、审核稿、兼容回退或二维码格式。
- 源图可以保留高清版本用于返工，但线上页面必须使用按展示尺寸生成的 WebP 候选图。
- 页面通过 `picture` / `srcset` / `sizes` 让浏览器按屏幕宽度和 DPR 自动选择合适图片，不让所有用户下载最大图。

## 2. Standard Sizes

Homepage and other wide 16:9-like visual blocks:

| Candidate | Use Case | Width | Height Rule |
| --- | --- | --- | --- |
| 1280w | normal desktop, tablet, most users | 1280 | keep source ratio |
| 1920w | high-DPR desktop, large monitor | 1920 | keep source ratio |
| 2560w | 2x retina / ultra-wide safety candidate | 2560 | keep source ratio |

For the current homepage Hero image, source ratio is `2360 x 1440`, so the generated sizes should be:

- `1280 x 781`
- `1920 x 1172`
- `2560 x 1562`

For the current homepage challenge, Skill-method, and Lizi flagship wide images, source ratio is `2360 x 1320`, so the generated sizes should be:

- `1280 x 716`
- `1920 x 1074`
- `2560 x 1432`

Other image groups:

- Product preview screenshots: `960w`, `1440w`, `1920w` WebP, height follows screenshot ratio.
- Case photos and mixed case visuals: `960w`, `1440w`, `1920w` WebP, height follows source ratio.
- Small logos/icons: keep SVG when vector exists; otherwise WebP/PNG based on source quality.
- QR codes: one clean PNG at supplied source resolution, normally `520 x 520` or larger.

## 3. Naming Rules

Stable image families use this pattern:

- `asset-id-1280.webp`
- `asset-id-1920.webp`
- `asset-id-2560.webp`
- `asset-id.png` only for source/fallback/QR when needed

Example:

- `home-hero-growth-loop-1280.webp`
- `home-hero-growth-loop-1920.webp`
- `home-hero-growth-loop-2560.webp`
- `home-hero-growth-loop.png` remains as source/fallback during transition

## 4. Page Markup Rule

Use `picture` for all non-QR website images after conversion:

```html
<picture>
  <source
    type="image/webp"
    srcset="
      assets/images/home/home-hero-growth-loop-1280.webp 1280w,
      assets/images/home/home-hero-growth-loop-1920.webp 1920w,
      assets/images/home/home-hero-growth-loop-2560.webp 2560w
    "
    sizes="(max-width: 768px) calc(100vw - 32px), 1280px"
  />
  <img
    src="assets/images/home/home-hero-growth-loop.png"
    width="2360"
    height="1440"
    loading="lazy"
    decoding="async"
    alt=""
  />
</picture>
```

Hero image exception:

- The first homepage hero image may use `fetchpriority="high"` and should not use `loading="lazy"`.
- Below-the-fold images keep `loading="lazy"`.

## 5. Quality Rules

- A 类咨询图 / 中文 UI 图：WebP quality `88-94`; prioritize text clarity.
- Product screenshots：WebP quality `86-92`; avoid blurry UI text.
- Real photos / case scenes：WebP quality `78-86`; prioritize file size while preserving subject detail.
- Do not over-compress diagrams with dense Chinese text.
- Each exported WebP must be visually checked at the actual website display size, not only opened at 100%.

## 6. Font Readability Rule

Because wide images display at a maximum of about `1280px`, internal source text must be designed for downscaling.

The approved homepage Hero image and the final Skill-method small-text revision are the default font benchmarks for all later A1/A2 images. Future images should keep this readability level unless a specific module has less available space and the user approves a smaller scale.

For current `2360px` source-width compositions, use this as the default production font scale:

- Primary section or case title: `76-92px` when it is the main title inside the image.
- Secondary title below the primary title: `38-46px`.
- Major card titles and dashboard titles: `46-68px`, depending on hierarchy.
- Normal paragraph/body copy: `23-29px`.
- Card descriptions, screenshot-like UI descriptions, AI-APP card subtext, process labels, and task rows: `21-24px`; `21px` is the minimum.
- Pills, tabs, status labels, AI APP tags, diagnosis rows, and flow-node main text: `20-24px`; `20px` is the minimum.
- Flow-node secondary text, short captions, radar/chart labels, and support labels: `18-21px`; `18px` is the minimum.
- Only tiny decorative metadata may use `16-17px`; do not use this size for business meaning, AI APP labels, task rows, radar labels, or card subtitles.
- Do not treat Chinese text under a title as a small support label. If it explains business meaning, it must stay at `21px+`.

After page scaling, core readable text should land around:

- key module titles: `23-28px`
- large card titles: `16-20px`
- body copy: `12-15px`
- card descriptions, screenshot-like UI descriptions, AI APP rows, and task rows: at least `11-13px`
- labels, radar/chart labels, and flow nodes: at least `10-12px`

Before exporting WebP, inspect the image at the actual webpage display width (`1280px` on desktop). If any meaningful Chinese text looks like a footnote at this size, the source font is too small even if it technically meets the minimum.

When a larger font causes wrapping, overlap, or crowding:

1. First adjust module height, width, grid tracks, internal spacing, or content hierarchy.
2. Keep the business information intact whenever possible.
3. Only shorten text when the shorter copy preserves the same meaning and matches the website tone.
4. Re-check the result at actual webpage display size before approval.

## 7. Approved Homepage Image Standards

The first three homepage image groups are the production benchmark for later A1/A2 website images:

- Hero: `home-hero-growth-loop`, source `2360 x 1440`. It uses a warm peach stage, two-column macro layout, left dark consulting/workflow area, right white AI execution dashboard, measured module alignment, and a bottom iteration/industry band.
- Challenge: `home-challenge-factory-growth-flow` and `home-challenge-chain-growth-flow`, source `2360 x 1320`. They use module-specific diagnostic structures, large white boards, right black diagnosis cards, readable business copy, and concise bottom process flows.
- Skill method: `home-skill-agent-method`, source `2360 x 1320`. It uses a three-column method structure: benchmark input, Benchmark Skill asset library, Skill calling / AI APP execution, and bottom method flow.

Use these files as quality references for format, typography, color, spacing, alignment, and information density. For a new module, the current page mockup for that exact slot is the binding template. Do not invent a new main layout when a preset mockup exists; replace content and make only measured internal adjustments.

### Layout And Alignment Rules

- Lock format, ratio, display size, and export size before starting.
- Preserve the target slot's macro structure, primary internal module structure, and page design language. Redesign only the content inside the existing modules; micro-adjust widths, heights, labels, and supporting elements only when needed for readability and alignment.
- Measure alignment where relationships matter. For example, in the approved Hero image, the right execution area aligns by track: the left top module equals the first three AI APP cards, the left lower module equals the fourth AI APP card, and the gap is identical.
- Avoid double-framed backgrounds, unclear nested cards, and modules that visually blend into their parent. Dark modules need visible card contrast and readable text.
- Bottom process bands must have enough breathing room from the main content; they should feel like a deliberate summary layer, not a collision.
- Short image titles and flow labels should not end with Chinese full stops unless the source copy requires punctuation.
- If the layout feels crowded, increase the module or image height first, then adjust grid, spacing, and hierarchy. Do not cut business information by default.

### Direct HTML/CSS Step

For every new A1/A2 module:

1. Read the module title, subtitle, body copy, nearby UI labels, target audience, and page slot mockup.
2. Record the non-negotiable template constraints from that exact mockup: column count, card positions, main module hierarchy, background, color, radius, shadow, and spacing rhythm.
3. Extract only the case/source-file information that proves Entbot AI's growth consulting plus AI growth solution. Exclude general project facts that do not support the website module's argument.
4. Fill the preset framework in `assets/images/prompt-frameworks.md` with the real content, locked asset spec, text whitelist, and template constraints.
5. Build the final website asset directly in HTML/CSS/SVG or real screenshot composite so Chinese text, alignment, and export ratio are deterministic.
6. Export PNG, inspect at actual website display size, generate WebP candidates after approval, then request review.

## 8. Conversion Workflow

For each approved image:

1. Keep or export one high-quality PNG source from HTML/CSS, screenshot, real photo, or image generation.
2. Generate WebP candidates at the planned widths.
3. Record generated files in `assets/images/manifest.json`.
4. Replace page markup with `picture + srcset`.
5. Verify desktop, mobile, and high-DPR behavior with browser screenshots.
6. Check file sizes; if a single non-hero image is still too large, lower quality by one step and compare.
7. After the user approves the final material version, delete historical draft files and keep only the current source/fallback file plus the WebP candidates used online.

## 9. Review Gates

- Homepage: convert and review image by image because these are large first-page assets.
- About and Services: review page by page.
- Products: review every 10 screenshots.
- Cases: review by case group.
- Contact: review after QR code assets are supplied.
