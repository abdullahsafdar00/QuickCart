import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: "user", index: true},
    items: [{
        product: {type: String, required: true, ref: "product"},
        quantity: {type: Number, required: true, min: 1}
    }],
    amount: {type: Number, required: true, min: 0},
    address: {type: String, required: true, ref: "address"},
    status: {type: String, required: true, default: "Order Placed", index: true},
    date: {type: Date, required: true, default: Date.now, index: true},
    courierName: {type: String, default: null},
    courierTrackingNumber: {type: String, default: null, index: true},
    courierStatus: {type: String, default: null},
    courierMeta: {type: Object, default: {}},
    paymentMethod: {type: String, enum: ['cod', 'jazzcash', 'easypaisa', 'paypro'], default: 'cod', index: true},
    paymentStatus: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending', index: true},
    paymentTxnRef: {type: String, default: null, index: true},
    paymentTxnId: {type: String, default: null},
    paymentError: {type: String, default: null}
}, {
    timestamps: true
});

// Compound indexes for common queries
orderSchema.index({ userId: 1, date: -1 });
orderSchema.index({ status: 1, date: -1 });
orderSchema.index({ paymentStatus: 1, paymentMethod: 1 });
orderSchema.index({ courierTrackingNumber: 1 }, { sparse: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;