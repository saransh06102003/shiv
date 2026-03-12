import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DiscoveryFeedCard from "../components/DiscoveryFeedCard";
import HorizontalScroller from "../components/HorizontalScroller";
import ProductCard from "../components/ProductCard";
import ReviewCard from "../components/ReviewCard";
import RoutineCard from "../components/RoutineCard";
import SectionHeader from "../components/SectionHeader";

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

const DISCOVERY_MODULES = [
  "Best for Acne",
  "Best for Oily Skin",
  "Best for Dry Skin",
  "Trending Skincare Products",
  "Most Loved by Customers"
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

const HOME_CATEGORIES = [
  { label: "Skincare", description: "Serums, moisturizers, SPF" },
  { label: "Makeup", description: "Lips, eyes, base" },
  { label: "Haircare", description: "Shampoo, masks, oils" },
  { label: "Fragrance", description: "Perfumes and mists" },
  { label: "Wellness", description: "Supplements & rituals" }
];

function normalizeIngredientCard(ingredient, ingredients) {
  const matched = ingredients.find((item) => item.name.toLowerCase() === ingredient.name.toLowerCase());
  return {
    name: ingredient.name,
    text: matched?.spotlightText || ingredient.fallback
  };
}

function HomePage({
  products,
  ingredients = [],
  featuredBrands,
  discoverySections,
  reviews = [],
  skinProfile,
  isLoading = false,
  onOpenQuiz,
  onAddToCart,
  onToggleWishlist,
  wishlistSet
}) {
  const heroSlides = useMemo(() => products.slice(0, 4), [products]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [heroSlides]);

  const bestSellers = useMemo(() => products.filter((item) => item.isBestSeller).slice(0, 12), [products]);
  const newLaunches = useMemo(() => products.filter((item) => item.isNew).slice(0, 12), [products]);
  const trendingProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const trendScoreA = Number(a.isBestSeller) * 2 + a.rating;
        const trendScoreB = Number(b.isBestSeller) * 2 + b.rating;
        return trendScoreB - trendScoreA;
      })
      .slice(0, 12);
  }, [products]);
  const beautyDeals = useMemo(
    () => [...products].sort((a, b) => b.discountPct - a.discountPct).slice(0, 12),
    [products]
  );
  const dermatologistPicks = useMemo(() => {
    const picks = products.filter((item) =>
      (item.tags || []).some((tag) => tag.toLowerCase().includes("dermatologist"))
    );
    if (picks.length > 0) return picks.slice(0, 12);
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 12);
  }, [products]);
  const customerReviews = useMemo(() => reviews.slice(0, 4), [reviews]);

  const personalized = useMemo(() => {
    if (!skinProfile) return [];
    return products
      .filter((product) => {
        const matchSkin = skinProfile.skinType ? product.skinTypes.includes(skinProfile.skinType) : false;
        const matchConcern = (skinProfile.skinConcerns || []).some((concern) => product.concerns.includes(concern));
        return matchSkin || matchConcern;
      })
      .slice(0, 4);
  }, [products, skinProfile]);

  const ingredientCards = useMemo(
    () => TRENDING_INGREDIENTS.map((ingredient) => normalizeIngredientCard(ingredient, ingredients)),
    [ingredients]
  );
  const discoveryFeed = useMemo(() => {
    const fallbackImage = products[0]?.images?.[0] || "/skinmatch-product.png";

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

  const activeHero = heroSlides[activeSlide] || products[0];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <section className="glass-card overflow-hidden p-6 md:p-8">
        <div className="layout-grid items-center">
          <div className="col-span-12 space-y-4 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-skin-gold">Premium Discovery</p>
            <h1 className="text-4xl font-bold leading-tight text-skin-ink md:text-5xl">
              Your best beauty match,
              <span className="block text-rose-600">curated to perfection.</span>
            </h1>
            <p className="max-w-md text-sm text-rose-900/70 md:text-base">
              Discover ingredient-first skincare, routine bundles, and on-trend launches made for your skin profile.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/category?search=Skincare" className="btn-primary">
                Shop Skincare
              </Link>
              <Link to="/category?search=Makeup" className="btn-secondary">
                Explore Makeup
              </Link>
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
            <Link to={`/product/${activeHero?.id}`} className="group relative block overflow-hidden rounded-[22px] bg-skin-hero p-5">
              <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-rose-700 shadow-soft">
                Limited-time glow bundle
              </div>
              <img
                src={activeHero?.images?.[0]}
                alt={activeHero?.name || "Featured product"}
                className="mx-auto h-80 w-full object-contain transition duration-500 group-hover:scale-105 motion-safe:animate-float"
                loading="eager"
                decoding="async"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-amber-200/50 bg-white/90 p-3 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700/80">{activeHero?.brand}</p>
                <p className="line-clamp-1 text-sm font-semibold text-skin-ink">{activeHero?.name}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Shop by Category" subtitle="Curated beauty aisles designed for you." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_CATEGORIES.map((category) => (
            <Link
              key={category.label}
              to={`/category?search=${encodeURIComponent(category.label)}`}
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700/80">{category.label}</p>
              <p className="mt-2 text-sm font-semibold text-skin-ink">{category.description}</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-skin-gold">Shop now →</span>
            </Link>
          ))}
        </div>
      </section>

      <HorizontalScroller
        title="Trending Products"
        subtitle="Top-rated favorites driving the buzz right now."
        products={trendingProducts}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Shop trending"
        actionLink="/category?search=trending"
      />

      <HorizontalScroller
        title="Best Sellers"
        subtitle="Most-loved skincare and beauty picks"
        products={bestSellers}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="See all"
        actionLink="/category"
      />

      <HorizontalScroller
        title="New Arrivals"
        subtitle="Fresh drops across skincare, makeup, and wellness"
        products={newLaunches}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="View all"
        actionLink="/category"
      />

      <HorizontalScroller
        title="Beauty Deals & Offers"
        subtitle="Best discounts hand-picked for you."
        products={beautyDeals}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="See offers"
        actionLink="/category?search=offers"
      />

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Customer Reviews" subtitle="Real results from the SkinMatch community." />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {customerReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      <section className="glass-card p-4 md:p-6">
        <SectionHeader
          title="Beauty Discovery Feed"
          subtitle="Scroll like a social feed to discover routines, trending products, tips, and ingredient education."
        />
        <div className="mx-auto mt-4 max-w-3xl space-y-4">
          {discoveryFeed.map((post) => (
            <DiscoveryFeedCard key={post.id} item={post} />
          ))}
        </div>
      </section>

      <section className="glass-card p-4 md:p-6">
        <SectionHeader
          title="Trending Ingredients"
          subtitle="Understand actives before you buy."
          action={
            <Link to="/ingredient-explorer" className="btn-secondary !px-4 !py-2">
              Explore
            </Link>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ingredientCards.map((ingredient) => (
            <Link
              key={ingredient.name}
              to={`/ingredient-explorer?ingredient=${encodeURIComponent(ingredient.name)}`}
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <h3 className="text-sm font-semibold text-skin-ink">{ingredient.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs text-rose-900/70">{ingredient.text}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-skin-gold">Ingredient Guide →</span>
            </Link>
          ))}
        </div>
      </section>

      <HorizontalScroller
        title="Dermatologist Picks"
        subtitle="Curated products trusted by experts"
        products={dermatologistPicks}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Explore"
        actionLink="/category?search=dermatologist"
      />

      <section className="glass-card p-4 md:p-6">
        <SectionHeader
          title="Skincare Routines"
          subtitle="Choose a routine path and start building your checklist."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ROUTINE_COLLECTIONS.map((routine) => (
            <RoutineCard
              key={routine.title}
              title={routine.title}
              description={routine.description}
              steps={routine.steps}
            />
          ))}
        </div>
      </section>

      {skinProfile && personalized.length > 0 ? (
        <section className="glass-card p-4 md:p-6">
          <SectionHeader title="Recommended For You" subtitle={`Matched for ${skinProfile.skinType} skin profile`} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {personalized.map((product) => (
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
      ) : null}

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Discovery Modules" subtitle="Explore by concern, skin type, and customer love." />
        <div className="flex flex-wrap gap-2">
          {DISCOVERY_MODULES.map((module) => (
            <Link
              key={module}
              to={`/category?search=${encodeURIComponent(module)}`}
              className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
            >
              {module}
            </Link>
          ))}
          {discoverySections.map((section) => (
            <Link
              key={section.title}
              to={`/category?search=${encodeURIComponent(section.title)}`}
              className="rounded-full border border-amber-200/60 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700"
            >
              {section.title}
            </Link>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {featuredBrands.slice(0, 10).map((brand) => (
            <Link
              key={brand}
              to={`/category?search=${encodeURIComponent(brand)}`}
              className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-orange-100 text-sm font-bold text-rose-700">
                {brand.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-rose-900/80">{brand}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
