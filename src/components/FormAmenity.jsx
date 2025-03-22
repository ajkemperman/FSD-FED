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

export const FormAmenity = ({
  isOpen,
  onClose,
  formAmenities,

  handleSubmitForm,
  handleChangeFormAmenities,
  addEdit,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formAmenities.name) newErrors.name = "Name is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  // Handle Submit
  const checkSubmitFormAmenity = (e) => {
    const isValid = validateForm();

    if (isValid) {
      handleSubmitForm(e);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {addEdit} {formAmenities.name}:
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Amenity Detail */}
          <FormControl mb={4} isRequired isInvalid={errors.name}>
            <FormLabel> Name:</FormLabel>
            <Input
              name="name"
              value={formAmenities.name}
              onChange={handleChangeFormAmenities}
              type="text"
              placeholder="Give a name for amenity"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitFormAmenity}>
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
