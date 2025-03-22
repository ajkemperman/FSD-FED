import {
  Text,
  Box,
  Flex,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";

import { Button } from "./ui/Button";
import { FormBookingEdit } from "./FormBookingEdit";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { putDataBookings } from "./Api";

export const BookingsPageItem = ({ booking, users, properties }) => {
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  let navigate = useNavigate();
  const [formBookings, setFormBookings] = useState({
    userId: booking.userId,
    propertyId: booking.propertyId,
    checkinDate: new Date(booking.checkinDate).toISOString().slice(0, 16),
    checkoutDate: new Date(booking.checkoutDate).toISOString().slice(0, 16),
    numberOfGuests: booking.numberOfGuests,
    totalPrice: booking.totalPrice,
    bookingStatus: booking.bookingStatus,
  });
  const toast = useToast();
  const handleChangeFormBookings = (e) => {
    const { name, value } = e.target;
    setFormBookings((prev) => ({ ...prev, [name]: value }));
  };
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const getUserName = () => {
    const findUser = users.find((user) => booking.userId === user.id);
    return findUser.name;
  };
  const getPropertyTitle = () => {
    const findProperty = properties.find(
      (property) => booking.propertyId === property.id
    );
    return findProperty.title;
  };
  const getPropertyPrice = () => {
    const findProperty = properties.find(
      (property) => booking.propertyId === property.id
    );
    return findProperty.pricePerNight;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    await putDataBookings(
      booking.id,
      formBookings,
      toast,
      import.meta.env.VITE_API_URL
    );

    handleClose();
    navigate("/bookings");
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem("tokenUser");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
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
      gap={2}
      borderRadius="2xl"
      w="100%"
      h="100%"
      bgColor="gray.100"
      alignItems="flex-start"
      boxShadow="lg" // Large shadow
      transform="scale(1.0)" // Slight scale effect
      transition="transform 0.2s ease-in-out"
      _hover={{
        boxShadow: "xl", // Bigger shadow on hover
      }}
    >
      <Box p={2} mt={1} textAlign="center" w="100%">
        <Text color="gray.700" mb={2}>
          <strong>{getUserName()} </strong>
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>UserId:</strong> {booking.userId}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>{getPropertyTitle()} </strong>
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>PropertyId:</strong> {booking.propertyId}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Checkin Date:</strong>
          {new Date(booking.checkinDate).toLocaleString()}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Checkout Date:</strong>{" "}
          {new Date(booking.checkoutDate).toLocaleString()}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Number of guests:</strong> {booking.numberOfGuests}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Total price:</strong> ${booking.totalPrice}
        </Text>
        <Text color="gray.700" mb={2}>
          <strong>Booking Status:</strong> {booking.bookingStatus}
        </Text>

        {
          <>
            <Button onClick={handleOpen} colorScheme="green" mt={2}>
              Edit details booking
            </Button>
            <FormBookingEdit
              isOpen={isOpen}
              onClose={handleClose}
              formBookings={formBookings}
              setFormBookings={setFormBookings}
              handleChangeFormBookings={handleChangeFormBookings}
              handleSubmitForm={handleSubmitForm}
              getPropertyPrice={getPropertyPrice}
            />
            <Button
              onClick={onDeleteDialogOpen}
              colorScheme="red"
              mx={4}
              mt={2}
            >
              Delete this booking
            </Button>

            <AlertDialog
              isOpen={isDeleteDialogOpen}
              onClose={onDeleteDialogClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete booking: {booking.name}
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can not undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onDeleteDialogClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDeleteBooking(booking.id)}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        }
      </Box>
    </Flex>
  );
};
