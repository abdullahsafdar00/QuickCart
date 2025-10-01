const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  public_id: String,
  url: String
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  offerPrice: Number,
  images: [ImageSchema],
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema)
