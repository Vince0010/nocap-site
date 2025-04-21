import {
  Box,
  Center,
  SimpleGrid,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MotionBox = motion(Box);
const MotionImg = motion.img;

export const ProductBox = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);

  console.log('ProductBox item:', item);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
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

  if (!item || !item.name || !item.image || !item.altImage) {
    console.warn('Invalid item data:', item);
    return <Text>Invalid item data</Text>;
  }

  return (
    <MotionBox
      ref={ref}
      key={index}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth="200px" // Fix image size
      onHoverStart={() => setIsHovered(true)} // Restore hover
      onHoverEnd={() => setIsHovered(false)} // Restore hover
    >
      <Center width="100%">
        <Box
          bg="white"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="lg"
          width="100%"
          position="relative"
        >
          <Skeleton isLoaded={!!item.image && !!item.altImage}>
            <Box
              width="100%"
              height="0"
              paddingBottom="100%"
              position="relative"
              minWidth="200px" // Fix image size
              minHeight="200px" // Fix image size
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
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                />
                <MotionImg
                  src={item.altImage}
                  alt={`${item.name} alternate`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0.75rem",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Box>
            </Box>
          </Skeleton>
        </Box>
      </Center>
      <Box mt={3} textAlign="center" width="100%">
        <Text fontSize="sm" fontWeight="0.75rem" color="black">
          {item.name}
        </Text>
        <Text
          fontSize="xs"
          color={item.price ? "black" : "gray.500"}
          mt={1}
          fontStyle={item.price ? "normal" : "italic"}
        >
          {item.price == null || item.price === ""
            ? "No price info"
            : `₱${parseFloat(item.price).toFixed(2)}`}
        </Text>
      </Box>
    </MotionBox>
  );
};

export const AnimatedProductRow = ({ title, items }) => {
  console.log('AnimatedProductRow items:', items);
  const ref = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
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
      <Text
        fontSize="3xl"
        fontWeight="bold"
        color="black"
        width="100%"
        textAlign="center"
      >
        {title}
      </Text>
      <Center width="100%">
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
          spacing={8}
          width="100%"
          justifyContent="center"
          maxW="1200px" // Fix image size
        >
          {items.map((item, index) => (
            <ProductBox
              key={item.id || index}
              item={item}
              index={index}
            />
          ))}
        </SimpleGrid>
      </Center>
    </VStack>
  );
};