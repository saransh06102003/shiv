import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { prefetchProductById } from "../lib/api";
import BrandLogo from "./BrandLogo";

function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isWishlisted = false,
  matchScore,
  glowScore,
  benefitTag
}) {
  const discountedPrice = Math.round(product.price * (1 - product.discountPct / 100));
  const [added, setAdded] = useState(false);
  const [wishlistPulse, setWishlistPulse] = useState(false);
  const highlightTag = (product.tags || []).find((tag) =>
    /editor|dermatologist|acne|glow|favorites/i.test(tag)
  );

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

  const isRecommended = typeof matchScore === "number" && matchScore >= 85;

  return (
    <article className={`product-card group ${isRecommended ? "product-card--recommended" : ""}`}>
      <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
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
        {highlightTag ? (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
            {highlightTag}
          </span>
        ) : null}
        {typeof matchScore === "number" ? (
          <span className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">
            {matchScore}% match
          </span>
        ) : null}
      </div>

      <div className="product-actions">
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={handleWishlist}
          className={`product-action-btn ${wishlistPulse ? "animate-heart-pop" : ""}`}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>
        <button
          type="button"
          aria-label="Quick view"
          onClick={() => onQuickView?.(product)}
          className="product-action-btn"
        >
          👁
        </button>
        <button
          type="button"
          aria-label="Quick add to cart"
          onClick={handleQuickAdd}
          className={`product-action-btn ${added ? "ring-2 ring-rose-200" : ""}`}
        >
          🛒
        </button>
      </div>

      <Link
        to={`/product/${product.id}`}
        onMouseEnter={() => prefetchProductById(product.id)}
        onTouchStart={() => prefetchProductById(product.id)}
        className="block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-white p-5">
          <div className="product-spotlight" />
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="product-image h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
          {typeof matchScore === "number" ? (
            <div
              className="match-ring match-ring--sm"
              style={{ background: `conic-gradient(#ff6f91 ${matchScore * 3.6}deg, rgba(255,255,255,0.4) 0deg)` }}
            >
              <div className="match-ring__inner">
                <span>{matchScore}%</span>
                <small>Match</small>
              </div>
            </div>
          ) : null}
          <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
            {product.discountPct}% OFF
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <BrandLogo brand={product.brand} showName className="brand-mark--card" imgClassName="brand-mark__img--sm" />
          <Link
            to={`/product/${product.id}`}
            className="mt-1 block min-h-[2.6rem] line-clamp-2 text-sm font-semibold leading-snug text-skin-ink"
          >
            {product.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-rose-800/55">
            <span>{product.category}</span>
            <span>·</span>
            <span>{product.routineStep}</span>
            {benefitTag ? <span className="product-benefit-tag">{benefitTag}</span> : null}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-rose-700">★ {product.rating}</span>
          {typeof glowScore === "number" ? (
            <span className="text-xs text-rose-900/60">Glow {glowScore} / 5</span>
          ) : (
            <span className="text-xs text-rose-900/60">{product.reviews} reviews</span>
          )}
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
          {added ? "Added ✓" : "Add to Bag"}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
