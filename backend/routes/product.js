const express = require('express');
const router = express.Router();

// Mock data (replace with MongoDB if using)
const keyboards = [
  {
    id: 1,
    name: "Rainy75",
    price: 6500.00,
    image: "/assets/rainy75.png",
    altImage: "/assets/altImg/rainy75Alt.png",
    availability: "in-stock",
    brand: "Akko",
  },
  {
    id: 2,
    name: "Retro Rainbow",
    price: 6500.00,
    image: "/assets/retro.png",
    altImage: "/assets/altImg/retrorainbowAlt.png",
    availability: "in-stock",
    brand: "Gateron",
  },
  {
    id: 3,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 4,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 5,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 6,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 7,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 8,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Akko",
  },
  {
    id: 9,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Gateron",
  },
  {
    id: 10,
    name: "Retro Rainbow",
    price: 6500.00,
    image: "/assets/retro.png",
    altImage: "/assets/altImg/retrorainbowAlt.png",
    availability: "in-stock",
    brand: "Gateron",
  },
  {
    id: 11,
    name: "Magnum65",
    price: 6500.00,
    image: "/assets/magnum65.png",
    altImage: "/assets/altImg/magnum65Alt.png",
    availability: "out-of-stock",
    brand: "Gateron",
  },
];
  const keycaps = [
    {
      id: 1,
      name: "Rainy75",
      price: 6500.00,
      image: "/assets/rainy75.png",
      altImage: "/assets/altImg/rainy75Alt.png",
      availability: "in-stock",
      brand: "Akko",
    },
    {
      id: 2,
      name: "Retro Rainbow",
      price: 6500.00,
      image: "/assets/retro.png",
      altImage: "/assets/altImg/retrorainbowAlt.png",
      availability: "in-stock",
      brand: "Gateron",
    },
    {
      id: 3,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 4,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 5,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 6,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 7,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 8,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Akko",
    },
    {
      id: 9,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Gateron",
    },
    {
      id: 10,
      name: "Retro Rainbow",
      price: 6500.00,
      image: "/assets/retro.png",
      altImage: "/assets/altImg/retrorainbowAlt.png",
      availability: "in-stock",
      brand: "Gateron",
    },
    {
      id: 11,
      name: "Magnum65",
      price: 6500.00,
      image: "/assets/magnum65.png",
      altImage: "/assets/altImg/magnum65Alt.png",
      availability: "out-of-stock",
      brand: "Gateron",
    },
];

router.get('/keyboards', (req, res) => {
  try {
    const { minPrice, maxPrice, availability, brand } = req.query;
    let filteredKeyboards = [...keyboards];

    // Only apply filters if parameters are valid
    if (minPrice && minPrice !== '' && !isNaN(parseFloat(minPrice))) {
      filteredKeyboards = filteredKeyboards.filter(
        (item) => item.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice && maxPrice !== '' && !isNaN(parseFloat(maxPrice))) {
      filteredKeyboards = filteredKeyboards.filter(
        (item) => item.price <= parseFloat(maxPrice)
      );
    }
    if (availability && availability !== '') {
      filteredKeyboards = filteredKeyboards.filter(
        (item) => item.availability === availability
      );
    }
    if (brand && brand !== '') {
      filteredKeyboards = filteredKeyboards.filter(
        (item) => item.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    console.log('Returning keyboards:', filteredKeyboards);
    res.json(filteredKeyboards);
  } catch (error) {
    console.error('Error in /keyboards route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/keycaps', (req, res) => {
  try {
    const { minPrice, maxPrice, availability, brand } = req.query;
    let filteredKeycaps = [...keycaps];

    // Only apply filters if parameters are valid
    if (minPrice && minPrice !== '' && !isNaN(parseFloat(minPrice))) {
      filteredKeycaps = filteredKeycaps.filter(
        (item) => item.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice && maxPrice !== '' && !isNaN(parseFloat(maxPrice))) {
      filteredKeycaps = filteredKeycaps.filter(
        (item) => item.price <= parseFloat(maxPrice)
      );
    }
    if (availability && availability !== '') {
      filteredKeycaps = filteredKeycaps.filter(
        (item) => item.availability === availability
      );
    }
    if (brand && brand !== '') {
      filteredKeycaps = filteredKeycaps.filter(
        (item) => item.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    console.log('Returning keycaps:', filteredKeycaps);
    res.json(filteredKeycaps);
  } catch (error) {
    console.error('Error in /keyboards route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;