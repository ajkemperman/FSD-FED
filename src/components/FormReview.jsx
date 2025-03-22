import React, { useEffect } from "react";
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

export const FormReview = ({
  isOpen,
  onClose,
  formReview,
  setFormReview,
  property,
  handleSubmitFormReview,
  handleChangeFormReview,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formReview.rating || formReview.rating < 0 || formReview.rating > 5)
      newErrors.rating = "Rating is required between 0-5.";
    if (!formReview.comment) newErrors.comment = "Comment is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    setFormReview((prev) => ({ ...prev, rating: Number(formReview.rating) }));
  }, [formReview.rating]);
  // Handle Submit
  const checkSubmitFormReview = (e) => {
    const isValid = validateForm();

    if (isValid) {
      handleSubmitFormReview(e);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Review property {property.title}:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Review Details */}
          <FormControl mb={4} isRequired>
            <FormLabel>UserId</FormLabel>
            <Input
              name="UserId"
              value={formReview.userId}
              type="text"
              placeholder="UserId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>PropertyId</FormLabel>
            <Input
              name="PropertyId"
              value={formReview.propertyId}
              type="text"
              placeholder="PropertyId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.rating}>
            <FormLabel> Give a rating (0-5):</FormLabel>
            <Input
              name="rating"
              value={formReview.rating}
              onChange={handleChangeFormReview}
              type="text"
              placeholder="Give a rating for property (0-5)"
            />
            <FormErrorMessage>{errors.rating}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.comment}>
            <FormLabel> Comment:</FormLabel>
            <Input
              name="comment"
              value={formReview.comment}
              onChange={handleChangeFormReview}
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
