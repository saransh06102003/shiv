import { useMemo, useState } from "react";

function CheckoutPage({ cartItems, productsById, onUpdateCartQty, onRemoveFromCart, onClearCart }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const summary = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = items.reduce(
      (acc, item) => acc + Math.round(item.product.price * (item.product.discountPct / 100)) * item.quantity,
      0
    );
    const delivery = subtotal > 499 ? 0 : 49;
    return {
      subtotal,
      discount,
      delivery,
      total: Math.max(0, subtotal - discount + delivery)
    };
  }, [items]);

  const placeOrder = () => {
    if (items.length === 0 || placingOrder) return;
    setPlacingOrder(true);
    setTimeout(() => {
      setPlacingOrder(false);
      setOrderPlaced(true);
      onClearCart();
    }, 900);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <section className="glass-card p-4 md:p-6">
        <div className="mb-5">
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-subtitle">Fast, secure checkout with simple order summary.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-rose-100 bg-white p-4">
            <h2 className="text-lg font-semibold text-skin-ink">Your Products</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-skin-ink">{item.product.name}</p>
                    <p className="text-xs text-rose-900/65">{item.product.brand}</p>
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
                    <button type="button" onClick={() => onRemoveFromCart(item.productId)} className="mt-1 text-xs text-rose-600">
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-8 text-center text-sm text-rose-900/70">
                  Your cart is empty.
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-3xl border border-rose-100 bg-white p-4">
            <h2 className="text-lg font-semibold text-skin-ink">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-rose-900/75">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <strong>Rs {summary.subtotal}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <strong>- Rs {summary.discount}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <strong>{summary.delivery === 0 ? "Free" : `Rs ${summary.delivery}`}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-rose-100 pt-2 text-base">
                <span className="font-semibold text-skin-ink">Total</span>
                <strong className="text-lg text-skin-ink">Rs {summary.total}</strong>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-skin-ink">Payment Method</p>
              {[
                { id: "upi", label: "UPI" },
                { id: "card", label: "Card" },
                { id: "cod", label: "Cash on Delivery" }
              ].map((method) => (
                <label key={method.id} className="flex items-center gap-2 text-sm text-rose-900/75">
                  <input
                    type="radio"
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="h-4 w-4 accent-rose-500"
                  />
                  {method.label}
                </label>
              ))}
            </div>

            <button
              type="button"
              className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled={items.length === 0 || placingOrder}
              onClick={placeOrder}
            >
              {placingOrder ? "Placing order..." : "Checkout"}
            </button>

            {orderPlaced ? (
              <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                Order confirmed. Tracking updates will be shared shortly.
              </p>
            ) : null}
          </article>
        </div>
      </section>
    </div>
  );
}

export default CheckoutPage;
