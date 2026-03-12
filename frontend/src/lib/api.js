const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(
  /\/$/,
  ""
);

const DEFAULT_PRODUCT_IMAGE = "/skinmatch-product.png";
const productPrefetchCache = new Map();

function buildUrl(path, query = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const queryString = params.toString();
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path, options.query), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json();
}

export function normalizeProduct(raw) {
  const id = raw.id || raw.sku || raw._id;
  return {
    id: String(id),
    name: raw.name || "Product",
    brand: raw.brand || "SkinMatch",
    category: raw.category || "Skincare",
    rating: Number(raw.rating || 0),
    reviews: Number(raw.reviews || 0),
    price: Number(raw.price || 0),
    discountPct: Number(raw.discountPct || 0),
    skinTypes: raw.skinTypes || [],
    concerns: raw.concerns || [],
    includeIngredients: raw.includeIngredients || [],
    excludeIngredients: raw.excludeIngredients || [],
    description: raw.description || "Premium skincare product selected for your skin goals.",
    tags: raw.tags || [],
    isNew: Boolean(raw.isNew),
    isBestSeller: Boolean(raw.isBestSeller),
    images: [DEFAULT_PRODUCT_IMAGE],
    routineStep: raw.routineStep || "Treat",
    compatibilityTags: raw.compatibilityTags || ["Derm-tested", "SkinMatch approved"]
  };
}

export function normalizeReview(raw) {
  return {
    id: String(raw.id || raw._id),
    productId: String(raw.productId),
    userName: raw.userName || "SkinMatch User",
    skinType: raw.skinType || "All",
    skinConcern: raw.skinConcern || "General",
    ageGroup: raw.ageGroup || "N/A",
    rating: Number(raw.rating || 0),
    comment: raw.comment || "",
    verifiedPurchase: Boolean(raw.verifiedPurchase),
    helpfulCount: Number(raw.helpfulCount || 0),
    beforeImage: raw.beforeImage || "",
    afterImage: raw.afterImage || "",
    createdAt: raw.createdAt || ""
  };
}

export function normalizeIngredient(raw) {
  return {
    name: raw.name,
    benefits: raw.benefits || [],
    suitableSkinTypes: raw.suitableSkinTypes || [],
    spotlightText:
      raw.spotlightText || `${raw.name} supports targeted skincare results across skin profiles.`
  };
}

export function normalizeProfile(raw) {
  if (!raw) return null;
  return {
    userId: String(raw.userId || raw._id || "guest"),
    skinType: raw.skinType || "",
    skinConcerns: raw.skinConcerns || [],
    ageRange: raw.ageRange || "",
    concern: raw.concern || (raw.skinConcerns && raw.skinConcerns[0]) || ""
  };
}

export async function fetchProducts(query = {}) {
  const data = await request("/api/products", { query });
  return (data.products || []).map(normalizeProduct);
}

export async function fetchProductById(productId) {
  if (productPrefetchCache.has(productId)) {
    return productPrefetchCache.get(productId);
  }
  const data = await request(`/api/products/${encodeURIComponent(productId)}`);
  const normalized = data.product ? normalizeProduct(data.product) : null;
  productPrefetchCache.set(productId, normalized);
  return normalized;
}

export async function prefetchProductById(productId) {
  if (!productId || productPrefetchCache.has(productId)) return;
  try {
    const product = await fetchProductById(productId);
    productPrefetchCache.set(productId, product);
  } catch (_error) {
    // no-op: prefetch should never break user flow
  }
}

export async function fetchIngredients() {
  const data = await request("/api/products/ingredients");
  return (data.ingredients || []).map(normalizeIngredient);
}

export async function fetchDiscoverySections() {
  const data = await request("/api/products/discovery");
  return (data.sections || []).map((section) => {
    if (Array.isArray(section.productIds)) {
      return {
        title: section.title,
        productIds: section.productIds.map((id) => String(id))
      };
    }
    if (Array.isArray(section.products)) {
      return {
        title: section.title,
        productIds: section.products.map((product) => String(product.id || product.sku || product._id))
      };
    }
    return { title: section.title || "Discovery", productIds: [] };
  });
}

export async function fetchReviews(query = {}) {
  const data = await request("/api/reviews", { query });
  return (data.reviews || []).map(normalizeReview);
}

export async function fetchRoutine(userId = "guest") {
  const data = await request(`/api/routines/${encodeURIComponent(userId)}`);
  return data.routine || null;
}

export async function saveRoutine(payload) {
  const data = await request("/api/routines", {
    method: "POST",
    body: payload
  });
  return data.routine || null;
}

export async function fetchUserProfile(userId = "guest") {
  const data = await request(`/api/users/profile/${encodeURIComponent(userId)}`);
  return normalizeProfile(data.profile);
}

export async function saveUserProfile(payload) {
  const data = await request("/api/users/profile", {
    method: "POST",
    body: payload
  });
  return normalizeProfile(data.profile);
}

export async function createReview(payload) {
  const data = await request("/api/reviews", {
    method: "POST",
    body: payload
  });
  return data.review ? normalizeReview(data.review) : null;
}

export async function fetchBootstrapData() {
  const [products, ingredients, discoverySections, reviews] = await Promise.all([
    fetchProducts(),
    fetchIngredients(),
    fetchDiscoverySections(),
    fetchReviews()
  ]);

  return {
    products,
    ingredients,
    discoverySections,
    reviews
  };
}
