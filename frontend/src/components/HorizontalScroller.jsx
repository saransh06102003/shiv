import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function HorizontalScroller({
  title,
  subtitle,
  products,
  isLoading = false,
  onAddToCart,
  onToggleWishlist,
  wishlistSet,
  actionLabel = "View all",
  actionLink = "/category",
  skeletonCount = 6
}) {
  return (
    <section className="glass-card p-4 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="section-title text-2xl md:text-3xl">{title}</h2>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>
        <Link to={actionLink} className="btn-secondary !px-4 !py-2">
          {actionLabel}
        </Link>
      </div>

      <div className="grid grid-flow-col auto-cols-[minmax(220px,1fr)] gap-4 overflow-x-auto pb-1 scrollbar-hidden md:auto-cols-[minmax(240px,1fr)]">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <div key={`skeleton-${index}`} className="skeleton-card animate-pulse space-y-4">
                <div className="h-40 rounded-lg bg-rose-100/70" />
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-rose-100/80" />
                  <div className="h-4 w-full rounded-full bg-rose-100/80" />
                  <div className="h-3 w-1/2 rounded-full bg-rose-100/80" />
                </div>
                <div className="h-9 rounded-full bg-rose-100/80" />
              </div>
            ))
          : products.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlistSet?.has(product.id)}
                />
              </div>
            ))}
      </div>
    </section>
  );
}

export default HorizontalScroller;
