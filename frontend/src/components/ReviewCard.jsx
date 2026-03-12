function ReviewCard({ review }) {
  return (
    <article className="glass-card p-4 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-sm text-skin-ink">{review.userName}</strong>
            {review.verifiedPurchase ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Verified
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] text-rose-700">{review.skinType}</span>
            <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] text-rose-700">{review.skinConcern}</span>
            <span className="rounded-full bg-rose-50 px-2 py-1 text-[11px] text-rose-700">{review.ageGroup}</span>
          </div>
        </div>
        <span className="text-sm font-semibold text-skin-gold">★ {review.rating}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-rose-900/80">{review.comment}</p>

      {(review.beforeImage || review.afterImage) && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {review.beforeImage ? (
            <figure>
              <img
                src={review.beforeImage}
                alt={`${review.userName} before result`}
                loading="lazy"
                decoding="async"
                className="h-24 w-full rounded-xl object-cover"
              />
              <figcaption className="mt-1 text-[11px] text-rose-900/60">Before</figcaption>
            </figure>
          ) : null}
          {review.afterImage ? (
            <figure>
              <img
                src={review.afterImage}
                alt={`${review.userName} after result`}
                loading="lazy"
                decoding="async"
                className="h-24 w-full rounded-xl object-cover"
              />
              <figcaption className="mt-1 text-[11px] text-rose-900/60">After</figcaption>
            </figure>
          ) : null}
        </div>
      )}

      <p className="mt-3 text-xs text-rose-900/55">{review.helpfulCount} people found this helpful</p>
    </article>
  );
}

export default ReviewCard;
