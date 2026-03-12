import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { matchesProductSearch, profileScoreForProduct } from "../lib/personalization";

const defaultFilters = {
  skinTypes: [],
  concerns: [],
  ingredientInclude: [],
  ingredientExclude: [],
  brands: [],
  minPrice: 100,
  maxPrice: 5000,
  minRating: 4
};

function CategoryPage({ products, skinProfile, onAddToCart, onToggleWishlist, wishlistSet, isLoading = false }) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const wishlistOnly = searchParams.get("wishlist") === "true";

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

  const filteredProducts = useMemo(() => {
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const category = searchParams.get("category");

    return products.filter((product) => {
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

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSkin &&
        matchesConcern &&
        matchesIncludeIngredient &&
        matchesExcludeIngredient &&
        matchesPrice &&
        matchesBrand &&
        matchesRating
      );
    });
  }, [filters, products, searchParams]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "priceLowHigh") list.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHighLow") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "newLaunches") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sortBy === "recommended") {
      list.sort((a, b) => profileScoreForProduct(b, skinProfile) - profileScoreForProduct(a, skinProfile));
    }
    return list;
  }, [filteredProducts, sortBy, skinProfile]);

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

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      <section className="glass-card p-4 md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="section-title">{wishlistOnly ? "My Wishlist" : "Category Products"}</h1>
            <p className="section-subtitle">
              {wishlistOnly
                ? "Save your favorites and review them anytime."
                : "Smart filters for skin type, concern, ingredients and budget."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary md:hidden" onClick={() => setShowFilters((prev) => !prev)}>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setFilters(defaultFilters)}>
              Reset Filters
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {quickFilters.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.apply}
              className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            >
              {chip.label}
            </button>
          ))}

          <label className="ml-auto inline-flex items-center gap-2 text-sm text-rose-900/70">
            Sort
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-full border border-rose-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="newLaunches">New launches</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </label>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
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

        <div className="grid gap-5 lg:grid-cols-12">
          <div className={`${showFilters ? "block" : "hidden"} lg:col-span-3 lg:block`}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              allSkinTypes={allSkinTypes}
              allConcerns={allConcerns}
              allIngredients={allIngredients}
              allBrands={allBrands}
            />
          </div>

          <div className="lg:col-span-9">
            <p className="mb-3 text-sm text-rose-900/70">
              <strong className="text-skin-ink">{sortedProducts.length}</strong> products found
            </p>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistSet?.has(product.id)}
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
    </div>
  );
}

export default CategoryPage;
