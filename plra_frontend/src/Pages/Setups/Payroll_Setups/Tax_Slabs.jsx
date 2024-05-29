import { Box, Typography, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Btn, DialogBox } from '../../../Components'
import { useTheme } from "@emotion/react";
import { FloppyDisk, Trash, PenToSquare } from '../../../Assets/Icons';


function Tax_Slabs() {
    const theme = useTheme();
    const [activeRow, setActiveRow] = useState(-1);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [taxSlabs, setTaxSlabs] = useState([
        { no: 1, exceeds: '60,0000', doesNotExceed: '600,00000', yearlyAmount: '-', taxRate: '0.00%', exceedingAmount: '-' },
    ]);


    const handleAddRow = () => {
        const newRow = {
            no: taxSlabs.length + 1,
            exceeds: '',
            doesNotExceed: '',
            yearlyAmount: '',
            taxRate: '',
            exceedingAmount: '',
        };
        setTaxSlabs((prevTaxSlabs) => [...prevTaxSlabs, newRow]);
        setActiveRow(taxSlabs.length);

    };
    const handleChange = (index) => (e) => {
        const { name, value } = e.target;
        setTaxSlabs((prevTaxSlabs) =>
            prevTaxSlabs.map((row, i) =>
                i === index ? { ...row, [name]: value } : row
            )
        );
    };

    const handleSave = () => {
        setActiveRow(-1)
    }
    const handleEdit = (index) => {
        setActiveRow(index)
        console.log(index)
    }
    const handleDeleteDialog = (index) => {
        setDeleteIndex(index);
        setDeleteDialog(true);
    };

    const handleDeleteData = () => {
        if (deleteIndex !== null) {
            setTaxSlabs((prevTaxSlabs) => prevTaxSlabs.filter((_, i) => i !== deleteIndex));
            setDeleteIndex(null);
        }
        setDeleteDialog(false);
        setActiveRow(-1);
    };

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ width: "100%", display: "flex", mb: 3, gap: 2, alignItems: 'center' }}>
                    <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Tax Slab</Typography>
                    <Btn type="Add" onClick={handleAddRow} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end', marginRight: 1 }} />
                </Box>

                <Box sx={{ width: '100%', overflowY: 'hidden', borderRadius: '6px', position: 'relative', border: "1px solid #379237", height: 'calc(100vh - 250px)' }} >
                    <Grid container xs={12}>
                        <Grid item xs={12} >
                            <Grid container sx={{ backgroundColor: theme.palette.primary.main, p: '0.3rem', display: 'flex', gap: 0.5 }} >
                                <Grid item xs={1} >
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>No</Typography></Grid>
                                <Grid item xs={1.2}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>If Exceeds</Typography></Grid>
                                <Grid item xs={2}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>But does not Exceed</Typography></Grid>
                                <Grid item xs={2}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Yearly fixed Amount</Typography></Grid>
                                <Grid item xs={1.4}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Yearly tax Rate</Typography></Grid>
                                <Grid item xs={2.3}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Of the Amount exceeding</Typography></Grid>
                                <Grid item xs={0.5}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Save</Typography></Grid>
                                <Grid item xs={0.5}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Edit</Typography></Grid>
                                <Grid item xs={0.5}>
                                    <Typography variant='h4' sx={{ width: '100%', color: 'var(--white-color)', fontWeight: 'bold', fontSize: '14px' }}>Delete</Typography></Grid>
                            </Grid>
                        </Grid>
                        {taxSlabs.map((row, index) => (
                            <Grid key={row.no} item xs={12} >
                                <Grid container sx={{ p: '0.3rem', display: 'flex', gap: 0.5 }} >
                                    <Grid item xs={1} >
                                        {
                                            activeRow === index ?
                                                <TextField name="no" value={row.no || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.no}
                                    </Grid>
                                    <Grid item xs={1.2} >
                                        {
                                            activeRow === index ?
                                                <TextField name="exceeds" value={row.exceeds || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.exceeds}
                                    </Grid>
                                    <Grid item xs={2}> {
                                        activeRow === index ?
                                            <TextField name="doesNotExceed" value={row.doesNotExceed || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.doesNotExceed}</Grid>
                                    <Grid item xs={2} >{
                                        activeRow === index ?
                                            <TextField name="yearlyAmount" value={row.yearlyAmount || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.yearlyAmount} </Grid>
                                    <Grid item xs={1.4} >{
                                        activeRow === index ?
                                            <TextField name="taxRate" value={row.taxRate || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.taxRate} </Grid>
                                    <Grid item xs={2.3}  >{
                                        activeRow === index ?
                                            <TextField name="exceedingAmount" value={row.exceedingAmount || ""} sx={{ border: '1px solid green', borderRadius: '2px' }} onChange={handleChange(index)} /> : row.exceedingAmount} </Grid>
                                    <Grid item xs={0.5} sx={{ textAlign: 'start', mt: activeRow === index ? '0.5rem' : '', ml: 0.8, cursor: 'pointer' }} onClick={handleSave}><FloppyDisk /></Grid>
                                    <Grid item xs={0.5} sx={{ textAlign: 'start', mt: activeRow === index ? '0.5rem' : '', ml: 0.2, cursor: 'pointer' }} onClick={() => handleEdit(index)}><PenToSquare /></Grid>
                                    <Grid item xs={0.5} sx={{ textAlign: 'start', mt: activeRow === index ? '0.5rem' : '', ml: 0.2, cursor: 'pointer' }} onClick={() => handleDeleteDialog(index)} ><Trash /></Grid>
                                    {
                                        deleteDialog ?
                                            <DialogBox
                                                open={deleteDialog}
                                                onClose={() => setDeleteDialog(false)}
                                                closeClick={() => setDeleteDialog(false)}
                                                sureClick={() => { handleDeleteData(); setDeleteDialog(false); }}
                                                title={"Are you sure you want to delete the record?"}
                                            /> : ''
                                    }

                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Box>


            </Box>
        </>
    )
}

export default Tax_Slabs