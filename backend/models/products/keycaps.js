import mongoose from "mongoose";

const keycapsSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    material: {
      type: String,
      required: false,
    },
    layoutStandard: {
      type: String,
      required: false,
    },
    subLegends: {
      type: String,
      required: false,
    },
    rgbShineThrough: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Keycaps = mongoose.model("Keycaps", keycapsSchema);

export default Keycaps;
