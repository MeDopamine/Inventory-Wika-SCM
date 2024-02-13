import { Box, Card, SimpleGrid, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TableInventorySD from "../components/Dashboard/tableInventorySD";
import ChartMonthDivisi from "../components/Dashboard/chartMonthDivisi";
import TableInventoryProyek from "../components/Dashboard/tableInventoryProyek";
import Statistics from "../components/Dashboard/statistics";
import TableInventoryMG from "../components/Dashboard/tableInventoryMG";

export const Dashboard = () => {
  const [totalValue, setTotalValue] = useState(0);
  const [totalMaterial, setTotalMaterial] = useState(0);

  useEffect(() => {
    fetch("http://localhost:4001/api/v1/inventory/dashboardData")
      .then((response) => response.json())
      .then((data) => {
        setTotalValue(data.dataTopPerSumberDaya.totalValue[0].total);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    fetch("http://localhost:4001/api/v1/inventory/dashboardData")
      .then((response) => response.json())
      .then((data) => {
        setTotalMaterial(data.dataTopPerSumberDaya.totalMaterial[0].jumlah);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <Box
        p={{ base: "20px", md: "30px" }}
        pe="20px"
        minH="100vh"
        pt="50px">
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
          gap="20px"
          mb="20px">
          <Card
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            bg="#ffffff"
            backgroundClip="border-box"
            overflow="auto">
            <Statistics
              name="Total Inventory Value"
              value={totalValue?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            />
          </Card>
          <Card
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            bg="#ffffff"
            backgroundClip="border-box"
            overflow="auto">
            <Statistics
              name="Jenis Material"
              value={totalMaterial?.toLocaleString("id-ID")}
            />
          </Card>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
          <Card
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            // wordWrap="break-word"
            bg="#ffffff"
            backgroundClip="border-box"
            overflow="auto">
            <TableInventoryProyek />
          </Card>
          <Card
            p="20px"
            width="100%"
            borderRadius="20px"
            minWidth="0px"
            bg="#ffffff"
            backgroundClip="border-box">
            <ChartMonthDivisi />
          </Card>
        </SimpleGrid>
        <SimpleGrid gap="20px" mb="20px">
          <Card
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            bg="#ffffff"
            backgroundClip="border-box"
            overflow="auto">
            <TableInventoryMG />
          </Card>
        </SimpleGrid>
        <SimpleGrid gap="20px" mb="20px">
          <Card
            p="20px"
            display="flex"
            flexDirection="column"
            width="100%"
            position="relative"
            borderRadius="20px"
            minWidth="0px"
            bg="#ffffff"
            backgroundClip="border-box"
            overflow="auto">
            <TableInventorySD />
          </Card>
        </SimpleGrid>
      </Box>
    </>
  );
};
