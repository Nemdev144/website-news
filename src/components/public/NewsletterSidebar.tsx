export default function NewsletterSidebar() {
  return (
    <aside className="border border-neutral-200 bg-gradient-to-b from-brand-50 to-white shadow-sm">
      <h2 className="border-b border-brand-200 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-brand-900">
        Daily Newsletter
      </h2>
      <div className="px-3 py-2.5">
        <p className="font-sans text-[11px] leading-relaxed text-neutral-600">
          Get the top stories delivered to your inbox every morning. Free, no spam.
        </p>
        <div className="mt-2 space-y-1.5">
          <input
            type="email"
            placeholder="Your email address"
            className="h-7 w-full border border-neutral-300 bg-white px-2 font-sans text-[11px] focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
          />
          <button
            type="button"
            className="h-7 w-full bg-brand-800 font-sans text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-900"
          >
            Subscribe Free
          </button>
        </div>
      </div>
    </aside>
  );
}
