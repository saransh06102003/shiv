import { useMemo, useState } from "react";
import { searchScoreForProduct, getBeautyMatchScore } from "../lib/personalization";

const SUGGESTIONS = [
  "Best products for acne?",
  "Routine for oily skin",
  "Affordable moisturizers",
  "Best sunscreen"
];

function BeautyAssistant({ products = [], skinProfile, onAddToCart }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const skinType = skinProfile?.skinType;

  const ranked = useMemo(
    () =>
      products
        .map((product) => ({
          product,
          score: searchScoreForProduct(product, query) + getBeautyMatchScore(product, skinType, skinProfile?.skinConcerns) / 10
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((item) => item.product),
    [products, query, skinType, skinProfile]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query) return;
    setResults(ranked);
  };

  return (
    <div className="beauty-assistant">
      <button type="button" className="beauty-assistant__fab" onClick={() => setOpen((prev) => !prev)}>
        ✨ Beauty Assistant
      </button>

      {open ? (
        <div className="beauty-assistant__panel">
          <div className="beauty-assistant__header">
            <div>
              <p>AI Beauty Assistant</p>
              <span>Ask anything about routines, ingredients, or glow.</span>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="beauty-assistant__form">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: serum for oily skin"
            />
            <button type="submit">Ask</button>
          </form>

          <div className="beauty-assistant__chips">
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>

          <div className="beauty-assistant__results">
            {results.length === 0 ? (
              <p>Type a question to get personalized recommendations.</p>
            ) : (
              results.map((product) => (
                <div key={product.id} className="beauty-assistant__result">
                  <img src={product.images?.[0]} alt={product.name} />
                  <div>
                    <p>{product.name}</p>
                    <span>{product.brand} • ★ {product.rating}</span>
                  </div>
                  <button type="button" onClick={() => onAddToCart?.(product.id, 1)}>
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BeautyAssistant;
