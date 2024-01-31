import React, { Fragment, useState } from 'react';
import { Typography, Grid, MenuItem, Select, InputLabel, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField, MyTableContainer } from '../../../Components/index';
import { useGetHolidaysQuery, usePostHolidaysMutation, useUpdateHolidaysMutation } from '../../../Features/API/API';
import { toast } from 'react-toastify'
import '../../Styles.css';

const Holidays = () => {
    const theme = useTheme();

    //States
    const [formData, setFormData] = useState({ holiday_from_date: '', holiday_to_date: '', holiday_type: '', allowed_to: '' });
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [editDialog, setEditDialog] = useState(false);


    // Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetHolidaysQuery();
    const [postHolidays] = usePostHolidaysMutation();
    const [updateHolidays] = useUpdateHolidaysMutation();

    //Functions
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ holiday_from_date: '', holiday_to_date: '', holiday_type: '', allowed_to: '' })
        setIsRowSelected(false)
    }

    const handleRowClick = (event) => {
        setIsRowSelected(true)
        setFormData({ holiday_from_date: event.row.holiday_from_date, holiday_to_date: event.row.holiday_to_date, holiday_type: event.row.holiday_type, allowed_to: event.row.allowed_to })
        setSelectedRowID(event.row.id)
    };

    const handleSaveData = async (e) => {
        e.preventDefault();
        if (formData.holiday_from_date === '' || formData.holiday_to_date === '' || formData.holiday_type === '' || formData.allowed_to === '') {
            toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
        }
        else {
            try {
                const res = await postHolidays(formData);
                if (res.error) {
                    if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
                    else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
                } else {
                    toast.success("Data created successfully.", { position: "top-center", autoClose: 3000 })
                    setFormData({
                        holiday_from_date: '', holiday_to_date: '', holiday_type: '', allowed_to: '',
                    });
                    refetch();
                }
            } catch (err) {
                console.error('Error creating Holidays:', err);
            }
        }
    }

    const handleUpdateData = async (e) => {
        try {
            const res = await updateHolidays({ selectRowID, updateHolidaysData: formData });
            if (res.error) {
                if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
                else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
            } else {
                toast.success("Holidays Updated successfully.", { position: "top-center", autoClose: 3000 });
                setFormData({ holiday_from_date: '', holiday_to_date: '', holiday_type: '', allowed_to: '' });
                setIsRowSelected(false)
                refetch();
            }
        } catch (err) {
            console.error('Error updating Holidays:', err);
        }
    }

    const columns = [
        {
            field: 'id', headerName: 'Holidays ID', flex: 1,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <span onClick={onView} className='table_first_column'>  {params.value} </span>
                );
            },
        },
        {
            field: 'holiday_from_date',
            headerName: 'Start Date',
            flex: 1,
        },
        { field: 'holiday_to_date', headerName: 'End Date', flex: 1 },
        { field: 'holiday_type', headerName: 'Holiday Type', flex: 1 },
        { field: 'allowed_to', headerName: 'Allowed To', flex: 1 },
    ];


    return (
        <Fragment style={{ position: 'relative', overflowY: 'scroll' }}>
            <Box sx={{ width: "100%", display: "flex", mb: 1, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>Holidays</Typography>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
            </Box>

            {/* Form */}
            <form action="">
                <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6}>
                        <InputField name="holiday_from_date" label="Holiday Start Date" placeholder="Holiday Start Date" type="date" value={formData.holiday_from_date} onChange={(e) => setFormData({ ...formData, holiday_from_date: e.target.value })} innerStyles={{ mb: 1 }} />
                        <InputField name="holiday_to_date" label="Holiday End Date" placeholder="Holiday End Date" type="date" value={formData.holiday_to_date} onChange={(e) => setFormData({ ...formData, holiday_to_date: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField name="holiday_type" label="Holiday Type" placeholder="Holiday Type" type="text" value={formData.holiday_type} onChange={(e) => setFormData({ ...formData, holiday_type: e.target.value })} innerStyles={{ mb: 1 }} />
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <InputLabel id="allowed_to" style={{ width: '25%' }} >Allowed To:</InputLabel>
                            <Select
                                sx={{ width: '84%' }}
                                value={formData.allowed_to}
                                label="type"
                                name='allowed_to'
                                onChange={handleChange} >
                                <MenuItem value="Christianity">Christianity</MenuItem>
                                <MenuItem value="Islam">Islam</MenuItem>
                                <MenuItem value="Hinduism">Hinduism</MenuItem>
                                <MenuItem value="Buddhism">Buddhism</MenuItem>
                                <MenuItem value="Judaism">Judaism</MenuItem>
                                <MenuItem value="All">All</MenuItem>
                            </Select>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            {/* table  */}
            {loading && <p>Loading...</p>}
            {refreshError && <p>Error while refreshing: {refreshError.message}</p>}
            {queryError && <p>Error while querying: {queryError.message}</p>}
            {data && (
                <MyTableContainer
                    columns={columns}
                    data={data.results}
                    isAddNewButton={true}
                    customPageSize={10}
                    RowFilterWith="id"
                />
            )}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '350px', p: 2 }}>
                    <Typography variant="h6" color="initial" >Do you want to update your data.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    )
}

export default Holidays;
