import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import IngredientBadge from "../components/IngredientBadge";
import SectionHeader from "../components/SectionHeader";
import BrandLogo from "../components/BrandLogo";
import { getAvoidIngredients, getBeautyMatchScore, getGlowScore, getBenefitTag } from "../lib/personalization";
import PackagingShowcase from "../components/PackagingShowcase";
import { fetchProductById, fetchReviews } from "../lib/api";

function getIngredientBadges(product) {
  const loweredIngredients = (product.includeIngredients || []).map((item) => item.toLowerCase());
  const loweredConcerns = (product.concerns || []).map((item) => item.toLowerCase());
  const badges = [];

  if (loweredConcerns.some((item) => item.includes("acne")) || loweredIngredients.some((item) => item.includes("salicylic"))) {
    badges.push("Acne Control");
  }
  if (loweredIngredients.some((item) => item.includes("hyaluronic") || item.includes("ceramide"))) {
    badges.push("Hydrating");
  }
  if (loweredIngredients.some((item) => item.includes("vitamin c") || item.includes("niacinamide"))) {
    badges.push("Brightening");
  }
  if (loweredIngredients.some((item) => item.includes("retinol") || item.includes("peptide"))) {
    badges.push("Anti-aging");
  }

  return badges;
}

function resolveIngredientInfo(ingredientName, ingredients) {
  const found = ingredients.find((ingredient) => ingredient.name.toLowerCase() === ingredientName.toLowerCase());
  if (!found) {
    return {
      name: ingredientName,
      summary: `${ingredientName} supports targeted skincare goals and daily routine effectiveness.`,
      suitableSkinTypes: []
    };
  }
  return {
    name: found.name,
    summary: found.spotlightText || (found.benefits && found.benefits[0]) || "Ingredient insight",
    suitableSkinTypes: found.suitableSkinTypes || []
  };
}

function ProductPage({
  products,
  ingredients = [],
  reviews,
  skinProfile,
  onAddToCart,
  onToggleWishlist,
  wishlistSet,
  alerts,
  onTogglePriceAlert,
  onToggleRestockAlert
}) {
  const { productId } = useParams();
  const [product, setProduct] = useState(() => products.find((item) => item.id === productId) || null);
  const [liveReviews, setLiveReviews] = useState(() => reviews.filter((review) => review.productId === productId));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [reviewFilters, setReviewFilters] = useState({
    skinType: "All",
    concern: "All",
    ageGroup: "All",
    similarProfile: false
  });
  const [bundleSelection, setBundleSelection] = useState([]);

  useEffect(() => {
    const fallbackProduct = products.find((item) => item.id === productId) || null;
    setProduct(fallbackProduct);
    setSelectedImageIndex(0);

    let isMounted = true;
    fetchProductById(productId)
      .then((remoteProduct) => {
        if (!isMounted || !remoteProduct) return;
        setProduct(remoteProduct);
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [productId, products]);

  useEffect(() => {
    setLiveReviews(reviews.filter((review) => review.productId === productId));
    let isMounted = true;
    setLoadingReviews(true);
    fetchReviews({ productId })
      .then((remoteReviews) => {
        if (!isMounted) return;
        setLiveReviews(remoteReviews);
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setLoadingReviews(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId, reviews]);

  const productReviews = useMemo(() => {
    if (!product) return [];
    return liveReviews.filter((review) => review.productId === product.id);
  }, [product, liveReviews]);

  const filterOptions = useMemo(
    () => ({
      skinTypes: ["All", ...new Set(productReviews.map((review) => review.skinType))],
      concerns: ["All", ...new Set(productReviews.map((review) => review.skinConcern))],
      ageGroups: ["All", ...new Set(productReviews.map((review) => review.ageGroup))]
    }),
    [productReviews]
  );

  const filteredReviews = useMemo(() => {
    return productReviews.filter((review) => {
      if (reviewFilters.skinType !== "All" && review.skinType !== reviewFilters.skinType) return false;
      if (reviewFilters.concern !== "All" && review.skinConcern !== reviewFilters.concern) return false;
      if (reviewFilters.ageGroup !== "All" && review.ageGroup !== reviewFilters.ageGroup) return false;
      if (reviewFilters.similarProfile && skinProfile) {
        const concernMatch = (skinProfile.skinConcerns || []).includes(review.skinConcern);
        if (skinProfile.skinType !== review.skinType && !concernMatch) return false;
      }
      return true;
    });
  }, [productReviews, reviewFilters, skinProfile]);

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 10);
  }, [product, products]);

  const frequentlyBoughtTogether = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.id !== product.id)
      .sort((a, b) => {
        const aScore = Number(a.brand === product.brand) + Number(a.category === product.category);
        const bScore = Number(b.brand === product.brand) + Number(b.category === product.category);
        return bScore - aScore;
      })
      .slice(0, 3);
  }, [product, products]);

  useEffect(() => {
    setBundleSelection(frequentlyBoughtTogether.map((item) => item.id));
  }, [frequentlyBoughtTogether]);

  if (!product) {
    return (
      <div className="space-y-4 pb-20 md:pb-8">
        <section className="glass-card p-6">
          <h2 className="section-title">Product not found</h2>
          <p className="section-subtitle">This product is not available in the current catalogue.</p>
        </section>
      </div>
    );
  }

  const discountedPrice = Math.round(product.price * (1 - product.discountPct / 100));
  const isWishlisted = wishlistSet?.has(product.id);
  const hasPriceDropAlert = alerts?.priceDropProductIds?.includes(product.id);
  const hasRestockAlert = alerts?.restockProductIds?.includes(product.id);
  const ingredientBadges = getIngredientBadges(product);
  const ingredientBreakdown = product.includeIngredients.map((name) => resolveIngredientInfo(name, ingredients));
  const selectedBundleProducts = frequentlyBoughtTogether.filter((item) => bundleSelection.includes(item.id));
  const bundlePrice = selectedBundleProducts.reduce(
    (sum, item) => sum + Math.round(item.price * (1 - item.discountPct / 100)),
    0
  );
  const matchScore = getBeautyMatchScore(product, skinProfile?.skinType, skinProfile?.skinConcerns);
  const glowScore = getGlowScore(product);
  const benefitTag = getBenefitTag(product);
  const avoidIngredients = getAvoidIngredients(skinProfile?.skinType);
  const whyThisWorks = product.includeIngredients
    .slice(0, 2)
    .map((ingredient) => `${ingredient} helps ${product.concerns?.[0] || "support your skin"} for ${skinProfile?.skinType || "all skin"} types.`)
    .join(" ");

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <section id="reviews" className="glass-card p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-7">
            <div className="group overflow-hidden rounded-[22px] border border-rose-100 bg-white p-5">
              <div className="product-spotlight" />
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="product-image h-96 w-full cursor-zoom-in object-contain transition duration-500 group-hover:scale-110"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-xl border p-1 transition ${
                    index === selectedImageIndex ? "border-skin-gold" : "border-rose-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="product-image h-16 w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div>
              <BrandLogo brand={product.brand} showName className="brand-mark--hero" imgClassName="brand-mark__img--md" />
              <h1 className="mt-1 text-4xl font-bold leading-tight text-skin-ink">{product.name}</h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-rose-900/70">
                <div className="match-ring" style={{ background: `conic-gradient(#ff6f91 ${matchScore * 3.6}deg, rgba(255,255,255,0.4) 0deg)` }}>
                  <div className="match-ring__inner">
                    <span>{matchScore}%</span>
                    <small>Match</small>
                  </div>
                </div>
                <span className="font-semibold text-rose-700">★ {product.rating}</span>
                <span>{product.reviews} reviews</span>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  Glow Score {glowScore} / 5
                </span>
              </div>
              <p className="mt-3 text-sm text-rose-900/70">{product.description}</p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-soft lg:sticky lg:top-24">
              <div className="flex items-end gap-2">
                <strong className="text-3xl font-bold text-skin-ink">Rs {discountedPrice}</strong>
                <span className="text-sm text-rose-900/50 line-through">Rs {product.price}</span>
                <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                  {product.discountPct}% OFF
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-full border border-rose-200 bg-rose-50/40 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-700/80">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-700"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center text-sm font-semibold text-skin-ink">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(99, prev + 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white text-sm font-semibold text-rose-700"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" className="btn-primary" onClick={() => onAddToCart?.(product.id, quantity)}>
                  Add to Cart
                </button>
                <button type="button" className="btn-secondary" onClick={() => onToggleWishlist?.(product.id)}>
                  {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${hasPriceDropAlert ? "!border-rose-400 !bg-rose-100" : ""}`}
                  onClick={() => onTogglePriceAlert?.(product.id)}
                >
                  {hasPriceDropAlert ? "Price Alert On" : "Price Drop Alert"}
                </button>
                <button
                  type="button"
                  className={`btn-secondary ${hasRestockAlert ? "!border-rose-400 !bg-rose-100" : ""}`}
                  onClick={() => onToggleRestockAlert?.(product.id)}
                >
                  {hasRestockAlert ? "Restock Alert On" : "Restock Alert"}
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {ingredientBadges.map((badge) => (
                  <IngredientBadge key={badge} label={badge} />
                ))}
                {product.compatibilityTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="texture-strip my-4 md:my-6" aria-hidden="true" />

      <section className="product-tabs">
        <div className="product-tabs__header">
          {[
            { id: "description", label: "Description" },
            { id: "ingredients", label: "Ingredients" },
            { id: "howto", label: "How to Use" },
            { id: "reviews", label: "Reviews" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`product-tabs__btn ${activeTab === tab.id ? "is-active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-tabs__panel">
          {activeTab === "description" ? (
            <div className="space-y-3">
              <p className="text-sm text-rose-900/75">{product.description}</p>
              <div className="why-it-works">
                <p className="why-it-works__title">✨ Why This Works For Your Skin</p>
                <p className="text-sm text-rose-900/70">{whyThisWorks}</p>
                {benefitTag ? <span className="why-it-works__tag">{benefitTag}</span> : null}
              </div>
            </div>
          ) : null}

          {activeTab === "ingredients" ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/70">Key Ingredients</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.includeIngredients.map((ingredient) => (
                    <span key={ingredient} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/70">Ingredient Intelligence</p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {ingredientBreakdown.map((ingredient) => (
                    <article key={ingredient.name} className="ingredient-card">
                      <h4 className="text-sm font-semibold text-skin-ink">{ingredient.name}</h4>
                      <p className="mt-1 text-xs text-rose-900/70">{ingredient.summary}</p>
                      {ingredient.suitableSkinTypes.length > 0 ? (
                        <p className="mt-2 text-[11px] font-medium text-rose-700">
                          Suitable: {ingredient.suitableSkinTypes.join(", ")}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
              <div className="ingredient-alerts">
                <span>Dermatologist Recommended</span>
                <span>Acne Safe</span>
                <span>Hydrating</span>
                <span>Oil Control</span>
              </div>
              {avoidIngredients.length > 0 ? (
                <p className="ingredient-avoid">⚠ Avoid: {avoidIngredients.join(", ")}</p>
              ) : null}
            </div>
          ) : null}

          {activeTab === "howto" ? (
            <ol className="list-decimal space-y-2 pl-4 text-sm text-rose-900/70">
              <li>Cleanse skin and pat dry.</li>
              <li>Apply treatment product on targeted areas.</li>
              <li>Follow with moisturizer to lock hydration.</li>
              <li>Use sunscreen in your morning routine.</li>
            </ol>
          ) : null}

          {activeTab === "reviews" ? (
            <div className="space-y-3">
              <p className="text-sm text-rose-900/70">See what real customers with similar profiles are saying.</p>
              <div className="grid gap-3 md:grid-cols-2">
                {productReviews.slice(0, 2).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              <button type="button" className="btn-secondary" onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}>
                View all reviews
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <div className="texture-strip my-4 md:my-6" aria-hidden="true" />

      <PackagingShowcase
        title="Our Signature Packaging"
        subtitle="Magnetic gift boxes, silk wrapping, and a handwritten beauty card for every order."
        variant="compact"
      />

      <div className="texture-strip my-4 md:my-6" aria-hidden="true" />

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Customer Reviews" subtitle="Filter by profile tags to see relevant feedback." />
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3 text-sm text-rose-900/70">
          <span className="text-lg font-semibold text-rose-700">★ {product.rating}</span>
          <span>{product.reviews} total reviews</span>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Verified buyers
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Skin Type
            <select
              value={reviewFilters.skinType}
              onChange={(event) => setReviewFilters((prev) => ({ ...prev, skinType: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm normal-case text-rose-900"
            >
              {filterOptions.skinTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Skin Concern
            <select
              value={reviewFilters.concern}
              onChange={(event) => setReviewFilters((prev) => ({ ...prev, concern: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm normal-case text-rose-900"
            >
              {filterOptions.concerns.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Age Group
            <select
              value={reviewFilters.ageGroup}
              onChange={(event) => setReviewFilters((prev) => ({ ...prev, ageGroup: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm normal-case text-rose-900"
            >
              {filterOptions.ageGroups.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-end pb-1 text-sm font-medium text-rose-900/80">
            <input
              type="checkbox"
              checked={reviewFilters.similarProfile}
              onChange={(event) =>
                setReviewFilters((prev) => ({ ...prev, similarProfile: event.target.checked }))
              }
              className="mr-2 h-4 w-4 accent-rose-500"
            />
            Similar to my skin profile
          </label>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {loadingReviews ? (
            <div className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-rose-900/70">Loading reviews...</div>
          ) : null}
          {!loadingReviews && filteredReviews.length === 0 ? (
            <div className="rounded-2xl border border-rose-100 bg-white p-6 text-sm text-rose-900/70">
              No reviews match selected profile filters.
            </div>
          ) : null}
        </div>
      </section>

      <div className="texture-strip my-4 md:my-6" aria-hidden="true" />

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Frequently Bought Together" subtitle="Save time with this curated bundle." />

        <div className="grid gap-3 md:grid-cols-3">
          {frequentlyBoughtTogether.map((item) => {
            const checked = bundleSelection.includes(item.id);
            return (
              <label key={item.id} className="rounded-2xl border border-rose-100 bg-white p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      setBundleSelection((prev) =>
                        event.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id)
                      );
                    }}
                    className="mt-1 h-4 w-4 accent-rose-500"
                  />
                  <img src={item.images[0]} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div>
                    <BrandLogo brand={item.brand} showName className="brand-mark--card" imgClassName="brand-mark__img--sm" />
                    <p className="text-sm font-semibold text-skin-ink">{item.name}</p>
                    <p className="text-xs text-rose-900/70">
                      Rs {Math.round(item.price * (1 - item.discountPct / 100))}
                    </p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/60 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-800">Bundle Price: Rs {bundlePrice}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => selectedBundleProducts.forEach((item) => onAddToCart?.(item.id, 1))}
            disabled={selectedBundleProducts.length === 0}
          >
            Add Bundle to Cart
          </button>
        </div>
      </section>

      <div className="texture-strip my-4 md:my-6" aria-hidden="true" />

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Recommended Products" subtitle="Handpicked to pair with your routine." />
        <div className="mt-4 grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto pb-1 scrollbar-hidden md:auto-cols-[minmax(240px,1fr)]">
          {similarProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlistSet?.has(item.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
