import { Box, Flex, SimpleGrid, Text, VStack, Select, Input, Button } from '@chakra-ui/react';

// Placeholder data for switches (replace with database data later)
const switches = [
  { name: 'Akko Cream Blue Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Cream Yellow Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Cream Black Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Lavender Purple', price: '₱380.00', image: 'https://via.placeholder.com/200' },
  // Add more items to test scrolling
  { name: 'Akko Cream Blue Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Cream Yellow Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Cream Black Pro V3', price: '₱400.00', image: 'https://via.placeholder.com/200' },
  { name: 'Akko Lavender Purple', price: '₱380.00', image: 'https://via.placeholder.com/200' },
];

const SwitchesPage = () => {
  return (
    <Box
      h="calc(100vh - 120px)"
      overflowY="auto"
      bg="gray.900"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }} // Stack on mobile, row on desktop
        maxW="1400px"
        mx="auto"
        py={8}
        px={4}
      >
        {/* Sidebar: Filter Panel */}
        <Box
          w={{ base: '100%', md: '250px' }} // Full width on mobile, fixed width on desktop
          mb={{ base: 4, md: 0 }} // Margin bottom on mobile
          mr={{ md: 4 }} // Margin right on desktop
        >
          <VStack align="start" spacing={4}>
            {/* Price Range Filter */}
            <Text fontSize="lg" fontWeight="bold" color="white">
              Price Range
            </Text>
            <Flex w="100%">
              <Input
                placeholder="MIN"
                bg="white"
                color="black"
                mr={2}
                _placeholder={{ color: 'gray.500' }}
              />
              <Input
                placeholder="MAX"
                bg="white"
                color="black"
                _placeholder={{ color: 'gray.500' }}
              />
            </Flex>
            <Button
              bg="purple.500"
              color="white"
              w="100%"
              _hover={{ bg: 'purple.600' }}
            >
              Apply
            </Button>

            {/* Availability Filter */}
            <Text fontSize="lg" fontWeight="bold" color="white" mt={4}>
              Availability
            </Text>
            <Select bg="white" color="black">
              <option value="">Select</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </Select>

            {/* Brand Filter */}
            <Text fontSize="lg" fontWeight="bold" color="white" mt={4}>
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
        <Box flex="1">
          <Text fontSize="2xl" fontWeight="bold" color="white" mb={4}>
            SWITCHES
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }} // Responsive grid
            spacing={4}
          >
            {switches.map((item, index) => (
              <Box
                key={index}
                bg="white"
                borderRadius="md"
                overflow="hidden"
                textAlign="center"
                p={4}
              >
                <Box
                  w="100%"
                  h="200px"
                  mb={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <Text fontSize="md" fontWeight="bold" color="black">
                  {item.name}
                </Text>
                <Text fontSize="sm" color="black">
                  {item.price}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default SwitchesPage;