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
  Center,
  Skeleton,
  SimpleGrid,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimation } from "framer-motion";
import { useDebounce } from "use-debounce";
import { AnimatedProductRow, ProductBox } from "../components/ProductComponents";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

// Schema-based attributes for comparison, derived from database models
const schemaAttributes = {
  switches: {
    attributes: [
      "releaseYear",
      "switchType",
      "isFactoryLubed",
      "switchProfile",
      "actuationForce",
      "bottomOutForce",
      "preTravel",
      "totalTravel",
      "pins",
      "isHallEffect",
      "topHousingMaterial",
      "bottomHousingMaterial",
      "stemMaterial",
      "springs",
      "isLongPole",
    ],
    displayLabels: {
      releaseYear: "Release Year",
      switchType: "Switch Type",
      isFactoryLubed: "Factory Lubed",
      switchProfile: "Switch Profile",
      actuationForce: "Actuation Force",
      bottomOutForce: "Bottom-Out Force",
      preTravel: "Pre-Travel",
      totalTravel: "Total Travel",
      pins: "Pins",
      isHallEffect: "Hall Effect",
      topHousingMaterial: "Top Housing Material",
      bottomHousingMaterial: "Bottom Housing Material",
      stemMaterial: "Stem Material",
      springs: "Springs",
      isLongPole: "Long Pole",
    },
  },
  keycaps: {
    attributes: [
      "profile",
      "material",
      "layoutCompatibility",
      "stemType",
    ],
    displayLabels: {
      profile: "Profile",
      material: "Material",
      layoutCompatibility: "Layout Compatibility",
      stemType: "Stem Type",
    },
  },
  keyboard: {
    attributes: [
      "releaseYear",
      "switchOptions",
      "plateMaterial",
      "profile",
      "isHotSwappable",
      "layoutSize",
      "layoutStandard",
      "layoutErgonomics",
      "connectivity",
      "pollingRate",
      "batteryCapacity",
      "mountType",
      "backlight",
      "caseColors",
      "caseMaterial",
      "keycapMaterial",
      "dimensions",
      "weight",
      "knobSupport",
      "displaySupport",
      "multiMediaKeys",
      "winmacSupport",
      "usb_C",
      "hallEffectSupport",
      "qmkSupport",
      "viaSupport",
      "nkeyRollover",
      "screwInStabilizers",
      "soundDampening",
    ],
    displayLabels: {
      releaseYear: "Release Year",
      switchOptions: "Switch Options",
      plateMaterial: "Plate Material",
      profile: "Profile",
      isHotSwappable: "Hot Swappable",
      layoutSize: "Layout Size",
      layoutStandard: "Layout Standard",
      layoutErgonomics: "Layout Ergonomics",
      connectivity: "Connectivity",
      pollingRate: "Polling Rate",
      batteryCapacity: "Battery Capacity",
      mountType: "Mount Type",
      backlight: "Backlight",
      caseColors: "Case Colors",
      caseMaterial: "Case Material",
      keycapMaterial: "Keycap Material",
      dimensions: "Dimensions",
      weight: "Weight",
      knobSupport: "Knob Support",
      displaySupport: "Display Support",
      multiMediaKeys: "Multimedia Keys",
      winmacSupport: "Windows/Mac Support",
      usb_C: "USB-C",
      hallEffectSupport: "Hall Effect Support",
      qmkSupport: "QMK Support",
      viaSupport: "VIA Support",
      nkeyRollover: "N-Key Rollover",
      screwInStabilizers: "Screw-In Stabilizers",
      soundDampening: "Sound Dampening",
    },
  },
  others: {
    attributes: [
      "category",
    ],
    displayLabels: {
      category: "Category",
    },
  },
};

const ComparePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("keycaps");
  const [comparedProducts, setComparedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDelay, setLoadingDelay] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const toast = useToast();
  const navigate = useNavigate();
  const controls = useAnimation();

  const fetchProducts = async () => {
    setLoading(true);
    setLoadingDelay(true);
    setError(null);
    try {
      const fetchCategory = selectedCategory === "others" ? "others" : selectedCategory;
      const queryParamsObj = {};
      if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
        queryParamsObj.search = debouncedSearchQuery.trim();
      }
      const queryParams = new URLSearchParams(queryParamsObj).toString();
      const url = `http://localhost:5000/api/${fetchCategory}${queryParams ? `?${queryParams}` : ""}`;
      console.log(`Fetching ${selectedCategory} with URL:`, url);

      const response = await fetch(url);
      console.log("Response headers:", [...response.headers.entries()]);
      if (!response.ok) {
        const text = await response.text();
        console.error("Response status:", response.status, "Response error text:", text.slice(0, 100));
        throw new Error(`Failed to fetch ${selectedCategory}: ${response.status} ${text.slice(0, 100)}`);
      }

      const data = await response.json();
      console.log(`Raw API Data for ${selectedCategory}:`, JSON.stringify(data, null, 2));

      // Handle single object or array
      const productsArray = Array.isArray(data) ? data : [data];
      console.log(`Processed ${selectedCategory} Array:`, productsArray);

      // Validate data (aligned with othersSchema for others, generic for others)
      const validData = productsArray.filter(
        (product) =>
          product &&
          (product._id || product.id) &&
          typeof product.name === "string" &&
          product.name.trim() &&
          (selectedCategory !== "others" ||
            (typeof product.description === "string" &&
              product.description.trim() &&
              typeof product.price === "number" &&
              product.price >= 0 &&
              typeof product.quantity === "number" &&
              product.category)) &&
          (!product.image ||
            (typeof product.image === "string" &&
              product.image.trim() &&
              product.image !== "null"))
      );
      console.log(`Valid Data for ${selectedCategory}:`, validData);

      if (validData.length < productsArray.length) {
        console.warn(
          `Invalid ${selectedCategory} entries filtered out:`,
          productsArray.filter((product) => !validData.includes(product))
        );
      }

      // Set category attributes based on schema
      const attributes = schemaAttributes[selectedCategory]?.attributes || [];
      console.log(`Schema Attributes for ${selectedCategory}:`, attributes);
      setCategoryAttributes(attributes);

      // Map backend data to match ComparePage structure
      const mappedProducts = validData.map((product) => {
        // Extract attributes from schema-defined fields
        const productAttributes = {};
        attributes.forEach((attr) => {
          if (product[attr] !== undefined && product[attr] !== null) {
            productAttributes[attr] = product[attr];
          }
        });

        return {
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          formattedPrice: product.price ? `₱${parseFloat(product.price).toFixed(2)}` : null,
          image: product.image || "https://via.placeholder.com/100",
          altImage: product.altImage || "https://placehold.co/600x400/000000/FFF",
          attributes: productAttributes,
          description: product.description || `Premium ${selectedCategory} product.`,
          inStock: product.quantity > 0 ? true : false,
          category: product.category?.toLowerCase() || fetchCategory, // Normalize category
        };
      });
      console.log(`Mapped Products for ${selectedCategory}:`, mappedProducts);

      setAvailableProducts(mappedProducts);
      controls.start("visible");
    } catch (error) {
      console.error(`Error fetching ${selectedCategory}:`, error);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingDelay(false);
      }, 500);
    }
  };

  useEffect(() => {
    setComparedProducts([]);
    fetchProducts();
  }, [selectedCategory, debouncedSearchQuery]);

  // Search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
        bg: "gray.200",
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
    setSearchQuery("");
  };

  const clearComparison = () => {
    setComparedProducts([]);
    setSearchQuery("");
  };

  // Helper function to display product info or "No info" if not available
  const displayProductInfo = (product, field) => {
    if (field === "price") {
      return product.formattedPrice || (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No price info
        </Text>
      );
    }
    if (field === "description") {
      return product.description || (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No description available
        </Text>
      );
    }
    return product[field] || (
      <Text color="gray.500" fontSize="sm" fontStyle="italic">
        No info
      </Text>
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
    return product.attributes[attribute] || (
      <Text color="gray.500" fontSize="sm" fontStyle="italic">
        No info
      </Text>
    );
  };

  // Helper function to get display label for an attribute
  const getDisplayLabel = (category, attribute) => {
    const label = schemaAttributes[category]?.displayLabels?.[attribute];
    if (label) return label;
    // Fallback: capitalize first letter and replace camelCase or underscores
    return attribute
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  };

  // Check for incomplete products
  const hasIncompleteProducts = comparedProducts.some((product) => {
    if (!product.formattedPrice || !product.description) return true;
    if (!product.attributes) return true;
    return categoryAttributes.some((attr) => !product.attributes[attr]);
  });

  // Memoize products to stabilize rendering
  const memoizedProducts = useMemo(() => {
    console.log(`Rendering ${selectedCategory}:`, availableProducts);
    return availableProducts;
  }, [availableProducts, selectedCategory]);

  return (
    <Box h="calc(104vh - 120px)" overflowY="auto" bg="gray.30" px={4} py={8} maxW="auto" mx="auto">
      <Heading as="h1" mb={6} color="gray.800" textAlign="center">
        Compare
      </Heading>

      {/* Category Selection and Search */}
      <Flex
        mb={8}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={4}
        wrap="wrap"
      >
        <Text fontSize="lg" fontWeight="bold" color="gray.700" whiteSpace="nowrap">
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
          <option value="keyboard">Keyboards</option>
          <option value="others">Others</option>
        </Select>

        <InputGroup maxW={{ base: "100%", md: "300px" }} ml={{ base: 0, md: 4 }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder={`Search ${selectedCategory}...`}
            value={searchQuery}
            onChange={handleSearch}
            borderColor="gray.300"
            bg="white"
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
          isDisabled={comparedProducts.length === 0 && !searchQuery}
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

      {/* Products to Compare Section with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {error ? (
          <MotionBox
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            w="full"
            mx="auto"
            py={8}
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.300"
            textAlign="center"
            bg="gray.50"
          >
            <Text color="red.500" fontSize="lg">
              Error: {error}
            </Text>
            <Button
              mt={4}
              size="sm"
              onClick={fetchProducts}
              bg="gray.700"
              color="white"
              _hover={{ bg: "gray.900" }}
            >
              Retry
            </Button>
          </MotionBox>
        ) : loading || loadingDelay ? (
          <MotionBox
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeatType: "loop" }}
          >
            <Heading as="h2" size="md" mb={4} color="gray.700">
              Select Products to Compare
            </Heading>
            <VStack align="start" spacing={6} width="100%">
              <Center width="100%">
                <SimpleGrid
                  columns={{
                    base: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                  }}
                  spacing={8}
                  width="100%"
                >
                  {[...Array(8)].map((_, index) => (
                    <Box
                      key={index}
                      minWidth="200px"
                      minHeight="300px"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      <Box
                        width="100%"
                        position="relative"
                        minWidth="200px"
                        minHeight="200px"
                      >
                        <Skeleton
                          width="100%"
                          height="0"
                          paddingBottom="100%"
                          borderRadius="xl"
                          startColor="gray.200"
                          endColor="gray.300"
                        />
                      </Box>
                      <Box mt={3} textAlign="center" width="100%">
                        <Skeleton
                          height="16px"
                          width="80%"
                          mb={2}
                          startColor="gray.200"
                          endColor="gray.300"
                        />
                        <Skeleton
                          height="12px"
                          width="60%"
                          startColor="gray.200"
                          endColor="gray.300"
                        />
                      </Box>
                      <Skeleton
                        height="30px"
                        width="100%"
                        mt={2}
                        startColor="gray.200"
                        endColor="gray.300"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Center>
            </VStack>
          </MotionBox>
        ) : memoizedProducts.length > 0 ? (
          <MotionBox
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Heading as="h2" size="md" mb={4} color="gray.700">
              Select Products to Compare
            </Heading>
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {memoizedProducts.map((product, index) => (
                <GridItem key={product.id}>
                  <Box position="relative">
                    <ProductBox
                      item={product}
                      index={index}
                    />
                    <Box position="absolute" top={2} right={2}>
                      {!product.inStock && (
                        <Badge colorScheme="red" mb={2}>
                          Out of Stock
                        </Badge>
                      )}
                    </Box>
                    {(!product.attributes ||
                      !product.formattedPrice ||
                      !product.description ||
                      categoryAttributes.some(
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
                    <Box mt={4} textAlign="center">
                      <Button
                        size="sm"
                        w="full"
                        colorScheme="gray"
                        bg="gray.700"
                        color="white"
                        _hover={{ bg: "gray.900" }}
                        isDisabled={comparedProducts.some((p) => p.id === product.id)}
                        onClick={() => handleAddToComparison(product.id)}
                      >
                        {comparedProducts.some((p) => p.id === product.id) ? "Added" : "Compare"}
                      </Button>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </MotionBox>
        ) : (
          <MotionBox
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            textAlign="center"
            py={8}
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="gray.300"
            mx="auto"
            maxW="auto"
          >
            <Text fontSize="lg" color="gray.500">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : "No products available for this category"}
            </Text>
            {searchQuery && (
              <Button mt={4} size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Comparison Table */}
      {comparedProducts.length > 0 && (
        <Box mt={10} overflowX="auto" borderRadius="xl" overflow="hidden">
          <Heading as="h2" size="md" mb={4} color="gray.700">
            Comparison Results
          </Heading>
          {hasIncompleteProducts && (
            <Box mb={4} p={4} bg="gray.50" borderRadius="md">
              <Flex align="center">
                <InfoIcon color="orange.500" mr={2} />
                <Text color="gray.700">
                  Some products have incomplete information. Missing details are marked as "No info".
                </Text>
              </Flex>
            </Box>
          )}
          <Table
            variant="simple"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
          >
            <Thead>
              <Tr bg="gray.50">
                <Th width="20%" borderTopLeftRadius="xl">
                  Feature
                </Th>
                {comparedProducts.map((product, index) => (
                  <Th
                    key={product.id}
                    width={`${80 / comparedProducts.length}%`}
                    borderTopRightRadius={index === comparedProducts.length - 1 ? "xl" : "0"}
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
              <Tr>
                <Td fontWeight="bold">Price</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>{displayProductInfo(product, "price")}</Td>
                ))}
              </Tr>
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
              <Tr>
                <Td fontWeight="bold">Category</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>{product.category}</Td>
                ))}
              </Tr>
              <Tr>
                <Td fontWeight="bold">Description</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>{displayProductInfo(product, "description")}</Td>
                ))}
              </Tr>
              {categoryAttributes.length > 0 ? (
                categoryAttributes.map((attribute) => (
                  <Tr key={attribute}>
                    <Td fontWeight="bold">{getDisplayLabel(selectedCategory, attribute)}</Td>
                    {comparedProducts.map((product) => (
                      <Td key={product.id}>{displayAttributeInfo(product, attribute)}</Td>
                    ))}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={comparedProducts.length + 1}>
                    <Text color="gray.500" fontStyle="italic" textAlign="center">
                      No attributes available for this category
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      )}

      {comparedProducts.length === 0 && !searchQuery && !loading && !loadingDelay && memoizedProducts.length > 0 && (
        <Box
          textAlign="center"
          py={12}
          px={6}
          borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
          borderColor="gray.300"
          mx="auto"
          maxW="auto"
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