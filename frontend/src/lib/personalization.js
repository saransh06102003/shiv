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
    .map((item) => item.trim())
    .filter(Boolean);
}

export function expandSearchTerms(query) {
  const normalized = String(query || "").toLowerCase().trim();
  if (!normalized) return [];

  const baseTokens = tokenize(normalized);
  const phraseTokens = [normalized];
  const expanded = [...baseTokens, ...phraseTokens];

  baseTokens.forEach((token) => {
    expanded.push(...(SEARCH_SYNONYMS[token] || []));
  });
  if (SEARCH_SYNONYMS[normalized]) expanded.push(...SEARCH_SYNONYMS[normalized]);

  return unique(expanded.map((item) => item.trim().toLowerCase()));
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

function fuzzyTokenMatch(token, valueTokens) {
  if (!token) return false;
  if (valueTokens.includes(token)) return true;
  return valueTokens.some((item) => {
    if (item.includes(token) || token.includes(item)) return true;
    if (Math.abs(item.length - token.length) > 2) return false;
    const threshold = token.length <= 5 ? 1 : 2;
    return levenshteinDistance(item, token) <= threshold;
  });
}

export function searchScoreForProduct(product, query) {
  const terms = expandSearchTerms(query);
  if (terms.length === 0) return 0;

  const nameTokens = tokenize(product.name);
  const brandTokens = tokenize(product.brand);
  const ingredientTokens = tokenize((product.includeIngredients || []).join(" "));
  const concernTokens = tokenize((product.concerns || []).join(" "));
  const categoryTokens = tokenize(product.category);
  const allTokens = unique([
    ...nameTokens,
    ...brandTokens,
    ...ingredientTokens,
    ...concernTokens,
    ...categoryTokens
  ]);

  let score = 0;
  terms.forEach((term) => {
    if (fuzzyTokenMatch(term, nameTokens)) score += 8;
    else if (fuzzyTokenMatch(term, brandTokens)) score += 6;
    else if (fuzzyTokenMatch(term, ingredientTokens)) score += 5;
    else if (fuzzyTokenMatch(term, concernTokens)) score += 4;
    else if (fuzzyTokenMatch(term, categoryTokens)) score += 3;
    else if (fuzzyTokenMatch(term, allTokens)) score += 1;
  });

  return score;
}

export function matchesProductSearch(product, query) {
  return searchScoreForProduct(product, query) > 0;
}

export function profileScoreForProduct(product, skinProfile) {
  if (!skinProfile) return 0;
  let score = 0;

  if (skinProfile.skinType && (product.skinTypes || []).includes(skinProfile.skinType)) score += 12;
  if (skinProfile.concern && (product.concerns || []).includes(skinProfile.concern)) score += 10;
  if (Array.isArray(skinProfile.skinConcerns) && skinProfile.skinConcerns.length > 0) {
    const concernMatches = skinProfile.skinConcerns.filter((concern) =>
      (product.concerns || []).includes(concern)
    ).length;
    score += concernMatches * 6;
  }

  if (skinProfile.budget) {
    if (skinProfile.budget === "budget" && product.price <= 600) score += 6;
    if (skinProfile.budget === "mid" && product.price > 600 && product.price <= 1200) score += 6;
    if (skinProfile.budget === "premium" && product.price > 1200) score += 6;
  }

  if (product.isBestSeller) score += 2;
  if (product.isNew) score += 1;
  return score;
}

export function sortProductsByProfile(products, skinProfile) {
  if (!skinProfile) return products;
  return [...products].sort((a, b) => {
    const diff = profileScoreForProduct(b, skinProfile) - profileScoreForProduct(a, skinProfile);
    if (diff !== 0) return diff;
    return b.rating - a.rating;
  });
}
