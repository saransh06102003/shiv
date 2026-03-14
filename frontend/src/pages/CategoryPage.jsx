import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";
import {
  buildRoutine,
  filterProductsForSkinType,
  getBeautyMatchScore,
  getBenefitTag,
  getGlowScore,
  matchesProductSearch,
  normalizeSkinType,
  profileScoreForProduct
} from "../lib/personalization";

const defaultFilters = {
  skinTypes: [],
  concerns: [],
  ingredientInclude: [],
  ingredientExclude: [],
  brands: [],
  minPrice: 100,
  maxPrice: 5000,
  minRating: 4,
  smartTags: []
};

function CategoryPage({
  products,
  skinProfile,
  onAddToCart,
  onToggleWishlist,
  wishlistSet,
  isLoading = false,
  onOpenAnalyzer
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("recommended");
  const [mode, setMode] = useState("personalized");
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const wishlistOnly = searchParams.get("wishlist") === "true";
  const activeCategory = searchParams.get("category") || "";
  const heroSamples = useMemo(() => products.slice(0, 3), [products]);
  const activeSkinType =
    skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "";
  const activeConcerns = skinProfile?.skinConcerns || [];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const search = searchParams.get("search") || "";
    const skincareCategories = ["Cleansers", "Serums", "Moisturizers", "Sunscreen", "Treatments", "Masks", "Skincare"];
    const isSkincare =
      skincareCategories.includes(activeCategory) ||
      skincareCategories.includes(search) ||
      /skincare|korean|clean beauty|luxury beauty/i.test(search);
    const hasSkinType = Boolean(localStorage.getItem("skinType"));
    const prompted = sessionStorage.getItem("skinmatch.quizPrompted") === "true";
    if (isSkincare && !hasSkinType && !prompted) {
      sessionStorage.setItem("skinmatch.quizPrompted", "true");
      onOpenAnalyzer?.();
    }
  }, [activeCategory, onOpenAnalyzer, searchParams]);

  useEffect(() => {
    const priceParam = searchParams.get("price");
    const skinTypeParam = searchParams.get("skinType");
    const concernParam = searchParams.get("concern");
    const brandParam = searchParams.get("brand");
    const ingredientParam = searchParams.get("ingredient");

    setFilters((prev) => {
      const next = { ...prev };
      if (priceParam) {
        if (priceParam.includes("-")) {
          const [min, max] = priceParam.split("-").map((value) => Number(value));
          next.minPrice = Number.isFinite(min) ? min : prev.minPrice;
          next.maxPrice = Number.isFinite(max) ? max : prev.maxPrice;
        } else if (priceParam.includes("plus")) {
          const min = Number(priceParam.replace("plus", ""));
          next.minPrice = Number.isFinite(min) ? min : prev.minPrice;
          next.maxPrice = 10000;
        }
      }
      if (skinTypeParam) next.skinTypes = [skinTypeParam];
      if (concernParam) next.concerns = [concernParam];
      if (brandParam) next.brands = [brandParam];
      if (ingredientParam) next.ingredientInclude = [ingredientParam];
      return next;
    });
  }, [searchParams]);

  const allSkinTypes = useMemo(
    () => [...new Set(products.flatMap((product) => product.skinTypes))].filter(Boolean),
    [products]
  );
  const allConcerns = useMemo(
    () => [...new Set(products.flatMap((product) => product.concerns))].filter(Boolean),
    [products]
  );
  const allIngredients = useMemo(
    () => [...new Set(products.flatMap((product) => product.includeIngredients))].filter(Boolean),
    [products]
  );
  const allBrands = useMemo(
    () => [...new Set(products.map((product) => product.brand))].filter(Boolean),
    [products]
  );
  const categoryOptions = useMemo(
    () => [...new Set(products.map((product) => product.category))].filter(Boolean),
    [products]
  );

  const matchesSmartTag = (product, tag) => {
    const lowerTag = tag.toLowerCase();
    const concerns = (product.concerns || []).map((item) => item.toLowerCase());
    const ingredients = (product.includeIngredients || []).map((item) => item.toLowerCase());
    const compatibility = (product.compatibilityTags || []).map((item) => item.toLowerCase());
    const excludes = (product.excludeIngredients || []).map((item) => item.toLowerCase());

    if (lowerTag.includes("dermat")) return compatibility.some((item) => item.includes("derm"));
    if (lowerTag.includes("acne")) return concerns.some((item) => item.includes("acne")) || ingredients.some((item) => item.includes("salicylic") || item.includes("bha"));
    if (lowerTag.includes("oil free")) return excludes.some((item) => item.includes("oil")) || concerns.some((item) => item.includes("oil"));
    if (lowerTag.includes("fragrance")) return excludes.some((item) => item.includes("fragrance")) || compatibility.some((item) => item.includes("sensitive"));
    if (lowerTag.includes("hydrating")) return concerns.some((item) => item.includes("hydration")) || ingredients.some((item) => item.includes("hyaluronic") || item.includes("ceramide"));
    return false;
  };

  const filteredProducts = useMemo(() => {
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const category = searchParams.get("category");
    const baseProducts =
      mode === "personalized" && activeSkinType
        ? filterProductsForSkinType(products, activeSkinType, activeConcerns)
        : products;

    return baseProducts.filter((product) => {
      if (wishlistOnly && !wishlistSet?.has(product.id)) return false;
      const matchesSearch =
        !search ||
        matchesProductSearch(product, search) ||
        product.name.toLowerCase().includes(search) ||
        product.brand.toLowerCase().includes(search);
      const matchesCategory = !category || product.category === category;
      const matchesSkin =
        filters.skinTypes.length === 0 ||
        filters.skinTypes.some((skinType) => product.skinTypes.includes(skinType));
      const matchesConcern =
        filters.concerns.length === 0 ||
        filters.concerns.some((concern) => product.concerns.includes(concern));
      const matchesIncludeIngredient =
        filters.ingredientInclude.length === 0 ||
        filters.ingredientInclude.every((ingredient) => product.includeIngredients.includes(ingredient));
      const matchesExcludeIngredient = filters.ingredientExclude.every(
        (ingredient) => !product.includeIngredients.map((value) => value.toLowerCase()).includes(ingredient.toLowerCase())
      );
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
      const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesRating = product.rating >= filters.minRating;
      const matchesSmartTags =
        filters.smartTags.length === 0 || filters.smartTags.every((tag) => matchesSmartTag(product, tag));
      const matchesPersonalized =
        mode !== "personalized" ||
        !activeSkinType ||
        getBeautyMatchScore(product, activeSkinType, activeConcerns) >= 60;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSkin &&
        matchesConcern &&
        matchesIncludeIngredient &&
        matchesExcludeIngredient &&
        matchesPrice &&
        matchesBrand &&
        matchesRating &&
        matchesSmartTags &&
        matchesPersonalized
      );
    });
  }, [filters, products, searchParams, wishlistOnly, wishlistSet, activeSkinType, activeConcerns, mode]);

  const sortedProducts = useMemo(() => {
    const list = filteredProducts.map((product) => ({
      ...product,
      matchScore: getBeautyMatchScore(product, activeSkinType, activeConcerns),
      glowScore: getGlowScore(product),
      benefitTag: getBenefitTag(product)
    }));
    if (sortBy === "priceLowHigh") list.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHighLow") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newLaunches") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sortBy === "recommended") {
      list.sort((a, b) => {
        const matchDiff = b.matchScore - a.matchScore;
        if (matchDiff !== 0) return matchDiff;
        return profileScoreForProduct(b, skinProfile) - profileScoreForProduct(a, skinProfile);
      });
    }
    return list;
  }, [filteredProducts, sortBy, skinProfile, activeSkinType, activeConcerns]);

  const smartTags = ["Acne Safe", "Dermat Tested", "Fragrance Free", "Oil Free", "Hydrating"];

  const personalizedRecommendations = useMemo(() => {
    if (!activeSkinType) return [];
    return filterProductsForSkinType(products, activeSkinType, activeConcerns)
      .map((product) => ({
        ...product,
        matchScore: getBeautyMatchScore(product, activeSkinType, activeConcerns),
        glowScore: getGlowScore(product),
        benefitTag: getBenefitTag(product)
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 6);
  }, [products, activeSkinType, activeConcerns]);

  const routine = useMemo(() => {
    if (!activeSkinType) return null;
    return buildRoutine(products, activeSkinType);
  }, [products, activeSkinType]);

  const quickFilters = [
    {
      label: "Best for Acne",
      apply: () => setFilters((prev) => ({ ...prev, concerns: ["Acne"], skinTypes: [] }))
    },
    {
      label: "Best for Oily Skin",
      apply: () => setFilters((prev) => ({ ...prev, skinTypes: ["Oily"], concerns: [] }))
    },
    {
      label: "Best for Dry Skin",
      apply: () => setFilters((prev) => ({ ...prev, skinTypes: ["Dry"], concerns: [] }))
    },
    {
      label: "Trending Skincare Products",
      apply: () => {
        setSortBy("newLaunches");
        setFilters(defaultFilters);
      }
    },
    {
      label: "Most Loved by Customers",
      apply: () => {
        setSortBy("rating");
        setFilters(defaultFilters);
      }
    }
  ];

  const updateCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!category || category === activeCategory) {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category);
    }
    setSearchParams(nextParams);
  };

  const textureStrip = <div className="texture-strip my-4 md:my-6" aria-hidden="true" />;

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      <section className="catalogue-hero">
        <div className="catalogue-hero__content">
          <p className="catalogue-kicker">{wishlistOnly ? "Wishlist" : "Skinmatch Catalogue"}</p>
          <h1 className="catalogue-title">
            {wishlistOnly ? "Your saved essentials, all in one place." : "Premium ritual-ready essentials, curated for you."}
          </h1>
          <p className="catalogue-subtitle">
            {wishlistOnly
              ? "Keep track of what you love and revisit anytime."
              : "Explore elevated formulas, refined textures, and ingredient-led favourites."}
          </p>
          <div className="catalogue-metrics">
            <div>
              <p className="catalogue-metric-value">{products.length}</p>
              <p className="catalogue-metric-label">Products</p>
            </div>
            <div>
              <p className="catalogue-metric-value">{allBrands.length}</p>
              <p className="catalogue-metric-label">Brands</p>
            </div>
            <div>
              <p className="catalogue-metric-value">{categoryOptions.length}</p>
              <p className="catalogue-metric-label">Categories</p>
            </div>
          </div>
        </div>
        <div className="catalogue-hero__visual">
          <div className="catalogue-orb" aria-hidden="true" />
          <div className="catalogue-samples">
            {heroSamples.map((sample) => (
              <div key={sample.id} className="catalogue-sample">
                <img src={sample.images?.[0]} alt={sample.name} loading="lazy" />
              </div>
            ))}
          </div>
          <p className="catalogue-hero-caption">Handpicked launches and editor-grade classics.</p>
        </div>
      </section>

      <section className="catalogue-shell">
        <div className="catalogue-toolbar">
          <div>
            <h2 className="catalogue-section-title">{wishlistOnly ? "Wishlist Picks" : "Shop the Catalogue"}</h2>
            <p className="catalogue-section-subtitle">Refine by concern, ingredient, and ritual step.</p>
          </div>

          <div className="catalogue-toolbar-actions">
            <div className="catalogue-toggle">
              <button
                type="button"
                onClick={() => setMode("personalized")}
                className={`catalogue-toggle__btn ${mode === "personalized" ? "is-active" : ""}`}
              >
                Personalized ✨
              </button>
              <button
                type="button"
                onClick={() => setMode("explore")}
                className={`catalogue-toggle__btn ${mode === "explore" ? "is-active" : ""}`}
              >
                Explore All 🌍
              </button>
            </div>
            <button type="button" className="btn-secondary md:hidden" onClick={() => setShowFilters((prev) => !prev)}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFilters(defaultFilters)}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="catalogue-pill-row">
          <button
            type="button"
            onClick={() => updateCategory("")}
            className={`catalogue-pill ${activeCategory === "" ? "is-active" : ""}`}
          >
            All
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => updateCategory(category)}
              className={`catalogue-pill ${activeCategory === category ? "is-active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="catalogue-chip-row">
          {quickFilters.map((chip) => (
            <button key={chip.label} type="button" onClick={chip.apply} className="catalogue-chip">
              {chip.label}
            </button>
          ))}
          <label className="catalogue-sort">
            Sort
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="newLaunches">New launches</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </label>
        </div>

        <div className="catalogue-chip-row">
          {["Niacinamide", "Retinol", "Ceramides", "Hyaluronic Acid"].map((ingredient) => (
            <button
              key={ingredient}
              type="button"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  ingredientInclude: [ingredient]
                }))
              }
              className="ingredient-badge"
            >
              {ingredient}
            </button>
          ))}
        </div>

        <div className="catalogue-chip-row">
          {smartTags.map((tag) => {
            const active = filters.smartTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    smartTags: active ? prev.smartTags.filter((item) => item !== tag) : [...prev.smartTags, tag]
                  }))
                }
                className={`catalogue-chip ${active ? "catalogue-chip--active" : ""}`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {textureStrip}

        {activeSkinType ? (
          <section className="catalogue-personalized">
            <div>
              <p className="catalogue-kicker">Personalized Recommendations</p>
              <h3 className="catalogue-personalized__title">
                Recommended for your skin type: <span>{normalizeSkinType(activeSkinType)} Skin</span>
              </h3>
              <p className="catalogue-personalized__subtitle">
                Handpicked edits based on your answers, concerns, and ritual preferences.
              </p>
            </div>
            <div className="catalogue-grid">
              {personalizedRecommendations.map((product) => (
                <ProductCard
                  key={`personal-${product.id}`}
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={setQuickViewProduct}
                  isWishlisted={wishlistSet?.has(product.id)}
                  matchScore={product.matchScore}
                  glowScore={product.glowScore}
                  benefitTag={product.benefitTag}
                />
              ))}
            </div>
          </section>
        ) : null}

        {activeSkinType && routine ? (
          <section className="catalogue-routine">
            <div className="catalogue-routine__header">
              <div>
                <p className="catalogue-kicker">AI Routine Builder</p>
                <h3 className="catalogue-personalized__title">Your AI Skincare Routine</h3>
                <p className="catalogue-personalized__subtitle">Auto-built steps tailored to your skin profile.</p>
              </div>
              <Link to="/routine-builder" className="btn-secondary">
                Build My Routine Automatically
              </Link>
            </div>
            <div className="catalogue-routine__grid">
              {[
                { title: "Morning Routine ☀️", steps: routine.morning },
                { title: "Night Routine 🌙", steps: routine.night }
              ].map((block) => (
                <div key={block.title} className="catalogue-routine__card">
                  <h4>{block.title}</h4>
                  <div className="catalogue-routine__steps">
                    {block.steps.map((step) => (
                      <div key={step.label} className="catalogue-routine__step">
                        <span className="catalogue-routine__label">{step.label}</span>
                        {step.product ? (
                          <div className="catalogue-routine__product">
                            <img src={step.product.images?.[0]} alt={step.product.name} />
                            <div>
                              <p className="catalogue-routine__product-name">{step.product.name}</p>
                              <p className="catalogue-routine__meta">★ {step.product.rating}</p>
                            </div>
                            <button type="button" onClick={() => onAddToCart?.(step.product.id, 1)}>
                              Add
                            </button>
                          </div>
                        ) : (
                          <p className="catalogue-routine__placeholder">Curating a match for this step.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-12">
          <div className={`${showFilters ? "block" : "hidden"} lg:col-span-3 lg:block`}>
            <div className="catalogue-panel">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                allSkinTypes={allSkinTypes}
                allConcerns={allConcerns}
                allIngredients={allIngredients}
                allBrands={allBrands}
              />
            </div>
          </div>

          <div className="lg:col-span-9">
            <p className="catalogue-count">
              <strong>{sortedProducts.length}</strong> products found
            </p>

            {isLoading ? (
              <div className="catalogue-grid">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={`category-skeleton-${index}`} className="skeleton-card animate-pulse space-y-4">
                    <div className="h-36 rounded-lg bg-rose-100/70" />
                    <div className="space-y-2">
                      <div className="h-3 w-20 rounded-full bg-rose-100/80" />
                      <div className="h-4 w-full rounded-full bg-rose-100/80" />
                      <div className="h-3 w-1/2 rounded-full bg-rose-100/80" />
                    </div>
                    <div className="h-9 rounded-full bg-rose-100/80" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="catalogue-grid">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    onQuickView={setQuickViewProduct}
                    isWishlisted={wishlistSet?.has(product.id)}
                    matchScore={product.matchScore}
                    glowScore={product.glowScore}
                    benefitTag={product.benefitTag}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-8 text-center text-sm text-rose-900/70">
                No products match these filters right now.
              </div>
            )}
          </div>
        </div>
      </section>

      <QuickViewModal
        open={Boolean(quickViewProduct)}
        product={quickViewProduct}
        skinType={activeSkinType}
        skinConcerns={activeConcerns}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        isWishlisted={quickViewProduct ? wishlistSet?.has(quickViewProduct.id) : false}
      />
    </div>
  );
}

export default CategoryPage;
