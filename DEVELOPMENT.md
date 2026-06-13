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

---

## Session 3 — 2026-06-12: Phase 3 Card CRUD & Dashboard

### Created
- **Card API** (`src/shared/api/cards.ts`):
  - `createCard`, `getCard`, `updateCard`, `deleteCard` — full Firestore CRUD
  - `listUserCards` — query by ownerUid, ordered by createdAt desc
  - `getCardBySlug` — lookup by slug for public viewer
  - `isSlugTaken` — uniqueness check with optional exclude for edits
- **Card editor types** (`features/card-editor/types/`):
  - `cardFormSchema` — zod schema covering all 20+ Card fields
  - Sub-schemas for Phone, Email, Address, SocialLink
  - `CardFormData` type inferred from schema
- **Card editor hooks** (`features/card-editor/hooks/`):
  - `useSaveCard` — create/update with auto-slug generation (retries up to 5 attempts on collision), toast feedback, redirect to dashboard
  - `useCardEditor` — load existing card for editing
  - Tests: 3 tests covering create, update, and error handling
- **Card editor components** (`features/card-editor/components/`):
  - `EditorForm` — full multi-section form with:
    - Personal info: prefix, first, middle, last, suffix, nickname, job title, department, company, bio
    - Dynamic arrays via `useFieldArray`: phones (type+number), emails (type+address), addresses (label+street+city+state+postal+country), social links (platform+url)
    - Design: ThemePicker (cosmic/warm/minimal) with color previews, accent color picker
    - ImageUploader: profile + background images with client-side compression → Firebase Storage upload
    - Settings: isPublic toggle
  - `ImageUploader` — compress → upload to Firebase Storage → return download URL, with preview and hover-to-change UX
  - `ThemePicker` — visual theme selector with gradient previews + color input
- **DashboardPage** (`src/pages/DashboardPage.tsx`):
  - Lists user's cards in a responsive grid
  - Shows name, job title/company, slug, view count, public/private status
  - Actions: view (if public), edit, delete with confirmation
  - Empty state with CTA to create first card
  - Loading spinner state
- **EditorPage** (`src/pages/EditorPage.tsx`):
  - Auth guard: redirects to / if not signed in
  - Loads existing card data for editing via `useCardEditor`
  - Renders full `EditorForm`
- **Dashboard hooks** (`features/dashboard/hooks/`):
  - `useDashboardCards` — loads user's cards from Firestore
- **Unit tests** (`shared/lib/utils/slugify.test.ts`): 7 tests covering spaces, special chars, accents, trimming, collapsing hyphens, uniqueness

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 16/16 passed (3 test files)
- `npm run build` — success, PWA SW regenerated
- Note: Firebase chunk at 504KB, will optimize in Phase 7

### Next: Phase 4 — Public Card Viewer & Sharing

---

## Session 4 — 2026-06-12: Phase 4 Public Card Viewer & Sharing

### Created
- **vCard generator** (`shared/lib/vcard/generateVCard.ts`):
  - Full vCard 4.0 spec: FN, N, NICKNAME, TITLE, ORG, NOTE, TEL, EMAIL, ADR, URL, PHOTO, REV
  - Proper escaping of `, ; \ \n` special characters
  - Line folding at 75 chars per RFC 6350
  - Phone types mapped to TEL.TYPE (CELL, WORK, HOME, PREF)
  - Email types mapped to EMAIL.TYPE
  - Social links mapped to URL.TYPE with platform label
  - `downloadVCard()` — blob-based .vcf download with dynamic filename
  - Tests: 10 tests covering full name, prefix/suffix, job/company, phones, emails, addresses, social links, nickname/bio, escaping, empty card
- **usePublicCard hook** — fetches card by slug, checks `isPublic`, handles loading/error states
- **useViewTracking hook** — writes to `analytics/{cardId}/{date}` subcollection on first view (merge + increment), debounced via `useRef`
- **FlipCard component** (3D CSS):
  - `perspective-[1000px]` + `[transform-style:preserve-3d]` for 3D flip
  - Front side: gradient background by theme (cosmic/warm/minimal), profile image or initials avatar, name, job title, company, nickname
  - Back side: contact details (phones as tel: links, emails as mailto:, addresses, social links), bio
  - Tap/click to flip with keyboard accessibility
  - Renders children (QRCodePanel) on the back when flipped
- **QRCodePanel** — Save Contact button (vCard download), Share button (Web Share API with clipboard fallback), QR code (qrcode.react with card accent color)
- **CardViewerPage** — full page layout: loading/error/not-found states, FlipCard + QRCodePanel, "Powered by NownCard" footer with link back
- **Card viewer barrel** — `features/card-viewer/index.ts` with public API

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 26/26 passed (4 test files)
- `npm run build` — success, PWA SW regenerated
- CardViewerPage chunk: 26.78 KB (gzip: 9.94 KB)

### Next: Phase 5 — Payments & Plan Enforcement

---

## Session 5 — 2026-06-12: Phase 5 Payments & Plan Enforcement

### Created
- **Plan config** (`features/payments/api/`):
  - `planConfig` — per-tier limits: maxCards, maxSocialLinks, maxPhones/Emails/Addresses, available themes, backgroundImage toggle, analytics flag
  - `isPlanAtLeast()` — tier comparison helper
  - `createCheckoutSession()` — Firebase Functions callable stub (ready when Stripe keys added)
  - Tests: 13 tests covering plan limits, tier comparison, theme access
- **Plan limits hook** (`features/payments/hooks/`):
  - `usePlanLimits` — exposes `canAddCard()`, `canAddField()`, `canUseTheme()`, `canUseBackgroundImage()` plus current plan config
  - `useCheckout` — Stripe checkout redirect flow with loading/error states
- **Plan UI components** (`features/payments/components/`):
  - `PlanBadge` — colored pill showing Free/Pro/Business plan
  - `UpgradePrompt` — "Upgrade to Pro/Business" card with feature description + link to pricing
- **Updated DashboardPage**:
  - Shows PlanBadge next to dashboard title
  - Disables "New Card" button when at card limit
  - Shows UpgradePrompt for free users at card limit
- **Updated EditorForm**:
  - Social links add button disabled at plan limit
  - Background image uploader hidden for free plan (shows "Pro feature" placeholder)
  - Shows UpgradePrompt for free users at social links limit
- **Updated PricingPage**:
  - Checkout buttons call Stripe via `useCheckout`
  - Shows "Current Plan" for active tier
  - Loading state on checkout buttons
- **Cloud Functions stubs** (`functions/`):
  - `createCheckoutSession` — callable function (commented-out Stripe integration, ready for keys)
  - `stripeWebhook` — HTTP endpoint (commented-out plan upgrade logic)
  - `updatePublicCardsCache` — denormalized card cache on card write
  - package.json + tsconfig for functions deployment
- **Updated firestore.rules**:
  - Added `pendingUpgrades` collection rules
  - Card create/update rules enforce ownerUid check

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 39/39 passed (5 test files)
- `npm run build` — success, PWA SW regenerated
- Functions stubs are tsconfig-isolated (not compiled as part of Vite build)

### Next: Phase 6 — Advanced Features (NFC, Messages, Analytics, Admin)

---

## Session 6 — 2026-06-12: Phase 6 Advanced Features

### Created
- **NFC writer** (`features/nfc/`):
  - `useNfcWriter` hook — Web NFC API integration, writes card URL to NFC tags, detects browser support
  - `NfcButton` component — "Write to NFC Tag" button with loading state, hidden when unsupported
- **Messages system** (`features/messages/`):
  - `sendMessage`, `getUserMessages` — Firestore CRUD for messages collection
  - `useSendMessage` hook — send with toast feedback
  - `MessageForm` component — subject + body form on card viewer back side, shows sent confirmation
- **Analytics dashboard** (`features/analytics/`):
  - `useCardAnalytics` hook — fetches 30 days of analytics data from Firestore
  - `AnalyticsChart` component — Recharts LineChart with views + saves, empty state
  - `AnalyticsPage` — card-specific analytics at `/analytics/:cardId`, shows total views/saves + daily chart
  - Dashboard cards now link to analytics for Pro/Business users
- **Admin panel** (`features/admin/`):
  - `useAdminUsers` hook — fetches all users from Firestore, ordered by createdAt
  - `getUserCardCount` helper — counts cards per user
  - `AdminUserTable` component — table with email, name, plan badge, card count, admin status, actions
  - `AdminPage` at `/admin` — isAdmin-guarded, shows "Access Denied" for non-admins
- **Updated routes** (`AppRoutes`):
  - `/analytics/:cardId` — protected
  - `/admin` — protected
- **Updated CardViewerPage**:
  - NFC write button on card back
  - "Send Message" → MessageForm toggle
- **Updated Navbar**:
  - Admin link with Shield icon for admin users
  - Mobile menu includes admin link
- **Updated Message type**: added optional `id` field

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 39/39 passed (5 test files)
- `npm run build` — success, PWA SW regenerated (24 precache entries, 1408KB)
- Note: AnalyticsPage chunk is 396KB (includes Recharts), will optimize in Phase 7

### Next: Phase 7 — Polish, Performance & Launch Prep

---

## Session 7 — 2026-06-12: Phase 7 Polish, Performance & Launch Prep

### Created
- **ErrorBoundary** (`src/app/ErrorBoundary.tsx`):
  - Class-based React error boundary with `getDerivedStateFromError` + `componentDidCatch`
  - Default fallback UI with "Refresh Page" button
  - Supports custom fallback prop
  - Wraps entire app in `App.tsx`
- **Skeleton loaders** (`shared/ui/skeleton.tsx`):
  - `Skeleton` — base animated pulse placeholder
  - `CardSkeleton` — mimics dashboard card list (3 placeholder cards)
  - `FormSkeleton` — mimics editor form layout
  - `ViewerSkeleton` — mimics card viewer (flip card + buttons)
- **Offline fallback** (`public/offline.html`):
  - Standalone HTML page for PWA when network is unavailable
  - Matches NownCard brand styling
  - Registered as `navigateFallback` in VitePWA config
- **Code-split optimization**:
  - Recharts (AnalyticsChart) lazy-loaded with `React.lazy` + `Suspense`
  - AnalyticsPage chunk: 396KB → 2.6KB (chart loads on demand: 394KB)
- **App.tsx**: Wrapped entire app with ErrorBoundary

### Verification
- `npm run type-check` — zero errors
- `npm run lint` — zero warnings
- `npm run test:unit` — 39/39 passed (5 test files)
- `npm run build` — success, PWA SW regenerated (26 precache entries)
- `npm run dev` — localhost verified

### Final Project Stats
- **Total files**: 90+ source files across Feature-Sliced Design
- **Features**: auth, card-editor, card-viewer, dashboard, payments, nfc, messages, analytics, admin
- **Shared**: Firebase lib, vCard generator, UI kit (button, card, dialog, input, label, textarea, skeleton), API layer (cards, users, messages, types)
- **Pages**: Home, Editor, CardViewer, Dashboard, Pricing, Analytics, Admin
- **Widgets**: Navbar, Footer, AppLayout, AuthModal
- **Tests**: 39 unit tests across 5 test files
- **Bundle**: React 49KB, Firebase 505KB, index 378KB, analytics chart 394KB (lazy)
- **PWA**: autoUpdate, 26 precache entries, offline fallback, Firebase Storage + card route caching
