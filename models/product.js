import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: 'user', index: true},
    name: {type: String, required: true, index: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, index: true},
    offerPrice: {type: Number, min: 0, default: 0},
    image: {type: Array, required: true},
    category: {type: String, required: true, index: true},
    date: {type: Date, required: true, default: Date.now, index: true},
    inStock: {type: Boolean, default: true, index: true},
    promotion: {type: Boolean, default: false, index: true},
    tags: [{type: String, index: true}],
    views: {type: Number, default: 0},
    sales: {type: Number, default: 0}
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound indexes for common queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ promotion: 1, date: -1 });
productSchema.index({ userId: 1, date: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
    return this.offerPrice > 0 ? this.offerPrice : this.price;
});

const Product = mongoose.models.product || mongoose.model('product', productSchema);

export default Product;