import mongoose from 'mongoose';

const ConfigQuant = mongoose.models.configquants || mongoose.model('configquants', new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'products' },
        orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'orders' },
        quantity: { type: Number, required: true}
    },
    {
        timestamps: true,
    }
));

if (!mongoose.models["orders"]) {
    require("./OrderModel");
}

export default ConfigQuant;