import React from "react";
import {
  Heading,
  Flex,
  SimpleGrid,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { FormCreateHost } from "../components/FormCreateHost";
import { postDataHosts } from "../components/Api";
import { HostsPageItem } from "../components/HostsPageItem";
import { jwtDecode } from "jwt-decode";
import { TextInput } from "../components/ui/TextInput";

export const loader = async () => {
  try {
    const hostsResponse = await fetch(`${import.meta.env.VITE_API_URL}/hosts`);

    if (!hostsResponse.ok) {
      throw new Error("Failed to fetch resource.");
    }

    const hosts = await hostsResponse.json();

    return {
      hosts,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      hosts: [],
      error: error.message,
    };
  }
};

export const HostsPage = () => {
  const [searchProperties, setSearchProperties] = useState("");

  const { hosts } = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formHosts, setFormHosts] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    profilePicture: "",
    aboutMe: "",
  });
  const toast = useToast();
  const handleChangeFormHosts = (e) => {
    const { name, value } = e.target;
    setFormHosts((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const getUserRole = () => {
    const tokenUser = localStorage.getItem("tokenUser"); // Of waar je de token opslaat

    if (!tokenUser) {
      return false;
    }

    try {
      const decoded = jwtDecode(tokenUser);
      if (decoded.role === "admin") {
        return true;
      } // Zorg dat je hier de juiste sleutel gebruikt
    } catch (error) {
      console.error("Ongeldige token:", error.message);
      return false;
    }
  };
  const matchedTitles = hosts.filter((host) => {
    return host.name.toLowerCase().includes(searchProperties.toLowerCase());
  });
  const handleChange = (host) => {
    setSearchProperties(host.target.value);
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const hostExists = hosts.some(
      (host) =>
        host.name.trim().toLowerCase() === formHosts.name.trim().toLowerCase()
    );
    if (!hostExists) {
      await postDataHosts(formHosts, toast, import.meta.env.VITE_API_URL);
    }

    handleClose();
    navigate("/hosts");
  };

  return (
    <Flex
      direction={"column"}
      bgColor="blue.300"
      alignItems="center"
      p={10}
      justifyContent="center"
      width="100vw"
    >
      <Heading size="xl" color="white" mb={8}>
        List of Hosts
      </Heading>
      <TextInput
        placeholder=" Search on name of host"
        onChange={handleChange}
        w={{ base: "90%", md: "50%", lg: "40%" }}
        bg="white"
        mb={2}
        p={2}
        borderRadius="2xl"
      />
      <Flex mb={8}>
        {(getUserRole() || !localStorage.getItem("tokenHost")) && (
          <Flex
            direction="column"
            justifyContent="center"
            alignContent="center"
            alignItems="center"
          >
            <Box color="white">
              <strong>
                If you have a house or appartment for rent, create a host
                account.
              </strong>
            </Box>
            <br></br>
            <Box>
              <Button
                onClick={handleOpen}
                colorScheme="teal"
                bgColor="green.600"
              >
                Create Host Account
              </Button>
            </Box>
            <FormCreateHost
              isOpen={isOpen}
              onClose={handleClose}
              formHosts={formHosts}
              setFormHosts={setFormHosts}
              handleChangeFormHosts={handleChangeFormHosts}
              handleSubmitForm={handleSubmitForm}
            />
          </Flex>
        )}
      </Flex>
      {searchProperties ? (
        <>
          {matchedTitles.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 1, xl: 2 }}
              gap={6}
              mb={4}
            >
              {matchedTitles.map((item) => (
                <HostsPageItem key={item.id} host={item} />
              ))}
            </SimpleGrid>
          ) : (
            <Text size="xl" color="white" height="400">
              No Matches Found.
            </Text>
          )}
        </>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 1, xl: 2 }}
            spacing={6}
            mb={4}
          >
            {hosts.map((item) => (
              <HostsPageItem key={item.id} host={item} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
