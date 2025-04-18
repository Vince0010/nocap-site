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
  } from "@chakra-ui/react";
  import {
    AnimatedProductRow,
    ProductBox,
  } from "../components/ProductComponents";
  // Placeholder data for switches (replace with database data later)
  const keyboards = [
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
  ];
  
  const OthersPage = () => {
    return (
      <Box h="calc(100vh - 120px)" overflowY="auto" bg="gray.150">
        <Flex
          direction={{ base: "column", md: "row" }}
          maxW="1400px"
          mx="auto"
          py={8}
          px={4}
        >
          {/* Sidebar: Filter Panel */}
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
              {/* Price Range Filter */}
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
                />
                <Input
                  placeholder="MAX"
                  bg="white"
                  color="black"
                  _placeholder={{ color: "gray.500" }}
                />
              </Flex>
              <Button
                bg="gray.700"
                color="white"
                w="100%"
                _hover={{ bg: "gray.900" }}
              >
                Apply
              </Button>
  
              {/* Availability Filter */}
              <Text fontSize="md" fontWeight="bold" color="black" mt={4}>
                Availability
              </Text>
              <Select bg="white" color="black">
                <option value="">Select</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </Select>
  
              {/* Brand Filter */}
              <Text fontSize="md" fontWeight="bold" color="black" mt={4}>
                Brand
              </Text>
              <Select bg="white" color="black">
                <option value="">Select</option>
                <option value="akko">Akko</option>
                <option value="gateron">Gateron</option>
              </Select>
            </VStack>
          </Box>
  
          {/* Main Content: Product Grid */}
          <Box ml="250px" p={4}>
            <AnimatedProductRow title="Others" items={keyboards} />
          </Box>
        </Flex>
      </Box>
    );
  };
  
  export default OthersPage;
  