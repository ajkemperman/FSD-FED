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

export const FormHost = ({
  isOpen = { isOpen },
  onClose = { handleClose },
  formHosts = { formHosts },
  setFormHosts = { setFormHosts },
  handleChangeFormHosts = { handleChangeFormHosts },
  handleSubmitForm = { handleSubmitForm },
  addEdit = { addEdit },
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});
  const [checkPassword, setCheckPassword] = useState("");
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

        // Store in formUsers.profilePicture
        setFormHosts((prev) => ({
          ...prev,
          profilePicture: resizedBase64,
        }));

        console.log("Resized image stored in formHosts.profilePicture");
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

    if (!formHosts.name) newErrors.name = "Host name is required.";
    if (!formHosts.email) newErrors.email = "Email is required.";
    if (!formHosts.username) newErrors.username = "Username is required.";
    if (!formHosts.password) newErrors.password = "Password is required.";
    if (checkPassword !== formHosts.password)
      newErrors.checkPassword = "Password is not the same.";

    if (!formHosts.phoneNumber)
      newErrors.phoneNumber = "PhoneNumber is required.";
    if (!formHosts.profilePicture)
      newErrors.profilePicture = "Image of host is required.";
    if (!formHosts.aboutMe)
      newErrors.aboutMe = " Tell something about yourself is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const checkSubmitForm = (e) => {
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
          {addEdit} host {formHosts.name} account:
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Host Details */}
          <FormControl mb={4} isRequired isInvalid={errors.name}>
            <FormLabel>Full name of host:</FormLabel>
            <Input
              name="name"
              value={formHosts.name}
              onChange={handleChangeFormHosts}
              type="text"
              placeholder="Full name of host"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.email}>
            <FormLabel>Email of host:</FormLabel>
            <Input
              name="email"
              value={formHosts.email}
              onChange={handleChangeFormHosts}
              type="text"
              placeholder="Email of host"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.username}>
            <FormLabel>Username:</FormLabel>
            <Input
              name="username"
              value={formHosts.username}
              onChange={handleChangeFormHosts}
              type="text"
              placeholder="Username of host"
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.password}>
            <FormLabel>Password:</FormLabel>
            <Input
              name="password"
              value={formHosts.password}
              onChange={handleChangeFormHosts}
              type="password"
              placeholder="Password"
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.checkPassword}>
            <FormLabel>Type password again :</FormLabel>
            <Input
              name="checkPassword"
              value={checkPassword}
              onChange={(e) => setCheckPassword(e.target.value)}
              type="password"
              placeholder="Type password again"
            />
            <FormErrorMessage>{errors.checkPassword}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isRequired isInvalid={errors.phoneNumber}>
            <FormLabel>Phone Number of host:</FormLabel>
            <Input
              name="phoneNumber"
              value={formHosts.phoneNumber}
              onChange={handleChangeFormHosts}
              type="text"
              placeholder="Phone Number of host"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.profilePicture}>
            <FormLabel>Profile Picture:</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            <FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.aboutMe}>
            <FormLabel>Tell something about yourself:</FormLabel>
            <Input
              name="aboutMe"
              value={formHosts.aboutMe}
              onChange={handleChangeFormHosts}
              type="text"
              placeholder="Tell something about yourself"
            />
            <FormErrorMessage>{errors.aboutMe}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitForm}>
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
