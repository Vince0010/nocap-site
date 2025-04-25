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
        const [keyboardsRes, switchesRes, keycapsRes, othersRes] =
          await Promise.all([
            fetch("/api/keyboards"),
            fetch("/api/switches"),
            fetch("/api/keycaps"), 
            fetch("/api/others"),
          ]);

        if (
          !keyboardsRes.ok ||
          !switchesRes.ok ||
          !keycapsRes.ok ||
          !othersRes.ok
        ) {
          throw new Error("Failed to fetch products");
        }

        const [keyboards, switches, keycaps, others] = await Promise.all([
          keyboardsRes.json(),
          switchesRes.json(),
          keycapsRes.json(),
          othersRes.json(),
        ]);

        // Map data to sections
        setData({
          featuredImages: [
            { ...keycaps[1], category: "keycaps" }, 
            { ...keyboards[4], category: "keyboards" },
            { ...keyboards[3], category: "keyboards" }, 
            { ...keycaps[2], category: "keycaps"  }, 
          ],
          newArrivals: [
            { ...keyboards[2], category: "keyboards" }, 
            { ...keyboards[0], category: "keyboards" }, 
            { ...switches[0], category: "switches" },  
            { ...others[0], category: "others" }, 
            { ...keyboards[1], category: "keyboards" }, 
          ],
          bestSellers: keyboards
            .slice(0, 5)
            .map((item) => ({ ...item, category: "keyboards" })), // Use keyboards for consistency
          switches: switches .slice(0, 5) .map((item) => ({ ...item, category: "switches" })),
        });

        console.log("Fetched data:", { keyboards, switches, keycaps, others });
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Box bg="black" px={{ base: 4, md: 8 }} py={8} h="calc(100vh - 120px)">
        <Text color="red.500" textAlign="center">
          Error: {error}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="#white"
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
        <VStack align="center" spacing={8} mb={12} width="100%">
          <Text fontSize="4xl" fontWeight="bold" color="black">
            Featured Highlights
          </Text>
          <Center width="100%">
            {loading ? (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={8} width="100%">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} height="300px" width="100%" />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid
                columns={{ base: 1, sm: 2 }}
                spacing={8}
                width="100%"
                justifyContent="center"
              >
                {data.featuredImages.map((item, index) => (
                  <Center key={index} width="100%">
                    <Box
                      bg="white"
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="lg"
                      width="100%"
                      position="relative"
                    >
                      <Box
                        width="100%"
                        height="0"
                        paddingBottom="75%"
                        position="relative"
                      >
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          width="100%"
                          height="100%"
                          overflow="hidden"
                        >
                          <MotionImg
                            src={item.image}
                            alt={item.name}
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
                              ₱{parseFloat(item.price).toFixed(2)}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Center>
                ))}
              </SimpleGrid>
            )}
          </Center>
        </VStack>

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
              category="mixed"
            />
            <AnimatedProductRow
              title="Best Sellers"
              items={data.bestSellers}
              category="keyboards"
            />
            <AnimatedProductRow
              title="Switches"
              items={data.switches}
              category="switches"
            />
          </>
        )}
      </Flex>
    </Box>
  );
};

export default HomePage;
