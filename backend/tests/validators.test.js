// tests/validators.test.js
// Run with: npx jest tests/validators.test.js

import { registerSchema, loginSchema, addFoodSchema, placeOrderSchema } from "../utils/validators.js";

describe("registerSchema", () => {
  test("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Ali Hassan",
      email: "Ali@Example.COM",
      password: "securePass1",
    });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("ali@example.com"); // lowercased
    expect(result.data.name).toBe("Ali Hassan");
  });

  test("rejects short name", () => {
    const result = registerSchema.safeParse({ name: "A", email: "a@b.com", password: "12345678" });
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toMatch(/2 characters/);
  });

  test("rejects invalid email", () => {
    const result = registerSchema.safeParse({ name: "Ali", email: "not-an-email", password: "12345678" });
    expect(result.success).toBe(false);
  });

  test("rejects short password", () => {
    const result = registerSchema.safeParse({ name: "Ali", email: "a@b.com", password: "1234" });
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toMatch(/8 characters/);
  });
});

describe("loginSchema", () => {
  test("accepts valid login", () => {
    const result = loginSchema.safeParse({ email: "user@CRAVE.ae", password: "pass1234" });
    expect(result.success).toBe(true);
    expect(result.data.email).toBe("user@crave.ae");
  });

  test("rejects missing password", () => {
    const result = loginSchema.safeParse({ email: "user@crave.ae", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("addFoodSchema", () => {
  test("accepts valid food item", () => {
    const result = addFoodSchema.safeParse({
      name: "Chicken Shawarma",
      description: "Grilled chicken wrap",
      price: "19.99",  // string coercion
      category: "Wraps",
    });
    expect(result.success).toBe(true);
    expect(result.data.price).toBe(19.99); // coerced to number
  });

  test("rejects negative price", () => {
    const result = addFoodSchema.safeParse({
      name: "Item", description: "A food item", price: -5, category: "X",
    });
    expect(result.success).toBe(false);
  });

  test("rejects short name", () => {
    const result = addFoodSchema.safeParse({
      name: "X", description: "A food item", price: 10, category: "Y",
    });
    expect(result.success).toBe(false);
  });
});

describe("placeOrderSchema", () => {
  const validOrder = {
    userId: "user123",
    restaurantId: "rest456",
    items: [{ _id: "food1", name: "Pizza", price: 30, quantity: 2 }],
    amount: 60,
    address: { street: "Al Majaz", city: "Sharjah" },
    paymentMethod: "cod",
  };

  test("accepts valid order", () => {
    const result = placeOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  test("rejects empty items array", () => {
    const result = placeOrderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  test("rejects zero amount", () => {
    const result = placeOrderSchema.safeParse({ ...validOrder, amount: 0 });
    expect(result.success).toBe(false);
  });

  test("rejects invalid payment method", () => {
    const result = placeOrderSchema.safeParse({ ...validOrder, paymentMethod: "bitcoin" });
    expect(result.success).toBe(false);
  });

  test("defaults paymentMethod to cod", () => {
    const { paymentMethod, ...withoutMethod } = validOrder;
    const result = placeOrderSchema.safeParse(withoutMethod);
    expect(result.success).toBe(true);
    expect(result.data.paymentMethod).toBe("cod");
  });
});
