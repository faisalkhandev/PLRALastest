import React, { Fragment, useState, useEffect } from 'react';
import { Typography, Box, Grid, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, InputField } from '../../../Components/index';
import { MyTableContainer } from '../../../Components/index';
import {
    useNOCTypeQuery,
    useCreateNOCTypeMutation,
    useUpdateNOCTypeMutation,
    useDeleteNOCTypeMutation,
} from '../../../Features/API/NocAPI';
import { toast } from 'react-toastify';
import { Warning } from '../../../Assets/Icons';
import '../../Styles.css';

const Noc_Type = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({ noc_rec_id: null, noc_type: '' });
    const [selectRowID, setSelectedRowID] = useState(null);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    // API
    const { data, isLoading, isError, error, refetch } = useNOCTypeQuery();
    const [createNOC] = useCreateNOCTypeMutation();
    const [updateNOC] = useUpdateNOCTypeMutation();
    const [deleteNOC] = useDeleteNOCTypeMutation();

    // Get data on start
    useEffect(() => { refetch() }, []);

    const resetForm = () => {
        setIsRowSelected(false);
        setFormData({ noc_rec_id: '', noc_type: '' });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRowClick = (event) => {
        setIsRowSelected(true);
        setFormData({
            noc_rec_id: event.row.noc_rec_id,
            noc_type: event.row.noc_type
        });
        setSelectedRowID(event.row.noc_rec_id);
    };

    const handleSave = async () => {
        if (isRowSelected) {
            // update record 
            const res = await updateNOC({ ID: selectRowID, NOC_Data: formData }).unwrap();
            if (res.error) {
                if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record updation failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            toast.success("Record Updated successfully.", { position: "top-center", autoClose: 3000 });
        }
        else {
            // create new record 
            const res = await createNOC(formData).unwrap();
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 400) { return toast.error("ID alredy exist.", { position: "top-center", autoClose: 3000 }) }
                else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            toast.success("Record created successfully.", { position: "top-center", autoClose: 3000 })
        }
        refetch();
        resetForm();
    };

    const handleDelete = async () => {
        if (selectRowID) {
            const res = await deleteNOC(selectRowID);
            console.log(res);
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
            }
            else {
                toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 1500 });
                refetch();
                resetForm();
            }
        }
    };

    const handleDeleteDiaglog = async () => {
        if (isRowSelected) {
            setDeleteDialog(true);
        } else {
            toast.warn("Please select a record to delete.", { position: "top-center", autoClose: 3000 });
        }
    };


    const columns = [
        {
            field: 'noc_rec_id',
            headerName: 'NOC ID',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <span onClick={onView} className='table_first_column'>
                        {params.value}
                    </span>
                );
            },
        },
        {
            field: 'noc_type',
            headerName: 'NOC Type Name',
            minWidth: 200,
            renderCell: (params) => {
                const onView = () => {
                    handleRowClick(params);
                };
                return (
                    <span onClick={onView} className='table_first_column'>
                        {params.value}
                    </span>
                );
            },
        },
    ];

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, alignItems: 'center' }}>
                <Typography variant='h4' sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>NOC Type</Typography>
                <Btn type='reset' onClick={resetForm} />
                <Btn type='save' onClick={handleSave} />
                <Btn type='delete' onClick={handleDeleteDiaglog} />
            </Box>
            <form action=''>
                <Grid container spacing={4} sx={{ mt: 1 }}>
                    {/* Assuming 'noc_rec_id' is not editable */}
                    <Grid item xs={12} md={6}>
                        <InputField name='noc_rec_id' label='NOC ID' outerStyles={{}} placeholder='Enter NOC Type' type='text' mandatory={true} value={formData.noc_rec_id} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField name='noc_type' label='NOC Type Name' outerStyles={{}} placeholder='Enter NOC Type' type='text' mandatory={true} value={formData.noc_type} onChange={handleChange} />
                    </Grid>
                </Grid>
            </form>

            <Box sx={{ mt: 6 }}>
                {data && (
                    <MyTableContainer
                        columns={columns}
                        data={data.results}
                        isAddNewButton={true}
                        customPageSize={10}
                        RowFilterWith='noc_rec_id'
                        onRowClick={handleRowClick}
                        minHeight={'calc(100vh - 350px)'}
                    />
                )}
            </Box>


            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '400px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleDelete(); setDeleteDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
        </Fragment>
    );
};

export default Noc_Type;
