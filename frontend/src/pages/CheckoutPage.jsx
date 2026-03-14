import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";

import BrandLogo from "../components/BrandLogo";
import PackagingShowcase from "../components/PackagingShowcase";

function CheckoutPage({ cartItems, productsById, onUpdateCartQty, onRemoveFromCart, onClearCart }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [giftEnabled, setGiftEnabled] = useState(false);
  const [giftMode, setGiftMode] = useState("record");
  const [typedMessage, setTypedMessage] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("Female warm voice");
  const [senderName, setSenderName] = useState("");
  const [audioDataUrl, setAudioDataUrl] = useState("");
  const [recording, setRecording] = useState(false);
  const [giftId, setGiftId] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [giftLink, setGiftLink] = useState("");
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

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

  useEffect(() => {
    if (!giftEnabled) return;
    if (typeof window === "undefined") return;
    const payloadReady = audioDataUrl || typedMessage;
    if (!payloadReady) return;

    const id = giftId || `gift-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const link = `${window.location.origin}/gift/${id}`;
    setGiftId(id);
    setGiftLink(link);

    const payload = {
      id,
      senderName: senderName || "SkinMatch customer",
      typedMessage,
      audioDataUrl,
      voiceStyle,
      createdAt: Date.now()
    };

    try {
      const existing = JSON.parse(localStorage.getItem("skinmatch.gifts") || "{}");
      localStorage.setItem("skinmatch.gifts", JSON.stringify({ ...existing, [id]: payload }));
    } catch (_error) {
      localStorage.setItem("skinmatch.gifts", JSON.stringify({ [id]: payload }));
    }

    QRCode.toDataURL(link, { margin: 1, width: 160 })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(""));
  }, [giftEnabled, typedMessage, audioDataUrl, voiceStyle, senderName, giftId]);

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data?.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioDataUrl(String(reader.result || ""));
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    };
    recorder.start();
    setRecording(true);
    setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, 20000);
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <section className="glass-card p-4 md:p-6">
        <div className="mb-5">
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">Confirm payment, gifting, and delivery details.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-rose-100 bg-white p-4">
            <h2 className="text-lg font-semibold text-skin-ink">Order Items</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-skin-ink">{item.product.name}</p>
                    <BrandLogo brand={item.product.brand} showName className="brand-mark--card" imgClassName="brand-mark__img--xs" />
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

      <section className="glass-card p-4 md:p-6">
        <div className="packaging-preview">
          <div>
            <p className="packaging-preview__kicker">📦 Your Order Packaging Preview</p>
            <h3>Your order will arrive in our signature aesthetic box.</h3>
            <p>Perfect for gifting, layered with silk wrapping and a complimentary beauty card.</p>
          </div>
          <div className="packaging-preview__box">
            <div className="packaging-preview__lid" />
            <div className="packaging-preview__base">
              <span>OpenLeaf Beauty</span>
            </div>
          </div>
        </div>
      </section>

      <PackagingShowcase
        title="Our Signature Packaging"
        subtitle="Magnetic gift boxes, silk paper, and ribbon wrapping designed to be kept."
        variant="compact"
      />

      <section className="glass-card p-4 md:p-6">
        <div className="gift-toggle">
          <div>
            <h3>🎁 Send As A Gift</h3>
            <p>Add a personal voice message and QR gift card inside the box.</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={giftEnabled} onChange={(event) => setGiftEnabled(event.target.checked)} />
            <span />
          </label>
        </div>

        {giftEnabled ? (
          <div className="gift-panel">
            <div className="gift-panel__modes">
              <button
                type="button"
                className={giftMode === "record" ? "is-active" : ""}
                onClick={() => setGiftMode("record")}
              >
                Record voice message
              </button>
              <button
                type="button"
                className={giftMode === "type" ? "is-active" : ""}
                onClick={() => setGiftMode("type")}
              >
                Type message + AI voice
              </button>
            </div>

            {giftMode === "record" ? (
              <div className="gift-panel__record">
                <p>Max duration: 20 seconds</p>
                <div className="gift-panel__record-actions">
                  <button type="button" className="btn-secondary" onClick={startRecording} disabled={recording}>
                    {recording ? "Recording..." : "Record"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={stopRecording} disabled={!recording}>
                    Stop
                  </button>
                </div>
                {audioDataUrl ? (
                  <audio controls src={audioDataUrl} className="gift-panel__audio" />
                ) : null}
              </div>
            ) : (
              <div className="gift-panel__type">
                <textarea
                  rows={4}
                  placeholder="Happy birthday! I hope you love this gift."
                  value={typedMessage}
                  onChange={(event) => setTypedMessage(event.target.value.slice(0, 180))}
                />
                <div className="gift-panel__controls">
                  <label>
                    Voice style
                    <select value={voiceStyle} onChange={(event) => setVoiceStyle(event.target.value)}>
                      <option>Female warm voice</option>
                      <option>Male voice</option>
                      <option>Soft luxury voice</option>
                    </select>
                  </label>
                  <label>
                    Sender name
                    <input
                      value={senderName}
                      onChange={(event) => setSenderName(event.target.value)}
                      placeholder="Your name"
                    />
                  </label>
                </div>
              </div>
            )}

            {giftLink ? (
              <div className="gift-panel__qr">
                <div>
                  <p>✨ A message just for you</p>
                  <span>Scan this QR to hear it</span>
                  <div className="gift-panel__share">
                    <input value={giftLink} readOnly />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(giftLink)}
                    >
                      Share link
                    </button>
                  </div>
                </div>
                {qrDataUrl ? <img src={qrDataUrl} alt="Gift QR code" /> : <div className="gift-panel__qr-placeholder" />}
              </div>
            ) : (
              <p className="gift-panel__hint">Create a message to generate your gift QR card.</p>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default CheckoutPage;
