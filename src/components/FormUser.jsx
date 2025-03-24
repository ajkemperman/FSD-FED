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
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

export const FormUser = ({
  isOpen,
  onClose,
  formUsers,
  setFormUsers,
  handleChangeFormUsers,
  handleSubmitForm,
  addEdit,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});
  const [checkPassword, setCheckPassword] = useState("");

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
        setFormUsers((prev) => ({
          ...prev,
          profilePicture: resizedBase64,
        }));

        console.log("Resized image stored in formUsers.profilePicture");
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

    if (!formUsers.name) newErrors.name = "User name is required.";
    if (!formUsers.email) newErrors.email = "Email is required.";
    if (!formUsers.username) newErrors.username = "Username is required.";
    if (!formUsers.password) newErrors.password = "Password is required.";
    if (checkPassword !== formUsers.password)
      newErrors.checkPassword = "Password is not the same.";

    if (!formUsers.phoneNumber)
      newErrors.phoneNumber = "PhoneNumber is required.";
    if (!formUsers.profilePicture)
      newErrors.profilePicture = "Image of user is required.";
    if (!formUsers.role) newErrors.role = "Role of user is required.";

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
          {addEdit} user {formUsers.name} account:
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* User Details */}
          <FormControl mb={4} isRequired isInvalid={errors.name}>
            <FormLabel>Full name of user:</FormLabel>
            <Input
              name="name"
              value={formUsers.name}
              onChange={handleChangeFormUsers}
              type="text"
              placeholder="Full name of user"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.email}>
            <FormLabel>Email of user:</FormLabel>
            <Input
              name="email"
              value={formUsers.email}
              onChange={handleChangeFormUsers}
              type="text"
              placeholder="Email of user"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.username}>
            <FormLabel>Username:</FormLabel>
            <Input
              name="username"
              value={formUsers.username}
              onChange={handleChangeFormUsers}
              type="text"
              placeholder="Username"
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.password}>
            <FormLabel>Password:</FormLabel>
            <Input
              name="password"
              value={formUsers.password}
              onChange={handleChangeFormUsers}
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
            <FormLabel>Phone Number of user:</FormLabel>
            <Input
              name="phoneNumber"
              value={formUsers.phoneNumber}
              onChange={handleChangeFormUsers}
              type="text"
              placeholder="Phone Number of user"
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          {/* <FormControl mb={4} isRequired isInvalid={errors.profilePicture}>
            <FormLabel>Image of user:</FormLabel>
            <Input
              name="image"
              value={formUsers.profilePicture}
              onChange={handleChangeFormUsers}
              type="text"
              placeholder="Image of user"
            />
            <FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
          </FormControl> */}
          <FormControl mb={4} isRequired isInvalid={errors.profilePicture}>
            <FormLabel>Profile Picture:</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            <FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.role}>
            <FormLabel>Role of user:</FormLabel>
            {getUserRole() ? (
              <Select
                name="role"
                value={formUsers.role}
                onChange={(e) =>
                  setFormUsers({
                    ...formUsers,
                    role: e.target.value,
                  })
                }
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </Select>
            ) : (
              <Input
                name="role"
                value={formUsers.role}
                onChange={handleChangeFormUsers}
                type="text"
                placeholder="Role of user"
                isReadOnly
              />
            )}
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitForm}>
            Submit
          </Button>
          <Button variant="guser" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
