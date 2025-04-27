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

const KeyCapsPage = () => {
  const [keycaps, setKeycaps] = useState([]);
  const [filteredKeycaps, setFilteredKeycaps] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 100);
  const [loadingDelay, setLoadingDelay] = useState(false);

  const fetchKeycaps = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/keycaps?_t=${Date.now()}`;
      console.log("Fetching keycaps with URL:", url);
      const response = await fetch(url);
      console.log("Response headers:", [...response.headers.entries()]);
      if (!response.ok) {
        const text = await response.text();
        console.log("Response status:", response.status);
        console.log("Response error text:", text.slice(0, 100));
        throw new Error(`Failed to fetch keycaps: ${response.status} ${text.slice(0, 100)}`);
      }
      const data = await response.json();
      console.log("Raw API Data:", data);

      const validData = data.filter(
        (keycap) =>
          keycap &&
          typeof keycap.id === "number" &&
          typeof keycap.name === "string" &&
          keycap.name.trim() &&
          typeof keycap.price === "number" &&
          keycap.price >= 0 &&
          typeof keycap.image === "string" &&
          keycap.image.trim() &&
          keycap.image !== "null" &&
          typeof keycap.availability === "string" &&
          ["in-stock", "out-of-stock"].includes(keycap.availability) &&
          typeof keycap.brand === "string" &&
          keycap.brand.trim()
      );

      console.log("Valid Data:", validData);
      setKeycaps(validData);
      setFilteredKeycaps(validData);
    } catch (error) {
      console.error("Error fetching keycaps:", error);
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
    fetchKeycaps();
  }, []);

  useEffect(() => {
    // Trigger loading state for filter/search changes
    setLoading(true);
    setLoadingDelay(true);

    let filtered = [...keycaps];

    filtered = filtered.filter(
      (keycap) =>
        keycap &&
        keycap.id &&
        keycap.name &&
        keycap.image &&
        keycap.image.trim() &&
        keycap.image !== "null" &&
        keycap.price !== undefined
    );

    console.log("Initial Keycaps for Filtering:", filtered);

    if (minPrice && !isNaN(minPrice) && minPrice !== "") {
      const min = parseFloat(minPrice);
      filtered = filtered.filter((keycap) => keycap.price >= min);
      console.log("After minPrice filter:", filtered);
    }
    if (maxPrice && !isNaN(maxPrice) && maxPrice !== "") {
      const max = parseFloat(maxPrice);
      filtered = filtered.filter((keycap) => keycap.price <= max);
      console.log("After maxPrice filter:", filtered);
    }
    if (availability && availability !== "") {
      filtered = filtered.filter((keycap) => keycap.availability === availability);
      console.log("After availability filter:", filtered);
    }
    if (brand && brand !== "") {
      filtered = filtered.filter((keycap) => keycap.brand === brand);
      console.log("After brand filter:", filtered);
    }
    if (debouncedSearchQuery.trim()) {
      const lowerCaseQuery = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((keycap) =>
        keycap.name?.toLowerCase().includes(lowerCaseQuery)
      );
      console.log("After search filter:", filtered);
    }

    setFilteredKeycaps(filtered);

    // Reset loading state after delay
    const timer = setTimeout(() => {
      setLoading(false);
      setLoadingDelay(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [minPrice, maxPrice, availability, brand, debouncedSearchQuery, keycaps]);

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

  const memoizedKeycaps = useMemo(() => {
    console.log("Memoized Keycaps:", filteredKeycaps);
    return filteredKeycaps;
  }, [filteredKeycaps]);

  return (
    <Box h="calc(104vh - 120px)" overflowY="auto" bg="gray.30" px={4} py={8} maxW="auto" mx="auto">
      <Heading as="h1" mb={6} color="gray.800" textAlign="center" fontWeight="bold">
        Keycaps
      </Heading>

      <Flex mb={4} justify="space-between" wrap="wrap" gap={4}>
        <InputGroup maxW={{ base: "100%", md: "350px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search keycaps..."
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
          isDisabled={!searchQuery && !minPrice && !maxPrice && !availability && !brand}
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
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">Price Range:</Text>
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
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">Availability:</Text>
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
          <Text fontWeight="bold" whiteSpace="nowrap" fontSize="sm">Brand:</Text>
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
            <option value="Akko">Akko</option>
            <option value="GMK">GMK</option>
            <option value="PBTFANS">PBTFANS</option>
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
            <Text color="red.500" fontSize="lg">{error}</Text>
            <Button
              mt={4}
              size="sm"
              onClick={fetchKeycaps}
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
        ) : memoizedKeycaps.length === 0 ? (
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
              No keycaps found with the selected filters.
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
            <AnimatedProductRow items={memoizedKeycaps} category="keycaps" />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default KeyCapsPage;