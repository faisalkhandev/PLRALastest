import React, { Fragment, useState } from 'react';
import { Typography, Grid, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Warning } from '../../../Assets/Icons';
import { Btn, InputField, MyTableContainer, Loader, ErrorHandler } from '../../../Components/index';
import { useDeleteHRCalendarYearMutation, useGetHRCalendarYearQuery, usePostHRCalendarYearMutation, useUpdateHRCalendarYearMutation } from '../../../Features/API/API';
import { toast } from 'react-toastify'
import '../../Styles.css';

const Add_HrCalendar_Year = () => {
    const theme = useTheme();

    //States
    const [formData, setFormData] = useState({ hr_celander_starting_date: '', hr_celander_ending_date: '', hr_year: '' });
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setdeleteDialog] = useState(false);



    // Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetHRCalendarYearQuery();
    const [postHRCalendarYear] = usePostHRCalendarYearMutation();
    const [updateHRCalendarYear] = useUpdateHRCalendarYearMutation();
    const [deleteHRCalendarYear] = useDeleteHRCalendarYearMutation();


    // function
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const resetForm = () => {
        console.log("hiiiiiii");
        setFormData({ ...formData, hr_celander_starting_date: '', hr_celander_ending_date: '', hr_year: '' })
        setIsRowSelected(false)
    }

    const handleRowClick = (event) => {
        setIsRowSelected(true)
        setFormData({ hr_celander_starting_date: event.row.hr_celander_starting_date, hr_celander_ending_date: event.row.hr_celander_ending_date, hr_year: event.row.hr_year })
        setSelectedRowID(event.row.id)
    };
    const handleDelete = async (e) => {
        try {
            const res = await deleteHRCalendarYear({ selectRowID })
            if (res.error) {
                if (res.error.status === 409) { toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 }) }
                else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
            } else {
                toast.success("HR Calender deleted.", { position: "top-center", autoClose: 3000 })
                setFormData({ t_id: '', t_name: '', district: '' })
                setDistrictData("")
                setIsRowSelected(false)
                refetch()
            }
        }
        catch (err) {
            console.error('Error creating Tehsil:', err);

        }

    }

    const handleDeleteDialog = () => {
        if (isRowSelected) {
            setdeleteDialog(true)
        }
        else {
            toast.error("Record not selected.", { position: "top-center", autoClose: 3000 });

        }
    }

    const handleSaveData = async (e) => {
        e.preventDefault();
        if (formData.hr_celander_starting_date == '' || formData.hr_celander_ending_date == '' || formData.hr_year == '') {
            toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
        }
        else {
            try {
                const res = await postHRCalendarYear(formData);
                if (res.error) {
                    if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
                    else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
                } else {
                    toast.success("Data create successfully.", { position: "top-center", autoClose: 3000 })
                    setFormData({
                        hr_celander_starting_date: '', hr_celander_ending_date: '', hr_year: '',
                    });
                    refetch();
                }
            } catch (err) {
                console.error('Error creating HR Calendar Year:', err);
            }
        }
    }

    const handleUpdateData = async (e) => {
        try {
            const res = await updateHRCalendarYear({ selectRowID, updateHRCalendarYearData: formData });
            if (res.error) {
                if (res.error.status === 400) { toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
                else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
            } else {
                toast.success("HR Celander Updated successfully.", { position: "top-center", autoClose: 3000 });
                setFormData({ hr_celander_starting_date: '', hr_celander_ending_date: '', hr_year: '' });
                setIsRowSelected(false)
                refetch();
            }
        } catch (err) {
            console.error('Error updating HR Celander:', err);
        }
    }

    const columns = [
        {
            field: 'id', headerName: 'HR Calendar ID', flex: 1,
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
            field: 'hr_celander_starting_date',
            headerName: 'Starting Date',
            flex: 1,
        },
        {
            field: 'hr_celander_ending_date',
            headerName: 'Ending Date',
            flex: 1,
        },
        {
            field: 'hr_year',
            headerName: 'Hr Year',
            flex: 1,
        },
    ];


    return (
        <Fragment >
            <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'center', color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Add Hr Calendar
            </Typography>
            <Box sx={{ width: "100%", display: "flex", mb: 1 }}>
                <Btn type="reset" onClick={resetForm} outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
                <Btn onClick={isRowSelected ? () => setEditDialog(true) : handleSaveData} type="save" />
                <Btn type="delete" onClick={handleDeleteDialog} />
            </Box>
            {/* form  */}
            <form action="">
                <Grid container spacing={{ xs: 1, md: 4 }} sx={{ mb: 4 }} >
                    <Grid item xs={12} md={6} >
                        <InputField name="hr_celander_starting_date" label="Starting Date" placeholder="Starting Date" type="date" value={formData.hr_celander_starting_date} onChange={(e) => setFormData({ ...formData, hr_celander_starting_date: e.target.value })} innerStyles={{ mb: 1 }} />
                        <InputField name="hr_year" label="Hr Year" placeholder="Hr Year" type="number" value={formData.hr_year} onChange={(e) => setFormData({ ...formData, hr_year: e.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField name="hr_celander_ending_date" label="Ending Date Date" placeholder="Ending Date" type="date" value={formData.hr_celander_ending_date} onChange={(e) => setFormData({ ...formData, hr_celander_ending_date: e.target.value })} innerStyles={{ mb: 1 }} />
                    </Grid>
                </Grid>
            </form>
            {/* table  */}
            {loading ? (
                <Loader placement={{ marginTop: '-100px' }} />
            ) : (
                <>
                    {refreshError ? (<ErrorHandler online={navigator.onLine} />)
                        : (
                            data && data?.results ? (
                                <MyTableContainer
                                    columns={columns}
                                    data={data.results}
                                    isAddNewButton={true}
                                    customPageSize={10}
                                    RowFilterWith="id"
                                    minHeight={'calc(100vh - 370px)'}
                                    onRowClick={handleRowClick}
                                />
                            ) : null
                        )}
                </>
            )}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '350px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} > <Warning />Do you want to update your data.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleUpdateData(); setEditDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setEditDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
            <Dialog open={deleteDialog} onClose={() => setdeleteDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '350px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }} > <Warning />Do you want to delete your data.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleDelete(); setdeleteDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setdeleteDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    )
}
export default Add_HrCalendar_Year;
