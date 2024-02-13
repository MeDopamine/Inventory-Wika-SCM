import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  CircularProgress,
} from "@chakra-ui/react";
import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import ModalTable from "./modalTable";
import { columnsDataProyek } from "./variables/ColumnData";
import { CustomerService } from "../../service/CustomerService"


export default function TableInventoryProyek(props) {
  const columnsData = columnsDataProyek;
  const [tableData, setTableData] = useState([]);
  const fetchData = async () => {
    const response = await fetch("http://localhost:4001/api/v1/inventory/dashboardData");
    const dataFull = await response.json()
    console.log('data full: ', dataFull.dataTopPerSumberDaya.Data2);
    const dataTopInventoryPerProjek = dataFull.dataTopPerSumberDaya.Data2
    setTableData(dataTopInventoryPerProjek)
  };
  useEffect(() => {
    fetchData();
    
  }, []);
  console.log('table data: ', tableData);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const openModal = (rowData) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

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
      <Flex px="25px" justify="space-between" align="center">
        <Text
          color={"#212529"}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%">
          Top 10 Inventory Per Proyek
        </Text>
      </Flex>
      {tableData.length > 0 ? (
        <Flex>
          <Table
            {...getTableProps()}
            variant="striped"
            color="gray.500"
            mb="24px"
            h="100%"
            w="100%">
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, index) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      pe="10px"
                      key={index}
                      borderColor="gray.200">
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
                      if (cell.column.Header === "NAMA PROYEK") {
                        data = (
                          <Flex align="center">
                            <Button
                              variant="link"
                              color={"#212529"}
                              fontSize="md"
                              fontWeight="500"
                              onClick={() => openModal(row.original)}>
                              {cell.value}
                            </Button>
                          </Flex>
                        );
                      } else if (cell.column.Header === "VALUE") {
                        data = (
                          <Text
                            color={"#212529"}
                            fontSize="sm"
                            fontWeight="500">
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
        </Flex>
      ) : (
        <Flex align="center" justify="center" h="100%">
          <CircularProgress isIndeterminate color="blue.400" size="20px" />
        </Flex>
      )}
      <Modal
        size={"xl"}
        scrollBehavior={"inside"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
        motionPreset="slideInBottom"
        blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedRowData && selectedRowData.namaProjek}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedRowData && selectedRowData.pd ? (
              <ModalTable dataArray={selectedRowData.pd} />
            ) : (
              <p>No data available</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
