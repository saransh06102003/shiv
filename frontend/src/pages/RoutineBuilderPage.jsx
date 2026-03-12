import { useEffect, useMemo, useState } from "react";
import { routineSteps } from "../data/mockData";
import SectionHeader from "../components/SectionHeader";
import { fetchRoutine, saveRoutine } from "../lib/api";

const initialRoutine = {
  morning: {},
  night: {}
};

const CHECKLIST_STORAGE_KEY = "skinmatch.routineChecklist";

function entriesToMap(entries) {
  return (entries || []).reduce((acc, entry) => {
    acc[entry.step] = entry.productId;
    return acc;
  }, {});
}

function readChecklist() {
  if (typeof window === "undefined") return { morning: {}, night: {} };
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { morning: {}, night: {} };
  } catch (_error) {
    return { morning: {}, night: {} };
  }
}

function RoutineColumn({ title, steps, selected, productsByStep, onSelect }) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-4">
      <h3 className="font-serif text-3xl font-semibold">{title}</h3>
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div key={step} className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3">
            <p className="text-sm font-semibold text-skin-ink">{step}</p>
            <p className="text-xs text-rose-900/65">{productsByStep[step]?.length || 0} recommended products</p>
            <select
              value={selected[step] ?? ""}
              onChange={(event) => onSelect(step, event.target.value)}
              className="mt-2 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="">Select product</option>
              {productsByStep[step]?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoutineChecklist({ title, time, steps, checklist, onToggle }) {
  const completed = steps.filter((step) => Boolean(checklist?.[time]?.[step])).length;
  const progress = Math.round((completed / steps.length) * 100);

  return (
    <article className="routine-card">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-skin-gold">Tracker</p>
      <h3 className="mt-2 font-serif text-3xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-rose-900/70">Mark each step as completed for today.</p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-rose-100">
        <div className="h-full rounded-full bg-gradient-to-r from-skin-rose to-skin-gold" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-1 text-xs font-medium text-rose-700">{completed}/{steps.length} steps completed</p>

      <div className="mt-4 space-y-2">
        {steps.map((step) => {
          const checked = Boolean(checklist?.[time]?.[step]);
          return (
            <label
              key={step}
              className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
                checked ? "border-amber-200 bg-amber-50" : "border-rose-100 bg-white"
              }`}
            >
              <span className={checked ? "text-amber-700" : "text-rose-900/80"}>{step}</span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(time, step)}
                className="h-4 w-4 accent-rose-500"
              />
            </label>
          );
        })}
      </div>
    </article>
  );
}

function RoutineBuilderPage({ products, routineReminder, onUpdateRoutineReminder }) {
  const [routine, setRoutine] = useState(initialRoutine);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [checklist, setChecklist] = useState(() => readChecklist());

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    let isMounted = true;

    fetchRoutine("guest")
      .then((savedRoutine) => {
        if (!isMounted || !savedRoutine) return;
        setRoutine({
          morning: entriesToMap(savedRoutine.morning),
          night: entriesToMap(savedRoutine.night)
        });
        setStatus("Loaded your saved routine.");
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  const productsByStep = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        if (!acc[product.routineStep]) acc[product.routineStep] = [];
        acc[product.routineStep].push(product);
        return acc;
      },
      {
        Cleanse: [],
        Treat: [],
        Moisturize: [],
        Protect: []
      }
    );
  }, [products]);

  const onSelectProduct = (time, step, productId) => {
    setRoutine((prev) => ({
      ...prev,
      [time]: {
        ...prev[time],
        [step]: productId
      }
    }));
    setStatus("Unsaved changes");
  };

  const onSaveRoutine = async () => {
    const payload = {
      userId: "guest",
      morning: routineSteps.morning
        .map((step) => ({ step, productId: routine.morning[step] }))
        .filter((entry) => entry.productId),
      night: routineSteps.night
        .map((step) => ({ step, productId: routine.night[step] }))
        .filter((entry) => entry.productId)
    };

    setIsSaving(true);
    try {
      await saveRoutine(payload);
      setStatus("Routine saved");
    } catch (_error) {
      setStatus("Unable to save right now");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleChecklist = (time, step) => {
    setChecklist((prev) => ({
      ...prev,
      [time]: {
        ...prev[time],
        [step]: !prev?.[time]?.[step]
      }
    }));
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      <section className="glass-card p-4 md:p-6">
        <SectionHeader
          title="Routine Builder"
          subtitle="Build your morning and night flow with personalized product steps."
          action={
            <button type="button" className="btn-primary" onClick={onSaveRoutine} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Routine"}
            </button>
          }
        />
        {status ? <p className="mb-4 text-sm font-medium text-rose-700">{status}</p> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <RoutineColumn
            title="Morning Routine"
            steps={routineSteps.morning}
            selected={routine.morning}
            productsByStep={productsByStep}
            onSelect={(step, productId) => onSelectProduct("morning", step, productId)}
          />
          <RoutineColumn
            title="Night Routine"
            steps={routineSteps.night}
            selected={routine.night}
            productsByStep={productsByStep}
            onSelect={(step, productId) => onSelectProduct("night", step, productId)}
          />
        </div>
      </section>

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Skincare Routine Tracker" subtitle="Check off completed steps and track daily consistency." />
        <div className="grid gap-4 md:grid-cols-2">
          <RoutineChecklist
            title="Morning Checklist"
            time="morning"
            steps={routineSteps.morning}
            checklist={checklist}
            onToggle={toggleChecklist}
          />
          <RoutineChecklist
            title="Night Checklist"
            time="night"
            steps={routineSteps.night}
            checklist={checklist}
            onToggle={toggleChecklist}
          />
        </div>
      </section>

      <section className="glass-card p-4 md:p-6">
        <SectionHeader title="Routine Reminder" subtitle="Stay consistent with personalized nudges." />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="rounded-2xl border border-rose-100 bg-white p-3 text-sm text-rose-900/75">
            <span className="mb-2 block font-semibold text-skin-ink">Enable Reminder</span>
            <input
              type="checkbox"
              checked={Boolean(routineReminder?.enabled)}
              onChange={(event) => onUpdateRoutineReminder?.({ enabled: event.target.checked })}
              className="h-4 w-4 accent-rose-500"
            />
          </label>

          <label className="rounded-2xl border border-rose-100 bg-white p-3 text-sm text-rose-900/75">
            <span className="mb-2 block font-semibold text-skin-ink">Reminder Time</span>
            <input
              type="time"
              value={routineReminder?.time || "21:00"}
              onChange={(event) => onUpdateRoutineReminder?.({ time: event.target.value })}
              className="w-full rounded-xl border border-rose-200 px-3 py-2"
            />
          </label>

          <label className="rounded-2xl border border-rose-100 bg-white p-3 text-sm text-rose-900/75">
            <span className="mb-2 block font-semibold text-skin-ink">Frequency</span>
            <select
              value={routineReminder?.frequency || "daily"}
              onChange={(event) => onUpdateRoutineReminder?.({ frequency: event.target.value })}
              className="w-full rounded-xl border border-rose-200 px-3 py-2"
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="alternate-days">Alternate Days</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}

export default RoutineBuilderPage;
