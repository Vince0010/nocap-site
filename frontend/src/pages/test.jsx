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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { AnimatedProductRow } from "../components/ProductComponents";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const KeyboardPage = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 100);

  const fetchKeyboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParamsObj = {};
      if (minPrice && !isNaN(minPrice)) queryParamsObj.minPrice = minPrice;
      if (maxPrice && !isNaN(maxPrice)) queryParamsObj.maxPrice = maxPrice;
      if (availability) queryParamsObj.availability = availability;
      if (brand) queryParamsObj.brand = brand;
      if (debouncedSearchQuery.trim()) queryParamsObj.search = debouncedSearchQuery.trim();

      const queryParams = new URLSearchParams(queryParamsObj).toString();
      const url = queryParams
        ? `/api/keyboards?${queryParams}&_t=${Date.now()}`
        : `/api/keyboards?_t=${Date.now()}`;

      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch keyboards: ${response.status} ${text.slice(0, 100)}`);
      }
      const data = await response.json();

      const validData = data.filter(
        (keyboard) =>
          keyboard &&
          typeof keyboard.id === "number" &&
          typeof keyboard.name === "string" &&
          keyboard.name.trim() &&
          typeof keyboard.price === "number" &&
          typeof keyboard.image === "string" &&
          typeof keyboard.availability === "string" &&
          typeof keyboard.brand === "string"
      );

      setKeyboards(validData);
    } catch (error) {
      console.error("Error fetching keyboards:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyboards();
  }, [minPrice, maxPrice, availability, brand, debouncedSearchQuery]);

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

  const memoizedKeyboards = useMemo(() => keyboards, [keyboards]);

  return (
    <Box h="calc(104vh - 120px)" overflowY="auto" bg="gray.30" px={4} py={8} maxW="auto" mx="auto">
      <Heading as="h1" mb={6} color="gray.800" textAlign="center" fontWeight="bold">
        Keyboards
      </Heading>

      {/* Search Bar and Clear All */}
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

        <Button onClick={clearAllFilters} colorScheme="gray" ml={{ base: 0, md: "auto" }}>
          Clear All
        </Button>
      </Flex>

      {/* Filters */}
      <Flex
        mb={8}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={4}
        wrap="wrap"
        p={4}
        borderRadius="md"
      >
        {/* Price */}
        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" fontSize="sm">Price Range:</Text>
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

        {/* Availability */}
        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" fontSize="sm">Availability:</Text>
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

        {/* Brand */}
        <Flex direction={{ base: "column", sm: "row" }} gap={2} align="center">
          <Text fontWeight="bold" fontSize="sm">Brand:</Text>
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
            <option value="Gateron">Gateron</option>
            <option value="KBDFans">KBDFans</option>
            <option value="Unknown">Unknown</option>
          </Select>
        </Flex>
      </Flex>

      {/* Content area with animation */}
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
              onClick={fetchKeyboards}
              bg="gray.700"
              color="white"
              _hover={{ bg: "gray.900" }}
              borderRadius="xl"
            >
              Retry
            </Button>
          </MotionBox>
        ) : loading ? (
          <MotionBox
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
              gap={6}
            >
              {[...Array(8)].map((_, index) => (
             <GridItem key={index}>
             <Skeleton
               height="200px"
               width="100%"
               borderRadius="xl"
               mb={4}
               startColor="gray.200"
               endColor="gray.300"
             />
             <Skeleton
               height="20px"
               width="80%"
               mb={2}
               startColor="gray.200"
               endColor="gray.300"
             />
             <Skeleton
               height="20px"
               width="60%"
               startColor="gray.200"
               endColor="gray.300"
             />
           </GridItem>
              ))}
            </Grid>
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
              No keyboards found with the selected filters.
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
            <AnimatedProductRow items={memoizedKeyboards} category="keyboards" />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default KeyboardPage;
