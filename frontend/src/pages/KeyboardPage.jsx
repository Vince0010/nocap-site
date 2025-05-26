/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  Input,
  Select,
  Button,
  Text,
  Heading,
  Skeleton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  CloseButton,
  SimpleGrid,
  VStack,
  Center,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { AnimatedProductRow } from "../components/ProductComponents";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const KeyboardPage = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [filteredKeyboards, setFilteredKeyboards] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300); // Increased debounce time for stability
  const [dataReady, setDataReady] = useState(false); // New state to track if data is fully ready

  const fetchKeyboards = async () => {
    setLoading(true);
    setError(null);
    setDataReady(false); // Reset data readiness

    try {
      const url = "http://localhost:5000/api/keyboard";
      console.log("Fetching from URL:", url);

      // Add timeout to handle slow networks
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.error("Response Text:", text);
        throw new Error(
          `Failed to fetch keyboards: ${response.status} ${text.slice(0, 100)}`
        );
      }

      const data = await response.json();
      console.log("Raw API Data:", JSON.stringify(data, null, 2));

      // Handle single object or array
      let keyboardArray;
      if (Array.isArray(data)) {
        keyboardArray = data.filter(
          (product) => product.category?.toLowerCase() === "keyboard"
        );
      } else if (data && typeof data === "object") {
        console.log("Received single object, wrapping in array");
        keyboardArray =
          data.category?.toLowerCase() === "keyboard" ? [data] : [];
      } else {
        console.error("Unexpected data format:", data);
        keyboardArray = [];
      }
      console.log("Filtered Keyboards:", keyboardArray);

      // Validate data
      const validData = keyboardArray.filter(
        (keyboard) =>
          keyboard &&
          (keyboard._id || keyboard.id) &&
          typeof keyboard.name === "string" &&
          keyboard.name.trim() &&
          typeof keyboard.price === "number" &&
          keyboard.price >= 0 &&
          (!keyboard.image ||
            (typeof keyboard.image === "string" &&
              keyboard.image.trim() &&
              keyboard.image !== "null"))
      );
      console.log("Valid Data:", validData);

      // Process data
      const processedData = validData.map((keyboard) => {
        if (!keyboard.brand || !keyboard.brand.trim()) {
          console.log(`Assigned Unknown brand to keyboard: ${keyboard.name || keyboard._id}`);
        }
        return {
          ...keyboard,
          id: keyboard._id || keyboard.id,
          category: keyboard.category?.toLowerCase() || "keyboard",
          brand:
            typeof keyboard.brand === "string" && keyboard.brand.trim()
              ? keyboard.brand
              : "Unknown",
          image: keyboard.image || "https://via.placeholder.com/100",
          altImage: keyboard.altImage || "https://placehold.co/600x400/000000/FFF",
          availability: keyboard.quantity > 0 ? "in-stock" : "out-of-stock",
        };
      });
      console.log("Processed Data:", processedData);

      if (processedData.length === 0) {
        console.warn("No valid keyboards after processing");
      }

      // Extract unique brands
      const uniqueBrands = [
        ...new Set(processedData.map((keyboard) => keyboard.brand)),
      ].sort();
      console.log("Unique Brands:", uniqueBrands);

      // Only update state if data is valid
      setKeyboards(processedData);
      setFilteredKeyboards(processedData);
      setBrandOptions(uniqueBrands);
      setDataReady(true); // Mark data as ready
    } catch (error) {
      console.error("Error fetching keyboards:", error);
      setError(
        error.name === "AbortError"
          ? "Request timed out. Please check your connection and try again."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyboards();
  }, []);

  useEffect(() => {
    if (!dataReady) return; // Skip filtering until data is ready

    let filtered = [...keyboards];

    filtered = filtered.filter(
      (keyboard) =>
        keyboard &&
        (keyboard._id || keyboard.id) &&
        keyboard.name &&
        keyboard.price !== undefined &&
        (!keyboard.image ||
          (keyboard.image &&
            keyboard.image.trim() &&
            keyboard.image !== "null")) &&
        (!keyboard.altImage ||
          (typeof keyboard.altImage === "string" &&
            keyboard.altImage.trim() &&
            keyboard.altImage !== "null"))
    );

    console.log("Initial Keyboards for Filtering:", filtered);

    if (minPrice && !isNaN(minPrice) && minPrice !== "") {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((keyboard) => keyboard.price >= min);
    }
    if (maxPrice && !isNaN(maxPrice) && maxPrice !== "") {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((keyboard) => keyboard.price <= max);
    }
    if (availability && availability !== "") {
      filtered = filtered.filter((keyboard) => {
        if (keyboard.availability) {
          return keyboard.availability === availability;
        } else {
          return (
            (availability === "in-stock" && keyboard.quantity > 0) ||
            (availability === "out-of-stock" && keyboard.quantity <= 0)
          );
        }
      });
    }
    if (brand && brand !== "") {
      filtered = filtered.filter((keyboard) => keyboard.brand === brand);
    }
    if (debouncedSearchQuery.trim()) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((keyboard) =>
        keyboard.name?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredKeyboards(filtered);
  }, [
    minPrice,
    maxPrice,
    availability,
    brand,
    debouncedSearchQuery,
    keyboards,
    dataReady,
  ]);

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

  const memoizedKeyboards = useMemo(() => {
    console.log("Memoized Keyboards:", filteredKeyboards);
    return filteredKeyboards;
  }, [filteredKeyboards]);

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
        Keyboards
      </Heading>

      <Flex mb={4} justify="space-between" wrap="wrap" gap={4}>
        <InputGroup maxW={{ base: "100%", md: "350px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search keyboards..."
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
          <Text fontWeight="bold" fontSize="sm">
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
          <Text fontWeight="bold" fontSize="sm">
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
          <Text fontWeight="bold" fontSize="sm">
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
              onClick={fetchKeyboards}
              bg="gray.700"
              color="white"
              _hover={{ bg: "gray.900" }}
              borderRadius="xl"
            >
              Retry
            </Button>
          </MotionBox>
        ) : loading || !dataReady ? (
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
                         sd
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
        ) : memoizedKeyboards.length === 0 ? (
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
              No keyboards found.
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
            <AnimatedProductRow
              items={memoizedKeyboards}
              category="keyboards"
            />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default KeyboardPage;