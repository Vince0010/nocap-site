/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
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

// Placeholder product data with alternate images
const products = {
  featuredImages: [
    {
      name: "GMK Laser Keycaps",
      price: "₱8500.00",
      image: "src/assets/laser-65-2_1500x.png",
    },
    { name: "Margo", price: "₱15100.00", image: "src/assets/margof.png" },
    { name: "PBTFANS Ronin", price: "₱6500.00", image: "src/assets/ronin.png" },
    { name: "Tofu60 Redux Kit", price: "₱7800.00", image: "src/assets/tofu60.png" },
  ],
  newArrivals: [
    {
      name: "S9000",
      price: "₱8500.00",
      image: "src/assets/S9000.png",
      altImage: "src/assets/altImg/S9000Alt.png",
    },
    {
      name: "Margo",
      price: "₱15100.00",
      image: "src/assets/margo.png",
      altImage: "src/assets/altImg/margoAlt.png",
    },
    {
      name: "Mount Tai HE Magnetic Switches",
      price: "₱6500.00",
      image: "src/assets/mounttai.png",
      altImage: "src/assets/altImg/mounttaiAlt.png",
    },
    {
      name: "Electronic Pet",
      price: "₱6500.00",
      image: "src/assets/electronicpet.png",
      altImage: "src/assets/altImg/electronicpetAlt.png",
    },
    {
      name: "Tofu60 Redux Kit",
      price: "₱7800.00",
      image: "src/assets/tofu60.png",
      altImage: "src/assets/altImg/tofu60Alt.png",
    },
  ],
  bestSellers: [
    {
      name: "Rainy75 ",
      price: "₱6500.00",
      image: "src/assets/rainy75.png",
      altImage: "src/assets/altImg/rainy75Alt.png",
    },
    {
      name: "Retro Rainbow",
      price: "₱6500.00",
      image: "src/assets/retro.png",
      altImage: "src/assets/altImg/retrorainbowAlt.png",
    },
    {
      name: "Magnum65",
      price: "₱6500.00",
      image: "src/assets/magnum65.png",
      altImage: "src/assets/altImg/magnum65Alt.png",
    },
    {
      name: "Cherry Black MX Hyperglide",
      price: "₱6500.00",
      image: "src/assets/cherrymxblack.png",
      altImage: "src/assets/altImg/cherrymxblackAlt.png",
    },
    {
      name: "AEBoards Staebies V2.1 Stabilizers",
      price: "₱6500.00",
      image: "src/assets/stabilizers.png",
      altImage: "src/assets/altImg/stabilizersAlt.png",
    },
  ],
  switches: [
    {
      name: "Mount Tai HE Magnetic Switches",
      price: "₱6500.00",
      image: "src/assets/mounttai.png",
      altImage: "src/assets/altImg/mounttaiAlt.png",
    },
    {
      name: "Cherry Black MX Hyperglide",
      price: "₱6500.00",
      image: "src/assets/cherrymxblack.png",
      altImage: "src/assets/altImg/cherrymxblackAlt.png",
    },
    {
      name: "Skyline Magnetic Switches",
      price: "₱6500.00",
      image: "src/assets/skyline.png",
      altImage: "src/assets/altImg/skylineAlt.png",
    },
    {
      name: "Gateron Magnetic Jade",
      price: "₱6500.00",
      image: "src/assets/magneticjade.png",
      altImage: "src/assets/altImg/magneticjadeAlt.png",
    },
    {
      name: "MMD Princess Linear/Tactile Switches V2",
      price: "₱6500.00",
      image: "src/assets/mmdprincess.png",
      altImage: "src/assets/altImg/mmdprincessAlt.png",
    },
  ],
};

const MotionImg = motion.img;

const HomePage = () => {
  return (
    <Box
      bg="gray.150"
      px={{ base: 4, md: 8 }}
      py={8}
      overflowY="auto"
      h="calc(100vh - 120px)"
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
            <SimpleGrid
              columns={{ base: 1, sm: 2 }}
              spacing={8}
              width="100%"
              justifyContent="center"
            >
              {products.featuredImages.map((item, index) => (
                <Center key={index} width="100%">
                  {/* Single unified container for both image and text */}
                  <Box
                    bg="white"
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="lg"
                    width="100%"
                    position="relative"
                  >
                    <Skeleton isLoaded={!!item.image}>
                      {/* Full container for the image */}
                      <Box
                        width="100%"
                        height="0"
                        paddingBottom="75%" // Adjusted aspect ratio
                        position="relative"
                      >
                        {/* Image container */}
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
                              left:"0",
                              width: "100%",
                              height: "100%",
                              objectFit:"cover",
                              borderRadius: "0.75rem",
                              transformOrigin: "center",
                            }}
                            whileHover={{ scale: 1.04 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          />
                        </Box>

                        {/* Overlay for product info */}
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
                              {item.price}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Skeleton>
                  </Box>
                </Center>
              ))}
            </SimpleGrid>
          </Center>
        </VStack>

        {/* Animated Product Rows */}
        <AnimatedProductRow title="New Arrivals" items={products.newArrivals} />
        <AnimatedProductRow title="Best Sellers" items={products.bestSellers} />
        <AnimatedProductRow title="Switches" items={products.switches} />
      </Flex>
    </Box>
  );
};

export default HomePage;