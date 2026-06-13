# NownCard Development Records

## Session 1 — 2026-06-12: Phase 1 Scaffolding & Foundation

### Setup Decisions
- Firebase project: `nown-card` (existing, Project ID: `nown-card`)
- GitHub repo: `https://github.com/MaryTheadoor/NownCard`
- Node v24.15.0, npm 11.12.1
- Firebase CLI v15.16.0, gh CLI v2.72.0
- Renamed references from `nowncard-v3` → `NownCard` throughout

### Created
- Vite 6 + React 19 + TypeScript strict scaffold
- Feature-Sliced Design directory structure:
  - `src/app/` — providers (Auth, Theme, Toast, Query), routing (React Router v7)
  - `src/features/` — auth, card-editor, card-viewer, dashboard, payments, nfc, messages, admin, analytics
  - `src/shared/` — lib (firebase, utils), ui (shadcn-style), api (types), types
  - `src/widgets/` — Navbar, Footer, AppLayout
  - `src/pages/` — Home, Editor, CardViewer, Dashboard, Pricing
- Dependencies: firebase v12, tailwind v4, react-router v7, radix ui, react-hook-form + zod, lucide-react, qrcode.react, recharts, tanstack/react-query, vite-plugin-pwa
- Dev deps: vitest, playwright, eslint v9 flat config, typescript-eslint
- Firebase rules: firestore.rules, storage.rules, firestore.indexes.json
- CI: .github/workflows/ci.yml (type-check, lint, test, build)
- PWA: autoUpdate with Firebase Storage + card route caching
- Tailwind v4: CSS-based config with brand color (#c9a278), flip animations, Inter font
- Shared UI: Button, Card, Input, Label, Textarea (shadcn/Radix patterns)
- Utilities: cn (clsx+twMerge), slugify, compressImage
- Types: User, Card, Phone, Email, Address, SocialLink, Message, DailyAnalytics

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run build` — successful, PWA SW generated (15 precache entries, ~468KB)
- Code splitting: react (49KB), firebase (151KB), page chunks (1-3KB each)

### Source: Firebase Config
- Pulled from desktop `Nown Card MASTER Doc.txt`
- Project: nown-card (ID: 719245905430)

### Next: Phase 2 — Authentication & User Profile
