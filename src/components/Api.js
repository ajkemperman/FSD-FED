export const postDataUser = async (user, toast, BASE_URL) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add user: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Adding the user was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting user data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while adding user data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const postDataAmenities = async (amenity, toast, BASE_URL) => {
  try {
    const token = localStorage.getItem("tokenUser");
    const response = await fetch(`${BASE_URL}/amenities`, {
      method: "POST",
      body: JSON.stringify(amenity),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add amenity: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Adding the amenity was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting amenity data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while adding amenity data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const postDataHosts = async (hosts, toast, BASE_URL) => {
  try {
    let token = localStorage.getItem("tokenHost");
    if (!token) {
      token = localStorage.getItem("tokenUser");
    }
    const response = await fetch(`${BASE_URL}/hosts`, {
      method: "POST",
      body: JSON.stringify(hosts),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add host: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Adding the host was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting host data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while adding host data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const postDataBookings = async (bookings, toast, BASE_URL) => {
  try {
    const formattedBookings = {
      ...bookings,
      numberOfGuests: Number(bookings.numberOfGuests),
      checkinDate: new Date(bookings.checkinDate).toISOString(),
      checkoutDate: new Date(bookings.checkoutDate).toISOString(),
    };
    const token = localStorage.getItem("tokenUser");
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      body: JSON.stringify(formattedBookings),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add booking: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Adding the booking was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting booking data:", error);

    toast({
      title: "Error!",
      description: "An error occurred while adding booking data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const postDataReview = async (review, toast, BASE_URL) => {
  try {
    const token = localStorage.getItem("tokenUser");
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add review: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Adding the review was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting review data:", error);

    toast({
      title: "Error!",
      description: "An error occurred while adding review data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const postDataProperties = async (properties, toast, BASE_URL) => {
  let token = localStorage.getItem("tokenUser");
  if (!token) {
    token = localStorage.getItem("tokenHost");
  }

  try {
    const response = await fetch(`${BASE_URL}/properties`, {
      method: "POST",
      body: JSON.stringify(properties),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to post property data.");
    } else {
      toast({
        title: "Success!",
        description: "Adding the property was successful.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding property data:", error);
    toast({
      title: "Error!",
      description: "Adding the property was unsuccessful.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const putDataHosts = async (hostId, host, toast, BASE_URL) => {
  try {
    let token = localStorage.getItem("tokenHost");
    if (!token) {
      token = localStorage.getItem("tokenUser");
    }
    const response = await fetch(`${BASE_URL}/hosts/${hostId}`, {
      method: "PUT",
      body: JSON.stringify(host),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update host: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the host was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating host data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating host data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const putDataUsers = async (userId, user, toast, BASE_URL) => {
  try {
    let token = localStorage.getItem("tokenUser");

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update user: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the user was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating user data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating user data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const putDataReviews = async (reviewId, review, toast, BASE_URL) => {
  try {
    const formattedReview = {
      ...review,
      rating: Number(review.rating),
    };
    let token = localStorage.getItem("tokenUser");

    const response = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(formattedReview),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update review: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the review was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating review data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating review data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};
export const putDataAmenities = async (amenityId, amenity, toast, BASE_URL) => {
  try {
    let token = localStorage.getItem("tokenUser");

    const response = await fetch(`${BASE_URL}/amenities/${amenityId}`, {
      method: "PUT",
      body: JSON.stringify(amenity),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update amenity: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the amenity was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating amenity data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating amenity data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const putDataLogo = async (logoId, logo, toast, BASE_URL) => {
  try {
    let token = localStorage.getItem("tokenUser");

    const response = await fetch(`${BASE_URL}/logos/${logoId}`, {
      method: "PUT",
      body: JSON.stringify(logo),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update logo: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the logo was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating logo data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating logo data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const putDataBookings = async (bookingId, booking, toast, BASE_URL) => {
  try {
    const formattedBooking = {
      ...booking,
      numberOfGuests: Number(booking.numberOfGuests),
      checkinDate: new Date(booking.checkinDate).toISOString(),
      checkoutDate: new Date(booking.checkoutDate).toISOString(),
    };

    let token = localStorage.getItem("tokenUser");

    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify(formattedBooking),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update booking: ${response.status} ${response.statusText}`
      );
    }

    toast({
      title: "Success!",
      description: "Updating the booking was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating booking data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating booking data.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const putDataProperties = async (
  propertyId,
  property,
  toast,
  BASE_URL
) => {
  let token = localStorage.getItem("tokenUser");
  if (!token) {
    token = localStorage.getItem("tokenHost");
  }

  try {
    const response = await fetch(`${BASE_URL}/properties/${propertyId}`, {
      method: "PUT",
      body: JSON.stringify(property),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `${token}`,
      },
    });
    console.log("Request body:", property); // Log the data being sent
    if (!response.ok) {
      throw new Error(
        `Failed to update property: ${response.status} ${response.statusText}`
      );
    }
    toast({
      title: "Success!",
      description: "Updating the property was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating property data:", error);
    toast({
      title: "Error!",
      description: "An error occurred while updating the property.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return { error: error.message };
  }
};

export const deleteProperty = async (propertyId, toast, BASE_URL) => {
  let token = localStorage.getItem("tokenUser");
  if (!token) {
    token = localStorage.getItem("tokenHost");
  }

  try {
    const response = await fetch(`${BASE_URL}/properties/${propertyId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete the property.");
    }

    toast({
      title: "Success!",
      description: "Deleting the property was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    toast({
      title: "Error!",
      description: "An error occurred while deleting the property.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};
