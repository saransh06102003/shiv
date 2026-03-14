import { useEffect, useMemo, useState } from "react";
import { inferSkinTypeFromAnswers } from "../lib/personalization";

const QUESTIONS = [
  {
    id: "afterWash",
    title: "How does your skin usually feel after washing your face?",
    options: [
      { label: "Tight / Dry", icon: "💧" },
      { label: "Comfortable", icon: "✨" },
      { label: "Slightly oily", icon: "🌤️" },
      { label: "Very oily", icon: "🌞" }
    ]
  },
  {
    id: "breakouts",
    title: "How often do you experience breakouts or acne?",
    options: [
      { label: "Very often", icon: "⚡" },
      { label: "Sometimes", icon: "🌿" },
      { label: "Rarely", icon: "🍃" },
      { label: "Never", icon: "🤍" }
    ]
  },
  {
    id: "pores",
    title: "How visible are your pores?",
    options: [
      { label: "Very visible", icon: "🔍" },
      { label: "Moderately visible", icon: "🌙" },
      { label: "Barely visible", icon: "🌫️" }
    ]
  },
  {
    id: "reaction",
    title: "How does your skin react to new products?",
    options: [
      { label: "Sensitive / redness", icon: "🌸" },
      { label: "Slight irritation sometimes", icon: "🌿" },
      { label: "No reaction", icon: "🕊️" }
    ]
  },
  {
    id: "goal",
    title: "What is your main skincare goal?",
    options: [
      { label: "Hydration", icon: "💦" },
      { label: "Acne control", icon: "🧼" },
      { label: "Brightening", icon: "☀️" },
      { label: "Anti-aging", icon: "🕰️" },
      { label: "Oil control", icon: "🌿" }
    ]
  },
  {
    id: "midday",
    title: "How does your skin look by midday?",
    options: [
      { label: "Very oily", icon: "🌞" },
      { label: "Slightly shiny", icon: "🌤️" },
      { label: "Normal", icon: "✨" },
      { label: "Dry patches", icon: "💧" }
    ]
  }
];

const GOAL_CONCERNS = {
  Hydration: ["Hydration", "Barrier"],
  "Acne control": ["Acne", "Pores"],
  Brightening: ["Brightening", "Dark spots"],
  "Anti-aging": ["Fine lines", "Texture"],
  "Oil control": ["Oil control", "Texture"]
};

function OptionCard({ active, option, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`quiz-option ${active ? "is-active" : ""}`}
    >
      <span className="quiz-option__icon" aria-hidden="true">{option.icon}</span>
      <span className="quiz-option__label">{option.label}</span>
    </button>
  );
}

function SkinQuizModal({ open, onClose, onSave, initialProfile }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setAnswers({});
    setResult(null);
  }, [open]);

  const progress = useMemo(() => (step + 1) / QUESTIONS.length, [step]);

  if (!open) return null;

  const currentQuestion = QUESTIONS[step];
  const selectedAnswer = answers[currentQuestion?.id];
  const canContinue = Boolean(selectedAnswer);
  const isLast = step === QUESTIONS.length - 1;

  const nextStep = () => {
    if (isLast) {
      const inferred = inferSkinTypeFromAnswers(answers);
      setResult(inferred);
      if (typeof window !== "undefined") {
        localStorage.setItem("skinType", inferred);
      }
      return;
    }
    setStep((prev) => Math.min(prev + 1, QUESTIONS.length - 1));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  const saveProfile = () => {
    const inferred = result || inferSkinTypeFromAnswers(answers);
    const concerns = GOAL_CONCERNS[answers.goal] || [];
    if (typeof window !== "undefined") {
      localStorage.setItem("skinType", inferred);
    }
    onSave({
      skinType: inferred,
      skinConcerns: concerns,
      ageRange: initialProfile?.ageRange || "",
      quizAnswers: answers
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-skin-ink/50 p-4 md:items-center">
      <div className="quiz-shell">
        <div className="quiz-header">
          <div>
            <p className="quiz-kicker">AI Skin Type Analyzer</p>
            <h3 className="quiz-title">Discover what your skin truly needs</h3>
            <p className="quiz-subtitle">A 60-second intelligent analysis for personalized results.</p>
          </div>
          <button type="button" onClick={onClose} className="quiz-close">
            Close
          </button>
        </div>

        <div className="quiz-progress">
          <div className="quiz-progress__bar" style={{ width: `${progress * 100}%` }} />
        </div>

        {result ? (
          <div className="quiz-result">
            <div className="quiz-result__badge">Your Skin Type</div>
            <h4 className="quiz-result__title">{result}</h4>
            <p className="quiz-result__subtitle">Personalized routines and match scores are now active.</p>
            <div className="quiz-result__actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Explore Products
              </button>
              <button type="button" className="btn-primary" onClick={saveProfile}>
                Save & Personalize
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-body">
            <div>
              <p className="quiz-step">Step {step + 1} of {QUESTIONS.length}</p>
              <h4 className="quiz-question">{currentQuestion.title}</h4>
            </div>
            <div className="quiz-options">
              {currentQuestion.options.map((option) => (
                <OptionCard
                  key={option.label}
                  option={option}
                  active={selectedAnswer === option.label}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.label }))}
                />
              ))}
            </div>
            <div className="quiz-actions">
              <button type="button" className="btn-secondary disabled:cursor-not-allowed disabled:opacity-60" onClick={prevStep} disabled={step === 0}>
                Back
              </button>
              <button type="button" className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={!canContinue} onClick={nextStep}>
                {isLast ? "See Results" : "Continue"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkinQuizModal;
