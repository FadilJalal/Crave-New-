import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import { uploadImage } from "../utils/cloudinaryUpload.js";
import {
  addRestaurant,
  listRestaurants,
  removeRestaurant,
  toggleActive,
  editRestaurant,
  resetRestaurantPassword,
} from "../controllers/restaurantController.js";

const router = express.Router();
const upload = uploadImage; // Cloudinary-backed multer instance

router.get("/list", listRestaurants);
router.post("/add",            adminAuth, upload.single("logo"), addRestaurant);
router.post("/remove",         adminAuth, removeRestaurant);
router.post("/toggle-active",  adminAuth, toggleActive);
router.post("/edit",           adminAuth, upload.single("logo"), editRestaurant);
router.post("/reset-password", adminAuth, resetRestaurantPassword);

export default router;