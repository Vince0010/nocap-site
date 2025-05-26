import mongoose from "mongoose";

const keyboardSchema = new mongoose.Schema(
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
    switchOptions: {
      type: String,
      required: false,
    },
    plateMaterial: {
      type: String,
      required: false,
    },
    profile: {
      type: String,
      required: false,
    },
    isHotSwappable: {
      type: String,
      required: false,
    },
    layoutSize: {
      type: String,
      required: false,
    },
    layoutStandard: {
      type: String,
      required: false,
    },
    layoutErgonomics: {
      type: String,
      required: false,
    },
    connectivity: {
      type: String,
      required: false,
    },
    pollingRate: {
      type: String,
      required: false,
    },
    batteryCapacity: {
      type: String,
      required: false,
    },
    mountType: {
      type: String,
      required: false,
    },
    backlight: {
      type: String,
      required: false,
    },
    caseColors: {
      type: String,
      required: false,
    },
    caseMaterial: {
      type: String,
      required: false,
    },
    keycapMaterial: {
      type: String,
      required: false,
    },
    dimensions: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    knobSupport: {
      type: String,
      required: false,
    },
    displaySupport: {
      type: String,
      required: false,
    },
    multiMediaKeys: {
      type: String,
      required: false,
    },
    winmacSupport: {
      type: String,
      required: false,
    },
    usb_C: {
      type: String,
      required: false,
    },
    hallEffectSupport: {
      type: String,
      required: false,
    },
    qmkSupport: {
      type: String,
      required: false,
    },
    viaSupport: {
      type: String,
      required: false,
    },
    nkeyRollover: {
      type: String,
      required: false,
    },
    screwInStabilizers: {
      type: String,
      required: false,
    },
    soundDampening: {
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
    altImage: {
      type: String,
      required: false,
    },
    imageRender1: {
      type: String,
      required: false,
    },
    imageRender2: {
      type: String,
      required: false,
    },
    imageRender3: {
      type: String,
      required: false,
    },
    imageRender4: {
      type: String,
      required: false,
    },
    imageRender5: {
      type: String,
      required: false,
    },
    imageRender6: {
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

const Keyboard = mongoose.model("Keyboard", keyboardSchema);

export default Keyboard;
