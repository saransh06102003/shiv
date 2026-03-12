import Product from "../models/Product.js";
import { isDatabaseReady } from "../config/db.js";
import { mockDiscovery, mockIngredients, mockProducts } from "../data/mockData.js";
import { buildMongoProductQuery, filterMockProducts } from "../utils/buildProductQuery.js";

export async function listProducts(req, res, next) {
  try {
    res.set("Cache-Control", "public, max-age=180, s-maxage=300, stale-while-revalidate=300");
    if (isDatabaseReady()) {
      const query = buildMongoProductQuery(req.query);
      const products = await Product.find(query).sort({ createdAt: -1 }).limit(120);
      return res.json({ source: "mongo", count: products.length, products });
    }

    const products = filterMockProducts(mockProducts, req.query);
    return res.json({ source: "mock", count: products.length, products });
  } catch (error) {
    return next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    res.set("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=600");
    if (isDatabaseReady()) {
      let product = null;
      if (req.params.productId.startsWith("sm-")) {
        product = await Product.findOne({ sku: req.params.productId });
      } else {
        product = await Product.findById(req.params.productId);
      }
      if (!product) return res.status(404).json({ message: "Product not found" });
      return res.json({ source: "mongo", product });
    }

    const product = mockProducts.find((item) => item._id === req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ source: "mock", product });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Product not found" });
    }
    return next(error);
  }
}

export async function getDiscoverySections(_req, res, next) {
  try {
    res.set("Cache-Control", "public, max-age=240, s-maxage=360, stale-while-revalidate=360");
    if (isDatabaseReady()) {
      const [acne, oily, derm] = await Promise.all([
        Product.find({ concerns: "Acne" }).limit(8),
        Product.find({ skinTypes: "Oily" }).limit(8),
        Product.find({ tags: "Dermatologist favorites" }).limit(8)
      ]);

      return res.json({
        source: "mongo",
        sections: [
          { title: "Best for acne", products: acne },
          { title: "Best for oily skin", products: oily },
          { title: "Dermatologist favorites", products: derm }
        ]
      });
    }

    return res.json({
      source: "mock",
      sections: mockDiscovery
    });
  } catch (error) {
    return next(error);
  }
}

export async function getIngredientExplorer(req, res, next) {
  try {
    res.set("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=600");
    if (isDatabaseReady()) {
      const products = await Product.find({}, { includeIngredients: 1, skinTypes: 1 });
      const map = new Map();

      for (const product of products) {
        for (const ingredient of product.includeIngredients) {
          if (!map.has(ingredient)) {
            map.set(ingredient, {
              name: ingredient,
              suitableSkinTypes: new Set(),
              count: 0
            });
          }
          const entry = map.get(ingredient);
          product.skinTypes.forEach((skinType) => entry.suitableSkinTypes.add(skinType));
          entry.count += 1;
        }
      }

      const ingredients = [...map.values()].map((entry) => ({
        name: entry.name,
        suitableSkinTypes: [...entry.suitableSkinTypes],
        productCount: entry.count
      }));

      return res.json({ source: "mongo", ingredients });
    }

    if (req.query.name) {
      const related = mockProducts.filter((product) =>
        product.includeIngredients.includes(req.query.name)
      );
      return res.json({
        source: "mock",
        ingredient: mockIngredients.find((item) => item.name === req.query.name) || null,
        products: related
      });
    }

    return res.json({ source: "mock", ingredients: mockIngredients });
  } catch (error) {
    return next(error);
  }
}
