import mongoose from 'mongoose';

const billingAddressSchema = new mongoose.Schema(
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
if(mongoose.models["bills"]) {
    delete mongoose.models["bills"];
}

const Billing = mongoose.model("bills", billingAddressSchema);

export default Billing;