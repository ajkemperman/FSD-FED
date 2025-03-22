import React from "react";
import {
  Heading,
  Flex,
  SimpleGrid,
  Box,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AmenitiesPageItem } from "../components/AmenitiesPageItem";
import { postDataAmenities } from "../components/Api";
import { TextInput } from "../components/ui/TextInput";
import { FormAmenity } from "../components/FormAmenity";

const addEdit = "Add";

export const loader = async () => {
  try {
    const amenitiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/amenities`
    );
    const propertiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/properties`
    );

    if (!amenitiesResponse.ok || !propertiesResponse.ok) {
      throw new Error("Failed to fetch resource.");
    }

    const amenities = await amenitiesResponse.json();

    const properties = await propertiesResponse.json();

    return {
      amenities,

      properties,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      amenities: [],

      properties: [],
      error: error.message,
    };
  }
};

export const AmenitiesPage = () => {
  const [searchProperties, setSearchProperties] = useState("");

  const { amenities, properties } = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formAmenities, setFormAmenities] = useState({
    name: "",
  });
  const matchedAmenities = () => {
    return amenities.filter((amenity) =>
      amenity.name.toLowerCase().includes(searchProperties.toLowerCase())
    );
  };
  const toast = useToast();
  const handleChange = (e) => {
    setSearchProperties(e.target.value);
  };
  const handleChangeFormAmenities = (e) => {
    const { name, value } = e.target;
    setFormAmenities((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await postDataAmenities(formAmenities, toast, import.meta.env.VITE_API_URL);
    handleClose();
    navigate("/amenities");
  };

  return (
    <Flex
      direction={"column"}
      bgColor="blue.300"
      alignItems="center"
      justifyContent="center"
      p={10}
      width="100vw"
      maxWidth="100vw"
      overflowX="hidden"
    >
      <Heading size="xl" color="white" mb={8}>
        List of Amenities
      </Heading>
      <Box color="white" mb={2}>
        <strong>Find the amenity:</strong>
      </Box>
      <TextInput
        placeholder=" Search on name of amenity"
        onChange={handleChange}
        w={{ base: "90%", md: "50%", lg: "40%" }}
        bg="white"
        mb={6}
        p={2}
        borderRadius="2xl"
      />
      <Flex mb={8}>
        <>
          <Button onClick={handleOpen} colorScheme="teal" bgColor="green.800">
            Add Amenity
          </Button>
          <FormAmenity
            isOpen={isOpen}
            onClose={handleClose}
            formAmenities={formAmenities}
            handleChangeFormAmenities={handleChangeFormAmenities}
            handleSubmitForm={handleSubmitForm}
            addEdit={addEdit}
          />
        </>
      </Flex>
      {searchProperties ? (
        <>
          {matchedAmenities().length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 1, xl: 3 }}
              gap={6}
              mb={4}
            >
              {matchedAmenities().map((item) => (
                <AmenitiesPageItem
                  key={item.id}
                  amenity={item}
                  properties={properties}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Text size="xl" color="white" height="400">
              No Matches Found.
            </Text>
          )}
        </>
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, sm: 1, md: 1, xl: 3 }}
            spacing={6}
            mb={4}
          >
            {amenities.map((item) => (
              <AmenitiesPageItem
                key={item.id}
                amenity={item}
                properties={properties}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
