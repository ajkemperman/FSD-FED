import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json;charset=utf-8" },
      });
      if (!response.ok) {
        // If the response isn't ok, show a toast notification for the error
        throw new Error("Invalid credentials");
      }
      const data = await response.json();

      localStorage.setItem("tokenUser", data.tokenUser);
      navigate("/"); // Redirect after login
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <Center h="100vh" bg="blue.300">
      <Box
        w={{ base: "90%", sm: "400px" }}
        p={6}
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          User Login
        </Heading>
        <form onSubmit={handleLogin}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                size="lg"
                autoComplete="current-username"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                autoComplete="current-password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              size="lg"
              width="full"
              mt={4}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    </Center>
  );
};
