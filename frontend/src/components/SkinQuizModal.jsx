import { useEffect, useState } from "react";

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const SKIN_CONCERNS = ["Acne", "Pigmentation", "Dullness", "Wrinkles", "Dryness", "Sensitivity"];
const AGE_RANGES = ["18-24", "25-34", "35-44", "45+"];

function ChoiceButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
        active
          ? "border-rose-400 bg-rose-100 text-rose-700"
          : "border-rose-100 bg-white text-rose-900/80 hover:bg-rose-50"
      }`}
    >
      {children}
    </button>
  );
}

function SkinQuizModal({ open, onClose, onSave, initialProfile }) {
  const [skinType, setSkinType] = useState(initialProfile?.skinType || "");
  const [skinConcerns, setSkinConcerns] = useState(initialProfile?.skinConcerns || []);
  const [ageRange, setAgeRange] = useState(initialProfile?.ageRange || "");

  useEffect(() => {
    if (!open) return;
    setSkinType(initialProfile?.skinType || "");
    setSkinConcerns(initialProfile?.skinConcerns || []);
    setAgeRange(initialProfile?.ageRange || "");
  }, [initialProfile, open]);

  if (!open) return null;

  const toggleConcern = (concern) => {
    setSkinConcerns((prev) =>
      prev.includes(concern) ? prev.filter((item) => item !== concern) : [...prev, concern].slice(-3)
    );
  };

  const canSave = skinType && skinConcerns.length > 0 && ageRange;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-skin-ink/45 p-3 md:items-center">
      <div className="w-full max-w-xl rounded-3xl border border-rose-100 bg-white p-5 shadow-soft md:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-600">Skin Profile</p>
            <h3 className="font-serif text-3xl font-semibold">Create your profile</h3>
            <p className="text-sm text-rose-900/65">Used for personalized recommendations.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-rose-100 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <section className="mb-5">
          <h4 className="mb-2 text-sm font-semibold text-skin-ink">Skin Type</h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {SKIN_TYPES.map((type) => (
              <ChoiceButton key={type} active={skinType === type} onClick={() => setSkinType(type)}>
                {type}
              </ChoiceButton>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h4 className="mb-2 text-sm font-semibold text-skin-ink">Skin Concerns (choose up to 3)</h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {SKIN_CONCERNS.map((concern) => (
              <ChoiceButton
                key={concern}
                active={skinConcerns.includes(concern)}
                onClick={() => toggleConcern(concern)}
              >
                {concern}
              </ChoiceButton>
            ))}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-sm font-semibold text-skin-ink">Age Range</h4>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {AGE_RANGES.map((range) => (
              <ChoiceButton key={range} active={ageRange === range} onClick={() => setAgeRange(range)}>
                {range}
              </ChoiceButton>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Later
          </button>
          <button
            type="button"
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canSave}
            onClick={() => onSave({ skinType, skinConcerns, ageRange })}
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default SkinQuizModal;
