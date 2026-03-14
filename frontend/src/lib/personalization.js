const SEARCH_SYNONYMS = {
  "vit c": ["vitamin c", "ascorbic acid"],
  "ascorbic acid": ["vitamin c", "vit c"],
  niacinamide: ["vitamin b3", "b3"],
  retinol: ["vitamin a"],
  "hyaluronic acid": ["ha", "hydrating"],
  salicylic: ["bha", "salicylic acid"],
  acne: ["breakout", "blemish"],
  oily: ["oil control", "sebum"],
  sunscreen: ["spf", "sun protection"],
  skincare: ["serum", "serums", "cleanser", "cleansers", "moisturizer", "moisturizers", "sunscreen"],
  dry: ["dehydrated", "tight", "flaky"],
  sensitive: ["redness", "irritation"],
  combination: ["combo"]
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

const SKIN_TYPE_TOKENS = {
  Oily: ["oily", "oil", "sebum", "shine"],
  Dry: ["dry", "dehydrated", "tight", "flaky"],
  Combination: ["combination", "combo", "t-zone"],
  Sensitive: ["sensitive", "redness", "irritation"],
  "Acne-Prone": ["acne", "breakout", "blemish"],
  Normal: ["normal", "balanced"]
};

const SKIN_TYPE_CONCERNS = {
  Oily: ["Oil control", "Pores", "Acne"],
  Dry: ["Hydration", "Barrier", "Dullness"],
  Combination: ["Oil control", "Hydration", "Texture"],
  Sensitive: ["Soothing", "Redness", "Barrier"],
  "Acne-Prone": ["Acne", "Pores", "Texture"],
  Normal: ["Glow", "Radiance", "Hydration"]
};

const SKIN_TYPE_INGREDIENTS = {
  Oily: ["Niacinamide", "Salicylic Acid", "BHA", "Green Tea"],
  Dry: ["Hyaluronic Acid", "Ceramides", "Squalane", "Glycerin"],
  Combination: ["Niacinamide", "Hyaluronic Acid", "Ceramides"],
  Sensitive: ["Centella", "Aloe", "Ceramides", "Panthenol"],
  "Acne-Prone": ["Salicylic Acid", "BHA", "Retinol", "Niacinamide"],
  Normal: ["Vitamin C", "Hyaluronic Acid", "Ceramides"]
};

const AVOID_INGREDIENTS = {
  Oily: ["Heavy oils", "Mineral oil"],
  Dry: ["Strong acids", "High alcohol"],
  Combination: ["Heavy oils", "Strong acids"],
  Sensitive: ["Fragrance", "Alcohol", "Strong acids"],
  "Acne-Prone": ["Comedogenic oils", "Heavy oils"],
  Normal: []
};

export function normalizeSkinType(value) {
  if (!value) return "";
  const cleaned = String(value).toLowerCase();
  if (cleaned.includes("acne")) return "Acne-Prone";
  if (cleaned.includes("dry")) return "Dry";
  if (cleaned.includes("oily")) return "Oily";
  if (cleaned.includes("comb")) return "Combination";
  if (cleaned.includes("sens")) return "Sensitive";
  return "Normal";
}

export function formatSkinType(value) {
  if (!value) return "Normal Skin";
  const normalized = normalizeSkinType(value);
  if (normalized === "Acne-Prone") return "Acne-Prone Skin";
  return `${normalized} Skin`;
}

export function inferSkinTypeFromAnswers(answers = {}) {
  let score = {
    Oily: 0,
    Dry: 0,
    Combination: 0,
    Sensitive: 0,
    "Acne-Prone": 0,
    Normal: 0
  };

  const feel = answers.afterWash;
  if (feel === "Tight / Dry") score.Dry += 3;
  if (feel === "Comfortable") score.Normal += 2;
  if (feel === "Slightly oily") score.Combination += 2;
  if (feel === "Very oily") score.Oily += 3;

  const breakouts = answers.breakouts;
  if (breakouts === "Very often") score["Acne-Prone"] += 3;
  if (breakouts === "Sometimes") score["Acne-Prone"] += 2;
  if (breakouts === "Rarely") score.Normal += 1;

  const pores = answers.pores;
  if (pores === "Very visible") score.Oily += 2;
  if (pores === "Moderately visible") score.Combination += 1;

  const reaction = answers.reaction;
  if (reaction === "Sensitive / redness") score.Sensitive += 3;
  if (reaction === "Slight irritation sometimes") score.Sensitive += 1;
  if (reaction === "No reaction") score.Normal += 1;

  const midday = answers.midday;
  if (midday === "Very oily") score.Oily += 3;
  if (midday === "Slightly shiny") score.Combination += 2;
  if (midday === "Normal") score.Normal += 2;
  if (midday === "Dry patches") score.Dry += 2;

  const entries = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [topType, topScore] = entries[0];
  if (topScore === 0) return "Normal Skin";
  return formatSkinType(topType);
}

export function extractSearchIntent(query) {
  const tokens = tokenize(query);
  const intent = {
    skinTypes: [],
    concerns: []
  };

  Object.entries(SKIN_TYPE_TOKENS).forEach(([type, keywords]) => {
    if (keywords.some((keyword) => tokens.includes(keyword))) {
      intent.skinTypes.push(type);
      if (type === "Acne-Prone") intent.concerns.push("Acne");
    }
  });

  if (tokens.includes("acne")) intent.concerns.push("Acne");
  if (tokens.includes("brightening")) intent.concerns.push("Brightening");
  if (tokens.includes("hydration") || tokens.includes("hydrating")) intent.concerns.push("Hydration");

  return intent;
}

export function getBeautyMatchScore(product, skinType, skinConcerns = []) {
  if (!product) return 0;
  const normalized = normalizeSkinType(skinType);
  let score = 50;

  if (normalized && (product.skinTypes || []).includes(normalized)) score += 22;

  const concernMatches = (skinConcerns || []).filter((concern) =>
    (product.concerns || []).includes(concern)
  );
  score += concernMatches.length * 8;

  const targetConcerns = SKIN_TYPE_CONCERNS[normalized] || [];
  if (targetConcerns.some((concern) => (product.concerns || []).includes(concern))) score += 10;

  const targetIngredients = SKIN_TYPE_INGREDIENTS[normalized] || [];
  if (targetIngredients.some((ingredient) => (product.includeIngredients || []).includes(ingredient))) score += 8;

  if (product.isBestSeller) score += 4;
  if (product.isNew) score += 2;

  return Math.max(32, Math.min(98, score));
}

export function getGlowScore(product) {
  if (!product) return 0;
  const base = product.rating || 0;
  const reviewBoost = Math.min(0.6, Math.log10((product.reviews || 1) + 1) / 4);
  const score = Math.min(5, base + reviewBoost);
  return Number(score.toFixed(1));
}

export function getBenefitTag(product) {
  const tags = [
    ...(product.compatibilityTags || []),
    ...(product.concerns || []),
    ...(product.includeIngredients || [])
  ];
  const priority = [
    "Oil Control",
    "Hydrating",
    "Acne Safe",
    "Dermat Approved",
    "Brightening",
    "Barrier",
    "Sun protection",
    "Texture"
  ];
  const found = priority.find((label) =>
    tags.some((tag) => String(tag).toLowerCase().includes(label.toLowerCase()))
  );
  return found || "Glow Boost";
}

export function filterProductsForSkinType(products, skinType, skinConcerns = []) {
  const normalized = normalizeSkinType(skinType);
  if (!normalized) return products;
  const targetConcerns = SKIN_TYPE_CONCERNS[normalized] || [];
  return products.filter((product) => {
    const skinMatch = (product.skinTypes || []).includes(normalized);
    const concernMatch =
      skinConcerns.length === 0
        ? targetConcerns.some((concern) => (product.concerns || []).includes(concern))
        : skinConcerns.some((concern) => (product.concerns || []).includes(concern));
    return skinMatch || concernMatch;
  });
}

export function buildRoutine(products, skinType) {
  const normalized = normalizeSkinType(skinType);
  const pick = (step, categoryFallbacks) =>
    products.find(
      (product) =>
        product.routineStep === step ||
        (categoryFallbacks || []).includes(product.category)
    );

  const cleanser = pick("Cleanse", ["Cleansers"]);
  const toner = pick("Treat", ["Treatments"]);
  const serum = pick("Treat", ["Serums"]);
  const moisturizer = pick("Moisturize", ["Moisturizers"]);
  const sunscreen = pick("Protect", ["Sunscreen"]);
  const nightTreatment = normalized === "Dry" ? pick("Treat", ["Masks"]) : pick("Treat", ["Serums"]);

  return {
    morning: [
      { label: "Cleanser", product: cleanser },
      { label: "Toner", product: toner },
      { label: "Serum", product: serum },
      { label: "Moisturizer", product: moisturizer },
      { label: "Sunscreen", product: sunscreen }
    ],
    night: [
      { label: "Cleanser", product: cleanser },
      { label: "Treatment Serum", product: serum },
      { label: "Moisturizer", product: moisturizer },
      { label: "Sleeping Mask", product: nightTreatment }
    ]
  };
}

export function getAvoidIngredients(skinType) {
  const normalized = normalizeSkinType(skinType);
  return AVOID_INGREDIENTS[normalized] || [];
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
  const score = searchScoreForProduct(product, query);
  if (score > 0) return true;
  const intent = extractSearchIntent(query);
  if (intent.skinTypes.length > 0) {
    return intent.skinTypes.some((skin) => (product.skinTypes || []).includes(skin));
  }
  if (intent.concerns.length > 0) {
    return intent.concerns.some((concern) => (product.concerns || []).includes(concern));
  }
  return false;
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
