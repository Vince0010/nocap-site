/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Text,
  VStack,
  Select,
  Button,
  Grid,
  GridItem,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Heading,
  CloseButton,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Alert,
  AlertIcon,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import { useAnimation } from "framer-motion";
import {
  AnimatedProductRow,
  ProductBox,
} from "../components/ProductComponents"; // Import the ProductBox component

// Product categories and their specific comparable attributes
const categoryAttributes = {
  keycaps: ["Profile", "Material", "Layout Compatibility", "Stem Type"],
  switches: ["Type", "Actuation Force", "Travel Distance", "Pre-Travel"],
  keyboards: ["Size", "Connection", "Hot-Swappable", "RGB", "Case Material"],
  accessories: ["Type", "Compatibility", "Material"],
};

// Sample product database with comparison attributes by category
const productDatabase = {
  keycaps: [
    {
      id: 1,
      name: "S9000",
      price: "₱8500.00",
      image: "src/assets/S9000.png",
      altImage: "src/assets/altImg/S9000Alt.png",
      attributes: {
        Profile: "DSA",
        Material: "PBT Dye-Sub",
        "Layout Compatibility": "65%, 75%, TKL, Full-size",
        "Stem Type": "Cherry MX",
      },
      description:
        "Premium DSA profile keycaps with excellent texture and durability.",
      inStock: true,
    },
    {
      id: 2,
      name: "Margo",
      price: "₱15100.00",
      image: "src/assets/margo.png",
      altImage: "src/assets/altImg/margoAlt.png",
      attributes: {
        Profile: "Cherry",
        // Missing "Material" attribute
        "Layout Compatibility": "60%, 65%, TKL",
        "Stem Type": "Cherry MX",
      },
      description: "High-end Cherry profile keycaps with vibrant colorways.",
      inStock: true,
    },
    {
      id: 3,
      name: "Electronic Pet",
      price: "₱6500.00",
      image: "src/assets/electronicpet.png",
      altImage: "src/assets/altImg/electronicpetAlt.png",
      // No attributes defined for this product
      description:
        "Novelty keycap set with electronic pet theme and SA profile.",
      inStock: false,
    },
  ],
  switches: [
    {
      id: 4,
      name: "Mount Tai HE Magnetic Switches",
      price: "₱6500.00",
      image: "src/assets/mounttai.png",
      altImage: "src/assets/altImg/mounttaiAlt.png",
      attributes: {
        Type: "Linear",
        "Actuation Force": "45g",
        "Travel Distance": "4.0mm",
        "Pre-Travel": "2.0mm",
      },
      description:
        "Magnetic switches with smooth linear feel and consistent actuation.",
      inStock: true,
    },
    {
      id: 5,
      name: "Gateron Yellow Pro",
      price: "₱2500.00",
      image: "src/assets/gateron.png",
      altImage: "src/assets/altImg/gateronAlt.png",
      attributes: {
        Type: "Linear",
        "Actuation Force": "50g",
        // Missing Travel Distance
        "Pre-Travel": "2.0mm",
      },
      description:
        "Budget-friendly smooth linear switches, factory lubed for better performance.",
      inStock: true,
    },
    {
      id: 6,
      name: "Holy Panda X",
      price: "₱4800.00",
      image: "src/assets/holypanda.png",
      altImage: "src/assets/altImg/holypandaAlt.png",
      attributes: {
        Type: "Tactile",
        "Actuation Force": "67g",
        "Travel Distance": "3.8mm",
        "Pre-Travel": "2.2mm",
      },
      description:
        "Premium tactile switches with a pronounced tactile bump and satisfying sound profile.",
      inStock: false,
    },
  ],
  keyboards: [
    {
      id: 7,
      name: "Tofu60 Redux Kit",
      price: "₱7800.00",
      image: "src/assets/tofu60.png",
      altImage: "src/assets/altImg/tofu60Alt.png",
      attributes: {
        Size: "60%",
        Connection: "Wired",
        "Hot-Swappable": "Yes",
        RGB: "Per-key",
        "Case Material": "Aluminum",
      },
      description: "Compact 60% keyboard with aluminum case and hot-swap PCB.",
      inStock: true,
    },
    {
      id: 8,
      name: "KBD67 Lite R4",
      // Product with incomplete information
      price: null,
      image: "src/assets/tofu60.png",
      altImage: "src/assets/altImg/tofu60Alt.png",
      attributes: {
        Size: "65%",
        // Missing Connection attribute
        "Hot-Swappable": "Yes",
        RGB: "Per-key",
        "Case Material": "Polycarbonate",
      },
      // Missing description
      inStock: true,
    },
  ],
  accessories: [
    {
      id: 9,
      name: "Krytox 205g0",
      price: "₱850.00",
      image: "src/assets/krytox.png",
      altImage: "src/assets/altImg/krytoxAlt.png",
      attributes: {
        Type: "Switch Lubricant",
        Compatibility: "All switches",
        Material: "PFPE/PTFE",
      },
      description:
        "Premium switch lubricant for smoother key action and reduced noise.",
      inStock: true,
    },
    {
      id: 10,
      name: "Coiled Aviator Cable",
      price: "₱1500.00",
      image: "src/assets/cable.png",
      altImage: "src/assets/altImg/cableAlt.png",
      attributes: null, // Completely missing attributes
      description:
        "Custom coiled cable with aviator connector and stylish sleeve.",
      inStock: true,
    },

    {
        id: 11,
        name: "Cherry Black MX Hyperglide",
        price: "₱6500.00",
        image: "src/assets/cherrymxblack.png",
        altImage: "src/assets/altImg/cherrymxblackAlt.png",
      },
      {
        id: 12,
        name: "AEBoards Staebies V2.1 Stabilizers",
        price: "₱6500.00",
        image: "src/assets/stabilizers.png",
        altImage: "src/assets/altImg/stabilizersAlt.png",
      },
      {
        id: 13,
        name: "Rainy75 ",
        price: "₱6500.00",
        image: "src/assets/rainy75.png",
        altImage: "src/assets/altImg/rainy75Alt.png",
      },
  ],
};

// Main comparison page component
const ComparePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("keycaps");
  const [comparedProducts, setComparedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const controls = useAnimation(); // For the ProductBox animations

  useEffect(() => {
    // Update available products when category changes
    setAvailableProducts(productDatabase[selectedCategory] || []);
    setDisplayedProducts(productDatabase[selectedCategory] || []);
    // Reset compared products when changing categories
    setComparedProducts([]);
    // Reset search query
    setSearchQuery("");
    // Trigger animations
    controls.start("visible");
  }, [selectedCategory, controls]);

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      // If search is empty, show all products in category
      setDisplayedProducts(availableProducts);
      return;
    }

    // Filter products by name matching search query
    const filteredProducts = availableProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    setDisplayedProducts(filteredProducts);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDisplayedProducts(availableProducts);
  };

  const handleAddToComparison = (productId) => {
    const product = availableProducts.find((p) => p.id === productId);

    if (!product) return;

    if (comparedProducts.some((p) => p.id === productId)) {
      toast({
        title: "Product already in comparison",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (comparedProducts.length >= 3) {
      toast({
        title: "Maximum 3 products for comparison",
        description: "Please remove a product before adding another",
        status: "error",
        duration: 3000,
        isClosable: true,
        bg:"gray.200"
      });
      return;
    }

    setComparedProducts([...comparedProducts, product]);
  };

  const handleRemoveFromComparison = (productId) => {
    setComparedProducts(comparedProducts.filter((p) => p.id !== productId));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const clearComparison = () => {
    setComparedProducts([]);
  };

  // Helper function to display product info or "No info" if not available
  const displayProductInfo = (product, field) => {
    if (field === "price") {
      return (
        product.price || (
          <Text color="gray.500" fontSize="sm" fontStyle="italic">
            No price info
          </Text>
        )
      );
    }

    if (field === "description") {
      return (
        product.description || (
          <Text color="gray.500" fontSize="sm" fontStyle="italic">
            No description available
          </Text>
        )
      );
    }

    return (
      product[field] || (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No info
        </Text>
      )
    );
  };

  // Helper function to display attribute info or "No info" if not available
  const displayAttributeInfo = (product, attribute) => {
    if (!product.attributes) {
      return (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No info
        </Text>
      );
    }

    return (
      product.attributes[attribute] || (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No info
        </Text>
      )
    );
  };

  // Check if any products have missing information
  const hasIncompleteProducts = comparedProducts.some((product) => {
    // Check basic product info
    if (!product.price || !product.description) return true;

    // Check if attributes are completely missing
    if (!product.attributes) return true;

    // Check if any required attribute is missing
    return categoryAttributes[selectedCategory].some(
      (attr) => !product.attributes[attr]
    );
  });

  return (
    <Box
      h="calc(100vh - 150px)"
      overflowY="auto"
      bg="gray.150"
      px={4}
      py={8}
      maxW="1400px"
      mx="auto"
    >
      <Heading as="h1" mb={6} color="gray.800">
        Product Comparison
      </Heading>

      {/* Category Selection and Search */}
      <Flex
        mb={8}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={4}
        wrap="wrap"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="gray.700"
          whiteSpace="nowrap"
        >
          Select Category:
        </Text>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          bg="white"
          color="black"
          maxW={{ base: "100%", md: "250px" }}
          borderColor="gray.300"
        >
          <option value="keycaps">Key Caps</option>
          <option value="switches">Switches</option>
          <option value="keyboards">Keyboards</option>
          <option value="accessories">Accessories</option>
        </Select>

        {/* Search Input */}
        <InputGroup
          maxW={{ base: "100%", md: "300px" }}
          ml={{ base: 0, md: 4 }}
        >
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={`Search ${selectedCategory}...`}
            value={searchQuery}
            onChange={handleSearch}
            borderColor="gray.300"
          />
          {searchQuery && (
            <InputRightElement>
              <CloseButton size="sm" onClick={clearSearch} />
            </InputRightElement>
          )}
        </InputGroup>

        <Button
          onClick={clearComparison}
          colorScheme="gray"
          ml={{ base: 0, md: "auto" }}
          isDisabled={comparedProducts.length === 0}
        >
          Clear All
        </Button>
      </Flex>

      {/* Selected Products Summary */}
      {comparedProducts.length > 0 && (
        <Box mb={8} p={4} bg="gray.50" borderRadius="md">
          <Flex align="center" wrap="wrap" gap={2}>
            <Text fontWeight="bold" mr={2}>
              Currently comparing:
            </Text>
            {comparedProducts.map((product) => (
              <Badge
                key={product.id}
                colorScheme="gray"
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                {product.name}
                <CloseButton
                  size="sm"
                  ml={1}
                  onClick={() => handleRemoveFromComparison(product.id)}
                />
              </Badge>
            ))}
            <Text ml={2} fontSize="sm" color="gray.700">
              ({comparedProducts.length}/3 selected)
            </Text>
          </Flex>
        </Box>
      )}

      {/* Products to Compare Section - Now using ProductBox component */}
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4} color="gray.700">
          Select Products to Compare
        </Heading>

        {displayedProducts.length > 0 ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {displayedProducts.map((product, index) => (
              <GridItem key={product.id}>
                <Box position="relative">
                  {/* Using ProductBox component */}
                  <ProductBox
                    item={product}
                    index={index}
                    controls={controls}
                  />

                  {/* Add status badges and action button overlay */}
                  <Box position="absolute" top={2} right={2}>
                    {!product.inStock && (
                      <Badge colorScheme="red" mb={2}>
                        Out of Stock
                      </Badge>
                    )}
                  </Box>

                  {(!product.attributes ||
                    !product.price ||
                    !product.description ||
                    categoryAttributes[selectedCategory].some(
                      (attr) => !product.attributes?.[attr]
                    )) && (
                    <Badge
                      position="absolute"
                      top={2}
                      left={2}
                      colorScheme="orange"
                      display="flex"
                      alignItems="center"
                    >
                      <InfoIcon mr={1} boxSize={3} />
                      Incomplete Info
                    </Badge>
                  )}

                  {/* Compare  - positioned at bottom */}
                  <Box mt={4} textAlign="center">
                    <Button
                      size="sm"
                      w="full"
                      colorScheme="gray"
                      bg="gray.700"
                      color="white"
                      _hover={{ bg: "gray.900" }}
                      isDisabled={comparedProducts.some(
                        (p) => p.id === product.id
                      )}
                      onClick={() => handleAddToComparison(product.id)}
                    >
                      {comparedProducts.some((p) => p.id === product.id)
                        ? "Added"
                        : "Compare"}
                    </Button>
                  </Box>
                </Box>
              </GridItem>
            ))}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={8}
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.300"
          >
            <Text fontSize="lg" color="gray.500">
              No products found matching "{searchQuery}"
            </Text>
            <Button mt={4} size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </Box>
        )}
      </Box>

      {/* Comparison Table */}
      {comparedProducts.length > 0 && (
        <Box mt={10} overflowX="auto">
          <Heading as="h2" size="md" mb={4} color="gray.700">
            Comparison Results
          </Heading>

          {/* Warning for incomplete product info */}
          {hasIncompleteProducts && (
            <Alert status="info" mb={4} borderRadius="md" bg="gray.50" >
              <AlertIcon color="black" />
              Some products have incomplete information. Missing details are
              marked as "No info".
            </Alert>
          )}

          <Table variant="simple" borderWidth="1px" borderColor="gray.200" >
            <Thead >
              <Tr bg="gray.50" >
                <Th width="20%">Feature</Th>
                {comparedProducts.map((product) => (
                  <Th
                    key={product.id}
                    width={`${80 / comparedProducts.length}%`}
                  >
                    <Flex justify="space-between" align="center">
                      <Text>{product.name}</Text>
                      <CloseButton
                        size="sm"
                        onClick={() => handleRemoveFromComparison(product.id)}
                      />
                    </Flex>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {/* Product Image */}
              <Tr>
                <Td fontWeight="bold">Image</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      maxH="100px"
                      objectFit="contain"
                      mx="auto"
                      fallbackSrc="https://via.placeholder.com/100"
                      borderRadius="xl"
                    />
                  </Td>
                ))}
              </Tr>

              {/* Price */}
              <Tr>
                <Td fontWeight="bold">Price</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>
                    {displayProductInfo(product, "price")}
                  </Td>
                ))}
              </Tr>

              {/* Availability */}
              <Tr>
                <Td fontWeight="bold">Availability</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>
                    <Badge colorScheme={product.inStock ? "green" : "red"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </Td>
                ))}
              </Tr>

              {/* Description */}
              <Tr>
                <Td fontWeight="bold">Description</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>
                    {displayProductInfo(product, "description")}
                  </Td>
                ))}
              </Tr>

              {/* Category-specific attributes */}
              {categoryAttributes[selectedCategory]?.map((attribute) => (
                <Tr key={attribute}>
                  <Td fontWeight="bold">{attribute}</Td>
                  {comparedProducts.map((product) => (
                    <Td key={product.id}>
                      {displayAttributeInfo(product, attribute)}
                    </Td>
                  ))}
                </Tr>
              ))}


            </Tbody>
          </Table>
        </Box>
      )}

      {/* Empty state for comparison */}
      {comparedProducts.length === 0 && (
        <Box
          textAlign="center"
          py={12}
          px={6}
          borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
          borderColor="gray.300"
        >
          <Text fontSize="lg" color="gray.500">
            Select products from above to compare their features
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ComparePage;
