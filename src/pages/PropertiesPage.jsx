import React from "react";
import {
  Heading,
  Flex,
  SimpleGrid,
  Text,
  useToast,
  Box,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { PropertiesPageItem } from "../components/PropertiesPageItem";
import { useState } from "react";
import { TextInput } from "../components/ui/TextInput";
import { Button } from "../components/ui/Button";
import { Form } from "../components/Form";
import { postDataProperties } from "../components/Api";
import { jwtDecode } from "jwt-decode";

const addEdit = "Add";

export const loader = async () => {
  try {
    const propertiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/properties`
    );
    const amenitiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/amenities`
    );
    const hostsResponse = await fetch(`${import.meta.env.VITE_API_URL}/hosts`);
    const bookingsResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/bookings`
    );
    if (
      !propertiesResponse.ok ||
      !amenitiesResponse.ok ||
      !hostsResponse.ok ||
      !bookingsResponse.ok
    ) {
      throw new Error("Failed to fetch one or more resources.");
    }

    const properties = await propertiesResponse.json();
    const amenities = await amenitiesResponse.json();
    const hosts = await hostsResponse.json();
    const bookings = await bookingsResponse.json();

    return {
      properties,
      amenities,
      hosts,
      bookings,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      properties: [],
      amenities: [],
      hosts: [],
      bookings: [],
      error: error.message,
    };
  }
};

export const PropertiesPage = () => {
  const [searchProperties, setSearchProperties] = useState("");
  const { properties, amenities, hosts, bookings } = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  const [formAmenity, setFormAmenity] = useState([]);
  let navigate = useNavigate();
  const [formProperties, setFormProperties] = useState({
    title: "",
    description: "",
    location: "",
    pricePerNight: "",
    bedroomCount: "",
    bathRoomCount: "",
    maxGuestCount: "",
    rating: "",
    image: "",
    hostId: "",
    amenitiesIds: [],
  });
  const toast = useToast();
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
  const handleChangeFormProperties = (e) => {
    const { name, value } = e.target;
    setFormProperties((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleAmenityChange = (amenityId) => {
    setFormAmenity(
      (prev) =>
        prev.includes(amenityId)
          ? prev.filter((id) => id !== amenityId) // Remove if unchecked
          : [...prev, amenityId] // Add if checked
    );
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const hostExists = hosts.some((host) => host.id === formProperties.hostId);
    if (hostExists) {
      const updatedFormProperties = {
        ...formProperties,
        amenitiesIds: formAmenity.join(","),
        bathRoomCount: Number(formProperties.bathRoomCount),
        bedroomCount: Number(formProperties.bedroomCount),
        maxGuestCount: Number(formProperties.maxGuestCount),
        pricePerNight: Number(formProperties.pricePerNight),
        rating: Number(formProperties.rating),
        image: formProperties.image,
      };
      await postDataProperties(
        updatedFormProperties,
        toast,
        import.meta.env.VITE_API_URL
      );
      handleClose();
      navigate("/");
    } else {
      toast({
        title: "Error!",
        description: "HostId does not exist",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const matchedTitles = properties.filter((property) => {
    return property.title
      .toLowerCase()
      .includes(searchProperties.toLowerCase());
  });
  const matchedDescription = properties.filter((property) => {
    return property.description
      .toLowerCase()
      .includes(searchProperties.toLowerCase());
  });
  const matchedLocation = properties.filter((property) => {
    return property.location
      .toLowerCase()
      .includes(searchProperties.toLowerCase());
  });
  const matchedAmenity = properties.filter((property) => {
    return property.amenitiesIds
      .split(",")
      .find((id) => id.toString().includes(searchProperties));
  });

  const matchedProperties = (titles, description, location, amenity) => {
    const mergeSearch = [...titles];
    description.forEach((description) => {
      if (!mergeSearch.includes(description)) {
        mergeSearch.push(description);
      }
    });
    location.forEach((location) => {
      if (!mergeSearch.includes(location)) {
        mergeSearch.push(location);
      }
    });
    amenity.forEach((amenity) => {
      if (!mergeSearch.includes(amenity)) {
        mergeSearch.push(amenity);
      }
    });
    return mergeSearch;
  };

  const handleChange = (property) => {
    setSearchProperties(property.target.value);
  };
  const bookingsSort = (bookings) => {
    const bookingLatest = [...bookings].sort(
      (a, b) => new Date(b.checkinDate) - new Date(a.checkinDate)
    );

    const bookingLatestId = bookingLatest[0].propertyId;
    const bookingLatestDate = bookingLatest[0].checkinDate;
    const bookingLatestName = properties.find(
      (property) => property.id === bookingLatestId
    );
    return { bookingLatestName, bookingLatestDate, bookingLatestId };
  };

  return (
    <Flex
      direction={"column"}
      bgColor="blue.300"
      alignItems="center"
      p={10}
      justifyContent="center"
      width="100vw"
    >
      <Box
        size="md"
        background="black"
        color="white"
        mb={8}
        borderWidth={2}
        borderColor="red"
        borderRadius={10}
        p={2}
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Text size="large" style={{ fontWeight: "bold" }}>
          Latest Booking:
        </Text>{" "}
        <Link to={`property/${bookingsSort(bookings).bookingLatestId}`}>
          <Text
            size="large"
            style={{ fontWeight: "bold" }}
            textDecoration="underline"
          >
            {bookingsSort(bookings).bookingLatestName.title}{" "}
          </Text>
        </Link>
        <p>
          {""}
          {new Date(
            bookingsSort(bookings).bookingLatestDate
          ).toLocaleDateString("en-En", {
            weekday: "long", // maandag, dinsdag, ...
            day: "numeric", // 7
            month: "long", // oktober
            year: "numeric", // 2025
            hour: "2-digit", // 14
            minute: "2-digit", // 32
          })}
        </p>
      </Box>
      <Flex
        direction={"column"}
        bgColor="blue.300"
        alignItems="center"
        p={10}
        justifyContent="center"
      >
        <Heading size="xl" color="white" mb={8}>
          FSD Booking Website
        </Heading>
        <Heading size="xl" color="white" mb={8}>
          Book your apartment or house
        </Heading>

        <TextInput
          placeholder=" Search property (name, description, location)"
          onChange={handleChange}
          w={{ base: "90%", md: "50%", lg: "40%" }}
          bg="white"
          mb={2}
          p={2}
          borderRadius="2xl"
        />
        <Text fontSize="20" mr={4} alignContent="center" color="white" mb={2}>
          Filter on amenities:
        </Text>
        <Flex flexWrap="wrap" justifyContent="center" mb={8}>
          <Box alignContent="center">
            {amenities.map((amenity) => {
              return (
                <Button
                  key={amenity.id}
                  mr={2}
                  onClick={() => setSearchProperties(amenity.id.toString())}
                  textTransform={"capitalize"}
                  fontSize="12"
                >
                  {amenity.name}{" "}
                </Button>
              );
            })}
            <Button
              bgColor="yellow.400"
              onClick={() => setSearchProperties("")}
            >
              Reset Search
            </Button>
          </Box>
        </Flex>
      </Flex>

      <Flex mb={8}>
        {(getUserRole() || localStorage.getItem("tokenHost")) && (
          <>
            <Button onClick={handleOpen} colorScheme="teal" bgColor="green.800">
              Add Property
            </Button>
            <Form
              isOpen={isOpen}
              onClose={handleClose}
              formProperties={formProperties}
              setFormProperties={setFormProperties}
              formAmenity={formAmenity}
              amenities={amenities}
              handleChangeFormProperties={handleChangeFormProperties}
              handleAmenityChange={handleAmenityChange}
              handleSubmitForm={handleSubmitForm}
              addEdit={addEdit}
            />
          </>
        )}
      </Flex>

      {searchProperties ? (
        <>
          {matchedProperties(
            matchedTitles,
            matchedDescription,
            matchedLocation,
            matchedAmenity
          ).length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 2, xl: 4 }}
              gap={6}
              mb={4}
            >
              {matchedProperties(
                matchedTitles,
                matchedDescription,
                matchedLocation,
                matchedAmenity
              ).map((item) => (
                <PropertiesPageItem
                  key={item.id}
                  property={item}
                  amenities={amenities}
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
            columns={{ base: 1, sm: 1, md: 2, xl: 4 }}
            spacing={6}
            mb={4}
          >
            {properties.map((item) => (
              <PropertiesPageItem
                key={item.id}
                property={item}
                amenities={amenities}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
