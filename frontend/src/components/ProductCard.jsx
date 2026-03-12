import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { prefetchProductById } from "../lib/api";

function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted = false }) {
  const discountedPrice = Math.round(product.price * (1 - product.discountPct / 100));
  const [added, setAdded] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);

  useEffect(() => {
    if (!added) return undefined;
    const timer = window.setTimeout(() => setAdded(false), 700);
    return () => window.clearTimeout(timer);
  }, [added]);

  useEffect(() => {
    if (!wishlistPulse) return undefined;
    const timer = window.setTimeout(() => setWishlistPulse(false), 260);
    return () => window.clearTimeout(timer);
  }, [wishlistPulse]);

  const handleQuickAdd = () => {
    onAddToCart?.(product.id, 1);
    setAdded(true);
  };

  const handleWishlist = () => {
    onToggleWishlist?.(product.id);
    setWishlistPulse(true);
  };

  return (
    <article className="product-card group">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        {product.isBestSeller ? (
          <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Best Seller
          </span>
        ) : null}
        {product.isNew ? (
          <span className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
            New
          </span>
        ) : null}
      </div>

      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={handleWishlist}
        className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-white/95 text-base text-rose-700 backdrop-blur transition ${
          wishlistPulse ? "animate-heart-pop" : ""
        }`}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      <button
        type="button"
        aria-label="Quick add to cart"
        onClick={handleQuickAdd}
        className={`absolute right-3 top-14 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-lg text-rose-700 shadow-sm transition ${
          added ? "ring-2 ring-rose-200" : ""
        } opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
      >
        +
      </button>

      <Link
        to={`/product/${product.id}`}
        onMouseEnter={() => prefetchProductById(product.id)}
        onTouchStart={() => prefetchProductById(product.id)}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 p-4">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
            {product.discountPct}% OFF
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-800/70">{product.brand}</p>
          <Link to={`/product/${product.id}`} className="mt-1 line-clamp-2 block text-sm font-semibold text-skin-ink">
            {product.name}
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-rose-700">★ {product.rating}</span>
          <span className="text-xs text-rose-900/60">{product.reviews} reviews</span>
        </div>

        <div className="flex items-end gap-2">
          <strong className="text-lg font-bold text-skin-ink">Rs {discountedPrice}</strong>
          <span className="text-xs text-rose-900/50 line-through">Rs {product.price}</span>
        </div>

        <button
          type="button"
          onClick={handleQuickAdd}
          className={`btn-primary w-full transition ${added ? "ring-2 ring-skin-gold/50" : ""}`}
        >
          {added ? "Added ✓" : "Quick Add"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
