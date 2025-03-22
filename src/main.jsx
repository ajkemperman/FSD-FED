import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  PropertiesPage,
  loader as loaderProperties,
} from "./pages/PropertiesPage";
import { PropertyPage, loader as loaderProperty } from "./pages/PropertyPage";
import { HostsPage, loader as loaderHosts } from "./pages/HostsPage";
import { UsersPage, loader as loaderUsers } from "./pages/UsersPage";
import {
  AmenitiesPage,
  loader as loaderAmenities,
} from "./pages/AmenitiesPage";
import { ReviewsPage, loader as loaderReviews } from "./pages/ReviewsPage";
import { BookingsPage, loader as loaderBookings } from "./pages/BookingsPage";
import { Login } from "./components/Login";
import { LoginHost } from "./components/LoginHost";
import { SignUpPage } from "./pages/SignUpPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <PropertiesPage />,
        loader: loaderProperties,
      },
      {
        path: "/property/:propertyId",
        element: <PropertyPage />,
        loader: loaderProperty,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/loginHost",
        element: <LoginHost />,
      },
      {
        path: "/signupPage",
        element: <SignUpPage />,
      },
      {
        path: "/hosts",
        element: <HostsPage />,
        loader: loaderHosts,
      },
      {
        path: "/users",
        element: <UsersPage />,
        loader: loaderUsers,
      },
      {
        path: "/bookings",
        element: <BookingsPage />,
        loader: loaderBookings,
      },
      {
        path: "/reviews",
        element: <ReviewsPage />,
        loader: loaderReviews,
      },
      {
        path: "/amenities",
        element: <AmenitiesPage />,
        loader: loaderAmenities,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
