import SectionHeader from "../components/SectionHeader";

function SkinAnalyzerPage({ skinProfile, onOpenAnalyzer }) {
  const skinType = skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "Not set";
  const concerns = skinProfile?.skinConcerns || [];

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="AI Skin Analyzer" subtitle="Answer a few questions for personalized recommendations." />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">Current Result</p>
            <h2 className="mt-2 text-2xl font-semibold text-skin-ink">{skinType}</h2>
            <p className="mt-2 text-sm text-rose-900/70">
              {concerns.length > 0 ? `Concerns: ${concerns.join(", ")}` : "Complete the analyzer to set your concerns."}
            </p>
            <button type="button" onClick={onOpenAnalyzer} className="btn-primary mt-5">
              {skinType === "Not set" ? "Start Analyzer" : "Retake Analyzer"}
            </button>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">How it works</p>
            <ul className="mt-4 space-y-3 text-sm text-rose-900/75">
              <li>Answer 6 quick questions about oiliness, sensitivity, and goals.</li>
              <li>We calculate your skin type and map products to your routine.</li>
              <li>Results power your Skin Match scores across the catalog.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SkinAnalyzerPage;
