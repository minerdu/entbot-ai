# Entbot AI Website Images

This folder is managed by Codex.

You do not need to rename images manually. Put raw materials in `_source` when needed, and Codex will normalize names, crop/export files, update `manifest.json`, and wire the final assets into the website.

Default `gpt-image-2` prompt frameworks live in `prompt-frameworks.md`. Generated images should use those frameworks unless a page has a stronger local reason to override them.

## Folder Rules

- `home/`: homepage visuals.
- `about/`: company and method visuals.
- `services/`: service workflow and delivery visuals.
- `products/ai-growth/`: AI Growth app screenshots.
- `products/ai-fran/`: AI Franchise app screenshots.
- `products/ai-ops/`: AI Ops app screenshots.
- `products/ai-train/`: AI Training app screenshots.
- `cases/*/`: case visuals grouped by case.
- `contact/`: QR codes and official contact images.
- `_source/`: raw user-provided files, drafts, generated versions, and uncropped screenshots.
- `_exports/`: temporary cropped/exported files before final placement.

## Final Naming

Final website images use stable, readable lowercase names:

```text
assets/images/{page-or-group}/{asset-name}.png
```

Examples:

```text
assets/images/services/service-hero-growth-workflow.png
assets/images/products/ai-growth/matrix-overview.png
assets/images/cases/lizi-space/lizi-skin-report-v4.png
assets/images/contact/contact-wecom-qr.png
```

Drafts can be versioned in `_source` or `_exports`, for example:

```text
assets/images/_source/services-service-hero-growth-workflow-v01.png
```
