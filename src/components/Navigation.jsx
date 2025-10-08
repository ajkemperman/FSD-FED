import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Text,
  Button,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { jwtDecode } from "jwt-decode";
import { putDataLogo } from "../components/Api";
import { FormLogo } from "../components/FormLogo";

export const Navigation = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("tokenUser")
  );
  const [isAuthenticatedHost, setIsAuthenticatedHost] = useState(
    !!localStorage.getItem("tokenHost")
  );
  const [logo, setLogo] = useState("");
  const [logoId, setLogoId] = useState("");
  const [formLogos, setFormLogos] = useState({ image: "" });
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataLogo(logoId, formLogos, toast, import.meta.env.VITE_API_URL);

    handleClose();
    console.log(logo);
    console.log(formLogos);

    setLogo(formLogos.image);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/logos`);
        if (!response.ok) throw new Error("Failed to fetch logo.");
        const data = await response.json();

        setLogo(data[0].image);
        setLogoId(data[0].id);
        setFormLogos({ image: data[0].image });
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    };
    loadLogo();
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("tokenUser"));
    setIsAuthenticatedHost(!!localStorage.getItem("tokenHost"));
  }, [localStorage.getItem("tokenUser"), localStorage.getItem("tokenHost")]);

  useEffect(() => {
    // Update every second
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // cleanup
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tokenUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleHostLogout = () => {
    localStorage.removeItem("tokenHost");
    setIsAuthenticatedHost(false);
    navigate("/loginHost");
  };

  const getUserRole = () => {
    const tokenUser = localStorage.getItem("tokenUser");
    if (!tokenUser) return false;
    try {
      const decoded = jwtDecode(tokenUser);
      return decoded.role === "admin";
    } catch (error) {
      console.error("Invalid token:", error.message);
      return false;
    }
  };

  return (
    <Box
      as="nav"
      bg="#fd7e14"
      color="white"
      p={4}
      boxShadow="sm"
      maxW="100%"
      height="100%"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        px={4}
      >
        <Image
          src={logo}
          alt="logo FSD"
          width="30px"
          height="30px"
          borderRadius="2xl"
          objectFit="cover"
        />
        {getUserRole() && (
          <>
            <Button colorScheme="red" onClick={handleOpen} size="sm">
              Change Logo
            </Button>
            <FormLogo
              isOpen={isOpen}
              onClose={handleClose}
              formLogos={formLogos}
              setFormLogos={setFormLogos}
              handleSubmitForm={handleSubmitForm}
            />
          </>
        )}
        <Box pl="10" mr="1" fontWeight="bold">
          {dateTime.toLocaleDateString()}
        </Box>
        {"|"}
        <Box ml="1" fontWeight="bold">
          {dateTime.toLocaleTimeString()}
        </Box>

        {/* Mobile Dropdown Menu */}
        <Box display={{ base: "block", md: "none" }} position="relative">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              color="white"
              borderColor="white"
            />
            <MenuList bg="white" color="black">
              <MenuItem as={Link} to="/">
                Home
              </MenuItem>
              <MenuItem as={Link} to="/hosts">
                Hosts
              </MenuItem>
              <MenuItem as={Link} to="/users">
                Users
              </MenuItem>
              {getUserRole() && (
                <>
                  <MenuItem as={Link} to="/bookings">
                    Bookings
                  </MenuItem>
                  <MenuItem as={Link} to="/reviews">
                    Reviews
                  </MenuItem>
                  <MenuItem as={Link} to="/amenities">
                    Amenities
                  </MenuItem>
                </>
              )}
              {!localStorage.getItem("tokenHost") &&
                !localStorage.getItem("tokenUser") && (
                  <MenuItem as={Link} to="/signupPage">
                    Sign Up
                  </MenuItem>
                )}
              {!localStorage.getItem("tokenHost") &&
                (isAuthenticated ? (
                  <MenuItem onClick={handleLogout}>User Logout</MenuItem>
                ) : (
                  <MenuItem as={Link} to="/login">
                    User Login
                  </MenuItem>
                ))}
              {!localStorage.getItem("tokenUser") &&
                (isAuthenticatedHost ? (
                  <MenuItem onClick={handleHostLogout}>Host Logout</MenuItem>
                ) : (
                  <MenuItem as={Link} to="/loginHost">
                    Host Login
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
        </Box>

        {/* Normal navigation for larger screens */}
        <Flex
          direction="row"
          justify="center"
          flex="1"
          display={{ base: "none", md: "flex" }}
        >
          <Link to="/">
            <Text
              mx={4}
              _hover={{ color: "blue.200", textDecoration: "underline" }}
            >
              Home
            </Text>
          </Link>
          <Link to="/hosts">
            <Text
              mx={4}
              _hover={{ color: "blue.200", textDecoration: "underline" }}
            >
              Hosts
            </Text>
          </Link>
          <Link to="/users">
            <Text
              mx={4}
              _hover={{ color: "blue.200", textDecoration: "underline" }}
            >
              Users
            </Text>
          </Link>
          {getUserRole() && (
            <>
              <Link to="/bookings">
                <Text
                  mx={4}
                  _hover={{ color: "blue.200", textDecoration: "underline" }}
                >
                  Bookings
                </Text>
              </Link>
              <Link to="/reviews">
                <Text
                  mx={4}
                  _hover={{ color: "blue.200", textDecoration: "underline" }}
                >
                  Reviews
                </Text>
              </Link>
              <Link to="/amenities">
                <Text
                  mx={4}
                  _hover={{ color: "blue.200", textDecoration: "underline" }}
                >
                  Amenities
                </Text>
              </Link>
            </>
          )}
        </Flex>

        {/* Authentication Buttons */}
        <Flex display={{ base: "none", md: "flex" }}>
          {!isAuthenticated && !isAuthenticatedHost && (
            <Link to="/signupPage">
              <Button colorScheme="green" size="sm" mx={2}>
                Sign Up User
              </Button>
            </Link>
          )}
          {!isAuthenticatedHost &&
            (isAuthenticated ? (
              <Button colorScheme="red" onClick={handleLogout} size="sm">
                User Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button colorScheme="green" size="sm" mx={2}>
                  User Login
                </Button>
              </Link>
            ))}
          {!isAuthenticated &&
            (isAuthenticatedHost ? (
              <Button colorScheme="red" onClick={handleHostLogout} size="sm">
                Host Logout
              </Button>
            ) : (
              <Link to="/loginHost">
                <Button colorScheme="green" size="sm" mx={2}>
                  Host Login
                </Button>
              </Link>
            ))}
        </Flex>
      </Flex>
    </Box>
  );
};
