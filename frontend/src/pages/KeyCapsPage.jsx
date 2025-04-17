import { Box, Flex, SimpleGrid, Text, VStack, Select, Input, Button } from '@chakra-ui/react';

// Placeholder data for keycap sets (replace with database data later)
const keycapSets = [
  { name: 'GMK Laser', price: '₱8500.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'SA Pulse', price: '₱7800.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'DSA Milkshake', price: '₱6500.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'Cherry Blossom', price: '₱7200.00', image: 'https://via.placeholder.com/280x280' },
  // Add more items to test scrolling
  { name: 'GMK Laser', price: '₱8500.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'SA Pulse', price: '₱7800.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'DSA Milkshake', price: '₱6500.00', image: 'https://via.placeholder.com/280x280' },
  { name: 'Cherry Blossom', price: '₱7200.00', image: 'https://via.placeholder.com/280x280' },
];

const KeyCapsPage = () => {
  return (
    <Box
      h="calc(100vh - 120px)"
      overflowY="auto"
      bg="gray.100"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        maxW="1400px"
        mx="auto"
        py={8}
        px={4}
      >
        {/* Sidebar: Filter Panel */}
        <Box
          w={{ base: '100%', md: '250px' }}
          mb={{ base: 4, md: 0 }}
          mr={{ md: 4 }}
          borderRight={{ md: '1px solid' }}
          borderColor={{ md: 'gray.300' }}
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
              <option value="gmk">GMK</option>
              <option value="sa">SA</option>
              <option value="dsa">DSA</option>
            </Select>
          </VStack>
        </Box>

        {/* Main Content: Product Grid */}
        <Box flex="1">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="black"
            mb={4}
            textAlign="center"
          >
            KEYCAP SETS
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 2, lg: 3 }} // Reduced to 3 columns on lg
            spacing={8}
          >
            {keycapSets.map((item, index) => (
              <VStack key={index} spacing={2} align="center">
                <Box
                  bg="white"
                  borderRadius="md"
                  overflow="hidden"
                  textAlign="center"
                  p={4}
                  boxShadow="sm"
                >
                  <Box
                    w="280px" // Slightly larger width
                    h="280px" // Matching height for square
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
                </Box>
                <Text fontSize="sm" fontWeight="bold" color="black">
                  {item.name}
                </Text>
                <Text fontSize="xs" color="black">
                  {item.price}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default KeyCapsPage;