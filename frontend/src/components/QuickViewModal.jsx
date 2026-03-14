import BrandLogo from "./BrandLogo";
import { getBeautyMatchScore, getGlowScore, getBenefitTag, normalizeSkinType } from "../lib/personalization";

function QuickViewModal({
  open,
  product,
  skinType,
  skinConcerns,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  if (!open || !product) return null;
  const matchScore = getBeautyMatchScore(product, skinType, skinConcerns);
  const glowScore = getGlowScore(product);
  const benefitTag = getBenefitTag(product);
  const ringStyle = {
    background: `conic-gradient(#ff6f91 ${matchScore * 3.6}deg, rgba(255, 255, 255, 0.4) 0deg)`
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-skin-ink/60 p-4 md:items-center">
      <div className="quick-view">
        <button type="button" className="quick-view__close" onClick={onClose}>
          Close
        </button>
        <div className="quick-view__media">
          <div className="quick-view__ring" style={ringStyle}>
            <div className="quick-view__ring-inner">
              <span>{matchScore}%</span>
              <small>Match</small>
            </div>
          </div>
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div className="quick-view__content">
          <BrandLogo brand={product.brand} showName className="brand-mark--hero" imgClassName="brand-mark__img--sm" />
          <h3>{product.name}</h3>
          <p className="quick-view__meta">
            ★ {product.rating} • Glow {glowScore} / 5 • {normalizeSkinType(skinType) || "All"} friendly
          </p>
          <div className="quick-view__tags">
            <span>{benefitTag}</span>
            {product.compatibilityTags?.slice(0, 2).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="quick-view__price">
            <strong>Rs {Math.round(product.price * (1 - product.discountPct / 100))}</strong>
            <span>Rs {product.price}</span>
          </div>
          <div className="quick-view__actions">
            <button type="button" className="btn-primary" onClick={() => onAddToCart?.(product.id, 1)}>
              Add to Bag
            </button>
            <button type="button" className="btn-secondary" onClick={() => onToggleWishlist?.(product.id)}>
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
