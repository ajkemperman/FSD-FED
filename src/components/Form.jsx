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
  Checkbox,
  Flex,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
export const Form = ({
  isOpen,
  onClose,
  formProperties,
  setFormProperties,
  amenities,
  formAmenity,
  handleChangeFormProperties,
  handleAmenityChange,
  handleSubmitForm,
  addEdit,
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
        const resizedBase64 = await resizeBase64Img(base64String, 500, 500);

        // Store in formUsers.profilePicture
        setFormProperties((prev) => ({
          ...prev,
          image: resizedBase64,
        }));

        console.log("Resized image stored in formProperties.image");
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

  const getHostId = () => {
    const tokenHost = localStorage.getItem("tokenHost"); // Of waar je de token opslaat

    if (!tokenHost) {
      console.error("Geen token gevonden");
      return null;
    }

    try {
      const decoded = jwtDecode(tokenHost);

      return decoded.hostId; // Zorg dat je hier de juiste sleutel gebruikt
    } catch (error) {
      console.error("Ongeldige token:", error.message);
      return null;
    }
  };
  useEffect(() => {
    if (localStorage.getItem("tokenHost")) {
      formProperties.hostId = getHostId();
    }
  }, []);
  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formProperties.title) newErrors.title = "Property title is required.";
    if (!formProperties.description)
      newErrors.description = "Description is required.";
    if (!formProperties.location) newErrors.location = "Location is required.";
    if (!formProperties.pricePerNight)
      newErrors.pricePerNight = "Price per night is required.";
    if (!formProperties.bedroomCount)
      newErrors.bedroomCount = " Number of bedrooms is required.";
    if (!formProperties.bathRoomCount)
      newErrors.bathRoomCount = "Number of bathrooms is required.";
    if (!formProperties.maxGuestCount)
      newErrors.maxGuestCount = "Max number of guests is required.";
    if (!formProperties.hostId) newErrors.hostId = "Id of host is required.";
    if (!formProperties.rating) newErrors.rating = "Rating is required.";
    if (!formProperties.image)
      newErrors.image = "Property image URL is required.";

    if (formAmenity.length === 0)
      newErrors.amenities = "Please select at least one amenity.";

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
          {addEdit} Property {formProperties.title}:
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Property Details */}
          <FormControl mb={4} isRequired isInvalid={errors.title}>
            <FormLabel>Property Title</FormLabel>
            <Input
              name="title"
              value={formProperties.title}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property Title"
            />
            <FormErrorMessage>{errors.title}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.description}>
            <FormLabel>Description of property</FormLabel>
            <Input
              name="description"
              value={formProperties.description}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property Description"
            />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.pricePerNight}>
            <FormLabel>Price per night of property</FormLabel>
            <Input
              name="pricePerNight"
              value={formProperties.pricePerNight}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property price per night"
            />
            <FormErrorMessage>{errors.pricePerNight}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.bedroomCount}>
            <FormLabel>Number of bedrooms of property</FormLabel>
            <Input
              name="bedroomCount"
              value={formProperties.bedroomCount}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property number of bedrooms"
            />
            <FormErrorMessage>{errors.bedroomCount}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.bathRoomCount}>
            <FormLabel>Number of bathrooms of property</FormLabel>
            <Input
              name="bathRoomCount"
              value={formProperties.bathRoomCount}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property number of bathrooms"
            />
            <FormErrorMessage>{errors.bathRoomCount}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.maxGuestCount}>
            <FormLabel>Max number of guests for property</FormLabel>
            <Input
              name="maxGuestCount"
              value={formProperties.maxGuestCount}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property max number of guests"
            />
            <FormErrorMessage>{errors.maxGuestCount}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.hostId}>
            <FormLabel>Host Id for property</FormLabel>
            <Input
              name="hostId"
              value={formProperties.hostId}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property host Id"
            />
            <FormErrorMessage>{errors.hostId}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.rating}>
            <FormLabel>Rating for property</FormLabel>
            <Input
              name="rating"
              value={formProperties.rating}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property Rating"
            />
            <FormErrorMessage>{errors.rating}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isRequired isInvalid={errors.image}>
            <FormLabel>Picture of property:</FormLabel>
            <Input type="file" accept="image/*" onChange={handleFileUpload} />
            <FormErrorMessage>{errors.image}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isRequired isInvalid={errors.amenities}>
            <FormLabel>Select amenities</FormLabel>
            <Flex wrap="wrap" flexDirection="column">
              {amenities.map((amenity) => (
                <Flex key={amenity.id} mb={2} flexDir="row">
                  <Checkbox
                    value={amenity.id}
                    isChecked={formAmenity.some((am) => am === amenity.id)}
                    onChange={() => handleAmenityChange(amenity.id)}
                  />
                  <Text ml={2} textTransform="capitalize">
                    {amenity.name}
                  </Text>
                </Flex>
              ))}
            </Flex>
            <FormErrorMessage>{errors.amenities}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.location}>
            <FormLabel>Location of property</FormLabel>
            <Input
              name="location"
              value={formProperties.location}
              onChange={handleChangeFormProperties}
              type="text"
              placeholder="Property Location"
            />
            <FormErrorMessage>{errors.location}</FormErrorMessage>
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
