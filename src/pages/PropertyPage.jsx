import React from "react";
import { useState, useEffect } from "react";
import {
  Heading,
  Flex,
  Image,
  Box,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Form } from "../components/Form";
import { FormBooking } from "../components/FormBooking";
import { FormReview } from "../components/FormReview";
import { putDataProperties } from "../components/Api";
import { postDataBookings } from "../components/Api";
import { postDataReview } from "../components/Api";
import { jwtDecode } from "jwt-decode";

const addEdit = "Edit";

export const loader = async ({ params }) => {
  try {
    const propertyResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/properties/${params.propertyId}`
    );
    const amenitiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/amenities`
    );
    const hostsResponse = await fetch(`${import.meta.env.VITE_API_URL}/hosts`);
    const bookingsResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/bookings`
    );
    const reviewsResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews`
    );
    if (
      !propertyResponse.ok ||
      !amenitiesResponse.ok ||
      !hostsResponse.ok ||
      !bookingsResponse.ok ||
      !reviewsResponse.ok
    ) {
      throw new Error("Failed to fetch one or more resources.");
    }

    const property = await propertyResponse.json();
    const amenities = await amenitiesResponse.json();
    const hosts = await hostsResponse.json();
    const bookings = await bookingsResponse.json();
    const reviews = await reviewsResponse.json();

    return {
      property,
      amenities,
      hosts,
      bookings,
      reviews,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      property: null,
      amenities: [],
      hosts: [],
      bookings: [],
      error: error.message,
    };
  }
};

export const PropertyPage = () => {
  const { property, amenities, hosts, bookings, reviews } = useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [isOpenReview, setIsOpenReview] = useState(false);

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  let navigate = useNavigate();
  const [formProperties, setFormProperties] = useState({
    title: property.title,
    description: property.description,
    image: property.image,
    amenitiesIds: property?.amenitiesIds?.split(",") || [],
    location: property.location,
    pricePerNight: property.pricePerNight,
    bedroomCount: property.bedroomCount,
    bathRoomCount: property.bathRoomCount,
    maxGuestCount: property.maxGuestCount,
    hostId: property.hostId,
    rating: property.rating,
  });
  const getUserId = () => {
    const tokenUser = localStorage.getItem("tokenUser"); // Of waar je de token opslaat

    if (!tokenUser) {
      return null;
    }

    try {
      const decoded = jwtDecode(tokenUser);
      return decoded.userId; // Zorg dat je hier de juiste sleutel gebruikt
    } catch (error) {
      console.error("Ongeldige token:", error.message);
      return null;
    }
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
  const canEditProperty = getUserRole() || getHostId() === property.hostId;

  const [formBookings, setFormBookings] = useState({
    userId: getUserId(),
    propertyId: property.id,
    checkinDate: "",
    checkoutDate: "",
    numberOfGuests: "",
    totalPrice: "",
    bookingStatus: "Pending",
  });
  const [formReview, setFormReview] = useState({
    userId: getUserId(),
    propertyId: property.id,
    rating: "",
    comment: "",
  });
  const [formAmenity, setFormAmenity] = useState([
    ...property.amenitiesIds.split(","),
  ]);
  const toast = useToast();
  useEffect(() => {
    setFormAmenity([...property.amenitiesIds.split(",")]);
  }, [property]);

  const handleChangeFormProperties = (e) => {
    const { name, value } = e.target;
    setFormProperties((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (amenityId) => {
    setFormAmenity(
      (prev) =>
        prev.includes(amenityId)
          ? prev.filter((id) => id !== amenityId) // Remove if unchecked
          : [...prev, amenityId] // Add if checked
    );
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const handleOpenBooking = () => setIsOpenBooking(true);
  const handleCloseBooking = () => setIsOpenBooking(false);
  const handleOpenReview = () => setIsOpenReview(true);
  const handleCloseReview = () => setIsOpenReview(false);
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const updatedFormProperties = {
      ...formProperties,
      amenitiesIds: formAmenity.join(","),
    };
    console.log("Final data being sent:", updatedFormProperties); // Debugging

    const hostExists = hosts.some((host) => host.id === formProperties.hostId);
    if (hostExists) {
      await putDataProperties(
        property.id,
        updatedFormProperties,
        toast,
        import.meta.env.VITE_API_URL
      );
      handleClose();
      navigate(`/property/${property.id}`, { replace: true });
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
  const handleChangeFormBookings = (e) => {
    const { name, value } = e.target;
    setFormBookings((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeFormReview = (e) => {
    const { name, value } = e.target;
    setFormReview((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitFormBooking = async (e) => {
    e.preventDefault();

    await postDataBookings(formBookings, toast, import.meta.env.VITE_API_URL);
    handleCloseBooking();
    navigate(`/property/${property.id}`, { replace: true });
  };
  const handleSubmitFormReview = async (e) => {
    e.preventDefault();
    console.log(formReview);
    await postDataReview(formReview, toast, import.meta.env.VITE_API_URL);
    handleCloseReview();
    navigate(`/property/${property.id}`, { replace: true });
  };

  const handleDeleteProperty = async (propertyId) => {
    let token = localStorage.getItem("tokenUser");
    if (!token) {
      token = localStorage.getItem("tokenHost");
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the property.");
      } else {
        toast({
          title: "Success!",
          description: "Deleting the property was successful.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
      onDeleteDialogClose();
      navigate("/");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error!",
        description: "An Error occured when deleting the property.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="row"
      wrap="wrap"
      width="100vw"
      bgColor="blue.300"
      height="100%"
    >
      <Flex width="250px" height="auto" mt={2}>
        <Box
          textAlign="center"
          bg="gray.100"
          mx={10}
          height="auto"
          borderRadius="2xl"
        >
          <Heading
            fontSize="2xl"
            color="white"
            mb={4}
            bg="black"
            borderTopRadius="2xl"
          >
            Booking status:
          </Heading>
          {bookings
            .filter((booking) => booking.propertyId === property.id)
            .map((booking) => (
              <Box key={booking.id} borderRadius="xl" bg="orange.100">
                <Heading fontSize="2xl" color="gray.800" mb={4}>
                  Status: {booking.bookingStatus}
                </Heading>
                <Text color="gray.700" mb={4}>
                  Number of guests: {booking.numberOfGuests}
                </Text>
                <Text color="gray.700" mb={4}>
                  Check-in: {new Date(booking.checkinDate).toLocaleString()}
                </Text>
                <Text color="gray.700" mb={4}>
                  Check-out: {new Date(booking.checkoutDate).toLocaleString()}
                </Text>
                <hr style={{ border: "1px solid black", margin: "16px 0" }} />
              </Box>
            ))}
        </Box>
      </Flex>
      <Flex
        direction="column"
        maxWidth="800px"
        borderRadius="2xl"
        bgColor="gray.100"
        p={8}
        gap={4}
        mx="auto"
        key={property.id}
        mt={2}
      >
        {!!localStorage.getItem("tokenUser") && (
          <>
            <Button onClick={handleOpenBooking} bg="#fd7e14">
              Book this property
            </Button>
            <FormBooking
              isOpen={isOpenBooking}
              onClose={handleCloseBooking}
              formBookings={formBookings}
              setFormBookings={setFormBookings}
              property={formProperties}
              handleChangeFormBookings={handleChangeFormBookings}
              handleSubmitFormBooking={handleSubmitFormBooking}
            />
          </>
        )}
        <Image
          src={property.image}
          width="100%"
          height="100%"
          alt={property.description}
          borderTopRadius="2xl"
        />
        <Box textAlign="center">
          <Heading fontSize="2xl" color="gray.800" mb={4}>
            {property.title}
          </Heading>
          <Text color="gray.700" mb={4} fontStyle={"italic"}>
            {property.description}
          </Text>
          <Text color="gray.700" mb={4} fontStyle={"italic"}>
            {property.location}
          </Text>
          <Flex direction="column" alignItems={"center"}>
            <Box>
              <Text color="gray.700" mb={4} fontWeight={"bold"} align="left">
                Price per night: ${property.pricePerNight}
              </Text>
              <Text color="gray.700" mb={4} fontWeight={"bold"} align="left">
                Bedrooms: {property.bedroomCount}
              </Text>
              <Text color="gray.700" mb={4} fontWeight={"bold"} align="left">
                Bathrooms: {property.bathRoomCount}
              </Text>
              <Text color="gray.700" mb={4} fontWeight={"bold"} align="left">
                Max number of guests: {property.maxGuestCount}
              </Text>
              <Text color="gray.700" mb={4} fontWeight={"bold"} align="left">
                Rating: {property.rating}
              </Text>
            </Box>
          </Flex>
          {property.amenitiesIds &&
            property.amenitiesIds.split(",").length > 0 && (
              <Flex flexWrap="wrap" justifyContent="center" mt={2}>
                {property.amenitiesIds.split(",").map((amenityId) => {
                  const amenity = amenities.find((cat) => cat.id === amenityId);
                  return (
                    amenity && (
                      <Text
                        key={amenityId}
                        bgColor="green.100"
                        px={2}
                        py={1}
                        fontWeight="bold"
                        textTransform="uppercase"
                        borderRadius="md"
                        mx={1}
                        mb={2}
                      >
                        {amenity.name}
                      </Text>
                    )
                  );
                })}
              </Flex>
            )}
        </Box>

        {hosts && (
          <Box mt={6} textAlign="center">
            <Heading fontSize="lg" color="gray.800" mb={2}>
              Host:
            </Heading>
            <Flex
              flexWrap="wrap"
              gap={2}
              alignContent="center"
              justifyContent="center"
            >
              {hosts
                .filter((host) => host.id === property.hostId)
                .map((host) => (
                  <Text
                    key={host.id}
                    bgColor="blue.100"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {host.name}
                    <Box
                      as="img"
                      src={host.profilePicture}
                      alt={`${host.name}'s avatar`}
                      borderRadius="100%"
                      maxWidth="200px"
                      maxHeight="200px"
                    />
                  </Text>
                ))}
            </Flex>
          </Box>
        )}
        <Flex
          mb={8}
          flexWrap="wrap"
          alignContent="center"
          justifyContent="center"
          gap={4}
        >
          {!!localStorage.getItem("tokenUser") && (
            <>
              <Button onClick={handleOpen} bg="#fd7e14">
                Book this property
              </Button>
              <FormBooking
                isOpen={isOpen}
                onClose={handleClose}
                formBookings={formBookings}
                setFormBookings={setFormBookings}
                property={formProperties}
                handleChangeFormBookings={handleChangeFormBookings}
                handleSubmitFormBooking={handleSubmitFormBooking}
              />
            </>
          )}
          {canEditProperty && (
            <>
              <Button onClick={handleOpen} colorScheme="green">
                Edit details property
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
              <Button onClick={onDeleteDialogOpen} colorScheme="red" mx={4}>
                Delete this property
              </Button>

              <AlertDialog
                isOpen={isDeleteDialogOpen}
                onClose={onDeleteDialogClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Property: {property.title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure? You can not undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button onClick={onDeleteDialogClose}>Cancel</Button>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDeleteProperty(property.id)}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </Flex>
      </Flex>
      <Flex width="250px" height="auto" mt={2}>
        <Box
          textAlign="center"
          bg="gray.100"
          mx={10}
          height="auto"
          borderRadius="2xl"
        >
          <Heading
            fontSize="2xl"
            color="white"
            mb={4}
            bg="black"
            borderTopRadius="2xl"
          >
            Reviews:
          </Heading>
          {!!localStorage.getItem("tokenUser") && (
            <>
              <Button onClick={handleOpenReview} bg="green" w="150px">
                Add review
              </Button>
              <FormReview
                isOpen={isOpenReview}
                onClose={handleCloseReview}
                formReview={formReview}
                setFormReview={setFormReview}
                property={formProperties}
                handleChangeFormReview={handleChangeFormReview}
                handleSubmitFormReview={handleSubmitFormReview}
              />
            </>
          )}
          <hr style={{ border: "1px solid black", margin: "16px 0" }} />
          {reviews
            .filter((review) => review.propertyId === property.id)
            .map((review) => (
              <Box key={review.id} borderRadius="xl" bg="yellow.100">
                <Text color="gray.700" mb={4}>
                  Rating: {review.rating}
                </Text>
                <Text color="gray.700" mb={4} fontStyle={"italic"}>
                  {review.comment}
                </Text>
                <hr style={{ border: "1px solid black", margin: "16px 0" }} />
              </Box>
            ))}
        </Box>
      </Flex>
    </Flex>
  );
};
