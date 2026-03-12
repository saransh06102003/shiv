const SEARCH_SYNONYMS = {
  "vit c": ["vitamin c", "ascorbic acid"],
  "ascorbic acid": ["vitamin c", "vit c"],
  niacinamide: ["vitamin b3", "b3"],
  retinol: ["vitamin a"],
  "hyaluronic acid": ["ha", "hydrating"],
  salicylic: ["bha", "salicylic acid"],
  acne: ["breakout", "blemish"],
  oily: ["oil control", "sebum"],
  sunscreen: ["spf", "sun protection"]
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function expandSearchTerms(query) {
  const normalized = String(query || "").toLowerCase().trim();
  if (!normalized) return [];

  const base = tokenize(normalized);
  const withPhrase = [...base, normalized];
  base.forEach((token) => withPhrase.push(...(SEARCH_SYNONYMS[token] || [])));
  if (SEARCH_SYNONYMS[normalized]) withPhrase.push(...SEARCH_SYNONYMS[normalized]);

  return unique(withPhrase.map((item) => item.trim().toLowerCase()));
}

function levenshteinDistance(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (!left) return right.length;
  if (!right) return left.length;
  const matrix = Array.from({ length: left.length + 1 }, () => Array(right.length + 1).fill(0));

  for (let i = 0; i <= left.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}

function fuzzyTokenMatch(token, values) {
  if (values.includes(token)) return true;
  return values.some((value) => {
    if (value.includes(token) || token.includes(value)) return true;
    if (Math.abs(value.length - token.length) > 2) return false;
    const threshold = token.length <= 5 ? 1 : 2;
    return levenshteinDistance(value, token) <= threshold;
  });
}

export function scoreProductSearch(product, searchQuery) {
  const terms = expandSearchTerms(searchQuery);
  if (terms.length === 0) return 0;

  const nameTokens = tokenize(product.name);
  const brandTokens = tokenize(product.brand);
  const ingredientTokens = tokenize((product.includeIngredients || []).join(" "));
  const concernTokens = tokenize((product.concerns || []).join(" "));
  const categoryTokens = tokenize(product.category);

  let score = 0;
  terms.forEach((term) => {
    if (fuzzyTokenMatch(term, nameTokens)) score += 8;
    else if (fuzzyTokenMatch(term, brandTokens)) score += 6;
    else if (fuzzyTokenMatch(term, ingredientTokens)) score += 5;
    else if (fuzzyTokenMatch(term, concernTokens)) score += 4;
    else if (fuzzyTokenMatch(term, categoryTokens)) score += 3;
  });
  return score;
}

export function matchesSearch(product, query) {
  return scoreProductSearch(product, query) > 0;
}
