import express from "express"
import { getBrands, getCategories, getVehicels } from "../controllers/vehicleController.js";

const router = express.Router();
router.post("/vehicles", getVehicels);
router.get("/brands", getBrands);
router.get("/categories", getCategories);
export default router;