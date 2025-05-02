import mongoose from "mongoose";

const switchesSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    releaseYear: {
      type: String,
      required: false,
    },
    switchType: {
      type: String,
      required: false,
    },
    isFactoryLubed: {
      type: String,
      required: false,
    },
    switchProfile: {
      type: String,
      required: false,
    },
    actuationForce: {
      type: String,
      required: false,
    },
    bottomOutForce: {
      type: String,
      required: false,
    },
    preTravel: {
      type: String,
      required: false,
    },
    totalTravel: {
      type: String,
      required: false,
    },
    pins: {
      type: String,
      required: false,
    },
    isHallEffect: {
      type: String,
      required: false,
    },
    topHousingMaterial: {
      type: String,
      required: false,
    },
    bottomHousingMaterial: {
      type: String,
      required: false,
    },
    stemMaterial: {
      type: String,
      required: false,
    },
    springs: {
      type: String,
      required: false,
    },
    isLongPole: {
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

const Switches = mongoose.model("Switches", switchesSchema);

export default Switches;
