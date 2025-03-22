import React from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  useToast,
  Stack,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postDataUser } from "../components/Api";
export const SignUpPage = () => {
  const [formUser, setFormUser] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phoneNumber: "",
    profilePicture: "",
    role: "user",
  });
  const [checkPassword, setCheckPassword] = useState("");

  const toast = useToast();
  let navigate = useNavigate();
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
        setFormUser((prev) => ({
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

  // State for validation errors
  const [errors, setErrors] = useState({});
  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formUser.name) newErrors.name = "Full name is required.";
    if (!formUser.email) newErrors.email = "Email is required.";
    if (!formUser.username) newErrors.username = "Username is required.";
    if (!formUser.password) newErrors.password = "Password is required.";
    if (checkPassword !== formUser.password)
      newErrors.checkPassword = "Password is not the same.";
    if (!formUser.phoneNumber)
      newErrors.phoneNumber = "PhoneNumber is required.";
    if (!formUser.profilePicture)
      newErrors.profilePicture = "Image of user is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const checkSubmitForm = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      handleSubmitForm(e);
    }
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    // console.log(formUser);
    await postDataUser(formUser, toast, import.meta.env.VITE_API_URL);

    navigate("/login");
  };
  const handleChangeFormUsers = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Flex direction="column" alignItems="center" bg="blue.300" width="100vw">
      <Text mt={4} mb={4} fontSize="lg" color="white">
        You can sign up here to book a property and give reviews of the
        property.
      </Text>
      <Box
        w={{ base: "90%", sm: "400px" }}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <form onSubmit={checkSubmitForm}>
          <Stack spacing={4}>
            <FormControl mb={4} isRequired isInvalid={errors.name}>
              <FormLabel>Full name of user:</FormLabel>
              <Input
                name="name"
                value={formUser.name}
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
                value={formUser.email}
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
                value={formUser.username}
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
                value={formUser.password}
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
                value={formUser.phoneNumber}
                onChange={handleChangeFormUsers}
                type="text"
                placeholder="Phone Number of user"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>
            <FormControl mb={4} isRequired isInvalid={errors.profilePicture}>
              <FormLabel>Profile Picture:</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileUpload} />
              <FormErrorMessage>{errors.profilePicture}</FormErrorMessage>
            </FormControl>

            <Button colorScheme="teal" mr={3} type="submit">
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};
