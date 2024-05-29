import React, { Fragment, useState, useEffect } from 'react';
import { Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, DialogBox, InputField } from '../../../Components/index';
import { MyTableContainer } from '../../../Components/index';
import {
    useNOCTypeQuery,
    useCreateNOCTypeMutation,
    useUpdateNOCTypeMutation,
    useDeleteNOCTypeMutation,
} from '../../../Features/API/NocAPI';
import '../../Styles.css';
import StatusCodeHandler from '../../../Components/Common/StatusCodeHandler';
import { showToast } from '../../../Components/shared/Toast_Card';


const Noc_Type = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
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

    const resetForm = () => {
        setFormErrors({});
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
            const res = await updateNOC({ ID: selectRowID, NOC_Data: formData })
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            showToast(`Record updated Successfully`, "success");
            resetForm();
        }
        else {
            // create new record 
            const res = await createNOC(formData)
            if (res?.error && res?.error?.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            showToast(`Record created Successfully`, "success");
            resetForm();
        }
    };

    const handleDelete = async () => {
        if (selectRowID) {
            const res = await deleteNOC(selectRowID);
            if (res?.error && res?.error?.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            else {
                showToast(`Record Deleted Successfully`, "success");
                resetForm();
                refetch();
            }
        }
    };

    const handleDeleteDiaglog = async () => {
        if (isRowSelected) {
            setDeleteDialog(true);
        } else {
            return showToast('Record not Selected', 'error');
        }
    };

    useEffect(() => { refetch() }, [handleDelete]);

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
                {
                    deleteDialog ?
                        <DialogBox
                            open={deleteDialog}
                            onClose={() => setDeleteDialog(false)}
                            closeClick={() => setDeleteDialog(false)}
                            sureClick={() => { handleDelete(); setDeleteDialog(false); }}
                            title={"Are you sure you want to delete the record?"}
                        /> : ''
                }
            </Box>
            <form action=''>
                <Grid container spacing={4} sx={{ mt: 1 }}>
                    {/* Assuming 'noc_rec_id' is not editable */}
                    <Grid item xs={12} md={6}>
                        <InputField name='noc_rec_id' label='NOC ID' outerStyles={{}} placeholder='Enter NOC Type' type='text' mandatory={true} value={formData.noc_rec_id} onChange={handleChange} error={formErrors?.data?.noc_rec_id} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InputField name='noc_type' label='NOC Type Name' outerStyles={{}} placeholder='Enter NOC Type' type='text' mandatory={true} value={formData.noc_type} onChange={handleChange} error={formErrors?.data?.noc_type} />
                    </Grid>
                </Grid>
            </form>

            <Box sx={{ mt: 6 }}>
                {data && (
                    <MyTableContainer
                        columns={columns}
                        data={data.results}
                        isAddNewButton={true}
                        customPageSize={9}
                        RowFilterWith='noc_rec_id'
                        onRowClick={handleRowClick}
                        minHeight={'calc(100vh - 370px)'}
                    />
                )}
            </Box>
        </Fragment>
    );
};

export default Noc_Type;
