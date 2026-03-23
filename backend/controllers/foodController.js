import foodModel from "../models/foodModel.js";
import { deleteImage } from "../utils/cloudinaryUpload.js";

const addFood = async (req, res) => {
  try {
    if (!req.file) return res.json({ success: false, message: "Image is required" });
    const food = new foodModel({
      name:         req.body.name,
      description:  req.body.description,
      price:        Number(req.body.price),
      image:        req.file.path,
      category:     req.body.category,
      restaurantId: req.admin.restaurantId,
    });
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("[addFood]", error);
    res.json({ success: false, message: "Error adding food" });
  }
};

const listFood = async (req, res) => {
  try {
    let foods;
    if (req.admin.role === "restaurantadmin") {
      foods = await foodModel.find({ restaurantId: req.admin.restaurantId });
    } else {
      foods = await foodModel.find({}).populate("restaurantId", "name");
    }
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("[listFood]", error);
    res.json({ success: false, message: "Error listing foods" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.json({ success: false, message: "Food not found" });
    await deleteImage(food.image);
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("[removeFood]", error);
    res.json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };