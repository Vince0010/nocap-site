/* eslint-disable no-unused-vars */
import {
    Box,
    Grid,
    GridItem,
    Heading,
    Text,
    Alert,
    AlertIcon,
    Skeleton,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    CloseButton,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  import { useState, useEffect } from "react";
  import { useSearchParams, useNavigate } from "react-router-dom";
  import { ProductBox } from "../components/ProductComponents";
  import { useAnimation } from "framer-motion";
  
  const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState(query);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const controls = useAnimation();
  
    // Fetch products from all categories
    useEffect(() => {
      const fetchAllProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const categories = ["keycaps", "switches", "keyboards", "others"];
          const fetchPromises = categories.map(async (category) => {
            const response = await fetch(`/api/${category}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${category}`);
            }
            const data = await response.json();
            return data.map((product) => ({
              ...product,
              category: category === "others" ? "accessories" : category,
              formattedPrice: product.price ? `₱${parseFloat(product.price).toFixed(2)}` : null,
              inStock: product.availability === "in-stock",
            }));
          });
  
          const results = await Promise.all(fetchPromises);
          const allProducts = results.flat();
          setProducts(allProducts);
          controls.start("visible");
          console.log("Fetched all products:", allProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAllProducts();
    }, [controls]);
  
    // Filter products based on query
    const filteredProducts = query
      ? products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      : products;
  
    // Handle search input change
    const handleSearch = (e) => {
      const newQuery = e.target.value;
      setSearchQuery(newQuery);
      setSearchParams(newQuery ? { q: newQuery } : {});
    };
  
    // Clear search
    const clearSearch = () => {
      setSearchQuery("");
      setSearchParams({});
    };
  
    if (error) {
      return (
        <Box bg="gray.150" px={4} py={8} maxW="1400px" mx="auto" minH="100vh">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Error: {error}
          </Alert>
        </Box>
      );
    }
  
    return (
      <Box bg="gray.150" px={4} py={8} maxW="1400px" mx="auto" minH="100vh">
        <Heading as="h1" mb={6} color="gray.800">
          Search Results
        </Heading>
  
        {/* Search Bar */}
        <InputGroup maxW="400px" mb={8}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search for an item"
            value={searchQuery}
            onChange={handleSearch}
            borderColor="gray.300"
            bg="white"
            color="gray.800"
          />
          {searchQuery && (
            <InputRightElement>
              <CloseButton size="sm" onClick={clearSearch} />
            </InputRightElement>
          )}
        </InputGroup>
  
        {/* Results Section */}
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
        ) : filteredProducts.length > 0 ? (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {filteredProducts.map((product, index) => (
              <GridItem key={`${product.category}-${product.id}`}>
                <Box position="relative">
                  <ProductBox
                    item={{
                      ...product,
                      name: `${product.name} (${product.category.charAt(0).toUpperCase() + product.category.slice(1)})`,
                    }}
                    index={index}
                    category={product.category}
                    controls={controls}
                  />
                  <Box position="absolute" top={2} right={2}>
                    {!product.inStock && (
                      <Badge colorScheme="red" mb={2}>
                        Out of Stock
                      </Badge>
                    )}
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
              {query
                ? `No products found matching "${query}"`
                : "Enter a search term to find products"}
            </Text>
            {query && (
              <Button mt={4} size="sm" onClick={clearSearch}>
                Clear Search
              </Button>
            )}
          </Box>
        )}
      </Box>
    );
  };
  
  export default SearchResultsPage;