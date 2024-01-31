import { Dialog, DialogContent, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@emotion/react';
import React from "react";


const Multi_Dropdown = ({ isOpen, onClose, tableRows, tableHeader, onSelect, RowFilterWith, MinimumWidth }) => {
  const handleRowClick = (params) => onSelect ? onSelect(params.row) : null
  const getRowId = (row) => {
    return RowFilterWith ? row[RowFilterWith] : undefined;
  };
  const rowHeight = 25;
  const theme = useTheme();
  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ minWidth: MinimumWidth, m: 'auto',  maxHeight:"500px" }}>
      <DialogContent sx={{ minWidth: MinimumWidth }}>
        {
          tableRows && tableRows.length > 0 ? (
            <DataGrid
              rows={tableRows}
              columns={tableHeader}
              getRowHeight={() => rowHeight}
              disableRowSelectionOnClick={false}
              columnHeaderHeight={30}
              pageSizeOptions={[10, 20, 30]}
              onRowClick={handleRowClick}
              sx={{ overflow: 'hidden', cursor: 'pointer' }}
              getRowId={getRowId}
            />
          ) : (
            <Box sx={{ p:3, textAlign:'center', fontSize:'18px' }}>No Record Found</Box>
          )
        }
      </DialogContent>
    </Dialog>
  );
};
export default Multi_Dropdown;

