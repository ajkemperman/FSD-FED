import {
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
  Button,
} from "@chakra-ui/react";

import { FormAmenity } from "./FormAmenity";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putDataAmenities } from "./Api";

const addEdit = "Add";

export const AmenitiesPageItem = ({ amenity, properties }) => {
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formAmenities, setFormAmenities] = useState({
    name: amenity.name,
  });
  const toast = useToast();
  const handleChangeFormAmenities = (e) => {
    const { name, value } = e.target;
    setFormAmenities((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const getPropertiesAmenity = () => {
    const findProperties = properties.filter((property) =>
      property.amenitiesIds.split(",").includes(amenity.id.toString())
    );

    findProperties.forEach((findProperty) => {
      findProperty.amenitiesIds = findProperty.amenitiesIds
        .split(",") // Convert string to array
        .filter((id) => id !== amenity.id) // Remove the ID
        .join(","); // Convert back to string
    });

    return findProperties;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataAmenities(
      amenity.id,
      formAmenities,
      toast,
      import.meta.env.VITE_API_URL
    );

    handleClose();
    navigate("/amenities");
  };

  const handleDeleteAmenity = async (amenityId) => {
    const token = localStorage.getItem("tokenUser");
    const propertiesToUpdate = getPropertiesAmenity();
    try {
      if (propertiesToUpdate.length > 0) {
        await Promise.all(
          propertiesToUpdate.map(async (property) => {
            const responseProperty = await fetch(
              `${import.meta.env.VITE_API_URL}/properties/${property.id}`,
              {
                method: "PATCH",
                body: JSON.stringify({ amenitiesIds: property.amenitiesIds }),
                headers: {
                  "Content-Type": "application/json",
                  authorization: `${token}`,
                },
              }
            );
            if (!responseProperty.ok) {
              throw new Error("Failed to change amenitiesIds in property.");
            }
          })
        );
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/amenities/${amenityId}`,
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
      <Box p={2} mt={1} textAlign="center" w="100%">
        <Text color="gray.700" mb={2}>
          <strong>Name:</strong> {amenity.name}
        </Text>
        {getPropertiesAmenity()}
        {
          <>
            <Button onClick={handleOpen} colorScheme="green" mt={2}>
              Edit details amenity
            </Button>
            <FormAmenity
              isOpen={isOpen}
              onClose={handleClose}
              formAmenities={formAmenities}
              amenity={amenity}
              handleChangeFormAmenities={handleChangeFormAmenities}
              handleSubmitForm={handleSubmitForm}
              addEdit={addEdit}
            />
            <Button
              onClick={onDeleteDialogOpen}
              colorScheme="red"
              mx={4}
              mt={2}
            >
              Delete this amenity
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={onDeleteDialogClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete amenity: {amenity.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can not undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onDeleteDialogClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteAmenity(amenity.id)}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        }
      </Box>
    </Flex>
  );
};
