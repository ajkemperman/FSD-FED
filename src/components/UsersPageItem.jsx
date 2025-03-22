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
import { Button } from "./ui/Button";
import { FormUser } from "./FormUser";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putDataUsers } from "./Api";

export const UsersPageItem = ({ user }) => {
  const addEdit = "Edit";
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formUsers, setFormUsers] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    role: user.role,
  });
  const toast = useToast();
  const handleChangeFormUsers = (e) => {
    const { name, value } = e.target;
    setFormUsers((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataUsers(user.id, formUsers, toast, import.meta.env.VITE_API_URL);

    handleClose();
    navigate("/users");
  };

  const getUserId = () => {
    const tokenUser = localStorage.getItem("tokenUser"); // Of waar je de token opslaat

    try {
      if (tokenUser) {
        const decoded = jwtDecode(tokenUser);

        return decoded.userId; // Zorg dat je hier de juiste sleutel gebruikt
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
  const canEditProperty = getUserRole() || getUserId() === user.id;

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("tokenUser");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
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
          src={user.profilePicture}
          w="300px"
          h="300px"
          alt={user.name}
          overflow="hidden"
          borderRadius="2xl"
          objectFit="cover"
        />
      </Box>

      <Box p={2} mt={1} textAlign="center" w="100%">
        <Heading fontSize="xl" color="gray.800" mt={1} mb={1}>
          {user.name}
        </Heading>
        <Text color="gray.700" mb={2}>
          {user.email}
        </Text>

        <Text color="gray.700" mb={2} fontSize="xl" fontStyle={"italic"}>
          {user.role}
        </Text>

        {canEditProperty && (
          <>
            <Button onClick={handleOpen} colorScheme="green" mt={2}>
              Edit details user
            </Button>
            <FormUser
              isOpen={isOpen}
              onClose={handleClose}
              formUsers={formUsers}
              setFormUsers={setFormUsers}
              handleChangeFormUsers={handleChangeFormUsers}
              handleSubmitForm={handleSubmitForm}
              addEdit={addEdit}
            />
            <Button
              onClick={onDeleteDialogOpen}
              colorScheme="red"
              mx={4}
              mt={2}
            >
              Delete this user
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={onDeleteDialogClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete user: {user.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can not undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onDeleteDialogClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteUser(user.id)}
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
