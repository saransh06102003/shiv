import SectionHeader from "../components/SectionHeader";
import ProductCard from "../components/ProductCard";

function WishlistPage({ products, wishlistSet, onAddToCart, onToggleWishlist }) {
  const items = products.filter((product) => wishlistSet?.has(product.id));

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Wishlist" subtitle="Your saved beauty edits, ready whenever you are." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted
            />
          ))}
        </div>
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-8 text-center text-sm text-rose-900/70">
            Your wishlist is empty. Save products to revisit them here.
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default WishlistPage;
