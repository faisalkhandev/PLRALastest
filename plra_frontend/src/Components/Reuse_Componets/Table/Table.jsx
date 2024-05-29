import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './Table.css';
import TableHead from './TableHead';
import { useState } from 'react';

function Table({ coloumns, rows, rowFilterWith, onFilterSearch, onAscendingClick, onDescendingClick, onPageChange, onRowClick, totalRecords }) {
    const [pageSize, setpageSize] = useState(25);
    const numericFilters = [
        {
          id: 1,
          name: "is equal to"
        },
        {
          id: 2,
          name: "greater than or equal"
        },
        {
          id: 3,
          name: "less than or equal"
        },
        {
          id: 4,
          name: "between"
        }
      ];
    
      const alphaNumericFilters = [
        { id: 1, name: "is exactly" },
        { id: 2, name: "contains" },
        { id: 3, name: "begins with" }
      ];
    return (
        <div className="table">
            <div className="table__body">
                <table>
                    <thead>
                        <tr>
                            {
                                coloumns.map((i) => {
                                    return <th style={i.style} key={i.id} >
                                        <TableHead i={i} numericFilters={numericFilters} alphaNumericFilters={alphaNumericFilters} onFilterSearch={onFilterSearch} onAscendingClick={onAscendingClick} onDescendingClick={onDescendingClick} />
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map((row, index) => {
                                return <tr key={row.id} onClick={(e) => onRowClick(row)} style={{ zIndex: 1 }} >
                                    {
                                        coloumns.map((j) => {
                                            const fieldParts = j.field.split('.'); // Split the field string by dot
                                            let value = row;
                                            for (const part of fieldParts) {
                                                value = value[part];
                                            }


                                            return <td> {value} </td>
                                        })
                                    }
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <h3>Rows Per Page: </h3>
                <div className="pageSize">
                    <select name="pageSize" id="pageSize" onChange={(e) => setpageSize(e.target.value)} >
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
                <Stack spacing={2}>
                    <Pagination count={Math.ceil(totalRecords / pageSize)} onChange={(event, page) => onPageChange(page)} />
                </Stack>
            </div>
        </div>
    );
}

export default Table;
