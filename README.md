# Enhance CV Builder

[![CI](https://github.com/r00tmebaby/Enhance-CV-Builder/actions/workflows/ci.yml/badge.svg)](https://github.com/r00tmebaby/Enhance-CV-Builder/actions/workflows/ci.yml)

An interactive, multi-template resume builder with a 3-pane editor (left menu, center canvas, right design panel), cross-page drag-and-drop, and PDF export.

---

## ✨ Highlights

- 3-pane layout: left actions menu, center resume canvas, right Design & Font panel (always visible)
- Single page scrollbar (no nested scrolling) for smooth multi-page editing
- Templates: Elegant, Double Column, Left Sidebar (with pagination where applicable)
- Page Background modes: Solid, Pattern, Gradient (per-page styling via settings)
- Image Overlay: add/position PNG/SVG, control opacity and scale
- Cross-page drag-and-drop with pagination for multi-page templates
- Per-section visibility, background clean-up, and compact design controls
- PDF export (html2canvas-pro + jsPDF)
- History snapshots (undo/redo) and Documents view

---

## 🧩 Templates

Source files live in `components/ResumeTemplates/`:

- `resume-template-double-column.tsx` (paginated, two columns)
- `resume-template-elegant.tsx` (left content + styled right sidebar)
- `resume-template-left-sidebar.tsx` (paginated variant with left sidebar)
- `resume-template-modern.tsx`, `resume-template-standard.tsx` (available, easy to enable)

Selection: via Templates modal (`components/Common/Dialogs/templates-modal.tsx`), stored in Redux `settingsSlice.template`. Renderer switch is in `components/resume-builder.tsx`.

Per-template defaults: Elegant uses tighter margins/spacing and 70% font-size on its right column by default (without changing global settings).

---

## 🎛 Design & Font panel

- Grouped controls with separators and collapsible sections
- Page Background (accordion): Solid/Pattern/Gradient with color(s) + angle
- Image Overlay (accordion): enable, choose pattern (dialog), opacity, scale, drag-to-position
- Layout controls (always visible): Page Margins, Section Spacing
- Typography: Font family, size, line-height

---

## 🚀 Getting Started

### Requirements

- Node.js 20.9+ (matches CI runner; avoids ESLint engine warnings)
- npm 10+

### Install & Run

```bash
# Clone
git clone https://github.com/r00tmebaby/Enhance-CV-Builder.git
cd Enhance-CV-Builder

# Install
npm ci

# Dev server
npm run dev

# Typecheck & lint (optional)
npm run typecheck
npm run lint

# Build
npm run build
```

Open http://localhost:3000

---

## � Usage tips

- Edit text inline; use section toolbars for quick actions
- Use “Rearrange” (left menu) for bulk DnD; page-aware DnD also works inline
- Switch templates in Templates modal; previews are under `public/templates/`
- Export via “Export as PDF” in the left menu

---

## 🛠️ CI/CD Workflows

GitHub Actions lives in `.github/workflows/`:

- `ci.yml` (default):
  - Runs on push/PR to `master`
  - Steps: checkout → setup Node 20 → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build`

- `release.yml` (optional):
  - Runs on tag `v*.*.*`
  - Creates a draft GitHub Release

Badges and workflow names can be adjusted as you prefer.

---

## 📁 Project Structure

```
app/                     # Next.js App Router
components/              # UI + templates + dialogs
  Common/                # Shared UI (dialogs, panels)
  ResumeTemplates/       # Template implementations
  Sections/              # Resume sections
lib/                     # Store, slices, utils
public/                  # Static assets (templates thumbnails, patterns)
.github/workflows/       # CI/CD
```

---

## 🤝 Contributing

1) Fork → 2) Branch → 3) Commit → 4) Push → 5) PR

Suggested commit style: Conventional Commits (e.g., `feat:`, `fix:`, `docs:`)

---

## 📄 License

MIT — see [LICENSE](./LICENSE)

---

Built with ❤️ by **r00tmebaby**

---

## 🧪 Run CI locally

Fast parity with CI without pushing:

```bash
# One-shot local CI
npm run ci:local
```

What it does:
- Clean install (npm ci)
- Lint (eslint .)
- Typecheck (tsc --noEmit)
- Build (next build)

Optional: run the GitHub Actions workflow with act

```bash
# Requires Docker and act
act -l                                   # list jobs
act push -j build \
  -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
```
