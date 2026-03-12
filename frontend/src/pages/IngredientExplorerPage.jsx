import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const PRIORITY_INGREDIENTS = [
  "Niacinamide",
  "Retinol",
  "Vitamin C",
  "Ceramides",
  "Salicylic Acid",
  "Hyaluronic Acid"
];

const INGREDIENT_COPY = {
  niacinamide: {
    spotlight:
      "A balancing multi-tasker that helps regulate oil, improve texture, and support a healthy barrier.",
    benefits: ["Balances excess sebum", "Refines visible pores", "Improves uneven tone"],
    suitableSkinTypes: ["Oily", "Combination", "Sensitive"]
  },
  retinol: {
    spotlight:
      "A proven nighttime active that accelerates skin renewal for smoother, clearer, and firmer-looking skin.",
    benefits: ["Smooths fine lines", "Improves skin texture", "Supports breakout control"],
    suitableSkinTypes: ["Combination", "Normal", "Mature"]
  },
  "vitamin c": {
    spotlight:
      "A brightening antioxidant that helps fade dark spots and protect skin from daily environmental stress.",
    benefits: ["Boosts radiance", "Fades dark spots", "Protects against oxidative stress"],
    suitableSkinTypes: ["Normal", "Dry", "Combination"]
  },
  ceramides: {
    spotlight:
      "Barrier-supporting lipids that reduce moisture loss and help skin feel stronger, calmer, and deeply hydrated.",
    benefits: ["Strengthens skin barrier", "Locks in hydration", "Reduces dryness discomfort"],
    suitableSkinTypes: ["Dry", "Sensitive", "Normal"]
  },
  "salicylic acid": {
    spotlight:
      "An oil-soluble BHA that deeply clears pores, reduces congestion, and improves rough skin texture.",
    benefits: ["Unclogs pores", "Targets breakouts", "Smooths rough texture"],
    suitableSkinTypes: ["Oily", "Combination", "Acne-prone"]
  },
  "hyaluronic acid": {
    spotlight:
      "A hydration magnet that attracts water to skin, making it look plumper, softer, and healthier.",
    benefits: ["Delivers deep hydration", "Plumps skin appearance", "Supports moisture barrier"],
    suitableSkinTypes: ["Dry", "Sensitive", "All"]
  }
};

const INGREDIENT_THEMES = {
  niacinamide: {
    bubble: "from-rose-200 via-rose-100 to-white border-rose-200",
    text: "text-rose-700"
  },
  retinol: {
    bubble: "from-violet-200 via-fuchsia-100 to-white border-violet-200",
    text: "text-violet-700"
  },
  "vitamin c": {
    bubble: "from-amber-200 via-yellow-100 to-white border-amber-200",
    text: "text-amber-700"
  },
  ceramides: {
    bubble: "from-orange-200 via-rose-100 to-white border-orange-200",
    text: "text-orange-700"
  },
  "salicylic acid": {
    bubble: "from-emerald-200 via-lime-100 to-white border-emerald-200",
    text: "text-emerald-700"
  },
  "hyaluronic acid": {
    bubble: "from-sky-200 via-cyan-100 to-white border-sky-200",
    text: "text-sky-700"
  }
};

function normalizeIngredientName(value = "") {
  return value.trim().toLowerCase();
}

function dedupeStrings(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function IngredientExplorerPage({ ingredients, products }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedIngredient = searchParams.get("ingredient");
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const ingredientCatalog = useMemo(() => {
    const ingredientMap = new Map();

    ingredients.forEach((ingredient) => {
      const key = normalizeIngredientName(ingredient.name);
      ingredientMap.set(key, {
        name: ingredient.name,
        benefits: ingredient.benefits || [],
        suitableSkinTypes: ingredient.suitableSkinTypes || [],
        spotlightText: ingredient.spotlightText || ""
      });
    });

    products.forEach((product) => {
      (product.includeIngredients || []).forEach((ingredientName) => {
        const key = normalizeIngredientName(ingredientName);
        if (!ingredientMap.has(key)) {
          ingredientMap.set(key, {
            name: ingredientName,
            benefits: [],
            suitableSkinTypes: [],
            spotlightText: ""
          });
        }

        const existing = ingredientMap.get(key);
        existing.suitableSkinTypes = dedupeStrings([
          ...existing.suitableSkinTypes,
          ...(product.skinTypes || []).filter((skinType) => normalizeIngredientName(skinType) !== "all")
        ]);
      });
    });

    PRIORITY_INGREDIENTS.forEach((ingredientName) => {
      const key = normalizeIngredientName(ingredientName);
      if (!ingredientMap.has(key)) {
        ingredientMap.set(key, {
          name: ingredientName,
          benefits: [],
          suitableSkinTypes: [],
          spotlightText: ""
        });
      }
    });

    const enriched = [...ingredientMap.values()].map((ingredient) => {
      const key = normalizeIngredientName(ingredient.name);
      const defaults = INGREDIENT_COPY[key];
      const benefits = ingredient.benefits?.length ? ingredient.benefits : defaults?.benefits || ["Supports healthier-looking skin"];
      const suitableSkinTypes = ingredient.suitableSkinTypes?.length
        ? ingredient.suitableSkinTypes
        : defaults?.suitableSkinTypes || ["All"];
      const spotlightText =
        ingredient.spotlightText || defaults?.spotlight || `${ingredient.name} supports targeted skincare goals.`;

      return {
        ...ingredient,
        benefits: dedupeStrings(benefits),
        suitableSkinTypes: dedupeStrings(suitableSkinTypes),
        spotlightText
      };
    });

    const priorityIndex = (name) => PRIORITY_INGREDIENTS.findIndex((item) => item === name);
    return enriched.sort((left, right) => {
      const leftPriority = priorityIndex(left.name);
      const rightPriority = priorityIndex(right.name);
      if (leftPriority !== -1 || rightPriority !== -1) {
        if (leftPriority === -1) return 1;
        if (rightPriority === -1) return -1;
        return leftPriority - rightPriority;
      }
      return left.name.localeCompare(right.name);
    });
  }, [ingredients, products]);

  useEffect(() => {
    if (ingredientCatalog.length === 0) return;

    const requested = requestedIngredient
      ? ingredientCatalog.find(
          (item) => normalizeIngredientName(item.name) === normalizeIngredientName(requestedIngredient)
        )
      : null;
    const selectedExists = ingredientCatalog.some((item) => item.name === selectedIngredient);

    if (requested && requested.name !== selectedIngredient) {
      setSelectedIngredient(requested.name);
      return;
    }

    if (!selectedExists && ingredientCatalog[0]) {
      setSelectedIngredient(ingredientCatalog[0].name);
    }
  }, [ingredientCatalog, requestedIngredient, selectedIngredient]);

  const activeIngredient = ingredientCatalog.find((item) => item.name === selectedIngredient);

  const productCountByIngredient = useMemo(() => {
    const countMap = {};
    products.forEach((product) => {
      (product.includeIngredients || []).forEach((ingredientName) => {
        const key = normalizeIngredientName(ingredientName);
        countMap[key] = (countMap[key] || 0) + 1;
      });
    });
    return countMap;
  }, [products]);

  const relatedProducts = useMemo(() => {
    if (!activeIngredient) return [];
    return products
      .filter((product) =>
        (product.includeIngredients || []).some(
          (ingredientName) =>
            normalizeIngredientName(ingredientName) === normalizeIngredientName(activeIngredient.name)
        )
      )
      .sort((left, right) => Number(right.isBestSeller) - Number(left.isBestSeller) || right.rating - left.rating);
  }, [activeIngredient, products]);

  const commonUses = useMemo(() => {
    if (!activeIngredient) return [];
    return [...new Set(relatedProducts.map((product) => product.category))].slice(0, 4);
  }, [activeIngredient, relatedProducts]);

  const ingredientHeroImage = relatedProducts[0]?.images?.[0] || products[0]?.images?.[0] || "";

  const handleSelectIngredient = (ingredientName) => {
    setSelectedIngredient(ingredientName);
    const next = new URLSearchParams(searchParams);
    next.set("ingredient", ingredientName);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <section className="glass-card overflow-hidden p-4 md:p-6">
        <SectionHeader
          title="Ingredient Explorer"
          subtitle="Tap an ingredient bubble to open its profile with benefits, skin-type fit, and product matches."
        />

        <div className="relative mt-4">
          <div className="pointer-events-none absolute -left-10 -top-8 h-24 w-24 rounded-full bg-rose-200/50 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 bottom-2 h-28 w-28 rounded-full bg-amber-100/60 blur-2xl" />

          <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ingredientCatalog.slice(0, 10).map((ingredient, index) => {
              const key = normalizeIngredientName(ingredient.name);
              const theme = INGREDIENT_THEMES[key] || {
                bubble: "from-rose-100 via-orange-50 to-white border-rose-200",
                text: "text-rose-700"
              };
              const isActive = activeIngredient?.name === ingredient.name;

              return (
                <button
                  key={ingredient.name}
                  type="button"
                  onClick={() => handleSelectIngredient(ingredient.name)}
                  className={`group relative aspect-square rounded-full border bg-gradient-to-br p-3 text-center shadow-soft transition duration-300 hover:-translate-y-0.5 hover:shadow-card ${theme.bubble} ${
                    isActive ? "ring-2 ring-skin-gold/50" : "ring-0"
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                  aria-label={`Open ${ingredient.name} details`}
                >
                  <div className="flex h-full flex-col items-center justify-center">
                    <span className={`text-sm font-semibold leading-tight ${theme.text}`}>{ingredient.name}</span>
                    <span className="mt-2 text-[11px] font-medium text-rose-900/60">
                      {productCountByIngredient[key] || 0}{" "}
                      products
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {activeIngredient ? (
        <section className="glass-card overflow-hidden">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[280px] bg-skin-hero p-5 md:p-6">
              {ingredientHeroImage ? (
                <img
                  src={ingredientHeroImage}
                  alt={activeIngredient.name}
                  className="h-full w-full rounded-3xl object-cover shadow-card"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center rounded-3xl bg-white/70 text-sm font-medium text-rose-700/70">
                  No preview available
                </div>
              )}
              <div className="absolute bottom-8 left-8 rounded-2xl border border-white/80 bg-white/90 px-4 py-2 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700/75">Ingredient Focus</p>
                <p className="font-serif text-2xl font-semibold text-skin-ink">{activeIngredient.name}</p>
              </div>
            </div>

            <article className="space-y-5 p-5 md:p-7">
              <div>
                <h2 className="font-serif text-4xl font-semibold text-skin-ink">{activeIngredient.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-rose-900/75">{activeIngredient.spotlightText}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                  <h3 className="text-sm font-semibold text-skin-ink">Benefits</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/75">
                    {activeIngredient.benefits.slice(0, 4).map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4">
                  <h3 className="text-sm font-semibold text-skin-ink">Suitable Skin Types</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {activeIngredient.suitableSkinTypes.map((skinType) => (
                      <span
                        key={skinType}
                        className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-700"
                      >
                        {skinType}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-skin-ink">Common Uses</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(commonUses.length > 0 ? commonUses : ["Daily Routine", "Barrier Support"]).map((use) => (
                    <span key={use} className="ingredient-badge">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-skin-ink">Recommended Products</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {relatedProducts.slice(0, 4).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-16 rounded-xl object-cover transition group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">{product.brand}</p>
                        <p className="line-clamp-1 text-sm font-semibold text-skin-ink">{product.name}</p>
                        <p className="mt-1 text-xs font-medium text-rose-700">View Product →</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {relatedProducts.length === 0 ? (
                  <p className="mt-3 text-sm text-rose-900/70">We are curating product matches for this ingredient.</p>
                ) : null}
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <section className="glass-card p-4 md:p-6">
        <SectionHeader
          title="Ingredient-Matched Products"
          subtitle={activeIngredient ? `Discover products powered by ${activeIngredient.name}.` : "Discover product matches."}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProducts.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="h-44 overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="space-y-2 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-700/75">{product.brand}</p>
                <h3 className="line-clamp-2 text-sm font-semibold text-skin-ink">{product.name}</h3>
                <p className="text-xs text-rose-900/70">★ {product.rating} • {product.reviews} reviews</p>
                <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  View Product
                </span>
              </div>
            </Link>
          ))}
        </div>
        {relatedProducts.length === 0 ? (
          <p className="mt-4 text-sm text-rose-900/70">
            Select another ingredient bubble to explore recommendations.
          </p>
        ) : null}
      </section>
    </div>
  );
}

export default IngredientExplorerPage;
