import mongoose from 'mongoose';

const Order = mongoose.models.orders || mongoose.model('orders', new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
        amount: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        status: { type: String, default: 'awaiting_shipment', enum: ['awaiting_shipment', 'shipped', 'delivered'] },
        products: { type: [mongoose.Schema.Types.ObjectId], required: true, ref: 'products',default: [] },
        shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'ships'},
        billingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'bills'},
    },
    {
        timestamps: true,
    }
));

export default Order;