import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true },
    skinType: { type: String, required: true },
    skinConcern: { type: String, required: true },
    ageGroup: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    beforeImage: { type: String, default: "" },
    afterImage: { type: String, default: "" }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
