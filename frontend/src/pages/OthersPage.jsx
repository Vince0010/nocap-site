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
} from "@chakra-ui/react";
import { AnimatedProductRow } from "../components/ProductComponents";
import { useEffect, useState } from "react";
const OthersPage = () => {
  const [others, setOthers] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOthers = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParamsObj = {};
      if (minPrice && minPrice !== "") queryParamsObj.minPrice = minPrice;
      if (maxPrice && maxPrice !== "") queryParamsObj.maxPrice = maxPrice;
      if (availability && availability !== "")
        queryParamsObj.availability = availability;
      if (brand && brand !== "") queryParamsObj.brand = brand;

      const queryParams = new URLSearchParams(queryParamsObj).toString();
      const url = queryParams
        ? `/api/others?${queryParams}&_t=${Date.now()}`
        : `/api/others?_t=${Date.now()}`;

      console.log("Fetching keyboards with URL:", url);
      const response = await fetch(url);
      console.log("Response headers:", [...response.headers.entries()]);
      if (!response.ok) {
        const text = await response.text();
        console.log("Response status:", response.status);
        console.log("Response error text:", text.slice(0, 100));
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched others:", data);
      setOthers(data);
    } catch (error) {
      console.error("Error fetching others:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOthers();
  }, [minPrice, maxPrice, availability, brand]);

  const handleApplyFilters = () => {
    fetchOthers();
  };

  return (
    <Box h="calc(100vh - 120px)" overflowY="auto" bg="gray.150">
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="auto"
        mx="auto"
        py={8}
        px={4}
      >
        <Box
          w={{ base: "100%", md: "250px" }}
          mb={{ base: 4, md: 0 }}
          position={{ md: "fixed" }}
          top={{ md: "190px" }}
          h={{ md: "calc(100vh - 120px)" }}
          overflowY={{ md: "auto" }}
          bg="gray.150"
          pr={{ md: 4 }}
        >
          <VStack align="start" spacing={4}>
            <Text fontSize="md" fontWeight="bold" color="black">
              Price Range
            </Text>
            <Flex w="100%">
              <Input
                placeholder="MIN"
                bg="white"
                color="black"
                mr={2}
                _placeholder={{ color: "gray.500" }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                placeholder="MAX"
                bg="white"
                color="black"
                _placeholder={{ color: "gray.500" }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Flex>
            <Button
              bg="gray.700"
              color="white"
              w="100%"
              _hover={{ bg: "gray.900" }}
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
            <Text fontSize="md" fontWeight="bold" color="black" mt={4}>
              Availability
            </Text>
            <Select
              bg="white"
              color="black"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">Select</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </Select>
            <Text fontSize="md" fontWeight="bold" color="black" mt={4}>
              Brand
            </Text>
            <Select
              bg="white"
              color="black"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Select</option>
              <option value="akko">Akko</option>
              <option value="gateron">Gateron</option>
            </Select>
          </VStack>
        </Box>
        <Box ml={{ base: 0, md: "250px" }} p={4}>
          {error ? (
            <Text color="red.500">Error: {error}</Text>
          ) : loading ? (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8}>
              {[...Array(5)].map((_, index) => (
                <Box key={index}>
                  <Skeleton height="200px" />
                  <Skeleton height="20px" mt={3} />
                  <Skeleton height="20px" mt={1} />
                </Box>
              ))}
            </SimpleGrid>
          ) : others.length === 0 ? (
            <Text>No keyboards found with the selected filters.</Text>
          ) : (
            <AnimatedProductRow title="Others" items={others} category={"others"} />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default OthersPage;
