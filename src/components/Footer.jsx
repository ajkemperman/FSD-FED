import { Box, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box
      as="footer"
      bg="blue.300"
      textAlign="center"
      py={4}
      height="100%"
      overflowX="hidden"
      maxW="100%"
    >
      <Text fontSize="sm" color="gray.800" fontWeight="normal">
        © {new Date().getFullYear()} A.J. Kemperman FSD
      </Text>
    </Box>
  );
};
