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
  Skeleton,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import { useAnimation } from "framer-motion";
import { AnimatedProductRow, ProductBox } from "../components/ProductComponents";

// Product categories and their specific comparable attributes
const categoryAttributes = {
  keycaps: ["Profile", "Material", "Layout Compatibility", "Stem Type"],
  switches: ["Type", "Actuation Force", "Travel Distance", "Pre-Travel"],
  keyboards: ["Size", "Connection", "Hot-Swappable", "RGB", "Case Material"],
  accessories: ["Type", "Compatibility", "Material"],
};

const ComparePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("keycaps");
  const [comparedProducts, setComparedProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      setComparedProducts([]);
      setSearchQuery("");
      try {
        const fetchCategory = selectedCategory === "accessories" ? "others" : selectedCategory;
        const response = await fetch(`/api/${fetchCategory}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${selectedCategory}`);
        }
        const data = await response.json();

        // Map backend data to match ComparePage structure
        const mappedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price, // Keep as number for ProductBox
          formattedPrice: product.price ? `₱${parseFloat(product.price).toFixed(2)}` : null, // For comparison table
          image: product.image,
          altImage: product.altImage,
          attributes: product.attributes || {},
          description: product.description || `Premium ${selectedCategory} product.`,
          inStock: product.availability === "in-stock",
        }));

        setAvailableProducts(mappedProducts);
        setDisplayedProducts(mappedProducts);
        controls.start("visible");
        console.log(`Fetched ${selectedCategory}:`, mappedProducts);
      } catch (error) {
        console.error(`Error fetching ${selectedCategory}:`, error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, controls]);

  // Search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setDisplayedProducts(availableProducts);
      return;
    }

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
  };

  const clearComparison = () => {
    setComparedProducts([]);
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

  // Check for incomplete products
  const hasIncompleteProducts = comparedProducts.some((product) => {
    if (!product.formattedPrice || !product.description) return true;
    if (!product.attributes) return true;
    return categoryAttributes[selectedCategory].some(
      (attr) => !product.attributes[attr]
    );
  });

  if (error) {
    return (
      <Box h="calc(100vh - 150px)" bg="gray.150" px={4} py={8} maxW="auto" mx="auto">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          Error: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      h="calc(105vh - 150px)"
      overflowY="auto"
      bg="gray.150"
      px={4}
      py={8}
      maxW="auto"
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
          <option value="keyboards">Keyboards</option>
          <option value="accessories">Accessories</option>
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

      {/* Products to Compare Section */}
      <Box mb={8}>
        <Heading as="h2" size="md" mb={4} color="gray.700">
          Select Products to Compare
        </Heading>

        {loading ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {[...Array(8)].map((_, index) => (
              <GridItem key={index}>
                <Skeleton height="300px" width="100%" borderRadius="xl" />
              </GridItem>
            ))}
          </Grid>
        ) : displayedProducts.length > 0 ? (
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
                  <ProductBox
                    item={product}
                    index={index}
                    category={selectedCategory}
                    controls={controls}
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
          {hasIncompleteProducts && (
            <Alert status="info" mb={4} borderRadius="md" bg="gray.50">
              <AlertIcon color="black" />
              Some products have incomplete information. Missing details are marked as "No info".
            </Alert>
          )}
          <Table variant="simple" borderWidth="1px" borderColor="gray.200">
            <Thead>
              <Tr bg="gray.50">
                <Th width="20%">Feature</Th>
                {comparedProducts.map((product) => (
                  <Th key={product.id} width={`${80 / comparedProducts.length}%`}>
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
                <Td fontWeight="bold">Description</Td>
                {comparedProducts.map((product) => (
                  <Td key={product.id}>{displayProductInfo(product, "description")}</Td>
                ))}
              </Tr>
              {categoryAttributes[selectedCategory]?.map((attribute) => (
                <Tr key={attribute}>
                  <Td fontWeight="bold">{attribute}</Td>
                  {comparedProducts.map((product) => (
                    <Td key={product.id}>{displayAttributeInfo(product, attribute)}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

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