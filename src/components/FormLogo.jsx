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

export const FormLogo = ({
  isOpen,
  onClose,
  formLogos,
  setFormLogos,
  handleSubmitForm,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size should not exceed 3MB.",
        }));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert image to Base64

      reader.onload = async () => {
        const base64String = reader.result;

        // Resize the Base64 image before storing
        const resizedBase64 = await resizeBase64Img(base64String, 350, 350);

        // Store in formLogos.image
        setFormLogos((prev) => ({
          ...prev,
          image: resizedBase64,
        }));

        console.log("Resized image stored in formLogos.image");
      };
    }
  };

  // Function to Resize Base64 Image
  const resizeBase64Img = (base64, width, height) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp")); // Convert back to Base64
      };
    });
  };

  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formLogos.image) newErrors.image = "Name is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  // Handle Submit
  const checkSubmitFormLogo = (e) => {
    const isValid = validateForm();

    if (isValid) {
      handleSubmitForm(e);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Other Logo Image:</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Logo Detail */}
          <FormControl mb={4} isRequired isInvalid={errors.image}>
            <FormLabel>Logo Picture:</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            <FormErrorMessage>{errors.image}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitFormLogo}>
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
