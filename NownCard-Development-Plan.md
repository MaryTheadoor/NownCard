
File 1: README.md (Project Overview)

```markdown
# Nowncard – Digital Business Cards Rebuilt

A production-ready PWA for creating and sharing digital business cards with 3D flip animations, QR codes, vCard export, and NFC support.

## Quick Start

```bash
git clone <new-repo-url>
cd nowncard-v3
npm install
cp .env.example .env.local   # Fill with Firebase config
npm run dev
```

Documentation

· Architecture
· Data Model
· Frontend Guide
· Backend Guide
· Implementation Plan
· Testing
· Deployment

Tech Stack (Strict)

· React 19 + TypeScript (strict mode)
· Vite 6 + Tailwind CSS v4
· Firebase v12 (Auth, Firestore, Storage, Hosting, Functions v2, Messaging)
· Stripe Checkout (Payments)
· Playwright + Vitest

Project Structure (Feature-Sliced Design)

```
src/
├── app/               # App-wide setup (providers, routing)
├── features/          # Business domains (auth, card-editor, etc.)
├── shared/            # Pure reusable code (lib, ui, api, types)
├── widgets/           # Complex UI blocks (Navbar, Footer)
├── pages/             # Thin route shells
└── index.css
```

Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
```

License

Proprietary – all rights reserved.

```

---

## File 2: `docs/ARCHITECTURE.md`

```markdown
# Architecture Design

## High-Level Principles

- **Feature-Sliced Design (FSD)** – Each feature is a self-contained module with its own components, hooks, API calls, and types.
- **One-way data flow** – Components receive data via props or custom hooks; no direct Firestore access outside `shared/api`.
- **Zero trust security** – All Firestore and Storage access is validated by Security Rules.
- **Offline-first PWA** – Public card viewer works without network.

## Tech Stack Decisions

| Area | Choice | Rationale |
|------|--------|-----------|
| Build tool | Vite 6 | Fast HMR, simple config, PWA plugin |
| UI library | shadcn/ui (Radix + Tailwind) | Accessible, headless, no CSS-in-JS |
| State management | React Context + custom hooks | No global stores; keep state local to features |
| Routing | React Router v7 | Suspense + lazy loading built-in |
| Payments | Stripe Checkout | Hosted payment page, less PCI scope |
| Notifications | Firebase Cloud Messaging | Native integration, no third-party |

## Folder Structure (Detailed)

```

src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── QueryProvider.tsx
│   └── routing/
│       ├── AppRoutes.tsx
│       └── ProtectedRoute.tsx
├── features/
│   ├── auth/
│   │   ├── components/ (SignInForm, SignUpForm, AuthModal)
│   │   ├── hooks/ (useAuth, useSignIn)
│   │   ├── api/ (firebase auth wrappers)
│   │   ├── types/ (AuthUser)
│   │   └── index.ts (public exports)
│   ├── card-editor/
│   │   ├── components/ (EditorForm, ImageUploader, SocialLinksArray)
│   │   ├── hooks/ (useCardEditor, useSaveCard)
│   │   ├── api/ (Firestore CRUD for cards)
│   │   ├── types/ (CardFormData)
│   │   └── index.ts
│   ├── card-viewer/
│   │   ├── components/ (FlipCard, QRCodePanel, VCardDownload)
│   │   ├── hooks/ (usePublicCard)
│   │   ├── api/ (fetch card by slug)
│   │   └── index.ts
│   ├── dashboard/
│   ├── payments/
│   ├── nfc/
│   ├── admin/
│   └── analytics/
├── shared/
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── init.ts
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── storage.ts
│   │   ├── vcard/
│   │   │   └── generateVCard.ts
│   │   └── utils/
│   │       ├── slugify.ts
│   │       └── compressImage.ts
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (shadcn components)
│   ├── api/
│   │   ├── cards.ts     # typed Firestore queries
│   │   ├── users.ts
│   │   └── types.ts     # shared Firestore interfaces
│   └── types/
│       └── global.d.ts
├── widgets/
│   ├── Navbar/
│   ├── Footer/
│   └── AuthModal/
└── pages/
├── HomePage.tsx
├── EditorPage.tsx
├── CardViewerPage.tsx
├── DashboardPage.tsx
└── ...

```

## Data Flow Example (Editing a Card)

1. User navigates to `/dashboard` → `DashboardPage` renders.
2. Clicks "Edit" on a card → navigates to `/editor/:cardId`.
3. `EditorPage` lazy-loads `features/card-editor`.
4. `useCardEditor(cardId)` fetches card data from Firestore via `shared/api/cards.ts`.
5. Form updates local state; on submit, `useSaveCard` calls `updateCard` API.
6. After successful save, redirect to dashboard.

## Cross-Feature Communication

- **Never import a feature directly into another feature** (except via `shared` or `app`).
- Use **events** (e.g., React Context or custom event bus) for loose coupling.
- Example: After payment success, `payments` feature dispatches a `"plan-upgraded"` event; `dashboard` listens and refetches user data.

## Error Handling

- All Firebase operations wrapped in try/catch that logs to console and shows a toast via `shared/ui/toast`.
- Global error boundary in `App.tsx` captures rendering errors.
- Sentry integration for production monitoring.
```

---

File 3: docs/DATA_MODEL.md

```markdown
# Firestore Data Model

## Collections

### `users/{uid}`

```typescript
interface User {
  email: string;
  displayName: string | null;
  photoURL: string | null;
  plan: 'free' | 'pro' | 'business';
  isAdmin: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stripeCustomerId?: string;
}
```

cards/{cardId}

```typescript
interface Card {
  // Identity
  id: string;
  ownerUid: string;
  slug: string;                 // URL-friendly, globally unique

  // Personal info
  prefix?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  nickname?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;

  // Contact details (arrays for order and metadata)
  phones: {
    type: 'mobile' | 'work' | 'home' | 'other';
    number: string;
    primary?: boolean;
  }[];
  emails: {
    type: 'work' | 'personal' | 'other';
    address: string;
    primary?: boolean;
  }[];
  addresses: {
    label?: string;             // e.g., "Office"
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  }[];

  // Social links (unlimited platforms)
  socialLinks: {
    platform: string;           // "linkedin", "twitter", "github", etc.
    url: string;
  }[];

  // Design
  theme: 'cosmic' | 'warm' | 'minimal';
  accentColor: string;          // hex code, default #c9a278
  profileImage?: string;        // Storage URL
  backgroundImage?: string;     // Storage URL

  // Status
  isPublic: boolean;
  isTeamCard?: boolean;         // for business plans
  viewCount: number;
  saveCount: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

publicCards/{slug} (Denormalized cache)

Exactly the same fields as cards, but only for cards with isPublic: true. Updated via Cloud Function on card write. Read by unauthenticated users (lower cost).

messages/{messageId}

```typescript
interface Message {
  senderUid: string;
  recipientUid: string;
  cardSlug: string;              // Which card they viewed
  subject: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
}
```

pendingUpgrades/{uid}

```typescript
interface PendingUpgrade {
  uid: string;
  plan: 'pro' | 'business';
  sessionId: string;             // Stripe Checkout session ID
  createdAt: Timestamp;
}
```

analytics/{cardId}/{date} (Subcollection)

```typescript
interface DailyAnalytics {
  cardId: string;
  date: string;                  // YYYY-MM-DD
  views: number;
  uniqueViews: number;           // approximated by IP hash
  saves: number;                 // vCard downloads
  createdAt: Timestamp;
}
```

Firestore Indexes (Required)

Run these in Firebase Console or via firestore.indexes.json:

```json
{
  "indexes": [
    {
      "collectionGroup": "cards",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "slug", "order": "ASCENDING" },
        { "fieldPath": "__name__", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "cards",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ownerUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "cards",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isPublic", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "messages",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "recipientUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "analytics",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "cardId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Security Rules (Outline)

firestore.rules (simplified – see repo for full):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{uid} {
      allow read: if request.auth != null && (request.auth.uid == uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    
    // Cards
    match /cards/{cardId} {
      allow read: if resource.data.isPublic == true || (request.auth != null && resource.data.ownerUid == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.ownerUid == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.ownerUid == request.auth.uid;
    }
    
    // Public cards cache
    match /publicCards/{slug} {
      allow read: if true;
      allow write: if false;  // managed by Cloud Function
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null && (resource.data.recipientUid == request.auth.uid || resource.data.senderUid == request.auth.uid);
      allow create: if request.auth != null && request.resource.data.senderUid == request.auth.uid;
    }
    
    // Analytics – anyone can write views, only owner can read
    match /analytics/{cardId}/{date} {
      allow read: if request.auth != null && get(/databases/$(database)/documents/cards/$(cardId)).data.ownerUid == request.auth.uid;
      allow create: if true;   // client-side view tracking
      allow update: if false;
    }
  }
}
```

Storage Rules

storage.rules:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/profile.jpg {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp)');
    }
    match /users/{uid}/backgrounds/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

```

---

## File 4: `docs/FRONTEND_GUIDE.md`

```markdown
# Frontend Development Guide

## Strict Rules

1. **No direct Firestore calls in components** – always use `shared/api/` functions.
2. **No global state managers** (Redux, Zustand, MobX) – use React Context for truly global state (auth, theme) and local state for everything else.
3. **All new features must be isolated in `features/`** with their own `index.ts` exporting only the public API.
4. **No circular dependencies** – enforced by `eslint-plugin-import` and `madge`.

## Routing (React Router v7)

`app/routing/AppRoutes.tsx`:

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const HomePage = lazy(() => import('../../pages/HomePage'));
const EditorPage = lazy(() => import('../../pages/EditorPage'));
const CardViewerPage = lazy(() => import('../../pages/CardViewerPage'));
const DashboardPage = lazy(() => import('../../pages/DashboardPage'));

const Loading = () => <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

export const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/editor/:cardId?" element={<EditorPage />} />
      <Route path="/card/:slug" element={<CardViewerPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      {/* ... other routes */}
    </Routes>
  </Suspense>
);
```

PWA Setup

1. Generate manifest

public/manifest.json:

```json
{
  "name": "Nowncard",
  "short_name": "Nowncard",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#c9a278",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

2. Register service worker

src/main.tsx:

```tsx
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

3. Vite PWA plugin

vite.config.ts:

```ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images' }
          },
          {
            urlPattern: /\/api\/cards\/.*/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' }
          }
        ]
      }
    })
  ]
});
```

Styling with Tailwind CSS v4

· Use @tailwind base; @tailwind components; @tailwind utilities; in src/index.css.
· Custom theme extension in tailwind.config.js:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#c9a278',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
      },
    },
  },
};
```

Form Handling

Use react-hook-form with zod validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const cardSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
});

type CardForm = z.infer<typeof cardSchema>;

function EditorForm() {
  const { register, handleSubmit } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
  });
  // ...
}
```

Image Upload with Compression

shared/lib/utils/compressImage.ts:

```ts
export async function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

Accessibility Requirements

· All interactive elements must be reachable via keyboard.
· Use aria-label on icon-only buttons.
· Color contrast ratio minimum 4.5:1 for text.
· Run npx playwright test --project=a11y before merging.

```

---

## File 5: `docs/BACKEND_GUIDE.md`

```markdown
# Backend (Firebase) Guide

## Firebase Project Setup

1. Create new Firebase project: `nowncard-v3`
2. Enable Authentication (Email/Password + Google)
3. Enable Firestore (start in test mode, then deploy rules)
4. Enable Storage (start in test mode, then deploy rules)
5. Enable Cloud Functions (Blaze plan required)
6. Enable Cloud Messaging for push notifications

## Environment Configuration

Create `.env` files:

```

.env.local (development)

VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=nowncard-v3.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nowncard-v3
VITE_FIREBASE_STORAGE_BUCKET=nowncard-v3.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

```

## Cloud Functions

### Function 1: `createCheckoutSession` (Stripe)

```typescript
// functions/src/stripe.ts
import * as functions from 'firebase-functions/v2';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
  const { plan } = data; // 'pro' or 'business'
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan === 'pro' ? 'price_pro_id' : 'price_business_id', quantity: 1 }],
    success_url: `https://nowncard.com/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://nowncard.com/pricing`,
    client_reference_id: context.auth.uid,
  });
  
  await admin.firestore().collection('pendingUpgrades').doc(context.auth.uid).set({
    uid: context.auth.uid,
    plan,
    sessionId: session.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return { sessionId: session.id, url: session.url };
});
```

Function 2: stripeWebhook

```typescript
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.client_reference_id;
    const plan = (await admin.firestore().collection('pendingUpgrades').doc(uid).get()).data().plan;
    
    await admin.firestore().collection('users').doc(uid).update({
      plan,
      stripeCustomerId: session.customer,
    });
    await admin.firestore().collection('pendingUpgrades').doc(uid).delete();
  }
  res.json({ received: true });
});
```

Function 3: updatePublicCardsCache

Triggered on cards write:

```typescript
export const updatePublicCardsCache = functions.firestore.onDocumentUpdated('cards/{cardId}', async (event) => {
  const after = event.data.after.data();
  if (after.isPublic) {
    await admin.firestore().collection('publicCards').doc(after.slug).set(after);
  } else {
    await admin.firestore().collection('publicCards').doc(after.slug).delete();
  }
});
```

Deployment Commands

```bash
# Deploy Firestore rules & indexes
firebase deploy --only firestore:rules,firestore:indexes

# Deploy Storage rules
firebase deploy --only storage

# Deploy Cloud Functions
cd functions && npm run build && firebase deploy --only functions

# Deploy hosting (frontend)
npm run build && firebase deploy --only hosting
```

Emulator Suite (local testing)

```bash
firebase emulators:start --only auth,firestore,functions,storage
# Then run your app with npm run dev -- --host
```

Migration from Old Database

A one-time script (scripts/migrate.ts) will:

1. Read all cards from old Firestore project.
2. Transform data to new schema (e.g., socialLinks array, phones/emails arrays).
3. Write to new cards collection, preserving slug and id.
4. Run updatePublicCardsCache for each public card.
5. Migrate users (minimal fields).

Run with npx ts-node scripts/migrate.ts after setting old project credentials.

```

---

## File 6: `docs/IMPLEMENTATION_PLAN.md`

```markdown
# Step-by-Step Implementation Plan (8 Weeks)

## Week 1 – Scaffolding & Foundation

**Goal:** Empty but working project with CI and base Firebase integration.

- [ ] Create new GitHub repo `nowncard-v3`.
- [ ] Run `npm create vite@latest . -- --template react-ts`
- [ ] Install dependencies: `firebase`, `react-router-dom`, `tailwindcss`, `shadcn/ui`, `vitest`, `playwright`.
- [ ] Configure `vite.config.ts` with aliases (`@/`), PWA plugin, and build optimizations.
- [ ] Set up Firebase web SDK in `shared/lib/firebase/init.ts`.
- [ ] Write `firestore.rules` and `storage.rules` (tested locally with emulator).
- [ ] Set up GitHub Actions CI: lint, type-check, unit tests, build.
- [ ] Create `src/app/App.tsx` with basic router and providers (Auth, Theme, Toast).
- [ ] **Milestone:** `npm run dev` shows a blank page with "Hello World".

## Week 2 – Authentication + User Profile

- [ ] Build `features/auth`: Email/Password and Google sign-in.
- [ ] Create `AuthModal` widget (reusable modal).
- [ ] Create `shared/api/users.ts` with typed Firestore user operations.
- [ ] Set up `AuthProvider` (React Context) to provide `user` and `isAdmin`.
- [ ] Protect routes: `ProtectedRoute` component.
- [ ] Write unit tests for auth hooks (mock Firebase).
- [ ] Write E2E test: user signs up, sees dashboard placeholder.
- [ ] Deploy to Firebase Hosting (staging environment).
- [ ] **Milestone:** `https://staging.nowncard.com` has working login.

## Week 3 – Card Data Layer & Basic CRUD

- [ ] Define Firestore `cards` collection with typed interfaces.
- [ ] Write `shared/api/cards.ts`: `createCard`, `updateCard`, `deleteCard`, `listUserCards`.
- [ ] Build `pages/DashboardPage.tsx` listing user's cards (simple table).
- [ ] Build `pages/EditorPage.tsx` with a basic form (firstName, lastName, email).
- [ ] Implement slug auto-generation: `slugify(firstName + lastName + random)` with uniqueness check.
- [ ] Add image upload to Storage (profile image) with compression.
- [ ] Write integration tests for card API functions.
- [ ] **Milestone:** User can create, edit, delete cards from dashboard.

## Week 4 – Public Card Viewer (3D Flip)

- [ ] Build `pages/CardViewerPage.tsx` that fetches card by slug from `publicCards` collection.
- [ ] Implement CSS 3D flip card (front/back).
- [ ] On back side: display QR code (using `qrcode.react`), vCard download button, share button.
- [ ] Implement vCard generation (`shared/lib/vcard/generateVCard.ts`).
- [ ] Track views: Firestore `analytics` collection write on each view (debounced, client-side).
- [ ] Implement PWA caching: service worker caches `/card/:slug` responses.
- [ ] Write E2E test: visit public card, click flip, download vCard.
- [ ] **Milestone:** Public card URL works offline and shows 3D animation.

## Week 5 – Payments & Plan Enforcement

- [ ] Set up Stripe account, create products (Pro $5/mo, Business $20/mo).
- [ ] Write Cloud Function `createCheckoutSession`.
- [ ] Write Cloud Function `stripeWebhook` to upgrade user's plan.
- [ ] Build `features/payments`: Pricing page, checkout button that calls the function.
- [ ] Implement plan limits in UI: if user on free plan, max 3 social links, 1 card, etc.
- [ ] Write Security Rules to prevent writes exceeding plan limits (using Firestore `get`).
- [ ] Write E2E test: upgrade to Pro via Stripe test card, verify plan changes.
- [ ] **Milestone:** Free users can upgrade and see new features unlocked.

## Week 6 – Advanced Features

- [ ] **NFC programming:** `features/nfc` – use Web NFC API to write card URL to NFC tag.
- [ ] **Direct messaging:** `features/messages` – send message to card owner from public viewer.
- [ ] **Analytics dashboard:** `features/analytics` – show daily views/saves chart (using Recharts).
- [ ] **Admin panel:** `features/admin` – list all users, delete cards, view errors (protected by `isAdmin`).
- [ ] Write E2E tests for each new feature.
- [ ] **Milestone:** Admin can view analytics; users can receive messages.

## Week 7 – Polish & Performance

- [ ] Add error boundary + Sentry integration.
- [ ] Run Lighthouse CI – fix all issues (score >90 each).
- [ ] Add skeleton loaders for all async data.
- [ ] Optimize bundle: code-split routes, lazy load heavy components.
- [ ] Implement offline fallback page for missing network.
- [ ] Add push notifications: Firebase Cloud Messaging for new messages.
- [ ] Write comprehensive Playwright tests (all user journeys).
- [ ] **Milestone:** Lighthouse PWA score 100, Performance >95.

## Week 8 – Migration & Launch

- [ ] Write migration script from old Firestore to new schema.
- [ ] Run migration on staging, verify all public cards work.
- [ ] Set up production Firebase project (separate from staging).
- [ ] Deploy to production with blue-green: keep old site at `v1.nowncard.com`, new at `www.nowncard.com`.
- [ ] Run smoke tests on production (using Playwright against live URL).
- [ ] Soft launch: invite 10 beta users, monitor errors for 48h.
- [ ] Update DNS: point `nowncard.com` to new hosting.
- [ ] Archive old GitHub repo.
- [ ] **Milestone:** Public launch – all old URLs redirect to new site.

## Daily Agent Workflow

For each task, the agent should:

1. Read the relevant documentation section.
2. Write code with strict TypeScript and tests.
3. Run `npm run test` and `npm run build` locally.
4. Commit with conventional commit message (`feat:`, `fix:`, `test:`).
5. Push and let CI run.
6. Only mark task as complete after CI passes.

## Acceptance Criteria

- [ ] All E2E tests pass on staging.
- [ ] No TypeScript errors (`tsc --noEmit`).
- [ ] No ESLint warnings.
- [ ] Lighthouse score ≥90 for Performance, Accessibility, Best Practices, SEO, PWA.
- [ ] Security Rules pass Firestore simulator tests.
```

---

File 7: docs/TESTING.md

```markdown
# Testing Strategy

## Test Pyramid

- **Unit tests (60%)** – `vitest` for utilities, hooks, and pure functions.
- **Integration tests (30%)** – `vitest` with Firebase emulator for API functions.
- **E2E tests (10%)** – `playwright` for critical user journeys.

## Unit Tests Example

`shared/lib/utils/slugify.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('John Doe')).toBe('john-doe');
  });
  it('removes special characters', () => {
    expect(slugify('Jane & Co.')).toBe('jane-co');
  });
});
```

Integration Tests with Firebase Emulator

features/card-editor/api/cards.test.ts:

```ts
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { initializeTestEnv, clearFirestore } from '../../../test/firebase';
import { createCard, getUserCards } from './cards';

describe('Card API', () => {
  beforeAll(async () => {
    await initializeTestEnv();
  });
  afterAll(async () => {
    await clearFirestore();
  });
  
  it('creates a card for authenticated user', async () => {
    const uid = 'test-user-1';
    const card = await createCard(uid, { firstName: 'Alice', lastName: 'Smith' });
    expect(card.id).toBeDefined();
    const cards = await getUserCards(uid);
    expect(cards).toHaveLength(1);
  });
});
```

E2E Tests with Playwright

e2e/create-card.spec.ts:

```ts
import { test, expect } from '@playwright/test';

test('authenticated user creates a card', async ({ page }) => {
  // Sign in
  await page.goto('/');
  await page.click('button:has-text("Sign in")');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Sign in")');
  await expect(page).toHaveURL('/dashboard');
  
  // Create card
  await page.click('a:has-text("Create new card")');
  await page.fill('input[name="firstName"]', 'E2E');
  await page.fill('input[name="lastName"]', 'Tester');
  await page.click('button:has-text("Save")');
  await expect(page.locator('.toast')).toContainText('Card saved');
  
  // Verify in dashboard
  await page.goto('/dashboard');
  await expect(page.locator('text=E2E Tester')).toBeVisible();
});
```

Accessibility Testing

Add to Playwright config:

```ts
import { defineConfig } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export default defineConfig({
  projects: [
    {
      name: 'a11y',
      testMatch: /.*\.a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

Then test:

```ts
test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

CI Integration

.github/workflows/ci.yml:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

Coverage Thresholds

In vitest.config.ts:

```ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

```

---

## File 8: `docs/DEPLOYMENT.md`

```markdown
# Deployment Guide

## Environments

| Environment | URL | Firebase Project | Purpose |
|-------------|-----|------------------|---------|
| Development | `localhost:5173` | (emulator) | Local coding |
| Staging | `staging.nowncard.com` | `nowncard-staging` | Pre-merge testing |
| Production | `www.nowncard.com` | `nowncard-prod` | Live site |

## Setup for Each Environment

```bash
# Create separate Firebase projects
firebase projects:create nowncard-staging
firebase projects:create nowncard-prod

# Set aliases
firebase use --add nowncard-staging staging
firebase use --add nowncard-prod prod
```

CI/CD Pipeline (GitHub Actions)

Workflow .github/workflows/deploy.yml:

```yaml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:  # manual trigger

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: w9jds/firebase-action@v13
        with:
          args: deploy --only hosting,firestore:rules,storage:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_STAGING }}
          PROJECT_ID: nowncard-staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    if: github.event_name == 'workflow_dispatch'  # manual approval
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: w9jds/firebase-action@v13
        with:
          args: deploy --only hosting,firestore:rules,storage:rules,functions
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_PROD }}
          PROJECT_ID: nowncard-prod
```

Manual Deploy Steps (if CI fails)

```bash
# 1. Switch to environment
firebase use prod

# 2. Deploy frontend only
npm run build
firebase deploy --only hosting

# 3. Deploy security rules
firebase deploy --only firestore:rules,storage:rules

# 4. Deploy Cloud Functions
cd functions && npm run build && firebase deploy --only functions
```

Rollback Procedure

If production is broken:

1. Immediate rollback (last working deployment):
   ```bash
   firebase hosting:clone --target=live --source=prev-deployment-id
   ```
2. Git revert (long-term fix):
   ```bash
   git revert HEAD --no-commit
   git commit -m "chore: rollback to previous stable version"
   git push origin main
   # CI will auto-deploy to staging; then manual deploy to prod
   ```
3. Database rollback (if schema changed):
   · Use Firestore Point-in-Time Recovery (requires enabled in GCP).
   · Restore to 10 minutes before incident.

Monitoring & Alerts

· Sentry for frontend JS errors.
· Firebase Crashlytics for native crashes (if wrapped as Android/iOS app).
· Uptime monitoring with UptimeRobot (checks /card/test every 5 min).
· Slack alerts via GitHub Actions on failed deployment.

Post-Launch Checklist

· DNS records verified (dig www.nowncard.com).
· SSL certificate valid (Firebase auto-provisions).
· Stripe webhook endpoint configured and verified.
· Email templates (password reset, payment receipt) tested.
· Old nowncard.com redirects to new site via HTTP 301.
· Google Analytics / Plausible installed.
· robots.txt allows indexing for public cards.
· sitemap.xml generated daily (Cloud Function).

```

---

These eight files give you a complete blueprint. Place them in your new repository root and `docs/` folder, then hand them to your AI agent to execute the build step by step.