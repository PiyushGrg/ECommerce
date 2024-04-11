import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

// check if user model is already created
if(mongoose.models["categories"]) {
    delete mongoose.models["categories"];
}

const Category = mongoose.model("categories", categorySchema);

export default Category;
