import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

export const FormReviewEdit = ({
  isOpen,
  onClose,
  formReviews,

  property,
  handleSubmitForm,
  handleChangeFormReviews,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formReviews.rating || formReviews.rating < 0 || formReviews.rating > 5)
      newErrors.rating = "Rating is required between 0-5.";
    if (!formReviews.comment) newErrors.comment = "Comment is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  // Handle Submit
  const checkSubmitFormReview = (e) => {
    const isValid = validateForm();

    if (isValid) {
      handleSubmitForm(e);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Review property {property.title}:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Review Details */}
          <FormControl mb={4} isRequired>
            <FormLabel>UserId</FormLabel>
            <Input
              name="UserId"
              value={formReviews.userId}
              type="text"
              placeholder="UserId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>PropertyId</FormLabel>
            <Input
              name="PropertyId"
              value={formReviews.propertyId}
              type="text"
              placeholder="PropertyId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.rating}>
            <FormLabel> Give a rating (0-5):</FormLabel>
            <Input
              name="rating"
              value={formReviews.rating}
              onChange={handleChangeFormReviews}
              type="text"
              placeholder="Give a rating for property (0-5)"
            />
            <FormErrorMessage>{errors.rating}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.comment}>
            <FormLabel> Comment:</FormLabel>
            <Input
              name="comment"
              value={formReviews.comment}
              onChange={handleChangeFormReviews}
              type="text"
              placeholder="Give a comment for property"
            />
            <FormErrorMessage>{errors.comment}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitFormReview}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
