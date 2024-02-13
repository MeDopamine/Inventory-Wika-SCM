import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Flex, Text, CircularProgress } from "@chakra-ui/react";
import { Message } from "primereact/message";

function ChartMonthDivisi(props) {
  const [dataAB, setDataAB] = useState([]);
  const [dataAC, setDataAC] = useState([]);
  const [dataAD, setDataAD] = useState([]);
  const [dataAE, setDataAE] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await fetch("http://localhost:4001/api/v1/inventory/dashboardData");
        const dataJson = await data.json()
        const dataJsonAB = dataJson.dataTopPerSumberDaya.allAB
        const dataJsonAC = dataJson.dataTopPerSumberDaya.allAC
        const dataJsonAD = dataJson.dataTopPerSumberDaya.allAD
        const dataJsonAE = dataJson.dataTopPerSumberDaya.allAE
        setDataAB(dataJsonAB);
        setDataAC(dataJsonAC);
        setDataAD(dataJsonAD);
        setDataAE(dataJsonAE);
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function sortAndSumData(data) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const totalByMonth = {};

    data.forEach((item) => {
      const grMonth = new Date(item.tanggalGr).getMonth();
      const giMonth = new Date(item.tanggalGi).getMonth();
      const inventorValue = parseFloat(item.inventorValue);

      for (let i = grMonth; i <= giMonth; i++) {
        const monthName = months[i];
        totalByMonth[monthName] =
          (totalByMonth[monthName] || 0) + inventorValue;
      }
    });

    const result = months.map((month) => totalByMonth[month] || 0);

    return result;
  }
  const sortDataAB = sortAndSumData(dataAB);
  const sortDataAC = sortAndSumData(dataAC);
  const sortDataAD = sortAndSumData(dataAD);
  const sortDataAE = sortAndSumData(dataAE);
  //   console.log(sortDataAB);

  const chartData = {
    options: {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        onDatasetHover: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
          },
        },
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: function (value) {
            return value.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            });
          },
        },
        fixed: {
          enabled: true,
          position: "right",
        },
      },
      xaxis: {
        categories: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        show: false,
        labels: {
          formatter: function (value) {
            var val = Math.abs(value);
            if (val >= 1000 && val < 1000000) {
              val = (val / 1000).toFixed(0) + " Ribu";
            }
            if (val >= 1000000 && val < 1000000000) {
              val = (val / 1000000).toFixed(0) + " Juta";
            }
            if (val >= 1000000000 && val < 1000000000000) {
              val = (val / 1000000000).toFixed(0) + " Milyar";
            }
            if (val >= 1000000000000) {
              val = (val / 1000000000000).toFixed(0) + " Triliun";
            }
            return "Rp " + val;
          },
          show: true,
          style: {
            colors: ["#212529"],
            fontSize: "14px",
            fontWeight: "500",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        labels: {
          colors: ["#212529"],
        },
      },
    },
    series: [
      {
        name: "Infrastruktur 1 Division",
        data: sortDataAB,
      },
      {
        name: "Infrastruktur 2 Division",
        data: sortDataAC,
      },
      {
        name: "EPCC Division",
        data: sortDataAD,
      },
      {
        name: "Building & Overseas Division",
        data: sortDataAE,
      },
    ],
  };
  return (
    <Flex direction="column" height="100%">
      <Flex px="25px" justify="space-between" align="center">
        <Text
          me="auto"
          color={"#212529"}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%">
          Total Value Inventory Per Divisi
        </Text>
      </Flex>
      <Box h="100%">
        {
          loading?
          (
            <Flex align="center" justify="center" h="100%">
              <CircularProgress isIndeterminate color="blue.400" size="20px" />
            </Flex>
          ):(
            dataAB.length > 0 ||
            dataAC.length > 0 ||
            dataAD.length > 0 ||
            dataAE.length > 0 ? 
            (
              <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
          />
            ):(
              <Flex align="center" justify="center" h="100%">
                <Message
                  severity="warn"
                  text="Pilih Filter Material Group terlebih dahulu"
                />
              </Flex>
            )
          )
        }
      </Box>
    </Flex>
  );
}

export default ChartMonthDivisi;
