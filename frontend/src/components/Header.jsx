import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchScoreForProduct } from "../lib/personalization";

const NAV_CATEGORIES = [
  {
    name: "Skincare",
    subcategories: ["Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen", "Face Masks"]
  },
  {
    name: "Makeup",
    subcategories: ["Foundation", "Concealer", "Lipstick", "Kajal", "Mascara", "Eyeshadow"]
  },
  {
    name: "Haircare",
    subcategories: ["Shampoo", "Conditioner", "Hair Oil", "Mask", "Scalp Care", "Serum"]
  },
  {
    name: "Fragrance",
    subcategories: ["Perfume", "Mists", "Roll-on", "Gift Sets", "Body Splash"]
  },
  {
    name: "Bath & Body",
    subcategories: ["Body Wash", "Scrub", "Body Lotion", "Hand Cream", "Body Butter"]
  },
  {
    name: "Tools",
    subcategories: ["Brushes", "Sponges", "Gua Sha", "Face Roller", "Eyelash Curler"]
  }
];

function IconButton({ label, onClick, badge, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="nav-icon-button"
    >
      {children}
      {badge ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-skin-rose px-1 text-[11px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${filled ? "text-rose-600" : "text-rose-700"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M12 20s-7-4.6-9.3-8.3C1.1 9.2 2.4 6.3 5.2 5.4c2-0.6 4 0.2 5.2 1.8 1.2-1.6 3.2-2.4 5.2-1.8 2.8 0.9 4.1 3.8 2.5 6.3C19 15.4 12 20 12 20z" />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-700" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l-1 11H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-rose-700" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.8-3 4.2-4.5 7-4.5s5.2 1.5 7 4.5" strokeLinecap="round" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-700" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  );
}

function Header({ products, cartCount = 0, wishlistCount = 0, onOpenQuiz }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const productSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return products
      .map((product) => ({ product, score: searchScoreForProduct(product, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.product);
  }, [products, query]);

  const onSearchSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    navigate(`/category?search=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/90 backdrop-blur">
      <div className="layout-container py-3">
        <div className="layout-grid items-center">
          <Link to="/" className="col-span-6 flex items-center gap-2 md:col-span-2">
            <span className="h-10 w-10 rounded-full bg-gradient-to-br from-skin-rose to-pink-400 shadow-glow" />
            <div>
              <p className="text-2xl font-bold leading-none tracking-tight text-skin-ink md:text-3xl">SkinMatch</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-700/80">Beauty Match</p>
            </div>
          </Link>

          <form className="relative col-span-12 hidden md:block md:col-span-6 lg:col-span-7" onSubmit={onSearchSubmit}>
            <div className="flex h-12 items-center gap-3 rounded-full border border-rose-200 bg-rose-50/50 px-5 shadow-sm transition focus-within:border-rose-300 focus-within:bg-white">
              <IconSearch />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 140)}
                placeholder="Search products, brands, ingredients..."
                aria-label="Search products, brands, ingredients"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-rose-900/40"
              />
            </div>

            {showSuggestions && productSuggestions.length > 0 ? (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-soft">
                {productSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseDown={() => navigate(`/product/${item.id}`)}
                    className="flex w-full items-center justify-between border-b border-rose-50 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-rose-50/40"
                  >
                    <span className="font-medium text-skin-ink">{item.name}</span>
                    <span className="text-xs text-rose-700/70">{item.brand}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </form>

          <div className="col-span-6 flex items-center justify-end gap-2 md:col-span-4 lg:col-span-3">
            <div className="group relative hidden md:block">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                <IconGrid />
                Categories
                <span className="text-xs text-rose-500">▾</span>
              </button>
              <div className="invisible absolute left-0 top-[calc(100%+10px)] z-30 w-64 translate-y-2 rounded-2xl border border-rose-100 bg-white p-2 opacity-0 shadow-card transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {NAV_CATEGORIES.map((category) => (
                  <div key={category.name} className="rounded-xl p-2 hover:bg-rose-50">
                    <button
                      type="button"
                      onClick={() => navigate(`/category?search=${encodeURIComponent(category.name)}`)}
                      className="flex w-full items-center justify-between text-sm font-semibold text-rose-900/90"
                    >
                      {category.name}
                      <span className="text-xs text-rose-500">→</span>
                    </button>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 4).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => navigate(`/category?search=${encodeURIComponent(sub)}`)}
                          className="rounded-full border border-rose-100 px-2 py-0.5 text-[11px] text-rose-700 hover:bg-white"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <IconButton label="Wishlist" onClick={() => navigate("/category?wishlist=true")} badge={wishlistCount || undefined}>
              <IconHeart filled={wishlistCount > 0} />
            </IconButton>
            <IconButton label="Cart" onClick={() => navigate("/checkout")} badge={cartCount || undefined}>
              <IconBag />
            </IconButton>
            <IconButton label="User Profile" onClick={onOpenQuiz}>
              <IconUser />
            </IconButton>
          </div>
        </div>

        <form className="relative mt-3 md:hidden" onSubmit={onSearchSubmit}>
          <div className="flex h-11 items-center gap-2 rounded-full border border-rose-200 bg-rose-50/50 px-4">
            <IconSearch />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands, ingredients..."
              aria-label="Search products, brands, ingredients"
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-rose-900/40"
            />
          </div>
        </form>
      </div>

      <div className="border-t border-rose-100/80 bg-white/80">
        <div className="layout-container flex items-center gap-1 overflow-x-auto py-2 scrollbar-hidden">
          {NAV_CATEGORIES.map((category) => (
            <div key={category.name} className="group relative shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/category?search=${encodeURIComponent(category.name)}`)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-rose-900/75 transition hover:bg-rose-50 hover:text-rose-700"
              >
                {category.name}
              </button>
              <div className="invisible absolute left-0 top-[calc(100%+8px)] z-20 w-52 translate-y-1 rounded-2xl border border-rose-100 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 md:block">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => navigate(`/category?search=${encodeURIComponent(sub)}`)}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-rose-900/80 hover:bg-rose-50"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;
