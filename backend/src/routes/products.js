import { Router } from "express";
import {
  getDiscoverySections,
  getIngredientExplorer,
  getProductById,
  listProducts
} from "../controllers/productController.js";

const router = Router();

router.get("/", listProducts);
router.get("/discovery", getDiscoverySections);
router.get("/ingredients", getIngredientExplorer);
router.get("/:productId", getProductById);

export default router;
