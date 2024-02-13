import React from "react";
import {
  Navigate,
  useOutlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Flex, Text } from "@chakra-ui/react";
import { PrimeIcons } from "primereact/api";
import { TabMenu } from "primereact/tabmenu";

export const ProtectedLayout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const items = [
    {
      label: "Dashboard",
      command: () => {
        navigate("Dashboard");
      },
      icon: PrimeIcons.HOME,
    },
    {
      label: "Data",
      command: () => {
        navigate("Data");
      },
      icon: PrimeIcons.TABLE,
    },
    {
      label: "Logout",
      command: logout,
      icon: PrimeIcons.SIGN_OUT,
    },
  ];

  const pathnameIndex = {
    "/Dashboard": 0,
    "/Data": 1,
  };

  const activeIndex = pathnameIndex[pathname] || 0;

  return (
    <Flex
      className="min-h-[100vh]"
      direction="column"
      bgGradient="linear(to-tr, #CDF5FD, #A0E9FF, #89CFF3, #00A9FF)">
      <Flex
        justifyContent="center"
      >
        <TabMenu model={items} activeIndex={activeIndex} />
      </Flex>
      {outlet}
      <Flex direction="column" position="absolute" bottom="0" left="0" width="100%" >
        <Flex justifyContent="center" marginBottom="7px" >
          <Text as="em" color="black" fontWeight='semibold'>
            Copyright &copy; 2023 WIKA Inventory SCM, All rights reserved.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
