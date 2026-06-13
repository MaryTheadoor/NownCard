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

---

## Session 2 — 2026-06-12: Phase 2 Authentication & User Profile

### Created
- **Auth feature module** (`src/features/auth/`):
  - `types/` — SignInFormData, SignUpFormData
  - `api/` — loginWithEmail, registerWithEmail, loginWithGoogle, logout (thin wrappers around Firebase)
  - `hooks/` — useSignIn, useSignUp, useGoogleSignIn, useSignOut with toast integration + error handling
  - `components/SignInForm.tsx` — email/password form with zod validation
  - `components/SignUpForm.tsx` — name/email/password/confirm form with zod validation
- **AuthModal widget** (`src/widgets/AuthModal/`) — reusable dialog wrapping SignIn/SignUp forms with Google sign-in
- **Dialog component** (`src/shared/ui/dialog.tsx`) — Radix-based dialog with overlay, header, title, description
- **User CRUD** (`src/shared/api/users.ts`) — getUser, ensureUser (auto-create on first sign-in), updateUser
- **Updated AuthProvider** — now fetches isAdmin + plan from Firestore on auth state change, auto-creates user doc via ensureUser
- **Updated Navbar** — uses AuthModal instead of plain links; adds sign-out button with LogOut icon
- **Updated HomePage** — CTA button opens AuthModal if not signed in, navigates to dashboard if signed in
- **Vitest config** (`vitest.config.ts`) — jsdom environment, v8 coverage with 80% thresholds
- **Test setup** (`src/test/setup.ts`) — @testing-library/jest-dom matchers
- **Unit tests** (`features/auth/hooks/index.test.ts`) — 6 tests covering useSignIn, useSignUp, useGoogleSignIn, useSignOut with mocked Firebase + Toast

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 6/6 passed
- `npm run build` — success, PWA SW regenerated

### Next: Phase 3 — Card CRUD & Dashboard
