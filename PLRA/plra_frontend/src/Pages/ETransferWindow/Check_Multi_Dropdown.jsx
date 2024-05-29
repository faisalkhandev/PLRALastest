import { Dialog, DialogContent, Box, Checkbox } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@emotion/react';
import React, { useState } from "react";

const Check_Multi_Dropdown = ({ isOpen, onClose, tableRows, tableHeader, onSelect, RowFilterWith, MinimumWidth }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const handleRowClick = (params) => {
        const index = selectedRows.findIndex((row) => row[RowFilterWith] === params.row[RowFilterWith]);
        let newSelectedRows;
        if (index === -1) {
            newSelectedRows = [...selectedRows, params.row];
        } else {
            newSelectedRows = selectedRows.filter((row) => row[RowFilterWith] !== params.row[RowFilterWith]);
        }
        setSelectedRows(newSelectedRows);
        onSelect(newSelectedRows);  // Ensure this is triggered on change
    };
    
    const getRowId = (row) => {
        return RowFilterWith ? row[RowFilterWith] : undefined;
    };
    const rowHeight = 25;
    const theme = useTheme();
    return (
        <Dialog open={isOpen} onClose={onClose} sx={{ minWidth: MinimumWidth, m: 'auto', minHeight: "550px", maxHeight: "550px" }}>
            <DialogContent sx={{ minWidth: MinimumWidth, maxWidth: MinimumWidth }}>
                {
                    tableRows && tableRows.length > 0 ? (
                        <Box>
                            <DataGrid
                                rows={tableRows}
                                columns={tableHeader.map((header, index) => ({
                                    ...header,
                                    renderCell: (params) => {
                                        if (index === 0) {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: `${rowHeight}px`, cursor: 'pointer' }} onClick={() => handleRowClick(params)}>
                                                    <Checkbox checked={selectedRows.some((row) => row[RowFilterWith] === params.row[RowFilterWith])} />
                                                    <Box>{params.value}</Box>
                                                </Box>
                                            );
                                        }
                                        return <Box>{params.value}</Box>;
                                    },
                                }))}
                                getRowHeight={() => rowHeight}
                                columnHeaderHeight={30}
                                getRowId={getRowId}
                                pageSizeOptions={[10, 20, 30]}
                                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 15 } } }}
                            />

                        </Box>
                    ) : (
                        <Box sx={{ p: 3, textAlign: 'center', fontSize: '18px' }}>No Record Found</Box>
                    )
                }
            </DialogContent>
        </Dialog>
    );
};
export default Check_Multi_Dropdown;
