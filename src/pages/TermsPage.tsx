export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-ink-muted">Last updated: June 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink">
        <section>
          <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By creating an account or using NownCard ("the Service"), you agree to be bound by these Terms of Service.
            If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">2. Account Responsibility</h2>
          <p className="mt-2">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. You must notify us immediately of any unauthorized use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">3. Content Ownership</h2>
          <p className="mt-2">
            You retain all rights to the content you create and upload to NownCard. By making a card public, you grant
            NownCard a limited license to display and distribute that content as part of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">4. Acceptable Use</h2>
          <p className="mt-2">
            You agree not to use the Service for any unlawful purpose or to violate any laws in your jurisdiction.
            You may not upload content that is abusive, harassing, defamatory, or otherwise objectionable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">5. Payment and Subscriptions</h2>
          <p className="mt-2">
            Paid plans are billed according to the terms presented at purchase. You may cancel at any time.
            Refunds are handled according to our refund policy. Pro and Business plan features are subject to change.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">6. Limitation of Liability</h2>
          <p className="mt-2">
            NownCard is provided "as is" without warranties of any kind. We shall not be liable for any damages
            arising from the use or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">7. Changes to Terms</h2>
          <p className="mt-2">
            We reserve the right to modify these terms at any time. Continued use of the Service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">8. Contact</h2>
          <p className="mt-2">
            For questions about these terms, contact us through our contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
