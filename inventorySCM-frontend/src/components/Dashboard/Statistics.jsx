import React from "react";
import { Flex, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export default function Statistics(props) {
  const { name, value } = props;

  return (
    <Flex px="25px">
      <Stat my="auto">
        <StatLabel
          lineHeight="100%"
          color="secondaryGray.600"
          fontSize={{
            base: "sm",
          }}>
          {name}
        </StatLabel>
        <StatNumber
          color="#212529"
          fontSize={{
            base: "2xl",
          }}>
          {value}
        </StatNumber>
      </Stat>
      <Flex ms="auto" w="max-content"></Flex>
    </Flex>
  );
}
