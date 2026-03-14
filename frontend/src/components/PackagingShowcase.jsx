const PACKAGING_IMAGE = "/packaging/signature-box.jpg";

const FEATURES = [
  "Premium Gift Box",
  "Eco Friendly Materials",
  "Hand Packed With Care",
  "Complimentary Beauty Card"
];

const SUSTAINABLE = ["Recyclable materials", "Minimal plastic", "Eco friendly ink", "Reusable boxes"];

function PackagingShowcase({ title = "Our Signature Packaging", subtitle, variant = "full" }) {
  return (
    <section className={`packaging-showcase packaging-showcase--${variant}`}>
      <div className="packaging-showcase__media">
        <span className="packaging-showcase__badge">✨ Packaging Worth Keeping</span>
        <img src={PACKAGING_IMAGE} alt="Signature gift packaging" loading="lazy" decoding="async" />
      </div>
      <div className="packaging-showcase__content">
        <p className="packaging-showcase__kicker">Luxury Unboxing</p>
        <h3 className="packaging-showcase__title">{title}</h3>
        <p className="packaging-showcase__subtitle">
          {subtitle || "Every order arrives in our signature aesthetic packaging, ready to gift and keep."}
        </p>
        <div className="packaging-showcase__features">
          {FEATURES.map((item) => (
            <div key={item}>
              <span>✓</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <div className="packaging-showcase__sustainable">
          <p>🌿 Sustainable Beauty Packaging</p>
          <div>
            {SUSTAINABLE.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PackagingShowcase;
