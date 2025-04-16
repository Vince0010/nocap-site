import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';

// HomePage Component
const HomePage = () => {
  return (
    <Box
      h="calc(100vh - 120px)" // Viewport height minus navbar height
      overflowY="auto" // Enable scrolling within the tab content
      bg="gray.900"
    >
      <Box py={8} px={4}>
        <VStack spacing={6} maxW="1400px" w="100%" mx="auto">
          {/* Heading */}
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Featured Products
          </Text>

          {/* Bento Box Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 4 }}
            spacing={2}
            w="100%"
          >
            {/* Card 1: Spans 2 columns */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              gridColumn={{ md: 'span 2' }}a
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 2 */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 3 */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 4 */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 5: Spans 2 columns and 2 rows */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '808px' }}
              gridColumn={{ md: 'span 2' }}
              gridRow={{ md: 'span 2' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 6 */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 7: Spans 2 columns */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              gridColumn={{ md: 'span 2' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>

            {/* Card 8 */}
            <Box
              bg="gray.700"
              borderRadius="xl"
              h={{ base: '200px', md: '400px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="lg">
                Image Placeholder
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>
    </Box>
  );
};

export default HomePage;