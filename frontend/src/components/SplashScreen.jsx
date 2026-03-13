function SplashScreen({ exiting = false }) {
  return (
    <div
      className={`splash-screen fixed inset-0 z-[120] overflow-hidden transition-opacity duration-500 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      aria-label="SkinMatch splash screen"
    >
      <div className="pointer-events-none absolute -left-32 top-8 h-64 w-64 rounded-full bg-rose-400/60 blur-[90px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-amber-300/60 blur-[100px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-56 w-56 -translate-x-1/2 rounded-full bg-fuchsia-300/40 blur-[90px]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 h-[320px] w-[320px] sm:h-[380px] sm:w-[380px]">
          <div className="splash-ring" />
          <div className="splash-ring splash-ring--alt" />
          <div className="splash-hero-card">
            <div className="splash-hero-glow" />
            <img
              src="/pdf-products/product-01.jpg"
              alt="SkinMatch hero product"
              className="product-image splash-hero-image"
            />
            <div className="splash-hero-meta">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-700/70">
                SkinMatch Atelier
              </p>
              <p className="mt-2 text-2xl font-semibold text-skin-ink">Curating your edit</p>
              <p className="mt-2 text-xs text-rose-900/70">Premium beauty, tailored to you.</p>
            </div>
          </div>

          <div className="splash-pill splash-pill--left">
            <img src="/pdf-products/product-02.jpg" alt="Mascara highlight" className="product-image h-10 w-10" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-700/70">Trend</p>
              <p className="text-sm font-semibold text-skin-ink">Sky High</p>
            </div>
          </div>

          <div className="splash-pill splash-pill--right">
            <img src="/pdf-products/product-03.jpg" alt="Lip color highlight" className="product-image h-10 w-10" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-700/70">New</p>
              <p className="text-sm font-semibold text-skin-ink">Matte Ink</p>
            </div>
          </div>
        </div>

        <div className="splash-progress">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700/70">
            Preparing your ritual
          </p>
          <div className="splash-progress-bar">
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
