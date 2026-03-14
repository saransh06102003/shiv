import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { buildRoutine, getBeautyMatchScore } from "../lib/personalization";

function SkinProfileDashboard({ products, skinProfile, onAddToCart, onToggleWishlist, wishlistSet }) {
  const skinType = skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "Not set";
  const concerns = skinProfile?.skinConcerns || [];

  const routine = useMemo(() => {
    if (!skinProfile?.skinType) return null;
    return buildRoutine(products, skinProfile.skinType);
  }, [products, skinProfile]);

  const topMatches = useMemo(() => {
    if (!skinProfile?.skinType) return products.slice(0, 6);
    return [...products]
      .map((product) => ({
        ...product,
        matchScore: getBeautyMatchScore(product, skinProfile.skinType, skinProfile.skinConcerns || [])
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [products, skinProfile]);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Skin Profile Dashboard" subtitle="Your personalized skin intelligence overview." />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">Skin Type</p>
            <h2 className="mt-2 text-2xl font-semibold text-skin-ink">{skinType}</h2>
            <p className="mt-2 text-sm text-rose-900/70">
              {concerns.length > 0 ? `Concerns: ${concerns.join(", ")}` : "Add concerns to sharpen your recommendations."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/skin-analyzer" className="btn-primary">Retake Analyzer</Link>
              <Link to="/routine-builder" className="btn-secondary">Build Routine</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">Routine Snapshot</p>
            {routine ? (
              <div className="mt-3 space-y-3">
                {routine.map((step) => (
                  <div key={step.step} className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50/60 px-3 py-2 text-sm">
                    <span className="font-semibold text-skin-ink">{step.step}</span>
                    <span className="text-rose-900/70">{step.product?.name || "Add product"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-rose-900/70">Complete the analyzer to unlock your routine.</p>
            )}
          </div>
        </div>
      </section>

      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Top Skin Match Picks" subtitle="Products with the highest compatibility for you." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topMatches.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistSet?.has(product.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default SkinProfileDashboard;
