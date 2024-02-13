import { useRouteError, Link } from "react-router-dom";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Flex justifyContent="center" bgGradient="linear(to-tr, #CDF5FD, #A0E9FF, #89CFF3, #00A9FF)" h="100vh">
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, teal.400, teal.600)"
          backgroundClip="text">
          404
        </Heading>
        <Text fontSize="18px" mt={3} mb={2}>
          Page {error.statusText || error.message}
        </Text>
        <Text color={"gray.500"} mb={6}>
          The page you&apos;re looking for does not seem to exist
        </Text>

        <Button
          colorScheme="teal"
          bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          color="white"
          variant="solid">
          <Link to={"/"}>Go to Home</Link>
        </Button>
      </Box>
    </Flex>
  );
}
