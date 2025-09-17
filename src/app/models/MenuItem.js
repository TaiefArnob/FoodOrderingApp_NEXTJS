// models/MenuItem.js
import mongoose, { Schema, model, models } from "mongoose";

const RatingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ratings: [RatingSchema], // store all ratings
  },
  { timestamps: true }
);

MenuItemSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  return sum / this.ratings.length;
});

const MenuItem = models.MenuItem || model("MenuItem", MenuItemSchema);
export default MenuItem;
