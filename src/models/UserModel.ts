import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicUrl: {
        type: String,
        required: false,
    },
    clerkUserId: {
        type: String,
        required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


// check if model already exists
if(mongoose.models["users"]) {
    delete mongoose.models["users"];
}

const User = mongoose.model("users", userSchema);

export default User;