import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sku: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    discountPct: { type: Number, default: 0 },
    skinTypes: [{ type: String }],
    concerns: [{ type: String }],
    includeIngredients: [{ type: String }],
    excludeIngredients: [{ type: String }],
    tags: [{ type: String }],
    routineStep: { type: String },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", brand: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
