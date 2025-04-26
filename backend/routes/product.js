const express = require('express');
const router = express.Router();

const keyboards = [
  {
    id: 1,
    name: "Rainy75",
    price: 6500.00,
    image: "/assets/rainy75.png",
    altImage: "/assets/altImg/rainy75Alt.png",
    availability: "in-stock",
    brand: "Akko",
    type: "Mechanical",
    description: "Compact 75% keyboard with customizable RGB and hot-swap switches.",
    attributes: {
      Size: "75%",
      Connection: "Wired/Wireless",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Aluminum",
    },
  },
  {
    id: 2,
    name: "Retro Rainbow",
    price: 6500.00,
    image: "/assets/retro.png",
    altImage: "/assets/altImg/retrorainbowAlt.png",
    availability: "in-stock",
    brand: "Gateron",
    type: "Mechanical",
    description: "Retro-styled keyboard with vibrant keycaps and smooth typing.",
    attributes: {
      Size: "TKL",
      Connection: "Wired",
      "Hot-Swappable": "No",
      RGB: "None",
      "Case Material": "Plastic",
    },
  },
  {
    id: 3,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
    type: "Mechanical",
    description: "65% keyboard with premium build and gasket mount design.",
    attributes: {
      Size: "65%",
      Connection: "Wired",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Aluminum",
    },
  },
  {
    id: 4,
    name: "Tofu60 Redux Kit",
    price: 7800.00,
    image: "/assets/tofu60.png",
    altImage: "/assets/altImg/tofu60Alt.png",
    availability: "in-stock",
    brand: "KBDFans",
    type: "Mechanical",
    description: "Compact 60% keyboard with aluminum case and hot-swap PCB.",
    attributes: {
      Size: "60%",
      Connection: "Wired",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Aluminum",
    },
  },
  {
    id: 5,
    name: "Margo",
    price: 15100.00,
    image: "/assets/margof.png",
    altImage: "/assets/altImg/margoAlt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Mechanical",
    description: "High-end mechanical keyboard with premium materials.",
    attributes: {
      Size: "Full-size",
      Connection: "Wired/Wireless",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Polycarbonate",
    },
  },
  {
    id: 6,
    name: "S9000",
    price: 8500.00,
    image: "/assets/S9000.png",
    altImage: "/assets/altImg/S9000Alt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Mechanical",
    description: "Sleek 65% keyboard with modern aesthetics.",
    attributes: {
      Size: "65%",
      Connection: "Wired",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Aluminum",
    },
  },
  {
    id: 7,
    name: "KBD67 Lite R4",
    price: 6500.00,
    image: "/assets/kbd67.png",
    altImage: "/assets/altImg/kbd67Alt.png",
    availability: "in-stock",
    brand: "KBDfans",
    type: "Mechanical",
    description: "Lightweight 65% keyboard with polycarbonate case.",
    attributes: {
      Size: "65%",
      Connection: "Wired",
      "Hot-Swappable": "Yes",
      RGB: "Per-key",
      "Case Material": "Polycarbonate",
    },
  },
];

const switches = [
  {
    id: 1,
    name: "Gateron Ink Black",
    price: 300.00,
    image: "/assets/inkblack.png",
    altImage: "/assets/altImg/inkblackAlt.png",
    availability: "in-stock",
    brand: "Gateron",
    type: "Linear",
    description: "Smooth linear switches with deep sound profile.",
    attributes: {
      Type: "Linear",
      "Actuation Force": "60g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 2,
    name: "Cherry MX Red",
    price: 250.00,
    image: "/assets/mxred.png",
    altImage: "/assets/altImg/mxredAlt.png",
    availability: "in-stock",
    brand: "Cherry",
    type: "Linear",
    description: "Classic linear switches with light actuation.",
    attributes: {
      Type: "Linear",
      "Actuation Force": "45g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 3,
    name: "Mount Tai HE Magnetic Switches",
    price: 6500.00,
    image: "/assets/mounttai.png",
    altImage: "/assets/altImg/mounttaiAlt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Magnetic",
    description: "Magnetic switches with smooth linear feel and consistent actuation.",
    attributes: {
      Type: "Linear",
      "Actuation Force": "45g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 4,
    name: "Skyline Magnetic Switches",
    price: 6500.00,
    image: "/assets/skyline.png",
    altImage: "/assets/altImg/skylineAlt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Magnetic",
    description: "High-performance magnetic switches for rapid response.",
    attributes: {
      Type: "Magnetic",
      "Actuation Force": "50g",
      "Travel Distance": "3.8mm",
      "Pre-Travel": "1.8mm",
    },
  },
  {
    id: 5,
    name: "Gateron Magnetic Jade",
    price: 6500.00,
    image: "/assets/magneticjade.png",
    altImage: "/assets/altImg/magneticjadeAlt.png",
    availability: "in-stock",
    brand: "Gateron",
    type: "Magnetic",
    description: "Magnetic switches with unique tactile feedback.",
    attributes: {
      Type: "Tactile",
      "Actuation Force": "55g",
      "Travel Distance": "3.8mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 6,
    name: "MMD Princess Linear/Tactile Switches V2",
    price: 6500.00,
    image: "/assets/mmdprincess.png",
    altImage: "/assets/altImg/mmdprincessAlt.png",
    availability: "in-stock",
    brand: "MMD",
    type: "Linear/Tactile",
    description: "Versatile switches with smooth linear or tactile options.",
    attributes: {
      Type: "Linear/Tactile",
      "Actuation Force": "62g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 7,
    name: "Cherry Black MX Hyperglide",
    price: 6500.00,
    image: "/assets/cherrymxblack.png",
    altImage: "/assets/altImg/cherrymxblackAlt.png",
    availability: "in-stock",
    brand: "Cherry",
    type: "Switch",
    description: "Heavy linear switches with smooth hyperglide technology.",
    attributes: {
      Type: "Linear",
      "Actuation Force": "60g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 8,
    name: "Gateron Yellow Pro",
    price: 2500.00,
    image: "/assets/gateron.png",
    altImage: "/assets/altImg/gateronAlt.png",
    availability: "in-stock",
    brand: "Gateron",
    type: "Linear",
    description: "Budget-friendly smooth linear switches, factory lubed.",
    attributes: {
      Type: "Linear",
      "Actuation Force": "50g",
      "Travel Distance": "4.0mm",
      "Pre-Travel": "2.0mm",
    },
  },
  {
    id: 9,
    name: "Holy Panda X",
    price: 4800.00,
    image: "/assets/holypanda.png",
    altImage: "/assets/altImg/holypandaAlt.png",
    availability: "out-of-stock",
    brand: "Drop",
    type: "Tactile",
    description: "Premium tactile switches with pronounced tactile bump.",
    attributes: {
      Type: "Tactile",
      "Actuation Force": "67g",
      "Travel Distance": "3.8mm",
      "Pre-Travel": "2.2mm",
    },
  },
];

const keycaps = [
  {
    id: 1,
    name: "Akko Neon",
    price: 1200.00,
    image: "/assets/neon.png",
    altImage: "/assets/altImg/neonAlt.png",
    availability: "in-stock",
    brand: "Akko",
    type: "Cherry Profile",
    description: "Vibrant neon-themed keycaps with Cherry profile.",
    attributes: {
      Profile: "Cherry",
      Material: "PBT Dye-Sub",
      "Layout Compatibility": "60%, 65%, TKL, Full-size",
      "Stem Type": "Cherry MX",
    },
  },
  {
    id: 2,
    name: "GMK Laser",
    price: 1500.00,
    image: "/assets/laser.png",
    altImage: "/assets/altImg/laserAlt.png",
    availability: "out-of-stock",
    brand: "GMK",
    type: "Cherry Profile",
    description: "Premium DSA profile keycaps with excellent texture.",
    attributes: {
      Profile: "DSA",
      Material: "PBT Dye-Sub",
      "Layout Compatibility": "65%, 75%, TKL, Full-size",
      "Stem Type": "Cherry MX",
    },
  },
  {
    id: 3,
    name: "PBTFANS Ronin",
    price: 6500.00,
    image: "/assets/ronin.png",
    altImage: "/assets/altImg/roninAlt.png",
    availability: "in-stock",
    brand: "PBTFANS",
    type: "Cherry Profile",
    description: "High-end Cherry profile keycaps with vibrant colorways.",
    attributes: {
      Profile: "Cherry",
      Material: "PBT Dye-Sub",
      "Layout Compatibility": "60%, 65%, TKL",
      "Stem Type": "Cherry MX",
    },
  },
  {
    id: 4,
    name: "Electronic Pet",
    price: 6500.00,
    image: "/assets/electronicpet.png",
    altImage: "/assets/altImg/electronicpetAlt.png",
    availability: "out-of-stock",
    brand: "Unknown",
    type: "SA Profile",
    description: "Novelty keycap set with electronic pet theme and SA profile.",
    attributes: {
      Profile: "SA",
      Material: "ABS",
      "Layout Compatibility": "60%, 65%",
      "Stem Type": "Cherry MX",
    },
  },
];

const others = [
  {
    id: 1,
    name: "Desk Mat",
    price: 800.00,
    image: "/assets/deskmat.png",
    altImage: "/assets/altImg/deskmatAlt.png",
    availability: "in-stock",
    brand: "Generic",
    type: "Accessory",
    description: "Large desk mat with smooth surface for keyboard and mouse.",
    attributes: {
      Type: "Desk Mat",
      Compatibility: "Universal",
      Material: "Cloth/Rubber",
    },
  },
  {
    id: 2,
    name: "Wrist Rest",
    price: 500.00,
    image: "/assets/wristrest.png",
    altImage: "/assets/altImg/wristrestAlt.png",
    availability: "in-stock",
    brand: "Generic",
    type: "Accessory",
    description: "Ergonomic wrist rest for comfortable typing.",
    attributes: {
      Type: "Wrist Rest",
      Compatibility: "60%, 65%, TKL, Full-size",
      Material: "Memory Foam",
    },
  },
  {
    id: 3,
    name: "Electronic Pet",
    price: 6500.00,
    image: "/assets/electronicpet.png",
    altImage: "/assets/altImg/electronicpetAlt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Accessory",
    description: "Interactive electronic pet accessory for desk setups.",
    attributes: {
      Type: "Novelty",
      Compatibility: "Universal",
      Material: "Plastic",
    },
  },
  {
    id: 4,
    name: "Krytox 205g0",
    price: 850.00,
    image: "/assets/krytox.png",
    altImage: "/assets/altImg/krytoxAlt.png",
    availability: "in-stock",
    brand: "Krytox",
    type: "Switch Lubricant",
    description: "Premium switch lubricant for smoother key action.",
    attributes: {
      Type: "Switch Lubricant",
      Compatibility: "All switches",
      Material: "PFPE/PTFE",
    },
  },
  {
    id: 5,
    name: "Coiled Aviator Cable",
    price: 1500.00,
    image: "/assets/cable.png",
    altImage: "/assets/altImg/cableAlt.png",
    availability: "in-stock",
    brand: "Unknown",
    type: "Cable",
    description: "Custom coiled cable with aviator connector and stylish sleeve.",
    attributes: {
      Type: "Cable",
      Compatibility: "USB-C keyboards",
      Material: "Braided Nylon",
    },
  },
  {
    id: 6,
    name: "AEBoards Staebies V2.1 Stabilizers",
    price: 6500.00,
    image: "/assets/stabilizers.png",
    altImage: "/assets/altImg/stabilizersAlt.png",
    availability: "in-stock",
    brand: "AEBoards",
    type: "Stabilizer",
    description: "High-quality stabilizers for smooth key action.",
    attributes: {
      Type: "Stabilizer",
      Compatibility: "Cherry-style keyboards",
      Material: "Plastic/Metal",
    },
  },
];

const categories = { keyboards, switches, keycaps, others };

router.get('/:category', (req, res) => {
  try {
    let { category } = req.params;
    const { minPrice, maxPrice, availability, brand, search } = req.query;

    // Map 'accessories' to 'others'
    if (category === 'accessories') {
      category = 'others';
    }

    if (!categories[category]) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Validate items
    const validItems = categories[category].filter(
      (item) =>
        item &&
        typeof item.id === 'number' &&
        typeof item.name === 'string' &&
        item.name.trim() &&
        typeof item.price === 'number' &&
        typeof item.image === 'string' &&
        typeof item.availability === 'string' &&
        ['in-stock', 'out-of-stock'].includes(item.availability) &&
        typeof item.brand === 'string'
    );
    if (validItems.length < categories[category].length) {
      console.warn(
        `Invalid ${category} entries filtered out:`,
        categories[category].filter((item) => !validItems.includes(item))
      );
    }

    let items = [...validItems];

    if (minPrice && minPrice !== '' && !isNaN(parseFloat(minPrice))) {
      items = items.filter((item) => item.price >= parseFloat(minPrice));
    } else if (minPrice) {
      console.warn(`Invalid minPrice ignored for ${category}:`, minPrice);
    }

    if (maxPrice && maxPrice !== '' && !isNaN(parseFloat(maxPrice))) {
      items = items.filter((item) => item.price <= parseFloat(maxPrice));
    } else if (maxPrice) {
      console.warn(`Invalid maxPrice ignored for ${category}:`, maxPrice);
    }

    if (availability && ['in-stock', 'out-of-stock'].includes(availability)) {
      items = items.filter((item) => item.availability === availability);
    } else if (availability) {
      console.warn(`Invalid availability ignored for ${category}:`, availability);
    }

    if (brand && brand !== '') {
      items = items.filter((item) => item.brand.toLowerCase() === brand.toLowerCase());
    }

    if (search && search.trim()) {
      items = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    console.log(`Returning ${category}:`, items);
    res.json(items);
  } catch (error) {
    console.error(`Error in /${req.params.category} route:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:category/:id', (req, res) => {
  try {
    let { category, id } = req.params;
    if (category === 'accessories') {
      category = 'others';
    }
    if (!categories[category]) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const product = categories[category].find((item) => item.id === parseInt(id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Returning ${category} product:`, product);
    res.json(product);
  } catch (error) {
    console.error(`Error in /${req.params.category}/:id route:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;