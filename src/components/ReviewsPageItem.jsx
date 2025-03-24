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
} from "@chakra-ui/react";

import { Button } from "./ui/Button";
import { FormReviewEdit } from "./FormReviewEdit";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putDataReviews } from "./Api";

export const ReviewsPageItem = ({ review, users, properties }) => {
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formReviews, setFormReviews] = useState({
    userId: review.userId,
    propertyId: review.propertyId,
    rating: review.rating,
    comment: review.comment,
  });
  const toast = useToast();
  const handleChangeFormReviews = (e) => {
    const { name, value } = e.target;
    setFormReviews((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const getUserName = () => {
    const findUser = users.find((user) => review.userId === user.id);
    return findUser.name;
  };
  const getPropertyTitle = () => {
    const findProperty = properties.find(
      (property) => review.propertyId === property.id
    );
    return findProperty.title;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataReviews(
      review.id,
      formReviews,
      toast,
      import.meta.env.VITE_API_URL
    );

    handleClose();
    navigate("/reviews");
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("tokenUser");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/reviews/${reviewId}`,
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
          <strong>{getUserName()} </strong>
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>UserId:</strong> {review.userId}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>{getPropertyTitle()} </strong>
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>PropertyId:</strong> {review.propertyId}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Rating:</strong> {review.rating}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Comment:</strong> {review.comment}
        </Text>

        {
          <>
            <Button onClick={handleOpen} colorScheme="green" mt={2}>
              Edit details review
            </Button>
            <FormReviewEdit
              isOpen={isOpen}
              onClose={handleClose}
              formReviews={formReviews}
              property={getPropertyTitle}
              handleChangeFormReviews={handleChangeFormReviews}
              handleSubmitForm={handleSubmitForm}
            />
            <Button
              onClick={onDeleteDialogOpen}
              colorScheme="red"
              mx={4}
              mt={2}
            >
              Delete this review
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={onDeleteDialogClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete review: {review.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can not undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onDeleteDialogClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteReview(review.id)}
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
