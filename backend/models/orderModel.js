import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  _id:             { type: String, required: true },
  name:            { type: String, required: true },
  price:           { type: Number, required: true },
  quantity:        { type: Number, required: true, min: 1 },
  category:        { type: String, default: "" },
  image:           { type: String, default: "" },
  selectedOptions: { type: Object, default: {} },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    userId:       { type: String, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant", required: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must have at least one item",
      },
    },
    amount:          { type: Number, required: true },
    deliveryFee:     { type: Number, default: 0 },
    address:         { type: Object, required: true },
    status:          { type: String, default: "Food Processing", enum: ["Food Processing", "Out for Delivery", "Delivered", "Cancelled"] },
    isBatched:       { type: Boolean, default: false },
    batchId:         { type: mongoose.Schema.Types.ObjectId, ref: "batch", default: null },
    date:            { type: Date, default: Date.now },
    payment:         { type: Boolean, default: false },
    promoCode:       { type: String, default: null },
    discount:        { type: Number, default: 0 },
    paymentMethod:   { type: String, enum: ["cod", "stripe", "split"], default: "cod" },
    stripeSessionId: { type: String, default: null },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;