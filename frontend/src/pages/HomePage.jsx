import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DiscoveryFeedCard from "../components/DiscoveryFeedCard";
import HorizontalScroller from "../components/HorizontalScroller";
import SectionHeader from "../components/SectionHeader";
import BrandLogo from "../components/BrandLogo";
import PackagingShowcase from "../components/PackagingShowcase";
import { featuredBrands } from "../data/mockData";
import { brandLogos } from "../data/brandAssets";
import { filterProductsForSkinType } from "../lib/personalization";

const TRENDING_INGREDIENTS = [
  {
    name: "Niacinamide",
    fallback: "Controls excess oil, refines pores, and supports balanced skin tone."
  },
  {
    name: "Retinol",
    fallback: "Boosts renewal for smoother texture and visible anti-aging benefits."
  },
  {
    name: "Vitamin C",
    fallback: "Brightens dull skin and helps reduce dark spots with antioxidant support."
  },
  {
    name: "Ceramides",
    fallback: "Strengthens your skin barrier and improves hydration retention."
  },
  {
    name: "Hyaluronic Acid",
    fallback: "Delivers deep hydration for plump, healthy-looking skin."
  }
];

const ROUTINE_COLLECTIONS = [
  {
    title: "Morning Routine",
    description: "Build your daytime essentials for glow and protection.",
    steps: ["Cleanser", "Serum", "Moisturizer", "Sunscreen"]
  },
  {
    title: "Night Routine",
    description: "Repair and replenish with active nighttime skincare.",
    steps: ["Cleanser", "Treatment", "Moisturizer"]
  },
  {
    title: "Acne Care Routine",
    description: "Target breakouts with balancing and calming actives.",
    steps: ["Salicylic", "Niacinamide", "Barrier Cream"]
  },
  {
    title: "Hydration Routine",
    description: "Layer moisture and lock hydration for soft skin.",
    steps: ["Hydrating Cleanser", "Hyaluronic", "Ceramide Cream"]
  }
];

const BEAUTY_TIP_POSTS = [
  {
    title: "How to Layer Skincare Correctly",
    description: "Start with lightweight products, then lock in hydration with richer textures.",
    kicker: "Beauty Tips",
    meta: "Routine-friendly for all skin types",
    ctaLabel: "Learn More",
    ctaLink: "/routine-builder"
  },
  {
    title: "Morning vs Night Routine Essentials",
    description: "Focus on antioxidant + SPF in the morning and treatment + repair at night.",
    kicker: "Beauty Tips",
    meta: "Great for beginners",
    ctaLabel: "Learn More",
    ctaLink: "/routine-builder"
  }
];

const HERO_HIGHLIGHTS = [
  "Curated beauty rituals",
  "Derm-tested essentials",
  "Luxury-grade formulas"
];

const EDITORIAL_STORIES = [
  {
    title: "Summer Glow Edit",
    description: "Lightweight hydration and radiant finishes for warm days.",
    category: "Serums",
    ctaLabel: "Shop glow",
    ctaLink: "/category?search=Serums",
    accent: "from-rose-100 via-pink-50 to-amber-100/80"
  },
  {
    title: "Makeup Capsule Wardrobe",
    description: "Everything you need for a soft matte, polished look.",
    category: "Makeup",
    ctaLabel: "Shop makeup",
    ctaLink: "/category?search=Makeup",
    accent: "from-amber-100/70 via-rose-50 to-pink-100"
  },
  {
    title: "Barrier Reset Ritual",
    description: "Gentle cleansers and moisture-locking creams for balance.",
    category: "Moisturizers",
    ctaLabel: "Shop moisture",
    ctaLink: "/category?search=Moisturizers",
    accent: "from-emerald-50 via-rose-50/40 to-rose-100/60"
  }
];

const HOME_CATEGORIES = [
  {
    label: "Makeup Staples",
    description: "Foundations, lips, eyes",
    search: "Makeup",
    image: "/pdf-products/product-14.jpg",
    accent: "from-rose-50 via-rose-100/60 to-pink-100"
  },
  {
    label: "Cleansing Rituals",
    description: "Daily face wash essentials",
    search: "Cleansers",
    image: "/pdf-products/product-26.jpg",
    accent: "from-amber-50 via-rose-50/40 to-rose-100/70"
  },
  {
    label: "Serum Treatments",
    description: "Targeted glow + hydration",
    search: "Serums",
    image: "/pdf-products/product-18.jpg",
    accent: "from-sky-50 via-blue-50/60 to-rose-100/60"
  },
  {
    label: "Moisture Lock",
    description: "Creams + eye gels",
    search: "Moisturizers",
    image: "/pdf-products/product-21.jpg",
    accent: "from-emerald-50 via-rose-50/40 to-rose-100/60"
  },
  {
    label: "Sun Protection",
    description: "SPF 50 daily shield",
    search: "Sunscreen",
    image: "/pdf-products/product-08.jpg",
    accent: "from-orange-50 via-amber-50/60 to-rose-100/70"
  },
  {
    label: "Haircare Essentials",
    description: "Nourishing hair oils",
    search: "Haircare",
    image: "/pdf-products/product-25.jpg",
    accent: "from-lime-50 via-emerald-50/50 to-rose-100/60"
  }
];

const LUXURY_CATEGORIES = [
  {
    label: "Makeup",
    description: "Runway pigments and velvet finishes.",
    search: "Makeup",
    image: "/pdf-products/product-14.jpg",
    accent: "from-rose-200/70 via-pink-100 to-orange-100"
  },
  {
    label: "Skincare",
    description: "Glow rituals and barrier care.",
    search: "Skincare",
    image: "/pdf-products/product-18.jpg",
    accent: "from-amber-100/60 via-rose-100 to-rose-50"
  },
  {
    label: "Clean Beauty",
    description: "Ingredient-first daily essentials.",
    search: "Cleansers",
    image: "/pdf-products/product-26.jpg",
    accent: "from-emerald-100/60 via-lime-50 to-rose-50"
  },
  {
    label: "Korean Skincare",
    description: "Hydration-forward K-beauty edits.",
    search: "Serums",
    image: "/new-products/keynote-01.jpg",
    accent: "from-sky-100/60 via-blue-50 to-rose-50"
  },
  {
    label: "Luxury Beauty",
    description: "Premium formulas and sensorial textures.",
    search: "Moisturizers",
    image: "/pdf-products/product-21.jpg",
    accent: "from-violet-100/60 via-fuchsia-50 to-rose-50"
  }
];

const BRAND_TAGLINES = {
  Maybelline: "Runway-inspired makeup icons",
  Lakme: "Everyday glam essentials",
  "L'Oreal Paris": "Parisian beauty power",
  MAC: "Artist-approved pigments",
  "The Ordinary": "Ingredient-first skincare",
  Cetaphil: "Dermatologist-loved care",
  Mamaearth: "Botanical daily care",
  COSRX: "K-beauty cult essentials",
  Laneige: "Hydration-first luxury",
  Innisfree: "Island-sourced botanicals",
  "Dot & Key": "Brightening everyday rituals",
  Neutrogena: "Clinical daily skincare",
  "The Face Shop": "Herbal glow rituals",
  "Beauty of Joseon": "Hanbang heritage skincare"
};

const BRAND_LOGOS = featuredBrands
  .map((name) => ({ name, src: brandLogos[name] }))
  .filter((item) => item.src);

function TextureStrip() {
  return <div className="texture-strip my-4 md:my-6" aria-hidden="true" />;
}

function normalizeIngredientCard(ingredient, ingredients) {
  const matched = ingredients.find((item) => item.name.toLowerCase() === ingredient.name.toLowerCase());
  return {
    name: ingredient.name,
    text: matched?.spotlightText || ingredient.fallback
  };
}

function HomePage({
  products,
  skinProfile,
  ingredients = [],
  isLoading = false,
  onAddToCart,
  onToggleWishlist,
  wishlistSet,
  onOpenAnalyzer
}) {
  const heroSlides = useMemo(() => products.slice(0, 4), [products]);
  const [activeSlide, setActiveSlide] = useState(0);
  const fallbackImage = products[0]?.images?.[0] || "/pdf-products/product-01.jpg";

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [heroSlides]);

  const bestSellers = useMemo(() => products.filter((item) => item.isBestSeller).slice(0, 12), [products]);
  const activeSkinType =
    skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "";
  const activeConcerns = skinProfile?.skinConcerns || [];
  const trendingProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const trendScoreA = Number(a.isBestSeller) * 2 + a.rating;
        const trendScoreB = Number(b.isBestSeller) * 2 + b.rating;
        return trendScoreB - trendScoreA;
      })
      .slice(0, 12);
  }, [products]);
  const recommendedForYou = useMemo(() => {
    if (!activeSkinType) return bestSellers;
    const curated = filterProductsForSkinType(products, activeSkinType, activeConcerns);
    return (curated.length ? curated : bestSellers).slice(0, 12);
  }, [products, activeSkinType, activeConcerns, bestSellers]);
  const concernHighlights = useMemo(() => {
    const concernKeywords = ["acne", "dark", "dry", "oil", "sensitive", "anti"];
    const filtered = products.filter((product) =>
      product.concerns?.some((concern) => concernKeywords.some((key) => concern.toLowerCase().includes(key)))
    );
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const skinTypeHighlights = useMemo(() => {
    const types = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
    const filtered = products.filter((product) =>
      product.skinTypes?.some((skinType) => types.includes(skinType))
    );
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const routineEssentials = useMemo(() => {
    const steps = ["Cleanse", "Treat", "Moisturize", "Protect"];
    const filtered = products.filter((product) => steps.includes(product.routineStep));
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const koreanSkincare = useMemo(() => {
    const koreanBrands = ["COSRX", "Innisfree", "Laneige", "Beauty of Joseon", "The Face Shop"];
    const filtered = products.filter((product) => koreanBrands.includes(product.brand));
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const luxurySkincare = useMemo(() => {
    const filtered = products.filter((product) => product.price >= 1500);
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const under1000Deals = useMemo(() => {
    const filtered = products.filter((product) => product.price <= 1000);
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);
  const customerFavorites = useMemo(() => {
    const filtered = products.filter((product) => product.rating >= 4.5 || product.isBestSeller);
    return (filtered.length ? filtered : products).slice(0, 12);
  }, [products]);

  const editorialStories = useMemo(() => {
    return EDITORIAL_STORIES.map((story, index) => {
      const matched = products.find((product) => product.category === story.category) || products[index];
      return {
        ...story,
        image: matched?.images?.[0] || fallbackImage
      };
    });
  }, [products, fallbackImage]);

  const brandSpotlight = useMemo(() => {
    const seen = new Set();
    return products
      .filter((product) => {
        if (!product.brand || seen.has(product.brand)) return false;
        seen.add(product.brand);
        return true;
      })
      .slice(0, 7)
      .map((product) => ({
        brand: product.brand,
        image: product.images?.[0] || fallbackImage,
        tagline: BRAND_TAGLINES[product.brand] || "Signature beauty edit"
      }));
  }, [products, fallbackImage]);

  const discoveryFeed = useMemo(() => {
    const routines = ROUTINE_COLLECTIONS.map((routine) => {
      const routineKey = routine.title.toLowerCase();
      let routineProduct = products.find((product) => product.routineStep === "Protect");
      if (routineKey.includes("night")) {
        routineProduct = products.find((product) => product.routineStep === "Treat");
      } else if (routineKey.includes("acne")) {
        routineProduct = products.find((product) =>
          product.concerns.some((concern) => concern.toLowerCase().includes("acne"))
        );
      } else if (routineKey.includes("hydration")) {
        routineProduct = products.find((product) =>
          product.concerns.some((concern) => concern.toLowerCase().includes("dry"))
        );
      }

      return {
        id: `feed-routine-${routine.title}`,
        type: "routine",
        kicker: routine.title,
        title: `${routine.title} Guide`,
        description: routine.description,
        meta: routine.steps.join(" • "),
        image: routineProduct?.images?.[0] || fallbackImage,
        ctaLabel: "Learn More",
        ctaLink: "/routine-builder"
      };
    });

    const trendingProductsFeed = [...products]
      .sort((a, b) => {
        const bestSellerDelta = Number(b.isBestSeller) - Number(a.isBestSeller);
        if (bestSellerDelta !== 0) return bestSellerDelta;
        return b.rating - a.rating;
      })
      .slice(0, 4)
      .map((product) => ({
        id: `feed-product-${product.id}`,
        type: "product",
        kicker: product.brand,
        title: product.name,
        description: product.description,
        meta: `★ ${product.rating} • ${product.reviews} reviews • ${product.discountPct}% off`,
        image: product.images?.[0] || fallbackImage,
        ctaLabel: "View Product",
        ctaLink: `/product/${product.id}`
      }));

    const ingredientEducationFeed = TRENDING_INGREDIENTS.slice(0, 4).map((ingredient) => {
      const related = products.find((product) =>
        product.includeIngredients.some((value) => value.toLowerCase().includes(ingredient.name.toLowerCase()))
      );
      return {
        id: `feed-ingredient-${ingredient.name}`,
        type: "ingredient",
        kicker: ingredient.name,
        title: `${ingredient.name} Explained`,
        description: normalizeIngredientCard(ingredient, ingredients).text,
        meta: related ? `Found in ${related.brand} ${related.name}` : "Ingredient-first product discovery",
        image: related?.images?.[0] || fallbackImage,
        ctaLabel: "Learn More",
        ctaLink: `/ingredient-explorer?ingredient=${encodeURIComponent(ingredient.name)}`
      };
    });

    const tipFeed = BEAUTY_TIP_POSTS.map((tip, index) => ({
      ...tip,
      id: `feed-tip-${index + 1}`,
      type: "tip",
      image: products[(index + 2) % products.length]?.images?.[0] || fallbackImage
    }));

    const feed = [];
    const maxLength = Math.max(
      routines.length,
      trendingProductsFeed.length,
      ingredientEducationFeed.length,
      tipFeed.length
    );

    for (let index = 0; index < maxLength; index += 1) {
      if (routines[index]) feed.push(routines[index]);
      if (trendingProductsFeed[index]) feed.push(trendingProductsFeed[index]);
      if (ingredientEducationFeed[index]) feed.push(ingredientEducationFeed[index]);
      if (tipFeed[index]) feed.push(tipFeed[index]);
    }

    return feed.slice(0, 10);
  }, [products, ingredients]);
  const guideFeed = useMemo(() => discoveryFeed.filter((item) => item.type === "tip").slice(0, 3), [discoveryFeed]);

  const activeHero = heroSlides[activeSlide] || products[0];

  return (
    <div className="space-y-10 pb-20 md:space-y-12 md:pb-8">
      <section className="glass-card overflow-hidden p-7 md:p-10">
        <div className="layout-grid items-center">
          <div className="col-span-12 space-y-5 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-skin-gold">Beauty Intelligence</p>
            <h1 className="text-4xl font-bold leading-tight text-skin-ink md:text-5xl">
              Discover what your skin truly needs
              <span className="block text-rose-600">with AI-powered rituals.</span>
            </h1>
            <p className="max-w-md text-sm text-rose-900/70 md:text-base">
              Luxury-grade skincare and intelligent matching that feels curated, personal, and endlessly inspiring.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={onOpenAnalyzer} className="btn-primary">
                Analyze My Skin
              </button>
              <Link to="/category" className="btn-secondary">
                Explore Products
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {HERO_HIGHLIGHTS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700/80"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition ${
                    index === activeSlide ? "w-8 bg-skin-gold" : "w-2.5 bg-rose-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <Link
              to={`/product/${activeHero?.id}`}
              className="group relative block overflow-hidden rounded-[26px] bg-skin-hero p-6"
            >
              <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-rose-700 shadow-soft">
                Editor&apos;s spotlight
              </div>
              <div className="product-spotlight" />
              <img
                src={activeHero?.images?.[0]}
                alt={activeHero?.name || "Featured product"}
                className="product-image mx-auto h-80 w-full object-contain transition duration-500 group-hover:scale-105 motion-safe:animate-float"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-amber-200/50 bg-white/90 p-3 backdrop-blur">
                <BrandLogo brand={activeHero?.brand} showName className="brand-mark--hero" imgClassName="brand-mark__img--sm" />
                <p className="line-clamp-1 text-sm font-semibold text-skin-ink">{activeHero?.name}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <TextureStrip />

      <PackagingShowcase
        title="Our Signature Packaging"
        subtitle="Magnetic gift boxes, silk wraps, and a beauty card that turns every order into a memorable ritual."
      />

      <TextureStrip />

      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Luxury Category Edit" subtitle="Aesthetic beauty aisles designed for discovery." />
        <div className="luxury-category-grid">
          {LUXURY_CATEGORIES.map((category) => (
            <Link
              key={category.label}
              to={`/category?search=${encodeURIComponent(category.search)}`}
              className="luxury-category-card"
            >
              <div className={`luxury-category-card__bg bg-gradient-to-br ${category.accent}`} />
              <img src={category.image} alt={category.label} />
              <div className="luxury-category-card__content">
                <p>{category.label}</p>
                <span>{category.description}</span>
                <em>Explore →</em>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TextureStrip />

      <section className="glass-card p-5 md:p-7">
        <SectionHeader title="Shop by Category" subtitle="Curated beauty aisles designed for you." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {HOME_CATEGORIES.map((category) => (
            <Link
              key={category.label}
              to={`/category?search=${encodeURIComponent(category.search)}`}
              className="group relative overflow-hidden rounded-[22px] border border-rose-100 bg-white/90 p-5 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.accent}`} />
              <img
                src={category.image}
                alt={category.label}
                className="product-image absolute -right-6 bottom-0 h-28 w-28 opacity-90 transition duration-500 group-hover:scale-110"
              />
              <div className="relative space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700/80">
                  {category.label}
                </p>
                <p className="text-sm font-semibold text-skin-ink">{category.description}</p>
                <span className="inline-flex text-xs font-semibold text-skin-gold">Shop now →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TextureStrip />

      <section className="glass-card bg-white/90 p-5 md:p-7">
        <SectionHeader title="Brand Houses" subtitle="The most loved names in beauty, now in one place." />
        <div className="flex flex-wrap items-center justify-center gap-4 md:flex-nowrap md:justify-between">
          {BRAND_LOGOS.map((logo) => (
            <div key={logo.name} className="brand-logo-card">
              <img src={logo.src} alt={`${logo.name} logo`} className="brand-logo-img" />
            </div>
          ))}
        </div>
      </section>

      <TextureStrip />

      <section className="glass-card bg-white/90 p-5 md:p-7">
        <SectionHeader title="Beauty Stories" subtitle="Editorial edits curated for every mood." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {editorialStories.map((story) => (
            <article
              key={story.title}
              className="group relative overflow-hidden rounded-[24px] border border-rose-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${story.accent}`} />
              <img
                src={story.image}
                alt={story.title}
                className="product-image absolute -right-6 bottom-0 h-32 w-32 opacity-90 transition duration-500 group-hover:scale-110"
              />
              <div className="relative space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700/80">Beauty Story</p>
                <h3 className="text-lg font-semibold text-skin-ink">{story.title}</h3>
                <p className="text-sm text-rose-900/70">{story.description}</p>
                <Link to={story.ctaLink} className="inline-flex text-xs font-semibold text-skin-gold">
                  {story.ctaLabel} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="full-bleed quote-block bg-rose-50/70 py-8 md:py-10">
        <div className="quote-watermark">atelier</div>
        <div className="layout-container text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-700/70">Editorial Note</p>
          <blockquote className="mt-4 text-2xl font-semibold text-skin-ink md:text-3xl">
            <span className="font-serif">
              “Beauty is the quiet confidence of a ritual that fits you.”
            </span>
          </blockquote>
          <p className="mt-4 text-sm text-rose-900/70">— SkinMatch Beauty Atelier</p>
        </div>
      </section>

      <TextureStrip />

      <section className="glass-card bg-rose-50/60 p-5 md:p-7">
        <SectionHeader title="Brand Spotlight" subtitle="The most-loved names in beauty, curated for you." />
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hidden">
          {brandSpotlight.map((brand) => (
            <Link
              key={brand.brand}
              to={`/category?search=${encodeURIComponent(brand.brand)}`}
              className="group relative min-w-[220px] overflow-hidden rounded-[22px] border border-rose-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/60 to-rose-100/80" />
              <img
                src={brand.image}
                alt={brand.brand}
                className="product-image absolute -right-4 bottom-0 h-20 w-20 opacity-80 transition duration-500 group-hover:scale-110"
              />
              <div className="relative space-y-2">
                <BrandLogo brand={brand.brand} showName className="brand-mark--card" imgClassName="brand-mark__img--xs" />
                <p className="text-sm font-semibold text-skin-ink">{brand.tagline}</p>
                <span className="inline-flex text-xs font-semibold text-skin-gold">Shop brand →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <TextureStrip />

      <section className="glass-card bg-rose-50/60 p-5 md:p-7">
        <SectionHeader
          title="Beauty Discover"
          subtitle="Trending rituals and curated edits to explore next."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {discoveryFeed.map((post) => (
            <DiscoveryFeedCard key={post.id} item={post} />
          ))}
        </div>
      </section>

      <HorizontalScroller
        title="Trending Products"
        subtitle="Best-selling, viral, and highly rated right now."
        products={trendingProducts}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Shop trending"
        actionLink="/category?search=trending"
      />

      <HorizontalScroller
        title="Recommended For You"
        subtitle={activeSkinType ? `Curated for ${activeSkinType} skin` : "AI-picked essentials for every routine."}
        products={recommendedForYou}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="View recommendations"
        actionLink="/category"
      />

      <HorizontalScroller
        title="Shop By Skin Concern"
        subtitle="Acne, dark spots, dryness, and oil control edits."
        products={concernHighlights}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Explore concerns"
        actionLink="/catalog"
      />

      <HorizontalScroller
        title="Shop By Skin Type"
        subtitle="Oily, dry, combination, sensitive, or normal."
        products={skinTypeHighlights}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Find your match"
        actionLink="/catalog"
      />

      <HorizontalScroller
        title="Routine Essentials"
        subtitle="Cleanse, treat, moisturize, and protect."
        products={routineEssentials}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Build routine"
        actionLink="/routine-builder"
      />

      <HorizontalScroller
        title="Korean Skincare"
        subtitle="K-beauty favorites for glass skin glow."
        products={koreanSkincare}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Shop K-beauty"
        actionLink="/category?search=Korean"
      />

      <HorizontalScroller
        title="Luxury Skincare"
        subtitle="Premium formulas and sensorial textures."
        products={luxurySkincare}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Explore luxury"
        actionLink="/category?search=Luxury"
      />

      <HorizontalScroller
        title="Under ₹1000 Deals"
        subtitle="Luxury picks that stay within budget."
        products={under1000Deals}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Shop deals"
        actionLink="/category?search=Under%201000"
      />

      <HorizontalScroller
        title="Customer Favorites"
        subtitle="Top-rated essentials loved by the community."
        products={customerFavorites}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Browse favorites"
        actionLink="/category?search=best"
      />

      <section className="glass-card bg-white/90 p-5 md:p-7">
        <SectionHeader title="Beauty Guides" subtitle="Editorial reads designed for your routine." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guideFeed.map((post) => (
            <DiscoveryFeedCard key={post.id} item={post} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
