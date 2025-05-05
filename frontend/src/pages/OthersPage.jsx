/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  VStack,
  Select,
  Input,
  Button,
  Center,
  Skeleton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  CloseButton,
  Heading,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { AnimatedProductRow } from "../components/ProductComponents";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const OthersPage = () => {
  const [others, setOthers] = useState([]);
  const [filteredOthers, setFilteredOthers] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 100);
  const [loadingDelay, setLoadingDelay] = useState(false);

  const fetchOthers = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = "http://localhost:5000/api/others";
      console.log("Fetching from URL:", url);
      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        console.error("Response Text:", text);
        throw new Error(
          `Failed to fetch accessories: ${response.status} ${text.slice(
            0,
            100
          )}`
        );
      }

      const data = await response.json();
      console.log("Raw API Data:", JSON.stringify(data, null, 2));

      // Handle single object or array
      let othersArray;
      if (Array.isArray(data)) {
        othersArray = data.filter(
          (product) =>
            !product.category || product.category?.toLowerCase() === "others"
        );
      } else if (data && typeof data === "object") {
        console.log("Received single object, wrapping in array");
        othersArray =
          !data.category || data.category?.toLowerCase() === "others"
            ? [data]
            : [];
      } else {
        console.error("Unexpected data format:", data);
        othersArray = [];
      }
      console.log("Filtered Accessories:", othersArray);

      // Log items that fail validation
      const invalidItems = [];
      const validData = othersArray.filter((item) => {
        const isValid =
          item &&
          (item._id || item.id) &&
          typeof item.name === "string" &&
          item.name.trim();
        if (!isValid) {
          invalidItems.push({
            item,
            reasons: [
              !item && "Item is null or undefined",
              !(item._id || item.id) && "Missing id",
              typeof item.name !== "string" && "Name is not a string",
              item.name && !item.name.trim() && "Name is empty",
            ].filter(Boolean),
          });
        }
        return isValid;
      });
      if (invalidItems.length > 0) {
        console.warn("Invalid items filtered out:", invalidItems);
      }
      console.log("Valid Data:", validData);

      // Process data with defaults
      const processedData = validData.map((item) => {
        if (!item.brand || !item.brand.trim()) {
          console.log(
            `Assigned Unknown brand to keyboard: ${item.name || item._id}`
          );
        }
        return {
          ...item,
          id: item._id || item.id,
          price:
            typeof item.price === "number" && item.price >= 0 ? item.price : 0,
          brand:
            typeof item.brand === "string" && item.brand.trim()
              ? item.brand
              : "Unknown",
          category: item.category?.toLowerCase() || "others", // Normalize category
          image:
            typeof item.image === "string" &&
            item.image.trim() &&
            item.image !== "null"
              ? item.image
              : "https://via.placeholder.com/100",
          availability:
            typeof item.quantity === "number" && item.quantity > 0
              ? "in-stock"
              : "out-of-stock",
        };
      });
      console.log("Processed Data:", processedData);

      if (processedData.length === 0) {
        console.warn("No valid accessories after processing");
      }
      const uniqueBrands = [
        ...new Set(processedData.map((keyboard) => keyboard.brand)),
      ].sort();

      setOthers(processedData);
      setFilteredOthers(processedData);
      setBrandOptions(uniqueBrands);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingDelay(false);
      }, 500);
      setLoadingDelay(true);
    }
  };

  useEffect(() => {
    fetchOthers();
    console.log("Accessories fetched on mount:", others);
  }, []);

  useEffect(() => {
    setLoading(true);
    setLoadingDelay(true);

    let filtered = [...others];

    filtered = filtered.filter((item) => item && item.id && item.name);

    console.log("Initial Accessories for Filtering:", filtered);

    if (minPrice && !isNaN(minPrice) && minPrice !== "") {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((item) => item.price >= min);
      console.log("After minPrice filter:", filtered);
    }
    if (maxPrice && !isNaN(maxPrice) && maxPrice !== "") {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((item) => item.price <= max);
      console.log("After maxPrice filter:", filtered);
    }
    if (availability && availability !== "") {
      filtered = filtered.filter((item) => {
        if (item.availability) {
          return item.availability === availability;
        } else {
          return (
            (availability === "in-stock" && item.quantity > 0) ||
            (availability === "out-of-stock" && item.quantity <= 0)
          );
        }
      });
      console.log("After availability filter:", filtered);
    }
    if (brand && brand !== "") {
      filtered = filtered.filter((item) => item.brand === brand);
      console.log("After brand filter:", filtered);
    }
    if (debouncedSearchQuery.trim()) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(lowerCaseQuery)
      );
      console.log("After search filter:", filtered);
    }

    setFilteredOthers(filtered);

    const timer = setTimeout(() => {
      setLoading(false);
      setLoadingDelay(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, availability, brand, debouncedSearchQuery, others]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAvailability("");
    setBrand("");
    setSearchQuery("");
  };

  const memoizedOthers = useMemo(() => {
    console.log("Memoized Accessories:", filteredOthers);
    return filteredOthers;
  }, [filteredOthers]);

  return (
    <Box
      h="calc(104vh - 120px)"
      overflowY="auto"
      bg="gray.30"
      px={4}
      py={8}
      maxW="auto"
      mx="auto"
    >
      <Heading
        as="h1"
        mb={6}
        color="gray.800"
        textAlign="center"
        fontWeight="bold"
      >
        Accessories
      </Heading>

      <Flex mb={4} justify="space-between" wrap="wrap" gap={4}>
        <InputGroup maxW={{ base: "100%", md: "350px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search accessories..."
            bg="white"
            color="black"
            borderColor="gray.300"
            value={searchQuery}
            onChange={handleSearch}
            size="md"
            borderRadius="md"
          />
          {searchQuery && (
            <InputRightElement>
              <CloseButton size="sm" onClick={clearSearch} />
            </InputRightElement>
          )}
        </InputGroup>

        <Button
          onClick={clearAllFilters}
          colorScheme="gray"
          ml={{ base: 0, md: "auto" }}
          isDisabled={
            !searchQuery && !minPrice && !maxPrice && !availability && !brand
          }
        >
          Clear All
        </Button>
      </Flex>

      <Flex
        mb={8}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={4}
        wrap="wrap"
        p={4}
        borderRadius="md"
      >
        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">
            Price Range:
          </Text>
          <Flex>
            <Input
              placeholder="MIN"
              bg="white"
              color="black"
              mr={2}
              _placeholder={{ color: "gray.500" }}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              size="sm"
              maxW="100px"
              borderRadius="md"
            />
            <Input
              placeholder="MAX"
              bg="white"
              color="black"
              _placeholder={{ color: "gray.500" }}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              size="sm"
              maxW="100px"
              borderRadius="md"
            />
          </Flex>
        </Flex>

        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">
            Availability:
          </Text>
          <Select
            bg="white"
            color="black"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            size="sm"
            maxW="150px"
            borderRadius="lg"
          >
            <option value="">All</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </Select>
        </Flex>

        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">
            Brand:
          </Text>
          <Select
            bg="white"
            color="black"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            size="sm"
            maxW="150px"
            borderRadius="md"
          >
            <option value="">All</option>
            {brandOptions.map((brandOption) => (
              <option key={brandOption} value={brandOption}>
                {brandOption}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>

      <AnimatePresence mode="wait">
        {error ? (
          <MotionBox
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            w="full"
            py={8}
            px={6}
            borderWidth="1px"
            borderRadius="xl"
            borderStyle="dashed"
            borderColor="gray.300"
            textAlign="center"
            bg="gray.50"
          >
            <Text color="red.500" fontSize="lg">
              {error}
            </Text>
            <Button
              mt={4}
              size="sm"
              onClick={fetchOthers}
              bg="gray.700"
              color="white"
              _hover={{ bg: "gray.900" }}
              borderRadius="xl"
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
            <VStack align="start" spacing={6} width="100%">
              <Center width="100%">
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
                  spacing={8}
                  width="100%"
                  justifyContent="center"
                  maxW="auto"
                >
                  {[...Array(10)].map((_, index) => (
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
                        minWidth="300px"
                        minHeight="300px"
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
                    </Box>
                  ))}
                </SimpleGrid>
              </Center>
            </VStack>
          </MotionBox>
        ) : memoizedOthers.length === 0 ? (
          <MotionBox
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            textAlign="center"
            py={8}
            px={6}
            borderWidth="1px"
            borderRadius="xl"
            borderStyle="dashed"
            borderColor="gray.300"
            mx="auto"
          >
            <Text fontSize="lg" color="gray.500">
              No accessories found.
            </Text>
            <Button mt={4} colorScheme="gray" onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </MotionBox>
        ) : (
          <MotionBox
            key="products"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            mt={4}
            minH="300px"
          >
            <AnimatedProductRow items={memoizedOthers} category="others" />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default OthersPage;
