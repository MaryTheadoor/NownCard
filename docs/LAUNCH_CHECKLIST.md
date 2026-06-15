# NownCard — Production Launch Checklist

> Last updated: 2026-06-15
> Firebase project: `nown-card`

## 1. Firebase Console Setup (one-time)

These steps must be done in the [Firebase Console](https://console.firebase.google.com/project/nown-card):

- [ ] **Enable Authentication**
  - Go to Authentication → Sign-in method
  - Enable **Email/Password** provider
  - Enable **Google** provider
  - No email verification required (can be added later)

- [ ] **Create Firestore Database**
  - Go to Firestore Database → Create database
  - Choose **Native mode** (not Datastore)
  - Start in **test mode** (we'll deploy rules immediately after)
  - Choose a location (us-central preferred)

- [ ] **Enable Firebase Storage**
  - Go to Storage → Get started
  - Start in test mode (we'll deploy rules immediately)

- [ ] **Upgrade to Blaze plan** (required for Cloud Functions)
  - Cloud Functions require the Blaze (pay-as-you-go) plan
  - Set a budget alert in Google Cloud Console

## 2. Local Deployment

Run these commands from the project root:

```powershell
# 1. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build the frontend
npm run build

# 4. Deploy Firestore & Storage rules + indexes
firebase deploy --only firestore,storage,firestore:indexes

# 5. Build and deploy Cloud Functions
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions

# 6. Deploy hosting
firebase deploy --only hosting
```

**Full deploy (after initial setup):**
```powershell
npm run build
firebase deploy
```

## 3. Environment Variables

Set these in the Firebase Functions environment:

```powershell
# Stripe (when ready)
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET

# Set runtime config
firebase functions:config:set site.url="https://nowncard.com"
```

Client-side `.env.local` is already configured with Firebase config values.

## 4. Post-Deploy Verification

- [ ] Visit `https://nown-card.web.app` — landing page loads
- [ ] Visit `https://nown-card.web.app/rolodex` — directory page loads
- [ ] Sign up with email/password — auth works
- [ ] Create a card — Firestore write works
- [ ] Upload a profile image — Storage works
- [ ] View the card at `/card/:slug` — public viewer works
- [ ] Sign out and view the card again — unauthenticated read works
- [ ] `/terms`, `/privacy`, `/contact` — static pages load
- [ ] `/nonexistent` — 404 page loads
- [ ] SPA refresh: visit `/rolodex` and refresh — page loads (rewrites working)

## 5. Custom Domain (optional)

- [ ] Add custom domain in Firebase Hosting console
- [ ] `nowncard.com` → Firebase Hosting
- [ ] Configure DNS A records pointing to Firebase IPs
- [ ] Provision SSL certificate (automatic)

## 6. Stripe Setup (when ready)

- [ ] Create Stripe account at https://stripe.com
- [ ] Create products: Pro ($5/mo), Business ($20/mo)
- [ ] Get publishable key → put in `.env.local` as `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Get secret key → set as Firebase secret `STRIPE_SECRET_KEY`
- [ ] Set up webhook endpoint: `https://us-central1-nown-card.cloudfunctions.net/stripeWebhook`
- [ ] Get webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`
- [ ] Uncomment Stripe code in `functions/src/index.ts`
- [ ] Rebuild and deploy functions

## 7. PWA Icons

The `public/icons/` directory needs:
- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

Generate these from `public/nowncard-logo.png` or create custom icons.

## 8. Known Gaps

| Item | Status | Notes |
|---|---|---|
| Stripe payments | Stubbed | Functions exist but commented out |
| Email verification | Not implemented | Can be added in Firebase Auth settings |
| Push notifications (FCM) | Not implemented | Low priority |
| PWA offline caching | Configured | vite-plugin-pwa handles this |
| Background image cropper | Not implemented | react-easy-crop (low priority) |
| Card export as PNG | Not implemented | html-to-image (low priority) |
| QR Poster page | Not implemented | Printable layout (low priority) |

## 9. Rollback Procedure

If something breaks:
```powershell
# Rollback hosting to previous version
firebase hosting:clone --target=live --source=prev-deployment-id

# Git revert
git revert HEAD --no-commit
git commit -m "chore: rollback"
git push
```
