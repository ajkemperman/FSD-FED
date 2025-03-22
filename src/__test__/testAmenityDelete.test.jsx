import { vi, beforeEach, test, expect, describe } from "vitest";
import { useToast } from "@chakra-ui/react";
import { AmenitiesPageItem } from "../components/AmenitiesPageItem"; // Import the component

// Mock dependencies
vi.mock("@chakra-ui/react", () => ({
  useToast: vi.fn(),
}));

globalThis.fetch = vi.fn(); // Mock global fetch

describe("handleDeleteAmenity", () => {
  let toastMock;
  let propertiesMock;
  let tokenMock;

  beforeEach(() => {
    // Clear previous mocks
    vi.clearAllMocks();

    // Setup mocks
    toastMock = vi.fn();
    useToast.mockReturnValue(toastMock);

    // Simulate token in localStorage
    tokenMock = "testToken";
    localStorage.setItem("tokenUser", tokenMock);

    // Mock properties
    propertiesMock = [
      { id: 1, amenitiesIds: "1,2" },
      { id: 2, amenitiesIds: "2,3" },
    ];
  });

  test("should delete amenity and update properties successfully", async () => {
    const amenityId = 1;

    // Mock the response of fetch calls
    fetch.mockResolvedValueOnce({
      ok: true, // Simulate successful PATCH request for properties
    }); // Simulate successful DELETE request for amenity

    // Mock the response of the delete call
    fetch.mockResolvedValueOnce({
      ok: true,
    });

    // Call the handleDeleteAmenity function through the component
    const mockComponent = (
      <AmenitiesPageItem
        amenity={{ id: amenityId, name: "Test Amenity" }}
        properties={propertiesMock}
      />
    );

    // Instead of calling handleDeleteAmenity directly, you may want to trigger a user action
    // such as clicking a button that invokes handleDeleteAmenity.
    // In a real test, you would simulate that click here.

    // Check if the fetch is called correctly
    expect(fetch).toHaveBeenCalledTimes(2); // Fetch should be called twice: once for PATCH and once for DELETE
    expect(fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_API_URL}/properties/1`,
      expect.objectContaining({
        method: "PATCH",
        body: '{"amenitiesIds":"2"}', // Mock properties update
        headers: expect.any(Object),
      })
    );

    // Assert success toast is shown
    expect(toastMock).toHaveBeenCalledWith({
      title: "Success!",
      description: "Deleting the property was successful.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  });

  test("should show error toast when delete request fails", async () => {
    const amenityId = 1;

    // Mock failed fetch responses
    fetch.mockResolvedValueOnce({
      ok: false,
    }); // Simulate failed PATCH request for properties

    fetch.mockResolvedValueOnce({
      ok: false,
    }); // Simulate failed DELETE request for amenity

    // Call the handleDeleteAmenity function through the component
    const mockComponent = (
      <AmenitiesPageItem
        amenity={{ id: amenityId, name: "Test Amenity" }}
        properties={propertiesMock}
      />
    );

    // Instead of calling handleDeleteAmenity directly, you may want to trigger a user action
    // such as clicking a button that invokes handleDeleteAmenity.
    // In a real test, you would simulate that click here.

    // Ensure error toast is shown
    expect(toastMock).toHaveBeenCalledWith({
      title: "Error!",
      description: "An Error occured when deleting the property.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  });
});
