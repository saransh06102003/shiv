import { Link } from "react-router-dom";

function RoutineCard({ title, description, steps = [] }) {
  return (
    <Link to="/routine-builder" className="routine-card block">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-skin-gold">Routine</p>
      <h3 className="mt-2 font-serif text-3xl font-semibold text-skin-ink">{title}</h3>
      <p className="mt-2 text-sm text-rose-900/70">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {steps.map((step) => (
          <span key={step} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
            {step}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default RoutineCard;
