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
  Grid,
  GridItem,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { AnimatedProductRow } from "../components/ProductComponents";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "use-debounce";

const KeyboardPage = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const fetchKeyboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParamsObj = {};
      if (minPrice && minPrice !== "" && !isNaN(minPrice))
        queryParamsObj.minPrice = minPrice;
      if (maxPrice && maxPrice !== "" && !isNaN(maxPrice))
        queryParamsObj.maxPrice = maxPrice;
      if (availability && availability !== "")
        queryParamsObj.availability = availability;
      if (brand && brand !== "") queryParamsObj.brand = brand;
      if (debouncedSearchQuery && debouncedSearchQuery.trim())
        queryParamsObj.search = debouncedSearchQuery.trim();

      const queryParams = new URLSearchParams(queryParamsObj).toString();
      const url = queryParams
        ? `/api/keyboards?${queryParams}&_t=${Date.now()}`
        : `/api/keyboards?_t=${Date.now()}`;

      console.log("Fetching keyboards with URL:", url);
      const response = await fetch(url);
      console.log("Response headers:", [...response.headers.entries()]);
      if (!response.ok) {
        const text = await response.text();
        console.log("Response status:", response.status);
        console.log("Response error text:", text.slice(0, 100));
        throw new Error(`Failed to fetch keyboards: ${response.status} ${text.slice(0, 100)}`);
      }
      const data = await response.json();
      console.log("Fetched keyboards:", data);
      // Validate data
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
      if (validData.length < data.length) {
        console.warn(
          "Invalid keyboard entries filtered out:",
          data.filter((keyboard) => !validData.includes(keyboard))
        );
      }
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
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleApplyFilters = () => {
    fetchKeyboards();
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setAvailability("");
    setBrand("");
    setSearchQuery("");
    fetchKeyboards();
  };

  // Memoize keyboards to stabilize rendering
  const memoizedKeyboards = useMemo(() => {
    console.log("Rendering keyboards:", keyboards);
    return keyboards;
  }, [keyboards]);

  return (
    <Box h="calc(104vh - 120px)" overflowY="auto" bg="gray.30" px={4} py={8} maxW="auto" mx="auto">
      <Heading as="h1" mb={6} color="gray.800" textAlign="center">
        Keyboards
      </Heading>

      {/* Search Bar - Now positioned above filters */}
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
            borderRadius="xl"
          />
          {searchQuery && (
            <InputRightElement>
              <CloseButton size="sm" onClick={clearSearch} />
            </InputRightElement>
          )}
        </InputGroup>

        {/* Clear Filters Button - Positioned at the end */}
        <Button
          onClick={clearAllFilters}
          colorScheme="gray"
          ml={{ base: 0, md: "auto" }}
          isDisabled={!searchQuery && !minPrice && !maxPrice && !availability && !brand}

        >
          Clear All
        </Button>
      </Flex>

      {/* Filter Controls - Now without the "Filters:" text */}
      <Flex
        mb={8}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={4}
        wrap="wrap"
      
        p={4}
        borderRadius="md"
      >
        {/* Price Range Controls */}
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

        {/* Availability Dropdown */}
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

        {/* Brand Dropdown */}
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
            <option value="Gateron">Gateron</option>
            <option value="KBDFans">KBDFans</option>
            <option value="Unknown">Unknown</option>
          </Select>
        </Flex>
      </Flex>

      {/* Results Area */}
      {error ? (
        <Box
          w="full"
          mx="auto"
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
        </Box>
      ) : loading ? (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={6}
        >
          {[...Array(8)].map((_, index) => (
            <GridItem key={index}>
              <Skeleton height="300px" width="100%" borderRadius="xl" />
            </GridItem>
          ))}
        </Grid>
      ) : memoizedKeyboards.length === 0 ? (
        <Box
          textAlign="center"
          py={8}
          px={6}
          borderWidth="1px"
          borderRadius="xl"
          borderStyle="dashed"
          borderColor="gray.300"
          mx="auto"
          maxW="auto"
        >
          <Text fontSize="lg" color="gray.500">
            No keyboards found with the selected filters.
          </Text>
          {(searchQuery || minPrice || maxPrice || availability || brand) && (
            <Button
            colorScheme="gray"
            ml={{ base: 0, md: "auto" }}
              onClick={clearAllFilters}

            >
              Clear All Filters
            </Button>
          )}
        </Box>
      ) : (
        <Box mt={4}>
          <AnimatedProductRow items={memoizedKeyboards} category="keyboards" />
        </Box>
      )}
    </Box>
  );
};

export default KeyboardPage;