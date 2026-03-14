import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

const ORDERS = [
  {
    id: "SM-2026-0312",
    date: "Mar 12, 2026",
    status: "Delivered",
    items: 3,
    total: 1890
  },
  {
    id: "SM-2026-0227",
    date: "Feb 27, 2026",
    status: "Shipped",
    items: 2,
    total: 1320
  },
  {
    id: "SM-2026-0214",
    date: "Feb 14, 2026",
    status: "Delivered",
    items: 4,
    total: 2450
  }
];

function OrderHistoryPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <section className="glass-card p-6 md:p-8">
        <SectionHeader title="Order History" subtitle="Track your luxury beauty deliveries." />
        <div className="mt-6 space-y-3">
          {ORDERS.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white p-4">
              <div>
                <p className="text-sm font-semibold text-skin-ink">{order.id}</p>
                <p className="text-xs text-rose-900/70">{order.date} · {order.items} items</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-skin-ink">Rs {order.total}</p>
                <p className="text-xs text-rose-600">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/catalog" className="btn-primary">Shop Again</Link>
          <Link to="/profile" className="btn-secondary">Back to Profile</Link>
        </div>
      </section>
    </div>
  );
}

export default OrderHistoryPage;
