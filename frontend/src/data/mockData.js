export const categories = [
  "Cleansers",
  "Serums",
  "Moisturizers",
  "Sunscreen",
  "Treatments",
  "Masks"
];

export const ingredients = [
  {
    name: "Niacinamide",
    benefits: ["Reduces oiliness", "Refines pores", "Brightens uneven skin"],
    suitableSkinTypes: ["Oily", "Combination", "Sensitive"],
    spotlightText: "Barrier-strengthening vitamin B3 for daily balancing."
  },
  {
    name: "Retinol",
    benefits: ["Smooths fine lines", "Improves texture", "Targets breakouts"],
    suitableSkinTypes: ["Normal", "Combination", "Mature"],
    spotlightText: "Gold-standard renewal ingredient for night routines."
  },
  {
    name: "Vitamin C",
    benefits: ["Boosts glow", "Reduces dullness", "Fades dark spots"],
    suitableSkinTypes: ["Normal", "Dry", "Combination"],
    spotlightText: "Antioxidant essential for bright, radiant mornings."
  },
  {
    name: "Hyaluronic Acid",
    benefits: ["Deep hydration", "Plumps skin", "Supports moisture barrier"],
    suitableSkinTypes: ["Dry", "Sensitive", "Normal"],
    spotlightText: "Weightless hydration that layers with everything."
  },
  {
    name: "Salicylic Acid",
    benefits: ["Clears pores", "Targets acne", "Controls excess sebum"],
    suitableSkinTypes: ["Oily", "Acne-prone", "Combination"],
    spotlightText: "BHA exfoliant for smoother, clearer texture."
  }
];

export const products = [
  {
    id: "sm-101",
    name: "Glass Skin Niacinamide Serum",
    brand: "Lumora",
    category: "Serums",
    rating: 4.8,
    reviews: 842,
    price: 1299,
    discountPct: 22,
    skinTypes: ["Oily", "Combination", "Sensitive"],
    concerns: ["Pores", "Acne", "Dullness"],
    includeIngredients: ["Niacinamide", "Zinc PCA"],
    excludeIngredients: ["Fragrance", "Parabens"],
    description:
      "A feather-light balancing serum designed to control sebum and visibly refine pores without over-drying.",
    tags: ["Best for acne", "Dermatologist favorites"],
    isNew: true,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1556227834-09f1de7a7d14?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Treat",
    compatibilityTags: ["Fragrance-free", "Pregnancy-safe", "Barrier-safe"]
  },
  {
    id: "sm-102",
    name: "Velvet Barrier Cream",
    brand: "Aurelia Skin",
    category: "Moisturizers",
    rating: 4.7,
    reviews: 613,
    price: 1599,
    discountPct: 18,
    skinTypes: ["Dry", "Sensitive", "Normal"],
    concerns: ["Dryness", "Sensitivity", "Redness"],
    includeIngredients: ["Ceramides", "Hyaluronic Acid", "Panthenol"],
    excludeIngredients: ["Sulfates"],
    description:
      "A rich yet breathable moisturizer that wraps skin in all-day comfort and supports a stronger barrier.",
    tags: ["Best for dry skin", "Dermatologist favorites"],
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600180758890-6c312ed5ef4b?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Moisturize",
    compatibilityTags: ["Barrier-repair", "Sensitive-safe", "Alcohol-free"]
  },
  {
    id: "sm-103",
    name: "Daily Dew Vitamin C Gel",
    brand: "Nuvia",
    category: "Serums",
    rating: 4.5,
    reviews: 412,
    price: 1499,
    discountPct: 15,
    skinTypes: ["Normal", "Combination", "Dry"],
    concerns: ["Dullness", "Dark spots"],
    includeIngredients: ["Vitamin C", "Ferulic Acid", "Vitamin E"],
    excludeIngredients: ["Mineral Oil"],
    description:
      "An antioxidant glow serum that boosts brightness and helps defend against urban stress.",
    tags: ["New launches"],
    isNew: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Treat",
    compatibilityTags: ["Glow-boosting", "Morning-routine", "Vegan"]
  },
  {
    id: "sm-104",
    name: "Cloud Silk Gel Cleanser",
    brand: "Pure Habitat",
    category: "Cleansers",
    rating: 4.6,
    reviews: 534,
    price: 999,
    discountPct: 20,
    skinTypes: ["Oily", "Combination", "Sensitive"],
    concerns: ["Acne", "Texture"],
    includeIngredients: ["Salicylic Acid", "Green Tea"],
    excludeIngredients: ["Parabens", "Artificial Color"],
    description:
      "A low-foam gel cleanser that purifies pores while keeping skin soft and calm.",
    tags: ["Best for oily skin"],
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1626202653015-7e07b8c8d6d9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1631214524020-9d20e1adf7b7?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Cleanse",
    compatibilityTags: ["pH-balanced", "Acne-safe", "Soap-free"]
  },
  {
    id: "sm-105",
    name: "SPF 50 Invisible Fluid",
    brand: "Solaris Lab",
    category: "Sunscreen",
    rating: 4.9,
    reviews: 1191,
    price: 1899,
    discountPct: 12,
    skinTypes: ["All"],
    concerns: ["Sun protection", "Pigmentation"],
    includeIngredients: ["UVA/UVB Filters", "Niacinamide"],
    excludeIngredients: ["White cast agents"],
    description:
      "Ultra-lightweight daily sunscreen with zero cast and a satin finish under makeup.",
    tags: ["Best sellers", "Dermatologist favorites"],
    isNew: false,
    isBestSeller: true,
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556227702-d1e4e7b33d1f?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Protect",
    compatibilityTags: ["No white cast", "Makeup-friendly", "All skin tones"]
  },
  {
    id: "sm-106",
    name: "Overnight Retinol Recovery",
    brand: "Derma Nova",
    category: "Treatments",
    rating: 4.4,
    reviews: 325,
    price: 2199,
    discountPct: 25,
    skinTypes: ["Combination", "Mature", "Normal"],
    concerns: ["Fine lines", "Texture", "Dark spots"],
    includeIngredients: ["Retinol", "Peptides", "Squalane"],
    excludeIngredients: ["Added fragrance"],
    description:
      "Encapsulated retinol treatment for visible resurfacing with minimal irritation.",
    tags: ["Best for texture"],
    isNew: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1591375372226-3531cf2d3578?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1556228841-a3d5c8fcd5f0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1607006483214-7a35f96d6d77?auto=format&fit=crop&w=1000&q=80"
    ],
    routineStep: "Treat",
    compatibilityTags: ["Night-only", "Anti-aging", "Derm-tested"]
  }
];

export const featuredBrands = [
  "Lumora",
  "Aurelia Skin",
  "Nuvia",
  "Pure Habitat",
  "Solaris Lab",
  "Derma Nova"
];

export const beautyTips = [
  {
    title: "Layering Rule",
    text: "Apply products from thinnest to thickest texture for optimal absorption."
  },
  {
    title: "Patch Test First",
    text: "Always patch test active ingredients for 24 hours before full-face use."
  },
  {
    title: "SPF Every Morning",
    text: "Use two-finger amount of sunscreen and reapply every 2-3 hours."
  }
];

export const reviews = [
  {
    id: "rv-1",
    productId: "sm-101",
    userName: "Aisha M.",
    skinType: "Oily",
    skinConcern: "Acne",
    ageGroup: "25-34",
    rating: 5,
    comment:
      "My pores look visibly smaller in two weeks, and it does not pill under moisturizer.",
    verifiedPurchase: true,
    helpfulCount: 72,
    beforeImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    afterImage: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=600&q=80",
    createdAt: "2026-03-01T10:00:00.000Z"
  },
  {
    id: "rv-2",
    productId: "sm-101",
    userName: "Maya K.",
    skinType: "Combination",
    skinConcern: "Dullness",
    ageGroup: "18-24",
    rating: 4,
    comment: "Very elegant texture and no irritation. Skin looks smoother by morning.",
    verifiedPurchase: true,
    helpfulCount: 29,
    createdAt: "2026-03-04T12:30:00.000Z"
  },
  {
    id: "rv-3",
    productId: "sm-102",
    userName: "Riya P.",
    skinType: "Dry",
    skinConcern: "Sensitivity",
    ageGroup: "25-34",
    rating: 5,
    comment: "Best barrier cream I have tried this year. Rich but not greasy.",
    verifiedPurchase: false,
    helpfulCount: 14,
    createdAt: "2026-03-08T09:20:00.000Z"
  }
];

export const routineSteps = {
  morning: ["Cleanse", "Treat", "Moisturize", "Protect"],
  night: ["Cleanse", "Treat", "Moisturize"]
};

export const discoverySections = [
  {
    title: "Best for acne",
    productIds: ["sm-101", "sm-104", "sm-106"]
  },
  {
    title: "Best for oily skin",
    productIds: ["sm-101", "sm-104", "sm-105"]
  },
  {
    title: "Dermatologist favorites",
    productIds: ["sm-101", "sm-102", "sm-105"]
  }
];
