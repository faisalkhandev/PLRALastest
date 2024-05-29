import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const rowHeight = 25;

export default function                                                                                                                                                               CheckBoxDataGrid(props) {
 const { columns, data, customPageSize, tableHeading, isAddNewButton, route, outerCSS, RowFilterWith, minHeight } = props;
 const filteredColumns = isAddNewButton ? columns : columns.filter(column => column.field !== 'button');

 const getRowId = (row) => {
    return RowFilterWith ? row[RowFilterWith] : undefined;
 };

 return (
    <Box sx={{ width: '100%', overflowY: 'hidden', borderRadius: '6px', position: 'relative', ...outerCSS }}>
      <DataGrid
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': { outline: 'none' },
          fontSize: '14px',
          overflowY: 'hidden',
          '& .MuiDataGrid-columnsContainer .MuiDataGrid-panel .MuiDataGrid-panelFooter button:first-child': { display: 'none' },
          '& .MuiDataGrid-columnsContainer .MuiDataGrid-panel .MuiDataGrid-panelFooter button:last-child': { display: 'none' }
        }}
        rows={data}
        columns={filteredColumns}
        getRowHeight={() => rowHeight}
        disableRowSelectionOnClick={true}
        columnHeaderHeight={30}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: customPageSize } } }}
        pageSizeOptions={[25, 50, 100]}
        getRowId={getRowId}
        style={{ minHeight }}
      />
    </Box>
 );
}
