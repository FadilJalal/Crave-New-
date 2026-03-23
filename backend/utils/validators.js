import { z } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map(e => e.message).join(", ");
      return res.status(400).json({ success: false, message });
    }
    req.body = result.data;
    next();
  };
}

export const registerSchema = z.object({
  name:     z.string().trim().min(2, "Name must be at least 2 characters"),
  email:    z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email:    z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const addFoodSchema = z.object({
  name:           z.string().trim().min(2, "Food name must be at least 2 characters"),
  description:    z.string().trim().min(5, "Description must be at least 5 characters"),
  price:          z.coerce.number().positive("Price must be a positive number"),
  category:       z.string().trim().min(1, "Category is required"),
  restaurantId:   z.string().trim().optional(),
  customizations: z.any().optional(),
});

export const placeOrderSchema = z.object({
  userId:       z.string().min(1, "User ID is required"),
  restaurantId: z.string().min(1, "Restaurant ID is required"),
  items: z.array(z.object({
    _id:      z.string(),
    name:     z.string(),
    price:    z.number(),
    quantity: z.number().int().positive(),
  })).min(1, "Order must have at least one item"),
  amount:        z.coerce.number().positive("Amount must be positive"),
  address:       z.object({
    street: z.string().trim().min(1, "Street is required"),
    city:   z.string().trim().min(1, "City is required"),
  }).passthrough(),
  paymentMethod: z.enum(["cod", "stripe", "split"]).default("cod"),
  promoCode:     z.string().optional().nullable(),
});

export const restaurantLoginSchema = z.object({
  email:    z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});