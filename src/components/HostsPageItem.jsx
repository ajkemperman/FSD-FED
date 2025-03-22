import {
  Heading,
  Image,
  Text,
  Box,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { jwtDecode } from "jwt-decode";
import { Button } from "../components/ui/Button";
import { FormHost } from "../components/FormHost";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putDataHosts } from "../components/Api";

export const HostsPageItem = ({ host }) => {
  const addEdit = "Edit";
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formHosts, setFormHosts] = useState({
    name: host.name,
    email: host.email,
    username: host.username,
    password: host.password,
    phoneNumber: host.phoneNumber,
    profilePicture: host.profilePicture,
    aboutMe: host.aboutMe,
  });
  const toast = useToast();
  const handleChangeFormHosts = (e) => {
    const { name, value } = e.target;
    setFormHosts((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataHosts(host.id, formHosts, toast, import.meta.env.VITE_API_URL);

    handleClose();
    navigate("/hosts");
  };

  const getHostId = () => {
    const tokenHost = localStorage.getItem("tokenHost"); // Of waar je de token opslaat

    try {
      if (tokenHost) {
        const decoded = jwtDecode(tokenHost);

        return decoded.hostId; // Zorg dat je hier de juiste sleutel gebruikt
      } else return null;
    } catch (error) {
      console.error("Ongeldige token:", error.message);
      return null;
    }
  };
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
  const canEditProperty = getUserRole() || getHostId() === host.id;

  const handleDeleteHost = async (hostId) => {
    const token = localStorage.getItem("tokenHost");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/hosts/${hostId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the property.");
      } else {
        toast({
          title: "Success!",
          description: "Deleting the property was successful.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      onDeleteDialogClose();
      navigate("/");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error!",
        description: "An Error occured when deleting the property.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="row"
      gap={2}
      borderRadius="2xl"
      w="100%"
      h="100%"
      bgColor="gray.100"
      alignItems="flex-start"
      boxShadow="lg" // Large shadow
      transform="scale(1.0)" // Slight scale effect
      transition="transform 0.2s ease-in-out"
      _hover={{
        boxShadow: "xl", // Bigger shadow on hover
      }}
    >
      <Box overflow="hidden">
        <Image
          src={host.profilePicture}
          w="300px"
          h="300px"
          alt={host.name}
          overflow="hidden"
          borderRadius="2xl"
          objectFit="cover"
        />
      </Box>

      <Box p={2} mt={1} textAlign="center" w="100%">
        <Heading fontSize="xl" color="gray.800" mt={1} mb={1}>
          {host.name}
        </Heading>
        <Text color="gray.700" mb={2}>
          {host.email}
        </Text>
        <Text color="gray.700" mb={2} fontSize="xl">
          {host.phoneNumber}
        </Text>
        <Text color="gray.700" mb={2} fontSize="xl" fontStyle={"italic"}>
          {host.aboutMe}
        </Text>

        {canEditProperty && (
          <>
            <Button onClick={handleOpen} colorScheme="green">
              Edit details host
            </Button>
            <FormHost
              isOpen={isOpen}
              onClose={handleClose}
              formHosts={formHosts}
              setFormHosts={setFormHosts}
              handleChangeFormHosts={handleChangeFormHosts}
              handleSubmitForm={handleSubmitForm}
              addEdit={addEdit}
            />
            <Button onClick={onDeleteDialogOpen} colorScheme="red" mx={4}>
              Delete this host
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={onDeleteDialogClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete host: {host.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can not undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onDeleteDialogClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteHost(host.id)}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </Box>
    </Flex>
  );
};
