import "dotenv/config";
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const PLACEHOLDER = "https://res.cloudinary.com/demo/image/upload/v1/samples/food/spices.jpg";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("✅ Connected to MongoDB");

  const foods = await foodModel.find({
    image: { $not: /^https?:\/\// }
  });

  console.log(`Found ${foods.length} food items with broken image paths`);

  if (foods.length === 0) {
    console.log("Nothing to fix!");
    process.exit(0);
  }

  for (const food of foods) {
    console.log(`  Fixing: "${food.name}" — old image: "${food.image}"`);
    food.image = PLACEHOLDER;
    await food.save();
  }

  console.log(`\n✅ Fixed ${foods.length} food items.`);
  console.log("Re-upload real images through the restaurant admin panel.");
  process.exit(0);
};

run().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});