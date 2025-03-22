import React from "react";
import { Heading, Flex, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { ReviewsPageItem } from "../components/ReviewsPageItem";

import { TextInput } from "../components/ui/TextInput";

export const loader = async () => {
  try {
    const reviewsResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/reviews`
    );
    const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`);
    const propertiesResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/properties`
    );

    if (!reviewsResponse.ok || !usersResponse.ok || !propertiesResponse.ok) {
      throw new Error("Failed to fetch resource.");
    }

    const reviews = await reviewsResponse.json();
    const users = await usersResponse.json();
    const properties = await propertiesResponse.json();

    return {
      reviews,
      users,
      properties,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      reviews: [],
      users: [],
      properties: [],
      error: error.message,
    };
  }
};

export const ReviewsPage = () => {
  const [searchProperties, setSearchProperties] = useState("");

  const { reviews, users, properties } = useLoaderData();

  const matchedReviews = () => {
    const reviewsFiltered = [];

    const searchNameUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchProperties.toLowerCase())
    );

    searchNameUsers.forEach((element) => {
      reviews.forEach((review) => {
        if (review.userId === element.id) {
          reviewsFiltered.push(review);
        }
      });
    });

    return reviewsFiltered;
  };
  const matchedProperties = () => {
    const propertiesFiltered = [];

    const searchTitleProperties = properties.filter((property) =>
      property.title.toLowerCase().includes(searchProperties.toLowerCase())
    );
    searchTitleProperties.forEach((element) => {
      reviews.forEach((review) => {
        if (review.propertyId === element.id) {
          propertiesFiltered.push(review);
        }
      });
    });

    return propertiesFiltered;
  };
  const matchedSearch = (names, titles) => {
    const mergeSearch = [...names];

    titles.forEach((title) => {
      if (!mergeSearch.includes(title)) {
        mergeSearch.push(title);
      }
    });
    return mergeSearch;
  };
  const handleChange = (e) => {
    setSearchProperties(e.target.value);
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
      <Heading size="xl" color="white" mb={8}>
        List of Reviews
      </Heading>
      <Box color="white" mb={2}>
        <strong>Find the review:</strong>
      </Box>
      <TextInput
        placeholder=" Search on name of user or title property"
        onChange={handleChange}
        w={{ base: "90%", md: "50%", lg: "40%" }}
        bg="white"
        mb={6}
        p={2}
        borderRadius="2xl"
      />

      {searchProperties ? (
        <>
          {matchedSearch(matchedReviews(), matchedProperties()).length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 1, xl: 3 }}
              gap={6}
              mb={4}
            >
              {matchedSearch(matchedReviews(), matchedProperties()).map(
                (item) => (
                  <ReviewsPageItem
                    key={item.id}
                    review={item}
                    users={users}
                    properties={properties}
                  />
                )
              )}
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
            {reviews.map((item) => (
              <ReviewsPageItem
                key={item.id}
                review={item}
                users={users}
                properties={properties}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
