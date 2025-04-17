import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Tabs,
  TabList,
  Tab,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';

// Navbar Component with Props
const Navbar = ({
  logoText = 'No Cap',
  navItems = [],
  style = {},
}) => {
  // Get the current route to determine the active tab
  const location = useLocation();

  // Map the current route to the corresponding tab index
  const tabIndex = navItems.findIndex((item) => item.href === location.pathname);

  return (
    <Box sx={style} bg="gray.800" px={2} py={8} minH="120px">
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        {/* Logo and Tabs (stacked vertically) */}
        <VStack align="flex-start" spacing={4}>
          {/* Logo */}
          <Flex align="center">
            {/* Placeholder for logo icon - replace with actual icon/image */}
            <Box mr={3}>
              <Text fontSize="2xl" color="white" fontWeight="bold">
                 {/* Replace with your logo icon */}
              </Text>
            </Box>
            <Text fontSize="2xl" color="white" fontWeight="bold">
              {logoText}
            </Text>
          </Flex>

          {/* Navigation Tabs */}
          <Tabs index={tabIndex} variant="unstyled">
            <TabList flexWrap={"wrap"}>
              {navItems.map((navItem) => (
                <Tab
                  key={navItem.label}
                  as={Link}
                  to={navItem.href}
                  color="white"
                  _selected={{
                    borderBottom: '2px solid white',
                    color: 'white',
                  }}
                  _hover={{
                    borderBottom: '2px solid gray.400',
                    color: 'white',
                  }}
                  _focus={{
                    outline: 'none',
                    borderBottom: '2px solid white',
                  }}
                  mr={1}
                  fontSize="md"
                  fontWeight={500}
                  pb={2}
                >
                  {navItem.label}
                </Tab>
              ))}
            </TabList>
          </Tabs>
        </VStack>

        {/* Search Bar */}
        <InputGroup maxW="250px" alignSelf="flex-start">
          <Input
            placeholder="Search for an item"
            bg="white"
            color="gray.800"
            borderRadius="md"
            fontSize="md"
            _placeholder={{ color: 'gray.500' }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              size="md"
              variant="ghost"
              color="gray.500"
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Box>
  );
};

export default Navbar;