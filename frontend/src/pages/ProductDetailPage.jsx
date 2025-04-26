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
  Heading,
  Grid,
  Divider,
  Container,
} from '@chakra-ui/react';

const VALID_CATEGORIES = ['keyboards', 'switches', 'keycaps', 'others'];

const ProductDetailPage = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

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
        setSelectedImage(data.image);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, id]);

  // Function to handle image click and set it as the main displayed image
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    // Scroll back to the main image if needed
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  // For demonstration purposes, creating an array of images including the main one and alternates
  // In a real app, this would come from the product data
  const productImages = [
    product.image,
    product.altImage,
    // Additional placeholder images
    product.image,
    product.altImage,
    product.image,
    product.altImage,
    product.image,
    product.altImage,
    product.image,
    product.altImage,
    product.image,
    product.altImage,
  ];

  // For full-sized render images section
  const fullSizeRenders = [
    product.image,
    product.altImage,
    product.image,
    product.altImage,
    product.image,
    product.altImage,
  ];

  return (
    <Box overflowY="auto" h="calc(103.3vh - 120px)" bg="#f5f5f5">
      {/* Main product section */}
      <Box maxW="1300px" mx="auto" py={8} px={4}>
        <Button as={Link} to={`/${category}`} mb={6} colorScheme="gray" size="sm">
          Back to {category.charAt(0).toUpperCase() + category.slice(1)}
        </Button>

        {/* Main content container */}
        <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 12 }}>
          {/* Left side - Main product image */}
          <Box flex="1">
            <Image
              src={selectedImage}
              alt={product.name}
              borderRadius="lg"
              objectFit="contain"
              w="100%"
              h={{ base: '300px', md: '450px' }}
              bg="#f9f9f9"
            />
            
            {/* Image grid below main image - Now visible on all screen sizes */}
            <Box mt={6}>
              <Text fontWeight="medium" mb={3}>Product Images</Text>
              <Grid 
                templateColumns={{ 
                  base: "repeat(3, 1fr)", 
                  sm: "repeat(4, 1fr)", 
                  md: "repeat(5, 1fr)", 
                  lg: "repeat(6, 1fr)" 
                }}
                gap={3}
              >
                {productImages.map((img, index) => (
                  <Box
                    key={index}
                    border={selectedImage === img ? '2px solid #3182CE' : '1px solid #E2E8F0'}
                    borderRadius="md"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => handleImageClick(img)}
                    transition="transform 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      objectFit="cover"
                      w="100%"
                      aspectRatio="1/1"
                    />
                  </Box>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Right side - Product details */}
          <VStack flex="1" align="start" spacing={4} maxW={{ md: '500px' }}>
            <Heading size="lg">{product.name}</Heading>
            <Text fontSize="xl" fontWeight="bold" color="#3182CE">
              ₱{parseFloat(product.price).toFixed(2)}
            </Text>
            
            <Divider />
            
            <Text>
              <Text as="span" fontWeight="medium">Availability:</Text>{' '}
              <Text as="span" color={product.availability === 'in-stock' ? 'green.500' : 'red.500'}>
                {product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
              </Text>
            </Text>
            
            <Text>
              <Text as="span" fontWeight="medium">Brand:</Text> {product.brand}
            </Text>
            
            <Divider />
            
            <Text fontWeight="medium">Description</Text>
            <Text fontSize="sm" color="gray.700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            
            <Divider />
            
            <Box width="100%">
              <Text fontWeight="medium" mb={2}>Specifications</Text>
              <Grid templateColumns="1fr 2fr" gap={2} fontSize="sm">
                <Text color="gray.600">Material</Text>
                <Text>{product.brand === 'Akko' ? 'PBT' : 'ABS'}</Text>
                
                <Text color="gray.600">Category</Text>
                <Text>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
                
                <Text color="gray.600">Type</Text>
                <Text>{product.type || 'Standard'}</Text>
              </Grid>
            </Box>
          </VStack>
        </Flex>
      </Box>

      {/* Full-sized renders section */}
      <Box bg="#f5f5f5" py={9} mt={10}>
        <Container maxW="1200px">
          <Heading size="md" textAlign="center" mb={8}>
            Product Renders
          </Heading>
          
          <VStack spacing={12}>
            {fullSizeRenders.map((img, index) => (
              <Box key={index} width="100%" boxShadow="sm" bg="#f5f5f5" p={4} borderRadius="lg">
                <Image
                  src={img}
                  alt={`${product.name} full render ${index + 1}`}
                  objectFit="contain"
                  w="100%"
                  h={{ base: "300px", md: "600px" }}
                  borderRadius="md"
                />
              </Box>
            ))}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;