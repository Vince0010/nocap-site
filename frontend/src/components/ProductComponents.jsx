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

export const ProductBox = ({ item, index, controls }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionBox
      key={index}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, delay: index * 0.2 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image container */}
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
              paddingBottom="100%" // Square aspect ratio
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
                {/* Primary Image */}
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
                  animate={{ opacity: isHovered ? 1 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                {/* Alternate Image */}
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
                  transition={{ duration: 0.2 }}
                />
              </Box>
            </Box>
          </Skeleton>
        </Box>
      </Center>

      {/* Product info outside the main box */}
      <Box mt={3} textAlign="center" width="100%">
        <Text fontSize="sm" fontWeight="bold" color="black">
          {item.name}
        </Text>
        <Text fontSize="xs" color="black" mt={1}>
          {item.price}
        </Text>
      </Box>
    </MotionBox>
  );
};

export const AnimatedProductRow = ({ title, items }) => {
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
        >
          {items.map((item, index) => (
            <ProductBox
              key={index}
              item={item}
              index={index}
              controls={controls}
            />
          ))}
        </SimpleGrid>
      </Center>
    </VStack>
  );
};
