import { useMemo } from "react";
import { Link } from "react-router-dom";
import HorizontalScroller from "../components/HorizontalScroller";
import SectionHeader from "../components/SectionHeader";
import { filterProductsForSkinType } from "../lib/personalization";

const CATEGORY_ITEMS = [
  { label: "Skincare", search: "Skincare", description: "Glow rituals + barrier care" },
  { label: "Makeup", search: "Makeup", description: "Complexion + lip edits" },
  { label: "Haircare", search: "Haircare", description: "Nourishing oils + masks" },
  { label: "Body Care", search: "Body", description: "Soft, luminous skin" }
];

const CONCERN_ITEMS = [
  { label: "Acne", search: "Acne", description: "Clarify and calm", link: "/category?concern=Acne" },
  { label: "Dark Spots", search: "Dark Spots", description: "Brightening targets", link: "/category?concern=Dark%20Spots" },
  { label: "Dry Skin", search: "Dry", description: "Deep hydration", link: "/category?concern=Dry%20Skin" },
  { label: "Oil Control", search: "Oil", description: "Balance + matte", link: "/category?concern=Oil%20Control" },
  { label: "Sensitive", search: "Sensitive", description: "Soothe and protect", link: "/category?concern=Sensitive%20Skin" },
  { label: "Anti Aging", search: "Anti Aging", description: "Lift + firm", link: "/category?concern=Anti%20Aging" }
];

const SKIN_TYPE_ITEMS = [
  { label: "Oily", search: "Oily", description: "Oil balancing", link: "/category?skinType=Oily" },
  { label: "Dry", search: "Dry", description: "Moisture rich", link: "/category?skinType=Dry" },
  { label: "Combination", search: "Combination", description: "Multi-zone care", link: "/category?skinType=Combination" },
  { label: "Sensitive", search: "Sensitive", description: "Comfort-first", link: "/category?skinType=Sensitive" },
  { label: "Normal", search: "Normal", description: "Daily maintenance", link: "/category?skinType=Normal" }
];

const ROUTINE_ITEMS = [
  { label: "Cleanser", search: "Cleansers", description: "Prep the canvas" },
  { label: "Toner", search: "Toner", description: "Balance + refine" },
  { label: "Serum", search: "Serums", description: "Targeted actives" },
  { label: "Moisturizer", search: "Moisturizers", description: "Hydration lock" },
  { label: "Sunscreen", search: "Sunscreen", description: "Daily protection" },
  { label: "Mask", search: "Masks", description: "Weekly reset" }
];

const INGREDIENT_ITEMS = [
  { label: "Niacinamide", search: "Niacinamide", description: "Pore refining", link: "/category?ingredient=Niacinamide" },
  { label: "Salicylic Acid", search: "Salicylic", description: "Acne care", link: "/category?ingredient=Salicylic%20Acid" },
  { label: "Hyaluronic Acid", search: "Hyaluronic", description: "Plump hydration", link: "/category?ingredient=Hyaluronic%20Acid" },
  { label: "Vitamin C", search: "Vitamin C", description: "Brightening", link: "/category?ingredient=Vitamin%20C" },
  { label: "Retinol", search: "Retinol", description: "Renewal", link: "/category?ingredient=Retinol" },
  { label: "Ceramides", search: "Ceramides", description: "Barrier support", link: "/category?ingredient=Ceramides" }
];

const PRICE_ITEMS = [
  { label: "Under ₹500", search: "price-0-500", description: "Entry luxuries", link: "/category?price=0-500" },
  { label: "₹500 - ₹1000", search: "price-500-1000", description: "Daily favorites", link: "/category?price=500-1000" },
  { label: "₹1000 - ₹2000", search: "price-1000-2000", description: "Prestige edits", link: "/category?price=1000-2000" },
  { label: "₹2000+", search: "price-2000-plus", description: "Iconic formulas", link: "/category?price=2000-plus" }
];

function CatalogTile({ item, image }) {
  return (
    <Link
      to={item.link || `/category?search=${encodeURIComponent(item.search)}`}
      className="group relative overflow-hidden rounded-[22px] border border-rose-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white via-rose-50/60 to-rose-100/70" />
      {image ? (
        <img
          src={image}
          alt={item.label}
          className="product-image absolute -right-5 bottom-0 h-24 w-24 opacity-90 transition duration-500 group-hover:scale-110"
        />
      ) : null}
      <div className="relative space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700/80">{item.label}</p>
        <p className="text-sm font-semibold text-skin-ink">{item.description}</p>
        <span className="inline-flex text-xs font-semibold text-skin-gold">Explore →</span>
      </div>
    </Link>
  );
}

function CatalogSection({ title, subtitle, items, getImage }) {
  return (
    <section className="glass-card bg-white/90 p-5 md:p-7">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <CatalogTile key={item.label} item={item} image={getImage(item)} />
        ))}
      </div>
    </section>
  );
}

function CatalogPage({ products, skinProfile, onAddToCart, onToggleWishlist, wishlistSet, isLoading = false }) {
  const fallbackImage = products[0]?.images?.[0] || "/pdf-products/product-01.jpg";
  const skinType = skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "";

  const recommended = useMemo(() => {
    if (!skinType) return products.slice(0, 12);
    return filterProductsForSkinType(products, skinType, skinProfile?.skinConcerns || []).slice(0, 12);
  }, [products, skinProfile, skinType]);

  const resolveImage = (search) => {
    const lower = search.toLowerCase();
    const match = products.find((product) =>
      [product.name, product.brand, product.category, product.routineStep]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(lower))
    );
    return match?.images?.[0] || fallbackImage;
  };

  const priceImage = (item) => {
    if (item.search.includes("0-500")) return resolveImage("Cleansers");
    if (item.search.includes("500-1000")) return resolveImage("Serums");
    if (item.search.includes("1000-2000")) return resolveImage("Moisturizers");
    return resolveImage("Sunscreen");
  };

  return (
    <div className="space-y-8 pb-20 md:pb-10">
      <section className="glass-card overflow-hidden p-6 md:p-8">
        <div className="layout-grid items-center">
          <div className="col-span-12 space-y-4 lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-skin-gold">Explore</p>
            <h1 className="text-3xl font-bold text-skin-ink md:text-4xl">
              Explore the SkinMatch catalog by concern, ingredient, and ritual.
            </h1>
            <p className="text-sm text-rose-900/70">
              Use smart discovery paths to find products that fit your skin, your routine, and your budget.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/skin-analyzer" className="btn-primary">Analyze My Skin</Link>
              <Link to="/category" className="btn-secondary">Browse All Products</Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="relative overflow-hidden rounded-[26px] bg-white/95 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-white to-amber-50/70" />
              <img
                src={fallbackImage}
                alt="Catalog highlight"
                className="product-image relative mx-auto h-60 w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <CatalogSection
        title="Shop by Category"
        subtitle="Skincare, makeup, haircare, and body rituals."
        items={CATEGORY_ITEMS}
        getImage={(item) => resolveImage(item.search)}
      />

      <CatalogSection
        title="Shop by Skin Concern"
        subtitle="Precision edits for your current skin goals."
        items={CONCERN_ITEMS}
        getImage={(item) => resolveImage(item.search)}
      />

      <CatalogSection
        title="Shop by Skin Type"
        subtitle="Build a routine made for your skin profile."
        items={SKIN_TYPE_ITEMS}
        getImage={(item) => resolveImage(item.search)}
      />

      <CatalogSection
        title="Routine-Based Catalogues"
        subtitle="Create a full ritual from cleanse to protect."
        items={ROUTINE_ITEMS}
        getImage={(item) => resolveImage(item.search)}
      />

      <CatalogSection
        title="Shop by Ingredient"
        subtitle="Ingredient-led discovery with intelligent filtering."
        items={INGREDIENT_ITEMS}
        getImage={(item) => resolveImage(item.search)}
      />

      <CatalogSection
        title="Shop by Price"
        subtitle="Luxury edits for every budget tier."
        items={PRICE_ITEMS}
        getImage={priceImage}
      />

      <HorizontalScroller
        title={skinType ? "Recommended For Your Skin" : "Catalog Highlights"}
        subtitle={skinType ? `Curated for ${skinType} skin` : "Best-in-class products from the SkinMatch vault."}
        products={recommended}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistSet={wishlistSet}
        isLoading={isLoading}
        actionLabel="Explore catalog"
        actionLink="/category"
      />
    </div>
  );
}

export default CatalogPage;
