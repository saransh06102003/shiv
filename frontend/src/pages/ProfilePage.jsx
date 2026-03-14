import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

function ProfilePage({ skinProfile, wishlistCount = 0, cartCount = 0 }) {
  const skinType = skinProfile?.skinType || (typeof window !== "undefined" ? localStorage.getItem("skinType") : "") || "Not set";
  const concerns = skinProfile?.skinConcerns || [];
  const glowPoints = 1200 + wishlistCount * 25;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Your Profile" subtitle="Personalized beauty insights and loyalty rewards." />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">Member</p>
            <h2 className="mt-2 text-2xl font-semibold text-skin-ink">SkinMatch Insider</h2>
            <p className="mt-2 text-sm text-rose-900/70">Luxury beauty, personalized for your skin goals.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-xs text-rose-700/70">Glow Points</p>
                <p className="text-lg font-semibold text-skin-ink">{glowPoints}</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-xs text-rose-700/70">Wishlist</p>
                <p className="text-lg font-semibold text-skin-ink">{wishlistCount}</p>
              </div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-xs text-rose-700/70">Bag Items</p>
                <p className="text-lg font-semibold text-skin-ink">{cartCount}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-rose-100 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-700/80">Skin Profile</p>
            <h3 className="mt-2 text-xl font-semibold text-skin-ink">{skinType}</h3>
            <p className="mt-2 text-sm text-rose-900/70">
              {concerns.length > 0 ? `Concerns: ${concerns.join(", ")}` : "Add your concerns to personalize routines."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/skin-analyzer" className="btn-primary">Analyze My Skin</Link>
              <Link to="/skin-profile" className="btn-secondary">View Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Quick Actions" subtitle="Jump back into your beauty ritual." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {
            [
              { label: "Routine Builder", link: "/routine-builder", detail: "Build your daily ritual" },
              { label: "Wishlist", link: "/wishlist", detail: "Saved product edits" },
              { label: "Orders", link: "/order-history", detail: "Track deliveries" },
              { label: "Cart", link: "/cart", detail: "Finish checkout" }
            ].map((item) => (
              <Link
                key={item.label}
                to={item.link}
                className="rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-card"
              >
                <p className="text-sm font-semibold text-skin-ink">{item.label}</p>
                <p className="mt-2 text-xs text-rose-900/70">{item.detail}</p>
              </Link>
            ))
          }
        </div>
      </section>

      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Engagement" subtitle="Stay consistent with your glow journey." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Routine Tracking",
              description: "Track daily usage and streaks for your skincare ritual."
            },
            {
              title: "Reorder Routine",
              description: "Rebuild your last routine in one click."
            },
            {
              title: "Product Comparison",
              description: "Compare actives, ratings, and skin match scores."
            }
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-1 hover:shadow-card"
            >
              <p className="text-sm font-semibold text-skin-ink">{item.title}</p>
              <p className="mt-2 text-xs text-rose-900/70">{item.description}</p>
              <button type="button" className="btn-secondary mt-4 w-full">
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
