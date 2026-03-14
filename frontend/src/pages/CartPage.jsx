import { useMemo } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../components/BrandLogo";
import SectionHeader from "../components/SectionHeader";

function CartPage({ cartItems, productsById, onUpdateCartQty, onRemoveFromCart }) {
  const items = useMemo(
    () =>
      cartItems
        .map((item) => ({
          ...item,
          product: productsById[item.productId]
        }))
        .filter((item) => item.product),
    [cartItems, productsById]
  );

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = items.reduce(
    (acc, item) => acc + Math.round(item.product.price * (item.product.discountPct / 100)) * item.quantity,
    0
  );
  const delivery = subtotal > 499 ? 0 : subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + delivery);

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Your Bag" subtitle="Review your beauty picks before checkout." />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-rose-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-skin-ink">Bag Items</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-[70px_1fr_auto] items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-3"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-skin-ink">{item.product.name}</p>
                    <BrandLogo
                      brand={item.product.brand}
                      showName
                      className="brand-mark--card"
                      imgClassName="brand-mark__img--xs"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.productId, Math.max(1, item.quantity - 1))}
                        className="h-7 w-7 rounded-full border border-rose-200 bg-white text-rose-700"
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold text-skin-ink">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateCartQty(item.productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-rose-200 bg-white text-rose-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-skin-ink">Rs {item.product.price * item.quantity}</p>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(item.productId)}
                      className="mt-1 text-xs text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-8 text-center text-sm text-rose-900/70">
                  Your bag is empty. Explore the catalog to add your favorites.
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-3xl border border-rose-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-skin-ink">Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-rose-900/75">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <strong>Rs {subtotal}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <strong>- Rs {discount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <strong>{delivery === 0 ? "Free" : `Rs ${delivery}`}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-rose-100 pt-2 text-base">
                <span className="font-semibold text-skin-ink">Total</span>
                <strong className="text-lg text-skin-ink">Rs {total}</strong>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/checkout"
                className={`btn-primary w-full text-center ${items.length === 0 ? "pointer-events-none opacity-60" : ""}`}
              >
                Proceed to Checkout
              </Link>
              <Link to="/catalog" className="btn-secondary w-full text-center">
                Continue Shopping
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
