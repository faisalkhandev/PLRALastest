import React from "react";
import { useTable, useSortBy, useResizeColumns } from "react-table";
import { faArrowUp, faArrowDown } from "../../Assets/Icons/Icons.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Styles.css";

const data = [
  {
    id: 1,
    gender: "male",
    salary: 1200,
  },
  {
    id: 2,
    gender: "fe-male",
    salary: 1000,
  },
  {
    id: 3,
    gender: "Robot",
    salary: 1000,
  },
];

const columns = [
  {
    Header: "ID",
    accessor: "id",
    maxWidth: 200, // Set the maximum width to 200px
  },
  {
    Header: "Gender",
    accessor: "gender",
    maxWidth: 200, // Set the maximum width to 200px
  },
  {
    Header: "Salary",
    accessor: "salary",
    maxWidth: 200, // Set the maximum width to 200px
  },
];

const MyTable = () => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy, useResizeColumns);

  return (
    <div style={{ padding: "10px", width: "100%" }}>
      <table {...getTableProps()} className="Table">
        <thead className="T_Head">
          {headerGroups.map((hg) => (
            <tr {...hg.getHeaderGroupProps()} className="T_Head_Column">
              {hg.headers.map((column) => (
                <th
                  {...column.getHeaderProps(
                    column.getSortByToggleProps(),
                    column.getResizerProps()
                  )}
                  className="T_Column"
                >
                  {column.render("Header")}
                  {column.isSorted && (
                    <span>
                      {column.isSortedDesc ? (
                        <FontAwesomeIcon
                          icon={faArrowUp}
                          className="sort_icon"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faArrowDown}
                          className="sort_icon"
                        />
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="T_body">
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="T_Row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="T_Row_Data">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MyTable;
