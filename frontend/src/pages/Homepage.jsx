/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Flex, SimpleGrid, Text, VStack, Skeleton, Center } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

// Placeholder product data
const products = {
  featuredImages: [
    { name: 'GMK Laser Keycaps', price: '₱8500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'KBD8X MKIII Keyboard', price: '₱15100.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Zealio Switches', price: '₱6500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'SA Pulse Keycaps', price: '₱7800.00', image: 'https://via.placeholder.com/500x500' },
  ],
  newArrivals: [
    { name: 'GMK Laser Keycaps', price: '₱8500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'KBD8X MKIII Keyboard', price: '₱15100.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Zealio Switches', price: '₱6500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'SA Pulse Keycaps', price: '₱7800.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'TET Keyboard', price: '₱15000.00', image: 'https://via.placeholder.com/500x500' },
  ],
  bestSellers: [
    { name: 'DSA Milkshake Keycaps', price: '₱6500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'White Fox Keyboard', price: '₱12000.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Cherry Blossom Set', price: '₱7200.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Gateron Ink Switches', price: '₱5500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Custom Cable', price: '₱2500.00', image: 'https://via.placeholder.com/500x500' },
  ],
  featuredProducts: [
    { name: 'Pavlov Keyboard', price: '₱12900.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Gateron Ink Switches', price: '₱5500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'TET Keyboard', price: '₱15000.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Custom Cable', price: '₱2500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Zealio Switches', price: '₱6500.00', image: 'https://via.placeholder.com/500x500' },
  ],
  switches: [
    { name: 'Zealio V2 Switches', price: '₱7000.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Gateron Milky Yellow', price: '₱4500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'JWK Linear Switches', price: '₱6000.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Aliaz Silent Switches', price: '₱6500.00', image: 'https://via.placeholder.com/500x500' },
    { name: 'Gateron Ink Switches', price: '₱5500.00', image: 'https://via.placeholder.com/500x500' },
  ],
};

const MotionBox = motion(Box);

// Create a component for each product row that handles its own animation
const AnimatedProductRow = ({ title, items }) => {
  const ref = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <VStack align="start" spacing={6} mb={12} ref={ref} width="100%">
<Text fontSize="3xl" fontWeight="bold" color="black" width="100%" textAlign="center">
  {title}
</Text>

      <Center width="100%">
        <SimpleGrid 
          columns={{ base: 1, sm: 2, md: 3, lg: 5 }} 
          spacing={8} 
          width="100%"
          justifyContent="center"
        >
          {items.map((item, index) => (
            <MotionBox
              key={index}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {/* Image container */}
              <Center width="100%">
                <Box
                  bg="white"
                  borderRadius="xl" // More rounded corners
                  overflow="hidden"
                  boxShadow="lg"
                  width="100%"
                  p={4}
                >
                  <Skeleton isLoaded={!!item.image}>
                    <Box
                      width="100%"
                      height="0"
                      paddingBottom="100%"
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="xl" // More rounded corners for image container
                        overflow="hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ 
                            width: "80%", 
                            height: "80%", 
                            objectFit: "contain",
                            borderRadius: "1rem" // Rounding the actual image
                          }}
                        />
                      </Box>
                    </Box>
                  </Skeleton>
                </Box>
              </Center>
              
              {/* Product info outside the main box */}
              <Box mt={3} textAlign="center" width="100%">
                <Text fontSize="lg" fontWeight="bold" color="black">
                  {item.name}
                </Text>
                <Text fontSize="md" color="black" mt={1}>
                  {item.price}
                </Text>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Center>
    </VStack>
  );
};

const HomePage = () => {
  return (
    <Box bg="white" px={{ base: 4, md: 8 }} py={8} overflowY="auto" h="calc(100vh - 120px)">
      <Flex 
        direction="column" 
        maxW={{ base: "100%", xl: "1800px" }} 
        mx="auto" 
        align="center"
        width="100%"
      >
        {/* Featured Highlights - Horizontal Images with info INSIDE the box */}
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
                  {/* Image container with product info inside */}
                  <Box
                    bg="white"
                    borderRadius="xl" // More rounded corners
                    overflow="hidden"
                    boxShadow="lg"
                    width="100%"
                    p={4}
                    display="flex"
                    flexDirection="column"
                  >
                    <Skeleton isLoaded={!!item.image}>
                      <Box
                        width="100%"
                        height="0"
                        paddingBottom="56.25%" // 16:9 aspect ratio
                        position="relative"
                        mb={4}
                      >
                        <Box
                          position="absolute"
                          top="0"
                          left="0"
                          width="100%"
                          height="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="xl" // More rounded corners for image container
                          overflow="hidden"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ 
                              width: "90%", 
                              height: "90%", 
                              objectFit: "contain",
                              borderRadius: "1rem" // Rounding the actual image
                            }}
                          />
                        </Box>
                      </Box>
                    </Skeleton>
                    
                    {/* Product info INSIDE the box for Featured Highlights */}
                    <Box mt={2} textAlign="center" width="100%">
                      <Text fontSize="xl" fontWeight="bold" color="black">
                        {item.name}
                      </Text>
                      <Text fontSize="lg" color="black" mt={1}>
                        {item.price}
                      </Text>
                    </Box>
                  </Box>
                </Center>
              ))}
            </SimpleGrid>
          </Center>
        </VStack>

        {/* Animated Product Rows - each with independent animation */}
        <AnimatedProductRow title="New Arrivals"  items={products.newArrivals} />
        <AnimatedProductRow title="Best Sellers" items={products.bestSellers} />
        <AnimatedProductRow title="Switches" items={products.switches} />
      </Flex>
    </Box>
  );
};

export default HomePage;