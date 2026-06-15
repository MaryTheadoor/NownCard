# NownCard — Firestore Data Model

> Auto-generated from `src/shared/api/types.ts` and deployed Firestore rules.
> Last updated: 2026-06-15

---

## Collections Overview

| Collection | Read Access | Write Access | Purpose |
|---|---|---|---|
| `users/{uid}` | Owner + admin | Owner | User profiles |
| `cards/{cardId}` | Public if `isPublic=true`, else owner | Owner | Digital business cards |
| `messages/{messageId}` | Sender + recipient | Authenticated sender | Direct messages from card viewers |
| `analytics/{cardId}/{date}` | Card owner | Anyone (view tracking) | Per-card daily stats |
| `pendingUpgrades/{uid}` | Owner | Cloud Function | Stripe checkout sessions |

---

## `users/{uid}`

Stores Firebase Auth user profiles. Created automatically on first sign-in via `ensureUser()`.

```typescript
interface User {
  uid: string;                  // Firebase Auth UID (doc ID)
  email: string;
  displayName: string | null;
  photoURL: string | null;
  plan: "free" | "pro" | "business";
  isAdmin: boolean;
  cardCount?: number;           // Denormalized count for plan enforcement
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stripeCustomerId?: string;    // Linked Stripe customer for billing portal
}
```

**Firestore Rules:**
- Read: Self or admin
- Write: Self only

---

## `cards/{cardId}`

The core collection. Every card has a globally unique `slug` for URL routing (`/card/:slug`).

```typescript
interface Card {
  // Identity
  id: string;                   // Firestore doc ID
  ownerUid: string;             // Firebase Auth UID — always set on creates and updates
  slug: string;                 // URL-friendly unique ID, auto-generated from name + random suffix

  // Personal info
  prefix?: string;              // e.g. "Mr.", "Dr."
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;              // e.g. "Jr.", "III"
  nickname?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;

  // Contact details (arrays for order and metadata)
  phones: { type: string; number: string; primary?: boolean }[];
  emails: { type: string; address: string; primary?: boolean }[];
  addresses: {
    label?: string;             // e.g. "Office"
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    zip?: string;               // Alias for postalCode
    country: string;
    type?: string;
  }[];
  socialLinks: { platform: string; url: string }[];
  websites?: { type?: string; url: string }[];

  // Payment links
  paymentLinks?: { platform: string; url: string }[];

  // Dates
  birthday?: string;            // YYYY-MM-DD
  anniversary?: string;         // YYYY-MM-DD

  // Design
  theme: "cosmic" | "warm" | "minimal";
  accentColor: string;          // Default: "#e8a628"
  cardTheme?: "light" | "dark";
  cardBgColor?: string;
  textColor?: string;           // Overrides all card text

  // Images
  profileImage?: string;        // Firebase Storage URL
  backgroundImage?: string;     // Firebase Storage URL
  bgOpacity?: number;           // 0-1, default 0.3 (light) / 0.6 (dark)
  bgPosition?: string;          // CSS background-position
  bgSize?: string;              // CSS background-size
  bgZoom?: number;              // Percentage zoom
  bgRotation?: number;          // Degrees
  bgDisplayMode?: "full" | "header";

  // Typography
  fontFamily?: string;          // Google Font name (default: "Manrope")
  fontSizeScale?: number;       // Multiplier (default: 1)
  customFontUrl?: string;       // Self-hosted font URL (Business plan)

  // Layout
  nameLayout?: "personal" | "business";
  profileShape?: "circle" | "rounded" | "square";
  profileSize?: "small" | "medium" | "large";

  // Dual backgrounds (Pro feature)
  backBackgroundImage?: string;
  backBgPosition?: string;
  backBgRotation?: number;

  // Display options
  hideNavbar?: boolean;
  hideLogo?: boolean;
  qrMode?: "url" | "vcard";

  // Section positioning
  bioPosition?: "front" | "back";
  contactsPosition?: "front" | "back";
  socialsPosition?: "front" | "back";
  paymentsPosition?: "front" | "back";

  // Status
  isPublic: boolean;            // Appears in /rolodex when true
  isTeamCard?: boolean;         // Business plan feature
  viewCount: number;            // Incremented on each card view
  saveCount: number;            // Incremented on each vCard download

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Firestore Rules:**
- Read: `isPublic == true` OR `ownerUid == request.auth.uid`
- Create: Authenticated, `ownerUid == request.auth.uid`
- Update/Delete: `ownerUid == request.auth.uid`

**Composite Indexes (required):**
```json
[
  { "fields": ["slug", "__name__"], "collectionGroup": "cards" },
  { "fields": ["ownerUid", "createdAt DESC"], "collectionGroup": "cards" },
  { "fields": ["isPublic", "updatedAt DESC"], "collectionGroup": "cards" }
]
```

---

## `messages/{messageId}`

Direct messages sent from card viewers to card owners via the public card page.

```typescript
interface Message {
  id?: string;
  senderUid: string;            // Firebase Auth UID of sender
  senderName?: string;          // Display name
  senderEmail?: string;
  recipientUid: string;         // Card owner's Auth UID
  cardId?: string;              // Which card they viewed
  cardSlug: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Timestamp;
}
```

**Firestore Rules:**
- Read: Sender or recipient
- Create: Authenticated, `senderUid == request.auth.uid`

**Critical Note:** `recipientUid` must be the card owner's Firebase Auth UID (`ownerUid`), never the Firestore doc ID (`card.id`). This is the most common messaging bug.

---

## `analytics/{cardId}/{date}`

Subcollection per card, with daily stats documents keyed by `YYYY-MM-DD`.

```typescript
interface DailyAnalytics {
  cardId: string;
  date: string;                 // YYYY-MM-DD
  views: number;                // Incremented via FieldValue.increment(1)
  uniqueViews: number;
  saves: number;
  flips?: number;               // Card flip interactions
  device?: Record<string, number>;  // Device type breakdown
  referrer?: Record<string, number>; // Traffic source breakdown
  createdAt: Timestamp;
}
```

**Firestore Rules:**
- Read: Card owner
- Create: Anyone (client-side tracking)
- Update: Denied (stats are additive)

---

## `pendingUpgrades/{uid}`

Temporary documents tracking in-progress Stripe checkout sessions.

```typescript
interface PendingUpgrade {
  uid: string;
  plan: "pro" | "business";
  sessionId: string;            // Stripe Checkout session ID
  createdAt: Timestamp;
}
```

---

## slug Uniqueness

Slugs are URL-safe identifiers generated from first and last name:

```
firstName = "John", lastName = "Doe" → "john-doe-a3f2"
```

- Accents normalized (NFD decomposition)
- Special characters replaced with hyphens
- 4-character random alphanumeric suffix appended
- Uniqueness verified against Firestore before creation (5 retry attempts)

---

## Plan Limits

| Feature | Free | Pro | Business |
|---|---|---|---|
| Cards | 1 | 5 | Unlimited |
| Social links | 3 | Unlimited | Unlimited |
| Themes | `minimal` only | All 3 | All 3 |
| Background images | No | Yes | Yes |
| Custom fonts | No | No | Yes |
| Team cards | No | No | Yes |
| NFC writing | No | Yes | Yes |
