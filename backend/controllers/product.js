// controllers/products.js
import Keyboard from "../models/products/keyboard.js";
import Switch from "../models/products/switches.js";
import Keycap from "../models/products/keycaps.js";
import Other from "..//models/products/others.js";

// Map category names to Mongoose models
const categories = {
  keyboard: Keyboard,
  switches: Switch,
  keycaps: Keycap,
  others: Other,
};

export const getProducts = async (category, query) => {
  try {
    const { minPrice, maxPrice, availability, brand, search } = query;

    // Map 'accessories' to 'others'
    if (category === "accessories") {
      category = "others";
    }

    // Check if category exists
    if (!categories[category]) {
      throw new Error("Category not found");
    }

    const Model = categories[category];

    // Build MongoDB query object
    let queryObj = {};

    if (minPrice && minPrice !== "" && !isNaN(parseFloat(minPrice))) {
      queryObj.price = { $gte: parseFloat(minPrice) };
    } else if (minPrice) {
      console.warn(`Invalid minPrice ignored for ${category}:`, minPrice);
    }

    if (maxPrice && maxPrice !== "" && !isNaN(parseFloat(maxPrice))) {
      queryObj.price = { ...queryObj.price, $lte: parseFloat(maxPrice) };
    } else if (maxPrice) {
      console.warn(`Invalid maxPrice ignored for ${category}:`, maxPrice);
    }

    if (availability && ["in-stock", "out-of-stock"].includes(availability)) {
      queryObj.availability = availability;
    } else if (availability) {
      console.warn(
        `Invalid availability ignored for ${category}:`,
        availability
      );
    }

    if (brand && brand !== "") {
      queryObj.brand = { $regex: brand, $options: "i" }; // Case-insensitive
    }

    if (search && search.trim()) {
      queryObj.name = { $regex: search, $options: "i" }; // Case-insensitive
    }

    // Fetch items from MongoDB
    const items = await Model.find(queryObj);
    console.log(`Returning ${category}:`, items);
    return items;
  } catch (error) {
    console.error(`Error in getProducts for ${category}:`, error);
    throw error;
  }
};

export const getProductById = async (category, id) => {
  try {
    // Map 'accessories' to 'others'
    if (category === "accessories") {
      category = "others";
    }

    // Check if category exists
    if (!categories[category]) {
      throw new Error("Category not found");
    }

    const Model = categories[category];

    // Find product by id
    const product = await Model.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    console.log(`Returning ${category} product:`, product);
    return product;
  } catch (error) {
    console.error(`Error in getProductById for ${category}/${id}:`, error);
    throw error;
  }
};
