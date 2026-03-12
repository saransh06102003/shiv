import { isDatabaseReady } from "../config/db.js";
import { mockReviews } from "../data/mockData.js";
import Review from "../models/Review.js";

export async function listReviews(req, res, next) {
  try {
    const { productId, skinType } = req.query;
    res.set("Cache-Control", "public, max-age=120, s-maxage=180, stale-while-revalidate=180");

    if (isDatabaseReady()) {
      const query = {};
      if (productId) query.productId = productId;
      if (skinType) query.skinType = skinType;

      const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(200);
      return res.json({ source: "mongo", count: reviews.length, reviews });
    }

    const filtered = mockReviews.filter((review) => {
      if (productId && review.productId !== productId) return false;
      if (skinType && review.skinType !== skinType) return false;
      return true;
    });

    return res.json({ source: "mock", count: filtered.length, reviews: filtered });
  } catch (error) {
    return next(error);
  }
}

export async function createReview(req, res, next) {
  try {
    const payload = req.body;
    if (
      !payload.productId ||
      !payload.userName ||
      !payload.comment ||
      !payload.rating ||
      !payload.skinType ||
      !payload.skinConcern ||
      !payload.ageGroup
    ) {
      return res.status(400).json({ message: "Missing required review fields" });
    }

    if (isDatabaseReady()) {
      const review = await Review.create({
        productId: payload.productId,
        userId: payload.userId,
        userName: payload.userName,
        rating: payload.rating,
        comment: payload.comment,
        skinType: payload.skinType,
        skinConcern: payload.skinConcern,
        ageGroup: payload.ageGroup,
        verifiedPurchase: Boolean(payload.verifiedPurchase),
        helpfulCount: Number(payload.helpfulCount || 0),
        beforeImage: payload.beforeImage || "",
        afterImage: payload.afterImage || ""
      });
      return res.status(201).json({ source: "mongo", review });
    }

    const review = {
      _id: `rv-${Date.now()}`,
      productId: payload.productId,
      userName: payload.userName,
      rating: payload.rating,
      comment: payload.comment,
      skinType: payload.skinType,
      skinConcern: payload.skinConcern,
      ageGroup: payload.ageGroup,
      verifiedPurchase: Boolean(payload.verifiedPurchase),
      helpfulCount: Number(payload.helpfulCount || 0),
      beforeImage: payload.beforeImage || "",
      afterImage: payload.afterImage || "",
      createdAt: new Date().toISOString()
    };
    mockReviews.unshift(review);

    return res.status(201).json({ source: "mock", review });
  } catch (error) {
    return next(error);
  }
}
