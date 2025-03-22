import { Heading, Image, Text, Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const PropertiesPageItem = ({ property, amenities }) => {
  return (
    <Flex
      direction="column"
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
        transform: "scale(1.1)", // Scale up on hover
        boxShadow: "xl", // Bigger shadow on hover
      }}
    >
      <Image
        src={property.image}
        w="100%"
        h="200px"
        alt={property.description}
        overflow="hidden"
        borderTopRadius="2xl"
        objectPosition="top"
        objectFit="cover"
      />
      <Box p={2} mt={1} textAlign="center" w="100%">
        <Heading fontSize="xl" color="gray.800" mt={1} mb={1}>
          {property.title}
        </Heading>
        <Text color="gray.700" mb={2} fontStyle={"italic"}>
          {property.description}
        </Text>
        <Text color="gray.700" mb={2} fontSize="xl">
          {property.location}
        </Text>
        <Link to={`property/${property.id}`}>
          <Box
            as="span"
            color="gray.900"
            _hover={{ color: "blue.500", textDecoration: "underline" }}
          >
            More Info....
          </Box>
        </Link>
        {property.amenitiesIds ? (
          <>
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
          </>
        ) : (
          <Text> No aminities</Text>
        )}
      </Box>
    </Flex>
  );
};
