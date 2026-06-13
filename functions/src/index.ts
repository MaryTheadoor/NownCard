import * as functions from "firebase-functions/v2";

/**
 * Creates a Stripe Checkout session for upgrading a user's plan.
 * Called from the client via httpsCallable.
 */
export const createCheckoutSession = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
  }

  // TODO: Set up Stripe products/prices in Stripe dashboard and add keys to .env
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const priceId = plan === "pro" ? process.env.STRIPE_PRO_PRICE_ID! : process.env.STRIPE_BUSINESS_PRICE_ID!;
  //
  // const session = await stripe.checkout.sessions.create({
  //   mode: "subscription",
  //   payment_method_types: ["card"],
  //   line_items: [{ price: priceId, quantity: 1 }],
  //   success_url: `${process.env.SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.SITE_URL}/pricing`,
  //   client_reference_id: context.auth.uid,
  // });
  //
  // await admin.firestore().collection("pendingUpgrades").doc(context.auth.uid).set({
  //   uid: context.auth.uid,
  //   plan,
  //   sessionId: session.id,
  //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
  // });
  //
  // return { sessionId: session.id, url: session.url };

  throw new functions.https.HttpsError("unavailable", "Stripe not configured");
});

/**
 * Handles Stripe webhook events to upgrade user plans on successful checkout.
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  // TODO: Implement after setting up Stripe
  // const sig = req.headers["stripe-signature"]!;
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //
  // const event = stripe.webhooks.constructEvent(
  //   req.rawBody,
  //   sig,
  //   process.env.STRIPE_WEBHOOK_SECRET!
  // );
  //
  // if (event.type === "checkout.session.completed") {
  //   const session = event.data.object;
  //   const uid = session.client_reference_id!;
  //   const pendingDoc = await admin.firestore().collection("pendingUpgrades").doc(uid).get();
  //   const plan = pendingDoc.data()?.plan;
  //
  //   await admin.firestore().collection("users").doc(uid).update({
  //     plan,
  //     stripeCustomerId: session.customer,
  //   });
  //   await admin.firestore().collection("pendingUpgrades").doc(uid).delete();
  // }
  //
  // res.json({ received: true });

  res.status(501).json({ error: "Stripe not configured" });
});

/**
 * Updates the publicCards denormalized cache on card create/update/delete.
 */
export const updatePublicCardsCache = functions.firestore.onDocumentWritten("cards/{cardId}", async (event) => {
  const after = event.data?.after.data();
  const before = event.data?.before.data();

  if (after && after.isPublic && after.slug) {
    await event.data!.after.ref.firestore.collection("publicCards").doc(after.slug).set(after);
  } else if (before && before.slug) {
    try {
      await event.data!.after.ref.firestore.collection("publicCards").doc(before.slug).delete();
    } catch {
      // Document may not exist - safe to ignore
    }
  }
});
