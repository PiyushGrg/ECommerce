import mongoose from 'mongoose';

const shippingAddressSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String },
        phoneNumber: { type: String },
    },
    {
        timestamps: true,
    }
);


// check if model already exists
if(mongoose.models["ships"]) {
    delete mongoose.models["ships"];
}

const Shipping = mongoose.model("ships", shippingAddressSchema);

export default Shipping;