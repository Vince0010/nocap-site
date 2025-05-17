/* eslint-disable no-unused-vars */
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  VStack,
  Skeleton,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AnimatedProductRow } from "../components/ProductComponents";
import { useState, useEffect } from "react";

const MotionImg = motion.img;

const HomePage = () => {
  const [data, setData] = useState({
    featuredImages: [],
    newArrivals: [],
    bestSellers: [],
    switches: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch data for each category
        const [keyboardRes, switchesRes, keycapsRes, othersRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/keyboard"),
            fetch("http://localhost:5000/api/switches"),
            fetch("http://localhost:5000/api/keycaps"),
            fetch("http://localhost:5000/api/others"),
          ]);

        // Check response status
        if (
          !keyboardRes.ok ||
          !switchesRes.ok ||
          !keycapsRes.ok ||
          !othersRes.ok
        ) {
          const errors = [];
          if (!keyboardRes.ok) errors.push(`Keyboards: ${keyboardRes.status}`);
          if (!switchesRes.ok) errors.push(`Switches: ${switchesRes.status}`);
          if (!keycapsRes.ok) errors.push(`Keycaps: ${keycapsRes.status}`);
          if (!othersRes.ok) errors.push(`Others: ${othersRes.status}`);
          throw new Error(`Failed to fetch products: ${errors.join(", ")}`);
        }

        const [keyboard, switches, keycaps, others] = await Promise.all([
          keyboardRes.json(),
          switchesRes.json(),
          keycapsRes.json(),
          othersRes.json(),
        ]);

        console.log("Raw API Data:", { keyboard, switches, keycaps, others });

        // Handle single object or array
        const normalizeArray = (data) => (Array.isArray(data) ? data : [data]);

        // Validate data
        const validateProduct = (product, category) => {
          if (!product || !(product._id || product.id)) return false;
          if (typeof product.name !== "string" || !product.name.trim()) return false;
          if (product.image && (typeof product.image !== "string" || product.image === "null")) return false;
          if (product.altImage && (typeof product.altImage !== "string" || product.altImage === "null")) return false;
          if (product.highlight && typeof product.highlight !== "boolean") return false;
          if (category === "others") {
            return (
              typeof product.description === "string" &&
              product.description.trim() &&
              typeof product.price === "number" &&
              product.price >= 0 &&
              typeof product.quantity === "number" &&
              typeof product.category === "string" &&
              product.category.trim()
            );
          }
          return true; // Relaxed validation for keyboards, switches, keycaps
        };

        const keyboardsArray = normalizeArray(keyboard).filter((item) =>
          validateProduct(item, "keyboard")
        );
        const switchesArray = normalizeArray(switches).filter((item) =>
          validateProduct(item, "switches")
        );
        const keycapsArray = normalizeArray(keycaps).filter((item) =>
          validateProduct(item, "keycaps")
        );
        const othersArray = normalizeArray(others).filter((item) =>
          validateProduct(item, "others")
        );

        console.log("Valid Data:", {
          keyboard: keyboardsArray,
          switches: switchesArray,
          keycaps: keycapsArray,
          others: othersArray,
        });

        // Log invalid entries
        if (keyboardsArray.length < normalizeArray(keyboard).length) {
          console.warn(
            "Invalid keyboards entries filtered out:",
            normalizeArray(keyboard).filter((item) => !keyboardsArray.includes(item))
          );
        }
        if (switchesArray.length < normalizeArray(switches).length) {
          console.warn(
            "Invalid switches entries filtered out:",
            normalizeArray(switches).filter((item) => !switchesArray.includes(item))
          );
        }
        if (keycapsArray.length < normalizeArray(keycaps).length) {
          console.warn(
            "Invalid keycaps entries filtered out:",
            normalizeArray(keycaps).filter((item) => !keycapsArray.includes(item))
          );
        }
        if (othersArray.length < normalizeArray(others).length) {
          console.warn(
            "Invalid others entries filtered out:",
            normalizeArray(others).filter((item) => !othersArray.includes(item))
          );
        }

        // Map data to consistent structure with category included
        const mapProduct = (product, category) => {
          const mapped = {
            id: product._id || product.id,
            name: product.name,
            price: product.price,
            formattedPrice: product.price ? `₱${parseFloat(product.price).toFixed(2)}` : null,
            image: product.image || "https://via.placeholder.com/100",
            altImage:
              product.altImage && typeof product.altImage === "string" && product.altImage !== "null"
                ? product.altImage
                : "https://placehold.co/600x400/000000/FFF",
            description: product.description || `Premium ${category} product.`,
            inStock: product.quantity > 0 ? true : false,
            category: category.toLowerCase(), // Normalize category
            highlight: product.highlight === true,
          };
          console.log(`Mapped product ${product.name}: image=${product.image}, altImage=${product.altImage || 'placeholder'}, highlight=${mapped.highlight}`);
          return mapped;
        };

        const mappedKeyboards = keyboardsArray.map((item) => mapProduct(item, "keyboard"));
        const mappedSwitches = switchesArray.map((item) => mapProduct(item, "switches"));
        const mappedKeycaps = keycapsArray.map((item) => mapProduct(item, "keycaps"));
        const mappedOthers = othersArray.map((item) => mapProduct(item, "others"));

        console.log("Mapped Data:", {
          keyboard: mappedKeyboards,
          switches: mappedSwitches,
          keycaps: mappedKeycaps,
          others: mappedOthers,
        });

        // Combine all products
        const allProducts = [
          ...mappedKeyboards,
          ...mappedSwitches,
          ...mappedKeycaps,
          ...mappedOthers,
        ];

        // MODIFIED: Get all highlighted products first
        const highlightedProducts = allProducts.filter((product) => product.highlight === true);
        console.log(`Found ${highlightedProducts.length} highlighted products`);
        
        // Take only the first 4 highlighted products for the Featured Highlights section
        const featuredHighlights = highlightedProducts.slice(0, 4);
        console.log("Featured Highlights:", featuredHighlights);

        // Ensure sufficient data for hardcoded indices
        const safeGet = (array, index, fallback = null) =>
          array.length > index ? array[index] : fallback;

        // Map data to sections - each product already has its category
        setData({
          featuredImages: featuredHighlights,
          newArrivals: [
            safeGet(mappedKeyboards, 2, null),
            safeGet(mappedKeyboards, 0, null),
            safeGet(mappedSwitches, 0, null),
            safeGet(mappedOthers, 0, null),
            safeGet(mappedKeyboards, 1, null),
          ].filter((item) => item !== null),
          bestSellers: mappedKeyboards.slice(0, 5),
          switches: mappedSwitches.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500); // Mimic ComparePage delay
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Box bg="gray.30" px={{ base: 4, md: 8 }} py={8} h="calc(100vh - 120px)">
        <Text color="red.500" textAlign="center">
          Error: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="gray.30"
      px={{ base: 4, md: 8 }}
      py={8}
      overflowY="auto"
      h="calc(103.5vh - 120px)"
    >
      <Flex
        direction="column"
        maxW={{ base: "100%", xl: "1800px" }}
        mx="auto"
        align="center"
        width="100%"
      >
        {/* Featured Highlights - Images with overlay text */}
        {data.featuredImages.length > 0 ? (
          <VStack align="center" spacing={8} mb={12} width="100%">
            <Text fontSize="4xl" fontWeight="bold" color="black">
              Featured Highlights
            </Text>
            <Center width="100%">
              {loading ? (
                <SimpleGrid columns={{ base: 1, sm: 2, md: 2 }} spacing={8} width="100%">
                  {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} height="300px" width="100%" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid
                  columns={{ base: 1, sm: 2, md: 2 }}
                  spacing={8}
                  width="100%"
                  justifyContent="center"
                >
                  {data.featuredImages.map((item, index) => (
                    <Center key={item.id || index} width="100%">
                      <Box
                        bg="white"
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="lg"
                        width="100%"
                        position="relative"
                      >
                        <Flex
                          width="100%"
                          height="0"
                          paddingBottom="75%"
                          position="relative"
                        >
                          {/* Main Image */}
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            width="50%"
                            height="100%"
                            overflow="hidden"
                          >
                            <MotionImg
                              src={item.image}
                              alt={`${item.name} main image`}
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "0.75rem",
                                transformOrigin: "center",
                              }}
                              whileHover={{ scale: 1.04 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          </Box>
                          {/* Alternate Image */}
                          <Box
                            position="absolute"
                            top="0"
                            right="0"
                            width="50%"
                            height="100%"
                            overflow="hidden"
                          >
                            <MotionImg
                              src={item.altImage}
                              alt={`${item.name} alternate image`}
                              style={{
                                position: "absolute",
                                top: "0",
                                left:"0",
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "0.75rem",
                                transformOrigin: "center",
                              }}
                              whileHover={{ scale: 1.04 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                          </Box>
                          <Box
                            position="absolute"
                            top="0"
                            left="0"
                            height="100%"
                            width="100%"
                            background="rgba(0, 0, 0, 0.3)"
                            borderRadius="0.75rem"
                            pointerEvents="none"
                          >
                            <Box
                              position="absolute"
                              bottom="15%"
                              width="100%"
                              textAlign="center"
                              p={4}
                            >
                              <Text
                                fontSize="2xl"
                                fontWeight="0.75rem"
                                color="white"
                              >
                                {item.name}
                              </Text>
                              <Text fontSize="xl" color="white">
                                {item.formattedPrice}
                              </Text>
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                    </Center>
                  ))}
                </SimpleGrid>
              )}
            </Center>
          </VStack>
        ) : (
          loading ? null : (
            <VStack align="center" spacing={4} mb={12} width="100%">
              <Text fontSize="4xl" fontWeight="bold" color="black">
                Featured Highlights
              </Text>
              <Text color="gray.500">
                No highlighted products found. Mark products as highlighted in your database to display them here.
              </Text>
            </VStack>
          )
        )}

        {/* Animated Product Rows */}
        {loading ? (
          <VStack align="center" spacing={8} width="100%">
            {[...Array(3)].map((_, index) => (
              <SimpleGrid
                key={index}
                columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
                spacing={8}
                width="100%"
              >
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} height="300px" width="100%" />
                ))}
              </SimpleGrid>
            ))}
          </VStack>
        ) : (
          <>
            <AnimatedProductRow
              title="New Arrivals"
              items={data.newArrivals}
            />
            <AnimatedProductRow
              title="Best Sellers"
              items={data.bestSellers}
            />
            <AnimatedProductRow
              title="Switches"
              items={data.switches}
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default HomePage;