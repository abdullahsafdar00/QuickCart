import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: "user"},
    items: [{
        product: {type: String, required: true, ref: "product"},
        quantity: {type: Number, required: true}
    }],
    amount: {type: Number, required: true},
    address: {type: String, required: true, ref: "address"},
    status: {type: String, required: true, default: "Order Placed"},
    date: {type: Date, required: true},
    courierName: {type: String, default: null},
    courierTrackingNumber: {type: String, default: null},
    courierStatus: {type: String, default: null},
    courierMeta: {type: Object, default: {}},
    paymentMethod: {type: String, enum: ['cod', 'jazzcash', 'easypaisa'], default: 'cod'},
    paymentStatus: {type: String, enum: ['pending', 'completed', 'failed'], default: 'pending'},
    paymentTxnRef: {type: String, default: null},
    paymentTxnId: {type: String, default: null},
    paymentError: {type: String, default: null}
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order;