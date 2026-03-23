import express from "express";
import authMiddleware from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import restaurantAuth from "../middleware/restaurantAuth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, placeOrderCod, listRestaurantOrders, restaurantUpdateStatus, cancelOrder } from "../controllers/orderController.js";
import orderModel from "../models/orderModel.js";
import { validate, placeOrderSchema } from "../utils/validators.js";

const orderRouter = express.Router();

orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place",      authMiddleware, validate(placeOrderSchema), placeOrder);
orderRouter.post("/placecod",   authMiddleware, validate(placeOrderSchema), placeOrderCod);
orderRouter.post("/verify",     verifyOrder);
orderRouter.post("/cancel",     authMiddleware, cancelOrder);

orderRouter.get("/track/:orderId", authMiddleware, async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.orderId)
      .populate("restaurantId", "name logo location")
      .lean();
    if (!order) return res.json({ success: false, message: "Order not found" });
    if (String(order.userId) !== String(req.body.userId))
      return res.status(403).json({ success: false, message: "Not authorized" });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("[track order]", error.message);
    res.json({ success: false, message: "Error fetching order" });
  }
});

orderRouter.get("/list",               adminAuth,       listOrders);
orderRouter.post("/status",            adminAuth,       updateStatus);
orderRouter.get("/restaurant/list",    restaurantAuth,  listRestaurantOrders);
orderRouter.post("/restaurant/status", restaurantAuth,  restaurantUpdateStatus);

export default orderRouter;