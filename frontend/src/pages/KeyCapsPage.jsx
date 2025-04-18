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
const keycaps = [
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
];

const KeyCapsPage = () => {
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
          <AnimatedProductRow title="Key Caps" items={keycaps} />
        </Box>
      </Flex>
    </Box>
  );
};

export default KeyCapsPage;
