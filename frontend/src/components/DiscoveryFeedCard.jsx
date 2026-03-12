import { Link } from "react-router-dom";

const FEED_STYLES = {
  routine: {
    badge: "Routine",
    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200/70"
  },
  product: {
    badge: "Trending Product",
    badgeClass: "bg-rose-100 text-rose-700 border border-rose-200/70"
  },
  tip: {
    badge: "Beauty Tip",
    badgeClass: "bg-sky-100 text-sky-700 border border-sky-200/70"
  },
  ingredient: {
    badge: "Ingredient Education",
    badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200/70"
  }
};

function DiscoveryFeedCard({ item }) {
  const style = FEED_STYLES[item.type] || FEED_STYLES.tip;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative h-64 overflow-hidden bg-skin-hero sm:h-72">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/5" />
        <div className="absolute left-4 top-4">
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${style.badgeClass}`}>
            {style.badge}
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700/70">{item.kicker}</p>
        <h3 className="mt-2 text-xl font-semibold leading-tight text-skin-ink">{item.title}</h3>
        <p className="mt-2 text-sm text-rose-900/70">{item.description}</p>
        {item.meta ? <p className="mt-3 text-xs font-medium text-rose-700/75">{item.meta}</p> : null}

        <div className="mt-5">
          <Link to={item.ctaLink} className="btn-primary !px-5">
            {item.ctaLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default DiscoveryFeedCard;
