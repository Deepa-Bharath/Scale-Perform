import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});
const ProductModel = mongoose.model('Product', productSchema, "products");

export {ProductModel};