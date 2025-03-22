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
} from "@chakra-ui/react";
import { useState } from "react";

export const FormBooking = ({
  isOpen,
  onClose,
  formBookings,
  setFormBookings,
  property,
  handleSubmitFormBooking,
  handleChangeFormBookings,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState({});
  const [dayDifference, setDayDifference] = useState(null);
  // Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formBookings.numberOfGuests)
      newErrors.numberOfGuests = "Number of guests is required.";
    if (!formBookings.checkinDate)
      newErrors.checkinDate = "Full checkin date & time is required.";
    if (!formBookings.checkoutDate)
      newErrors.checkoutDate = "Full checkout date & time is required.";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit
  const checkSubmitFormBooking = (e) => {
    const isValid = validateForm();

    if (isValid) {
      handleSubmitFormBooking(e);
    }
  };
  useEffect(() => {
    if (formBookings.checkinDate && formBookings.checkoutDate) {
      let differenceInTime = 0;
      const start = new Date(formBookings.checkinDate);
      const end = new Date(formBookings.checkoutDate);
      differenceInTime = end - start;
      const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24); // Convert ms to days

      setDayDifference(Math.floor(differenceInDays));
      setFormBookings((prev) => ({
        ...prev,

        totalPrice: property.pricePerNight * dayDifference,
      }));
    }
  }, [formBookings.checkinDate, formBookings.checkoutDate, dayDifference]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Add Booking property {property.title} (price per night $
          {property.pricePerNight}):
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Property Details */}
          <FormControl mb={4} isRequired>
            <FormLabel>UserId</FormLabel>
            <Input
              name="UserId"
              value={formBookings.userId}
              type="text"
              placeholder="UserId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>PropertyId</FormLabel>
            <Input
              name="PropertyId"
              value={formBookings.propertyId}
              type="text"
              placeholder="PropertyId"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.numberOfGuests}>
            <FormLabel> Number of guests</FormLabel>
            <Input
              name="numberOfGuests"
              value={formBookings.numberOfGuests}
              onChange={handleChangeFormBookings}
              type="text"
              placeholder="Number of guests"
            />
            <FormErrorMessage>{errors.numberOfGuests}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.checkinDate}>
            <FormLabel>Checkin Date & Time</FormLabel>
            <Input
              name="checkinDate"
              value={formBookings.checkinDate}
              onChange={handleChangeFormBookings}
              type="datetime-local"
            />
            <FormErrorMessage>{errors.checkinDate}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired isInvalid={errors.checkoutDate}>
            <FormLabel>Checkout Date & Time</FormLabel>
            <Input
              name="checkoutDate"
              value={formBookings.checkoutDate}
              onChange={handleChangeFormBookings}
              type="datetime-local"
            />
            <FormErrorMessage>{errors.checkoutDate}</FormErrorMessage>
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Total price $</FormLabel>
            <Input
              name="totalPrice"
              value={formBookings.totalPrice}
              type="text"
              isReadOnly
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Booking status</FormLabel>
            <Input
              name="bookingStatus"
              value={formBookings.bookingStatus}
              type="text"
              isReadOnly
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={checkSubmitFormBooking}>
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
