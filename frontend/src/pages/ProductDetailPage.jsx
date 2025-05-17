import React from 'react';
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

const VALID_CATEGORIES = ['keyboard', 'switches', 'keycaps', 'others'];

const schemaAttributes = {
  switches: {
    attributes: [
      'switchType',
      'actuationForce',
      'bottomOutForce',
      'preTravel',
      'totalTravel',
      'topHousingMaterial',
      'stemMaterial',
    ],
  },
  keycaps: {
    attributes: ['profile', 'material', 'layoutCompatibility', 'stemType'],
  },
  keyboards: {
    attributes: [
      'layoutSize',
      'layoutStandard',
      'isHotSwappable',
      'connectivity',
      'caseMaterial',
      'keycapMaterial',
      'mountType',
    ],
  },
  others: {
    attributes: ['category', 'type'],
  },
};

const ProductDetailPage = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  const placeholder = 'https://via.placeholder.com/100';

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
        throw new Error(`Failed to fetch product: ${response.status} ${text.slice(0, 100)}`);
      }
      const data = await response.json();
      console.log('Fetched product:', data);


      const processedProduct = {
        ...data,
        id: data._id || data.id,
        category: data.category?.toLowerCase() || category, 
        image:
          typeof data.image === 'string' && data.image.trim() && data.image !== 'null'
            ? data.image
            : placeholder,
        altImage:
          typeof data.altImage === 'string' && data.altImage.trim() && data.altImage !== 'null'
            ? data.altImage
            : placeholder,
        availability: data.quantity > 0 ? 'in-stock' : 'out-of-stock',
        description:
          typeof data.description === 'string' && data.description.trim()
            ? data.description
            : 'No description available.',
        brand:
          typeof data.brand === 'string' && data.brand.trim() ? data.brand : 'Unknown',
      };
      setProduct(processedProduct);
      setSelectedImage(processedProduct.image);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [category, id]);

  
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };


  const getSpecifications = (product, category) => {
    const attributes = schemaAttributes[category]?.attributes || [];
    const specs = [];

    attributes.forEach((attr) => {
      let value = product[attr];
      if (value === undefined || value === null || value === '') {
        value = 'No info';
      } else if (typeof value === 'boolean') {
        value = value ? 'Yes' : 'No';
      } else if (Array.isArray(value)) {
        value = value.join(', ');
      }
      specs.push({
        label: attr
          .replace(/([A-Z])/g, ' $1')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim(),
        value,
      });
    });


    if (specs.length === 0) {
      specs.push(
        { label: 'Category', value: category.charAt(0).toUpperCase() + category.slice(1) },
        { label: 'Brand', value: product.brand },
        { label: 'Type', value: product.type || 'Standard' }
      );
    }

    return specs;
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

  const productImages = [];
  const allProductImages = []; 
  
  if (product.image !== placeholder) {
    productImages.push(product.image);
    allProductImages.push(product.image);
  }
  if (
    product.altImage !== placeholder &&
    product.altImage !== product.image
  ) {
    productImages.push(product.altImage);
    allProductImages.push(product.altImage);
  }
  
  const productRenders = [];
  
  for (let i = 1; i <= 6; i++) {
    const renderField = `imageRender${i}`;
    if (
      product[renderField] &&
      typeof product[renderField] === 'string' &&
      product[renderField].trim() &&
      product[renderField] !== 'null'
    ) {
      productRenders.push(product[renderField]);
      
      if (!productImages.includes(product[renderField])) {
        productImages.push(product[renderField]);
      }
      
      if (!allProductImages.includes(product[renderField])) {
        allProductImages.push(product[renderField]);
      }
    }
  }

  if (productImages.length === 0) {
    productImages.push(placeholder);
  }

  if (allProductImages.length === 0) {
    allProductImages.push(placeholder);
  }
  
  console.log('Product images count:', productImages.length);
  console.log('All product images count:', allProductImages.length);


  const specifications = getSpecifications(product, category);

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
              fallbackSrc={placeholder}
            />

            {/* Image grid below main image */}
            <Box mt={6}>
              <Text fontWeight="medium" mb={3}>Product Images & Renders</Text>
              <Grid
                templateColumns="repeat(auto-fit, minmax(100px, 1fr))"
                gridAutoRows="100px"
                gap={3}
                maxWidth="500px"
              >
                {productImages.map((img, index) => (
                  <Box
                    key={index}
                    maxW="100px"
                    maxH="100px"
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
                      alt={
                        img === placeholder
                          ? `${product.name} placeholder`
                          : `${product.name} view ${index + 1}`
                      }
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      aspectRatio="1/1"
                      fallbackSrc={placeholder}
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

            <Text>
              <Text as="span" fontWeight="medium">Category:</Text>{' '}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>

            <Divider />

            <Text fontWeight="medium">Description</Text>
            <Text fontSize="sm" color="gray.700">
              {product.description}
            </Text>

            <Divider />

            <Box width="100%">
              <Text fontWeight="medium" mb={2}>Specifications</Text>
              <Grid templateColumns="1fr 2fr" gap={2} fontSize="sm">
                {specifications.map((spec, index) => (
                  <React.Fragment key={index}>
                    <Text color="gray.600">{spec.label}</Text>
                    <Text>{spec.value}</Text>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </VStack>
        </Flex>
      </Box>

      {/* Product Renders section */}
      {allProductImages.length > 0 && (
        <Box bg="#f5f5f5" py={9} mt={10}>
          <Container maxW="1200px">
            <Heading size="md" textAlign="center" mb={8}>
              Product Gallery
            </Heading>

            <VStack spacing={12}>
              {allProductImages.map((img, index) => (
                <Box
                  key={index}
                  width="100%"
                  boxShadow="sm"
                  bg="#f5f5f5"
                  p={4}
                  borderRadius="lg"
                >
                  <Image
                    src={img}
                    alt={
                      img === placeholder
                        ? `${product.name} placeholder`
                        : `${product.name} view ${index + 1}`
                    }
                    objectFit="contain"
                    w="100%"
                    h={{ base: '300px', md: '600px' }}
                    borderRadius="md"
                    fallbackSrc={placeholder}
                  />
                </Box>
              ))}
            </VStack>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetailPage;