import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Skeleton,
  VStack,
  HStack,
  Heading,
} from '@chakra-ui/react';

const VALID_CATEGORIES = ['keyboards', 'switches', 'keycaps', 'others'];

const ProductDetailPage = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!VALID_CATEGORIES.includes(category)) {
        setError('Invalid product category');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/${category}/${id}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Text: ${text.slice(0, 100)}`);
        }
        const data = await response.json();
        console.log('Fetched product:', data);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, id]);

  if (error) {
    return (
      <Box maxW="1200px" mx="auto" py={8} px={4}>
        <Text color="red.500">Error: {error}</Text>
        <Button as={Link} to={`/${category}`} mt={4} colorScheme="gray">
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box maxW="1200px" mx="auto" py={8} px={4}>
        <Skeleton height="400px" />
        <Skeleton height="40px" mt={4} />
        <Skeleton height="20px" mt={2} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box maxW="1200px" mx="auto" py={8} px={4}>
        <Text>Product not found</Text>
        <Button as={Link} to={`/${category}`} mt={4} colorScheme="gray">
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>
      </Box>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" py={8} px={4}>
      <Button as={Link} to={`/${category}`} mb={4} colorScheme="gray">
        Back to {category.charAt(0).toUpperCase() + category.slice(1)}
      </Button>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Box flex="1">
          <Image
            src={product.image}
            alt={product.name}
            borderRadius="xl"
            objectFit="cover"
            w="100%"
            h={{ base: '300px', md: '400px' }}
          />
          <HStack mt={4} spacing={4}>
            <Image
              src={product.image}
              alt={`${product.name} thumbnail`}
              borderRadius="md"
              w="100px"
              h="100px"
              objectFit="cover"
              cursor="pointer"
            />
            <Image
              src={product.altImage}
              alt={`${product.name} alternate thumbnail`}
              borderRadius="md"
              w="100px"
              h="100px"
              objectFit="cover"
              cursor="pointer"
            />
          </HStack>
        </Box>
        <VStack flex="1" align="start" spacing={4}>
          <Heading size="xl">{product.name}</Heading>
          <Text fontSize="lg" fontWeight="bold">
            ₱{parseFloat(product.price).toFixed(2)}
          </Text>
          <Text>
            <strong>Availability:</strong>{' '}
            {product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
          </Text>
          <Text>
            <strong>Brand:</strong> {product.brand}
          </Text>
          <Text>
            <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
          <Text>
            <strong>Specifications:</strong>
            <ul>
              <li>Material: {product.brand === 'Akko' ? 'PBT' : 'ABS'}</li>
              <li>Category: {category.charAt(0).toUpperCase() + category.slice(1)}</li>
              <li>Type: {product.type || 'Standard'}</li>
            </ul>
          </Text>
          <Button colorScheme="blue" size="lg">
            Add to Cart
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

export default ProductDetailPage;