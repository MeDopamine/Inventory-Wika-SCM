import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { columnsDataSD } from "./variables/ColumnData";


export default function TableInventorySD(props) {
  const columnsData = columnsDataSD;
  const [tableData, setTableData] = useState([]);
  const fetchData = async () => {
    const response = await fetch("http://localhost:4001/api/v1/inventory/dashboardData");
      const dataFull = await response.json()
      console.log('data full: ', dataFull.dataTopPerSumberDaya.Data1);
      const dataTopInventoryPerSumberDaya = dataFull.dataTopPerSumberDaya.Data1
      setTableData(dataTopInventoryPerSumberDaya)
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 10;

  return (
    <Flex direction="column">
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text
          color="#212529"
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%">
          Top 10 Inventory Per Sumber Daya
        </Text>
      </Flex>
      {tableData.length > 0 ? (
        <Table
          {...getTableProps()}
          variant="striped"
          color="gray.500"
          mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor="gray.200"
                    width={column.width}>
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="black">
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "NAMA MATERIAL") {
                      data = (
                        <Flex>
                          <Text
                            color="#212529"
                            fontSize="sm"
                            fontWeight="500"
                            paddingRight="5">
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "UOM") {
                      data = (
                        <Flex>
                          <Text color="#212529" fontSize="sm" fontWeight="500">
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "QUANTITY") {
                      data = (
                        <Text
                          color="#212529"
                          fontSize="sm"
                          fontWeight="500"
                          justifyContent="right">
                          {cell.value.toLocaleString("id-ID")}
                        </Text>
                      );
                    } else if (cell.column.Header === "VALUE") {
                      data = (
                        <Text color="#212529" fontSize="sm" fontWeight="500">
                          {cell.value.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </Text>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        maxH="30px !important"
                        py="8px"
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent">
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : (
        <Flex align="center" justify="center" h="100%">
          <CircularProgress isIndeterminate color="blue.400" size="20px" />
        </Flex>
      )}
    </Flex>
  );
}
