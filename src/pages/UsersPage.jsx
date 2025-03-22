import React from "react";
import { Heading, Flex, SimpleGrid, Box, Text } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { UsersPageItem } from "../components/UsersPageItem";

import { TextInput } from "../components/ui/TextInput";

export const loader = async () => {
  try {
    const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/users`);

    if (!usersResponse.ok) {
      throw new Error("Failed to fetch resource.");
    }

    const users = await usersResponse.json();

    return {
      users,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    return {
      users: [],
      error: error.message,
    };
  }
};

export const UsersPage = () => {
  const [searchProperties, setSearchProperties] = useState("");

  const { users } = useLoaderData();
  const matchedTitles = users.filter((user) => {
    return user.name.toLowerCase().includes(searchProperties.toLowerCase());
  });
  const handleChange = (user) => {
    setSearchProperties(user.target.value);
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
        List of Users
      </Heading>
      <Box color="white" mb={2}>
        <strong>Find your user account:</strong>
      </Box>
      <TextInput
        placeholder=" Search on name of user"
        onChange={handleChange}
        w={{ base: "90%", md: "50%", lg: "40%" }}
        bg="white"
        mb={6}
        p={2}
        borderRadius="2xl"
      />

      {searchProperties ? (
        <>
          {matchedTitles.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 1, xl: 3 }}
              gap={6}
              mb={4}
            >
              {matchedTitles.map((item) => (
                <UsersPageItem key={item.id} user={item} />
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
            {users.map((item) => (
              <UsersPageItem key={item.id} user={item} />
            ))}
          </SimpleGrid>
        </>
      )}
    </Flex>
  );
};
