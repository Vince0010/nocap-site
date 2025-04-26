import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

// Navbar Component with Props
const Navbar = ({ logoText = "", navItems = [], style = {} }) => {
  // Get the current route to determine the active tab
  const location = useLocation();

  // Map the current route to the corresponding tab index
  const tabIndex = navItems.findIndex(
    (item) => item.href === location.pathname
  );

  return (
    <Box sx={style} bg="#1A1A1A" px={2} py={2} mb={0} pb={0}>
      <Flex
        align="center"
        justify="space-between"
        maxW="1400px"
        mx="auto"
        minH="80px"
      >
        {/* Logo Section */}
        <Flex align="center">
          <Box mr={3}>
            <img
              src="/assets/logo.png" // Replace with your actual path
              alt="Logo"
              style={{
                borderRadius: "99px",
                width: "70px",
                height: "70px",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Logo Text and Navigation Tabs - now horizontal */}
          <Flex direction="column" align="flex-start" spacing={2} mb={0} pb={0}>
            {/* Logo Text */}
            <Text fontSize="2xl" color="white" fontWeight="bold">
              {logoText}
            </Text>

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
                      borderBottom: "3px solid white",
                      color: "white",
                    }}
                    _hover={{
                      borderBottom: "2px solid gray.400",
                      color: "white",
                    }}
                    _focus={{
                      outline: "none",
                      borderBottom: "3px solid white",
                    }}
                    mr={1}
                    fontSize="md"
                    fontWeight={500}
                    pb={1}
                  >
                    {navItem.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </Flex>
        </Flex>


      </Flex>
    </Box>
  );
};

export default Navbar;