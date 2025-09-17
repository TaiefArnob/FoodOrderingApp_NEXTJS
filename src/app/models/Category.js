import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite in dev
const Category = models.Category || model("Category", CategorySchema);

export default Category;
