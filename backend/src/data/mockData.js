import fs from "fs";

const categoryImagePool = {
  Cleansers: [
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1600180758890-6c312ed5ef4b?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1100&q=80"
  ],
  Serums: [
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=1100&q=80"
  ],
  Moisturizers: [
    "https://images.unsplash.com/photo-1556228841-a3d5c8fcd5f0?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1591375372226-3531cf2d3578?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1556227702-d1e4e7b33d1f?auto=format&fit=crop&w=1100&q=80"
  ],
  Sunscreen: [
    "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1556228832-94be8b89c5ba?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1556227702-d1e4e7b33d1f?auto=format&fit=crop&w=1100&q=80"
  ],
  Treatments: [
    "https://images.unsplash.com/photo-1607006483214-7a35f96d6d77?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1631214524020-9d20e1adf7b7?auto=format&fit=crop&w=1100&q=80"
  ],
  Masks: [
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1629198735660-e39ea93f5c18?auto=format&fit=crop&w=1100&q=80"
  ],
  Toners: [
    "https://images.unsplash.com/photo-1626202653015-7e07b8c8d6d9?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=1100&q=80"
  ],
  Essences: [
    "https://images.unsplash.com/photo-1626784215021-2e39cc1f3b6b?auto=format&fit=crop&w=1100&q=80",
    "https://images.unsplash.com/photo-1619451427882-8f48f0d95b0f?auto=format&fit=crop&w=1100&q=80"
  ]
};

const externalCatalogPath = new URL("./nykaaCatalog.json", import.meta.url);
const catalogImagesDir = new URL("./catalog-images/", import.meta.url);

function loadCatalogImage(index) {
  const filename = `product-${String(index + 1).padStart(2, "0")}.png`;
  const filepath = new URL(filename, catalogImagesDir);
  try {
    const buffer = fs.readFileSync(filepath);
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (_error) {
    return "";
  }
}

function loadExternalCatalog() {
  try {
    const raw = fs.readFileSync(externalCatalogPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCategory(category) {
  const normalized = (category || "").toLowerCase().trim();
  const map = {
    makeup: "Makeup",
    foundation: "Makeup",
    concealer: "Makeup",
    kajal: "Makeup",
    lipstick: "Makeup",
    mascara: "Makeup",
    palette: "Makeup",
    eyeshadow: "Makeup",
    skincare: "Skincare",
    cleanser: "Cleansers",
    cleansers: "Cleansers",
    facewash: "Cleansers",
    "face wash": "Cleansers",
    serum: "Serums",
    serums: "Serums",
    moisturizer: "Moisturizers",
    moisturizers: "Moisturizers",
    "day cream": "Moisturizers",
    cream: "Moisturizers",
    "night gel": "Moisturizers",
    haircare: "Haircare",
    shampoo: "Haircare",
    "hair oil": "Haircare",
    bodycare: "Bodycare",
    "body lotion": "Bodycare",
    sunscreen: "Sunscreen",
    sun: "Sunscreen",
    spf: "Sunscreen",
    treatment: "Treatments",
    treatments: "Treatments",
    "spot treatment": "Treatments",
    mask: "Masks",
    masks: "Masks",
    toner: "Toners",
    toners: "Toners",
    essence: "Essences",
    essences: "Essences"
  };

  return map[normalized] || category || "Serums";
}

const categoryDefaults = {
  Makeup: {
    routineStep: "Treat",
    skinTypes: ["All"],
    concerns: ["Coverage", "Long wear", "Smooth finish"],
    includeIngredients: ["Pigments", "Silica", "Film Formers"]
  },
  Skincare: {
    routineStep: "Treat",
    skinTypes: ["All"],
    concerns: ["Hydration", "Glow", "Barrier support"],
    includeIngredients: ["Niacinamide", "Vitamin C", "Hyaluronic Acid"]
  },
  Haircare: {
    routineStep: "Treat",
    skinTypes: ["All"],
    concerns: ["Hair fall", "Scalp care", "Shine"],
    includeIngredients: ["Onion Extract", "Biotin", "Plant Oils"]
  },
  Bodycare: {
    routineStep: "Moisturize",
    skinTypes: ["All"],
    concerns: ["Dryness", "Softness", "Nourishment"],
    includeIngredients: ["Shea Butter", "Glycerin", "Vitamin E"]
  },
  Cleansers: {
    routineStep: "Cleanse",
    skinTypes: ["Oily", "Combination", "Sensitive"],
    concerns: ["Acne", "Oiliness", "Texture"],
    includeIngredients: ["Ceramides", "Niacinamide", "Green Tea"]
  },
  Serums: {
    routineStep: "Treat",
    skinTypes: ["Normal", "Combination", "Dry"],
    concerns: ["Dullness", "Dark spots", "Uneven tone"],
    includeIngredients: ["Niacinamide", "Vitamin C", "Hyaluronic Acid"]
  },
  Moisturizers: {
    routineStep: "Moisturize",
    skinTypes: ["Dry", "Sensitive", "Normal"],
    concerns: ["Dryness", "Redness", "Barrier support"],
    includeIngredients: ["Ceramides", "Panthenol", "Squalane"]
  },
  Sunscreen: {
    routineStep: "Protect",
    skinTypes: ["All"],
    concerns: ["Sun protection", "Pigmentation", "Early aging"],
    includeIngredients: ["UV Filters", "Niacinamide", "Antioxidants"]
  },
  Treatments: {
    routineStep: "Treat",
    skinTypes: ["Combination", "Oily", "Mature"],
    concerns: ["Acne", "Fine lines", "Texture"],
    includeIngredients: ["Retinol", "Salicylic Acid", "Peptides"]
  },
  Masks: {
    routineStep: "Treat",
    skinTypes: ["Oily", "Combination", "Normal"],
    concerns: ["Clogged pores", "Dullness", "Oiliness"],
    includeIngredients: ["Clay", "BHA", "Niacinamide"]
  },
  Toners: {
    routineStep: "Treat",
    skinTypes: ["Combination", "Normal", "Oily"],
    concerns: ["Texture", "Pores", "Dullness"],
    includeIngredients: ["Glycolic Acid", "PHA", "Aloe Vera"]
  },
  Essences: {
    routineStep: "Treat",
    skinTypes: ["Dry", "Sensitive", "Normal"],
    concerns: ["Hydration", "Barrier support", "Glow"],
    includeIngredients: ["Snail Mucin", "Hyaluronic Acid", "Centella"]
  }
};

const ingredientSignals = [
  { pattern: /niacinamide/i, ingredient: "Niacinamide" },
  { pattern: /retinol/i, ingredient: "Retinol" },
  { pattern: /salicylic/i, ingredient: "Salicylic Acid" },
  { pattern: /vitamin c/i, ingredient: "Vitamin C" },
  { pattern: /hyaluronic/i, ingredient: "Hyaluronic Acid" },
  { pattern: /ceramide/i, ingredient: "Ceramides" },
  { pattern: /spf|sun|uv/i, ingredient: "UV Filters" },
  { pattern: /snail/i, ingredient: "Snail Mucin" },
  { pattern: /cica|centella/i, ingredient: "Centella" },
  { pattern: /glycolic/i, ingredient: "Glycolic Acid" },
  { pattern: /tea tree/i, ingredient: "Tea Tree" },
  { pattern: /green tea/i, ingredient: "Green Tea" },
  { pattern: /oat/i, ingredient: "Oat Extract" },
  { pattern: /rice/i, ingredient: "Rice Water" },
  { pattern: /clay/i, ingredient: "Clay" }
];

const concernSignals = [
  { pattern: /retinol/i, concern: "Fine lines" },
  { pattern: /salicylic|tea tree/i, concern: "Acne" },
  { pattern: /vitamin c/i, concern: "Dullness" },
  { pattern: /hyaluronic|hydrating/i, concern: "Dryness" },
  { pattern: /sun|spf|uv/i, concern: "Sun protection" },
  { pattern: /pore|clay/i, concern: "Clogged pores" },
  { pattern: /pigment|radiance/i, concern: "Dark spots" }
];

const defaultProductSeeds = [
  { brand: "Maybelline", name: "Fit Me Matte + Poreless Foundation", category: "Makeup", price: 599, useIcon: true },
  { brand: "Maybelline", name: "Fit Me Concealer", category: "Makeup", price: 549, useIcon: true },
  { brand: "Maybelline", name: "Colossal Kajal", category: "Makeup", price: 199, useIcon: true },
  { brand: "Maybelline", name: "SuperStay Matte Ink Lipstick", category: "Makeup", price: 699, useIcon: true },
  { brand: "Maybelline", name: "Colossal Mascara", category: "Makeup", price: 399, useIcon: true },

  { brand: "Lakme", name: "Lakme 9to5 Primer + Matte Foundation", category: "Makeup", price: 650, useIcon: true },
  { brand: "Lakme", name: "Lakme 9to5 Weightless Matte Mousse Lipstick", category: "Makeup", price: 550, useIcon: true },
  { brand: "Lakme", name: "Lakme Eyeconic Kajal", category: "Makeup", price: 249, useIcon: true },
  { brand: "Lakme", name: "Lakme Absolute Skin Natural Mousse", category: "Makeup", price: 825, useIcon: true },
  { brand: "Lakme", name: "Lakme Absolute Perfect Radiance Cream", category: "Skincare", price: 499, useIcon: true },

  { brand: "Sugar Cosmetics", name: "Smudge Me Not Liquid Lipstick", category: "Makeup", price: 699, useIcon: true },
  { brand: "Sugar Cosmetics", name: "Ace of Face Foundation Stick", category: "Makeup", price: 999, useIcon: true },
  { brand: "Sugar Cosmetics", name: "Kohl of Honour Kajal", category: "Makeup", price: 249, useIcon: true },
  { brand: "Sugar Cosmetics", name: "Contour De Force Face Palette", category: "Makeup", price: 799, useIcon: true },
  { brand: "Sugar Cosmetics", name: "Blend The Rules Eyeshadow Palette", category: "Makeup", price: 1199, useIcon: true },

  { brand: "Mamaearth", name: "Ubtan Face Wash", category: "Cleansers", price: 349, useIcon: true },
  { brand: "Mamaearth", name: "Vitamin C Face Serum", category: "Skincare", price: 699, useIcon: true },
  { brand: "Mamaearth", name: "Rice Face Wash", category: "Cleansers", price: 349, useIcon: true },
  { brand: "Mamaearth", name: "Onion Hair Oil", category: "Haircare", price: 449, useIcon: true },
  { brand: "Mamaearth", name: "Tea Tree Face Wash", category: "Cleansers", price: 349, useIcon: true },

  { brand: "WOW Skin Science", name: "Vitamin C Face Wash", category: "Cleansers", price: 399, useIcon: true },
  { brand: "WOW Skin Science", name: "Aloe Vera Gel", category: "Skincare", price: 299, useIcon: true },
  { brand: "WOW Skin Science", name: "Onion Black Seed Oil Shampoo", category: "Haircare", price: 499, useIcon: true },
  { brand: "WOW Skin Science", name: "Apple Cider Vinegar Shampoo", category: "Haircare", price: 499, useIcon: true },
  { brand: "WOW Skin Science", name: "Vitamin C Serum", category: "Skincare", price: 549, useIcon: true },

  { brand: "Minimalist", name: "Niacinamide 10% Serum", category: "Skincare", price: 599, useIcon: true },
  { brand: "Minimalist", name: "Salicylic Acid Cleanser", category: "Cleansers", price: 299, useIcon: true },
  { brand: "Minimalist", name: "Hyaluronic Acid Serum", category: "Skincare", price: 599, useIcon: true },
  { brand: "Minimalist", name: "Vitamin C Serum", category: "Skincare", price: 699, useIcon: true },
  { brand: "Minimalist", name: "Sunscreen SPF 50", category: "Sunscreen", price: 399, useIcon: true },

  { brand: "Plum", name: "Green Tea Face Wash", category: "Cleansers", price: 395, useIcon: true },
  { brand: "Plum", name: "Green Tea Night Gel", category: "Moisturizers", price: 575, useIcon: true },
  { brand: "Plum", name: "Vitamin C Serum", category: "Skincare", price: 699, useIcon: true },
  { brand: "Plum", name: "Rice Water Sunscreen", category: "Sunscreen", price: 549, useIcon: true },
  { brand: "Plum", name: "BodyLovin Vanilla Body Lotion", category: "Bodycare", price: 475, useIcon: true },

  { brand: "Dot & Key", name: "Vitamin C + E Super Bright Serum", category: "Skincare", price: 595, useIcon: true },
  { brand: "Dot & Key", name: "Cica Calming Night Gel", category: "Moisturizers", price: 595, useIcon: true },
  { brand: "Dot & Key", name: "Watermelon Cooling Sunscreen", category: "Sunscreen", price: 495, useIcon: true },
  { brand: "Dot & Key", name: "Hyaluronic Hydrating Moisturizer", category: "Moisturizers", price: 595, useIcon: true },
  { brand: "Dot & Key", name: "Glow Revealing Face Wash", category: "Cleansers", price: 395, useIcon: true },

  { brand: "Himalaya", name: "Neem Face Wash", category: "Cleansers", price: 175, useIcon: true },
  { brand: "Himalaya", name: "Nourishing Skin Cream", category: "Moisturizers", price: 220, useIcon: true },
  { brand: "Himalaya", name: "Purifying Neem Pack", category: "Masks", price: 150, useIcon: true },
  { brand: "Himalaya", name: "Lip Balm", category: "Bodycare", price: 150, useIcon: true },
  { brand: "Himalaya", name: "Aloe Vera Gel", category: "Skincare", price: 120, useIcon: true },

  { brand: "Garnier", name: "Garnier Micellar Cleansing Water", category: "Cleansers", price: 349, useIcon: true },
  { brand: "Garnier", name: "Garnier Vitamin C Serum", category: "Skincare", price: 549, useIcon: true },
  { brand: "Garnier", name: "Bright Complete Face Wash", category: "Cleansers", price: 199, useIcon: true },
  { brand: "Garnier", name: "Garnier Sheet Masks", category: "Masks", price: 99, useIcon: true },
  { brand: "Garnier", name: "Garnier BB Cream", category: "Makeup", price: 199, useIcon: true }
];

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function inferIngredients(name, category) {
  const fromName = ingredientSignals
    .filter((signal) => signal.pattern.test(name))
    .map((signal) => signal.ingredient);
  return uniq([...(categoryDefaults[category]?.includeIngredients || []), ...fromName]).slice(0, 4);
}

function inferConcerns(name, category) {
  const fromName = concernSignals
    .filter((signal) => signal.pattern.test(name))
    .map((signal) => signal.concern);
  return uniq([...(categoryDefaults[category]?.concerns || []), ...fromName]).slice(0, 4);
}

function inferSkinTypes(name, category) {
  const defaults = categoryDefaults[category]?.skinTypes || ["All"];
  if (/gentle|cica|sensitive/i.test(name)) return uniq(["Sensitive", ...defaults]).slice(0, 4);
  if (/oil|pore|acne|salicylic/i.test(name)) return uniq(["Oily", "Combination", ...defaults]).slice(0, 4);
  if (/hydrating|hyaluronic|cream|moisturizing/i.test(name))
    return uniq(["Dry", "Sensitive", ...defaults]).slice(0, 4);
  return defaults;
}

function productId(index) {
  return `sm-${101 + index}`;
}

const brandIconPalettes = {
  Maybelline: ["#21253D", "#4D5BAA"],
  Lakme: ["#2E2437", "#8B6BA7"],
  "Sugar Cosmetics": ["#2F2A2D", "#D25F7A"],
  Mamaearth: ["#1F6B50", "#45A178"],
  "WOW Skin Science": ["#24535D", "#4D9EAF"],
  Minimalist: ["#2F3440", "#8A96B0"],
  Plum: ["#4B2A56", "#A36AB8"],
  "Dot & Key": ["#3A2F52", "#B57CB4"],
  Himalaya: ["#2E6A43", "#5BA070"],
  Garnier: ["#31584A", "#6DA885"]
};

function escapeSvg(value) {
  return String(value).replace(/[<>&"']/g, (char) => {
    const map = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      '"': "&quot;",
      "'": "&apos;"
    };
    return map[char] || char;
  });
}

function buildIconImage(seed, index) {
  const [bgA, bgB] = brandIconPalettes[seed.brand] || ["#4a4f62", "#8f95b0"];
  const initials = String(seed.brand || "SM")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const title = String(seed.name || "SkinMatch").split(/\s+/).slice(0, 3).join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg-${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bgA}" />
      <stop offset="100%" stop-color="${bgB}" />
    </linearGradient>
  </defs>
  <rect width="640" height="640" rx="70" fill="url(#bg-${index})" />
  <circle cx="320" cy="228" r="116" fill="rgba(255,255,255,0.15)" />
  <text x="320" y="248" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="700">${escapeSvg(
    initials
  )}</text>
  <text x="320" y="404" text-anchor="middle" fill="#ffffff" opacity="0.95" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">${escapeSvg(
    seed.brand
  )}</text>
  <text x="320" y="456" text-anchor="middle" fill="#ffffff" opacity="0.92" font-family="Arial, Helvetica, sans-serif" font-size="27">${escapeSvg(
    title
  )}</text>
  <text x="320" y="526" text-anchor="middle" fill="#ffffff" opacity="0.75" font-family="Arial, Helvetica, sans-serif" font-size="22">SkinMatch Catalog Icon</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function inferRoutineStep(name, category, fallback) {
  const normalizedName = String(name || "").toLowerCase();
  if (/cleanser|face wash|facewash|micellar|wash/.test(normalizedName)) return "Cleanse";
  if (/sunscreen|spf|sun/.test(normalizedName)) return "Protect";
  if (/moisturizer|body lotion|night gel|cream|gel/.test(normalizedName) && category !== "Makeup") {
    return "Moisturize";
  }
  return fallback || "Treat";
}

const externalProductSeeds = loadExternalCatalog()
  .map((seed) => ({
    id: seed.id || seed.sku || "",
    brand: seed.brand || "",
    name: seed.name || seed.productName || "",
    category: seed.category || "Serums",
    price: seed.price,
    mrp: seed.mrp,
    rating: seed.rating,
    reviews: seed.reviews,
    discountPct: seed.discountPct,
    description: seed.description,
    images: Array.isArray(seed.images) ? seed.images : [],
    productUrl: seed.productUrl || "",
    skinTypes: Array.isArray(seed.skinTypes) ? seed.skinTypes : [],
    concerns: Array.isArray(seed.concerns) ? seed.concerns : [],
    includeIngredients: Array.isArray(seed.includeIngredients) ? seed.includeIngredients : [],
    excludeIngredients: Array.isArray(seed.excludeIngredients) ? seed.excludeIngredients : [],
    tags: Array.isArray(seed.tags) ? seed.tags : [],
    routineStep: seed.routineStep || "",
    useIcon: Boolean(seed.useIcon),
    isNew: seed.isNew,
    isBestSeller: seed.isBestSeller,
    compatibilityTags: Array.isArray(seed.compatibilityTags) ? seed.compatibilityTags : []
  }))
  .filter((seed) => seed.brand && seed.name && seed.price);

const productSeeds = externalProductSeeds.length >= 50 ? externalProductSeeds : defaultProductSeeds;

function buildProduct(seed, index) {
  const category = normalizeCategory(seed.category);
  const imagePool = categoryImagePool[category] || categoryImagePool.Serums;
  const ingredientList =
    Array.isArray(seed.includeIngredients) && seed.includeIngredients.length > 0
      ? seed.includeIngredients
      : inferIngredients(seed.name, category);
  const concerns =
    Array.isArray(seed.concerns) && seed.concerns.length > 0
      ? seed.concerns
      : inferConcerns(seed.name, category);
  const skinTypes =
    Array.isArray(seed.skinTypes) && seed.skinTypes.length > 0
      ? seed.skinTypes
      : inferSkinTypes(seed.name, category);
  const baseRoutineStep = seed.routineStep || categoryDefaults[category]?.routineStep || "Treat";
  const routineStep = inferRoutineStep(seed.name, category, baseRoutineStep);
  const price = parseNumber(seed.price, 999);
  const discountPct = parseNumber(seed.discountPct, 10 + (index % 18));
  const reviews = parseNumber(seed.reviews, 170 + index * 23);
  const rating = parseNumber(seed.rating, Number((4.2 + ((index % 8) * 0.1)).toFixed(1)));
  const isBestSeller = typeof seed.isBestSeller === "boolean" ? seed.isBestSeller : index % 3 === 0;
  const isNew = typeof seed.isNew === "boolean" ? seed.isNew : index % 8 === 0;
  const seedName = String(seed.name || "").trim();
  const normalizedName =
    seedName.toLowerCase().startsWith(String(seed.brand || "").toLowerCase()) || !seed.brand
      ? seedName
      : `${seed.brand} ${seedName}`;
  const providedImages =
    Array.isArray(seed.images) && seed.images.length > 0 ? seed.images.filter(Boolean) : [];
  const catalogImage = loadCatalogImage(index);
  const iconImage = seed.useIcon ? buildIconImage(seed, index) : "";
  const mergedImages =
    providedImages.length > 0
      ? providedImages
      : catalogImage
        ? [catalogImage]
      : iconImage
        ? [iconImage]
        : [imagePool[index % imagePool.length], imagePool[(index + 1) % imagePool.length]];
  const mergedTags = Array.isArray(seed.tags) && seed.tags.length > 0 ? seed.tags : null;
  const mergedCompatibility =
    Array.isArray(seed.compatibilityTags) && seed.compatibilityTags.length > 0
      ? seed.compatibilityTags
      : null;
  const tags = uniq([
    ...(mergedTags || []),
    mergedTags ? null : isBestSeller ? "Best sellers" : null,
    mergedTags ? null : isNew ? "New launches" : null,
    mergedTags ? null : concerns.includes("Acne") ? "Best for acne" : null,
    mergedTags ? null : skinTypes.includes("Oily") ? "Best for oily skin" : null,
    mergedTags ? null : index % 5 === 0 ? "Dermatologist favorites" : null
  ]);
  const entityId = seed.id || seed.sku || productId(index);

  return {
    _id: String(entityId),
    sku: String(entityId),
    name: normalizedName,
    brand: seed.brand,
    category,
    rating,
    reviews,
    price,
    discountPct,
    skinTypes,
    concerns,
    includeIngredients: ingredientList,
    excludeIngredients: ["Parabens", "Mineral Oil"],
    description:
      seed.description ||
      `${normalizedName} is formulated with ${ingredientList
        .slice(0, 2)
        .join(" and ")} to target ${concerns.slice(0, 2).join(" and ").toLowerCase()}.`,
    productUrl: seed.productUrl || "",
    tags,
    isNew,
    isBestSeller,
    images: mergedImages,
    routineStep,
    compatibilityTags: uniq([
      ...(mergedCompatibility || []),
      mergedCompatibility ? null : "Dermatologist tested",
      mergedCompatibility ? null : skinTypes.includes("Sensitive") ? "Sensitive-safe" : null,
      mergedCompatibility ? null : ingredientList.includes("UV Filters") ? "No white cast" : null,
      mergedCompatibility ? null : ingredientList.includes("Ceramides") ? "Barrier-repair" : null,
      mergedCompatibility ? null : "Fragrance-aware"
    ])
  };
}

export const mockProducts = productSeeds.map((seed, index) => buildProduct(seed, index));

const ingredientBenefits = {
  Niacinamide: ["Balances oil", "Refines pores", "Brightens uneven tone"],
  Retinol: ["Smooths texture", "Targets fine lines", "Supports renewal"],
  "Salicylic Acid": ["Unclogs pores", "Reduces acne", "Controls sebum"],
  "Vitamin C": ["Boosts glow", "Fades dullness", "Supports antioxidant defense"],
  "Hyaluronic Acid": ["Deep hydration", "Plumps skin", "Supports moisture barrier"],
  Ceramides: ["Strengthens barrier", "Prevents moisture loss", "Calms dryness"],
  "UV Filters": ["Broad spectrum protection", "Helps prevent tanning", "Reduces UV stress"],
  "Snail Mucin": ["Supports repair", "Improves hydration", "Smooths skin texture"],
  Centella: ["Calms redness", "Supports healing", "Soothes sensitivity"],
  "Glycolic Acid": ["Refines texture", "Improves clarity", "Targets dullness"],
  "Tea Tree": ["Purifies skin", "Targets blemishes", "Balances oil"],
  "Green Tea": ["Antioxidant care", "Calms skin", "Reduces irritation"],
  "Oat Extract": ["Soothes skin", "Supports barrier", "Eases sensitivity"],
  "Rice Water": ["Enhances glow", "Improves softness", "Hydrates skin"],
  Clay: ["Absorbs oil", "Cleans pores", "Mattifies skin"]
};

export const mockIngredients = uniq(mockProducts.flatMap((product) => product.includeIngredients)).map(
  (ingredient) => {
    const suitableSkinTypes = uniq(
      mockProducts
        .filter((product) => product.includeIngredients.includes(ingredient))
        .flatMap((product) => product.skinTypes)
    ).slice(0, 4);

    return {
      name: ingredient,
      benefits: ingredientBenefits[ingredient] || [
        "Supports targeted skincare goals",
        "Works well in layered routines",
        "Pairs with barrier support care"
      ],
      suitableSkinTypes
    };
  }
);

const acneIds = mockProducts.filter((product) => product.concerns.includes("Acne")).slice(0, 8).map((p) => p._id);
const oilyIds = mockProducts.filter((product) => product.skinTypes.includes("Oily")).slice(0, 8).map((p) => p._id);
const dermIds = mockProducts.filter((product) => product.tags.includes("Dermatologist favorites")).slice(0, 8).map((p) => p._id);

export const mockDiscovery = [
  {
    title: "Best for acne",
    productIds: acneIds
  },
  {
    title: "Best for oily skin",
    productIds: oilyIds
  },
  {
    title: "Dermatologist favorites",
    productIds: dermIds
  }
];

export const mockReviews = [
  {
    _id: "rv-1",
    productId: "sm-116",
    userName: "Aisha M.",
    rating: 5,
    comment: "Cleanses well without drying and works great for daily use.",
    skinType: "Oily",
    skinConcern: "Acne",
    ageGroup: "25-34",
    verifiedPurchase: true,
    helpfulCount: 81,
    beforeImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-03-02T10:20:00.000Z"
  },
  {
    _id: "rv-2",
    productId: "sm-139",
    userName: "Naina R.",
    rating: 5,
    comment: "Hydrates deeply and layers perfectly before makeup.",
    skinType: "Dry",
    skinConcern: "Dryness",
    ageGroup: "25-34",
    verifiedPurchase: true,
    helpfulCount: 64,
    beforeImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-03-04T08:44:00.000Z"
  },
  {
    _id: "rv-3",
    productId: "sm-126",
    userName: "Ishita K.",
    rating: 4,
    comment: "My skin looks more balanced and less oily by noon.",
    skinType: "Combination",
    skinConcern: "Pores",
    ageGroup: "18-24",
    verifiedPurchase: true,
    helpfulCount: 39,
    createdAt: "2026-03-05T15:11:00.000Z"
  },
  {
    _id: "rv-4",
    productId: "sm-130",
    userName: "Ritika P.",
    rating: 5,
    comment: "No white cast and easy to reapply through the day.",
    skinType: "Sensitive",
    skinConcern: "Sun protection",
    ageGroup: "25-34",
    verifiedPurchase: true,
    helpfulCount: 58,
    createdAt: "2026-03-06T12:00:00.000Z"
  },
  {
    _id: "rv-5",
    productId: "sm-130",
    userName: "Megha T.",
    rating: 4,
    comment: "Matte finish with no flashback. Works well under foundation.",
    skinType: "Oily",
    skinConcern: "Sun protection",
    ageGroup: "18-24",
    verifiedPurchase: true,
    helpfulCount: 27,
    createdAt: "2026-03-07T09:12:00.000Z"
  },
  {
    _id: "rv-6",
    productId: "sm-116",
    userName: "Karishma V.",
    rating: 4,
    comment: "Helped with small breakouts. Good texture and no tightness after wash.",
    skinType: "Combination",
    skinConcern: "Acne",
    ageGroup: "25-34",
    verifiedPurchase: false,
    helpfulCount: 18,
    createdAt: "2026-03-08T07:30:00.000Z"
  },
  {
    _id: "rv-7",
    productId: "sm-139",
    userName: "Sanya D.",
    rating: 5,
    comment: "Skin felt softer in 1 week. Great for dry patches around cheeks.",
    skinType: "Dry",
    skinConcern: "Dryness",
    ageGroup: "35-44",
    verifiedPurchase: true,
    helpfulCount: 42,
    createdAt: "2026-03-10T18:05:00.000Z"
  },
  {
    _id: "rv-8",
    productId: "sm-126",
    userName: "Anika G.",
    rating: 4,
    comment: "Noticeably smoother texture with regular use, especially near T-zone.",
    skinType: "Oily",
    skinConcern: "Pores",
    ageGroup: "25-34",
    verifiedPurchase: true,
    helpfulCount: 31,
    createdAt: "2026-03-11T11:00:00.000Z"
  }
];

export const mockRoutines = [
  {
    _id: "rt-1",
    userId: "guest",
    morning: [
      { step: "Cleanse", productId: "sm-116" },
      { step: "Treat", productId: "sm-126" },
      { step: "Moisturize", productId: "sm-139" },
      { step: "Protect", productId: "sm-130" }
    ],
    night: [
      { step: "Cleanse", productId: "sm-118" },
      { step: "Treat", productId: "sm-137" },
      { step: "Moisturize", productId: "sm-132" }
    ]
  }
];

export const mockProfiles = [
  {
    _id: "pf-1",
    userId: "guest",
    skinType: "Combination",
    skinConcerns: ["Acne", "Dullness"],
    ageRange: "25-34"
  }
];
