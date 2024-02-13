import { useReducer, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "primereact/image";

import {
  FormControl,
  FormLabel,
  Heading,
  FormErrorMessage,
  FormHelperText,
  Box,
  Flex,
  Stack,
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useReducer(
    (formData, newItem) => {
      return { ...formData, ...newItem };
    },
    { userName: "", password: "" }
  );
  const [errorMessage, setErrorMessage] = useState(null);

  const doLogin = async () => {
    try {
      await login(formData.userName, formData.password);
      navigate("/Dashboard");
    } catch (error) {
      setErrorMessage(error);
      console.log("gagal login");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      doLogin();
    }
  };

  return (
    <Flex position="relative" bgGradient="linear(to-tr, #CDF5FD, #A0E9FF, #89CFF3, #00A9FF)" h="100vh">
      <Flex
        h={{
          sm: "100vh",
          md: "100vh",
          lg: "100vh",
          xl: "100vh",
        }}
        mx="auto"
        justifyContent="start"
        direction="column">
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Image src="/Wijaya_Karya.svg" />
            <Heading fontSize={"4xl"}>Inventory SCM</Heading>
          </Stack>
          <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <FormControl id="user">
                <FormLabel>User</FormLabel>
                <Input
                  type="user"
                  value={formData.userName}
                  onChange={(e) => setFormData({ userName: e.target.value })}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ password: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  onClick={doLogin}
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}>
                  Login
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Flex>
  );
};
