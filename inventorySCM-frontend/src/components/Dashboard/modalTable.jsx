import React, { useMemo } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useTable, useSortBy } from "react-table";

const ModalTable = ({ dataArray }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Material",
        accessor: "material",
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: ({ value }) => (
          <Td color={"#212529"} fontSize="sm" fontWeight="500">
            {value.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </Td>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => JSON.parse(dataArray), [dataArray]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <Table
      {...getTableProps()}
      variant="striped"
      color="gray.500"
      mb="24px"
      layout={{ fixedHeader: true }}>
      <Thead>
        {headerGroups.map((headerGroup, index) => (
          <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <Th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                key={index}
                color={"#212529"}>
                {column.render("Header")}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <Tr {...row.getRowProps()} key={index}>
              {row.cells.map((cell, index) => (
                <Td {...cell.getCellProps()} key={index} color={"#212529"}>
                  {cell.render("Cell")}
                </Td>
              ))}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default ModalTable;
