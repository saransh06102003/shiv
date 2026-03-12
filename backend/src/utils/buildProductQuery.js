import { expandSearchTerms, scoreProductSearch } from "./searchHelpers.js";

export function buildMongoProductQuery(query) {
  const mongoQuery = {};

  if (query.category) mongoQuery.category = query.category;
  if (query.brand) mongoQuery.brand = query.brand;

  if (query.minRating) {
    mongoQuery.rating = { ...(mongoQuery.rating || {}), $gte: Number(query.minRating) };
  }

  if (query.minPrice || query.maxPrice) {
    mongoQuery.price = {};
    if (query.minPrice) mongoQuery.price.$gte = Number(query.minPrice);
    if (query.maxPrice) mongoQuery.price.$lte = Number(query.maxPrice);
  }

  if (query.skinType) {
    mongoQuery.skinTypes = query.skinType;
  }

  if (query.concern) {
    mongoQuery.concerns = query.concern;
  }

  if (query.ingredientInclude) {
    mongoQuery.includeIngredients = query.ingredientInclude;
  }

  if (query.ingredientExclude) {
    mongoQuery.includeIngredients = { $ne: query.ingredientExclude };
  }

  if (query.search) {
    const terms = expandSearchTerms(query.search).slice(0, 5);
    const regex = terms.length > 0 ? terms.join("|") : query.search;
    mongoQuery.$or = [
      { name: { $regex: regex, $options: "i" } },
      { brand: { $regex: regex, $options: "i" } },
      { includeIngredients: { $regex: regex, $options: "i" } }
    ];
  }

  return mongoQuery;
}

export function filterMockProducts(products, query) {
  const search = (query.search || "").toLowerCase();
  const minPrice = query.minPrice ? Number(query.minPrice) : null;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : null;
  const minRating = query.minRating ? Number(query.minRating) : null;

  const filtered = products.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (query.brand && product.brand !== query.brand) return false;
    if (query.skinType && !product.skinTypes.includes(query.skinType)) return false;
    if (query.concern && !product.concerns.includes(query.concern)) return false;
    if (query.ingredientInclude && !product.includeIngredients.includes(query.ingredientInclude))
      return false;
    if (query.ingredientExclude && product.includeIngredients.includes(query.ingredientExclude))
      return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (minRating !== null && product.rating < minRating) return false;
    if (search && scoreProductSearch(product, search) <= 0) {
      return false;
    }
    return true;
  });

  if (!search) return filtered;
  return filtered.sort((a, b) => scoreProductSearch(b, search) - scoreProductSearch(a, search));
}
