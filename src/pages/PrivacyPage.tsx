export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-ink-muted">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <p className="mt-2">
            When you create an account, we collect your email address, name, and profile information. When you create
            a card, we store the information you choose to include. We use Firebase Authentication and Firestore
            to securely store your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use your information to provide and improve the Service, communicate with you about your account,
            and display your public cards in the card directory when you choose to make them public.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Data Storage and Security</h2>
          <p className="mt-2">
            All data is stored on Google Cloud (Firebase) infrastructure with encryption at rest and in transit.
            We implement appropriate security measures to protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Public Cards</h2>
          <p className="mt-2">
            Cards that you mark as "public" are visible to anyone with the link and appear in our public card
            directory. Private cards are only visible to you. You can change a card's visibility at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Analytics and Tracking</h2>
          <p className="mt-2">
            We collect anonymous analytics about card views to provide you with insights about your card's
            performance. This data includes view counts, device types, and referral sources.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Third-Party Services</h2>
          <p className="mt-2">
            We use Firebase (Google) for authentication, database, and storage. Stripe processes payments.
            These services have their own privacy policies regarding data handling.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Your Rights</h2>
          <p className="mt-2">
            You may access, update, or delete your personal data at any time through your account settings.
            You may also request complete data deletion by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Contact</h2>
          <p className="mt-2">
            If you have questions about this privacy policy or our data practices, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
