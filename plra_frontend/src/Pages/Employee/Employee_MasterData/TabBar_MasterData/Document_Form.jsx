import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, InputField, HeadingBar, DialogBox } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { toast } from 'react-toastify'
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx'
import { useTheme } from '@emotion/react'
import {
    useGetPersonalDocumentsQuery, usePostPersonalDocumentsMutation, useUpdatePersonalDocumentsMutation, useDeletePersonalDocumentsMutation
} from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'


const Document_Form = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams()
    const goBack = () => {
        window.history.go(-1);
    };

    //States
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [selectedImagePaths, setSelectedImagePaths] = useState([]);
    const [formData, setFormData] = useState({
        document_name: "",
        document_type: "",
        attachment: null,
        issuance_authority: "",
        verified: false,
        renewal_require: false,
        effective_date: null,
        employee: id,
        expiration_date: null,

    });
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)
    const [isattachmentselected, setisattachmentselected] = useState(false)



    //Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetPersonalDocumentsQuery(id);
    const [postPersonalDocuments] = usePostPersonalDocumentsMutation();
    const [updatePersonalDocuments] = useUpdatePersonalDocumentsMutation();
    const [deletePersonalDocuments] = useDeletePersonalDocumentsMutation();

    //Functions
    useEffect(() => {
        refetch();
    }, [])

    const handleBoxClick = (record) => {
        setActiveTab(true);
        setIsRowSelected(true);
        setfieldsDisable(true)
        setSelectedRowID(record.personal_document_rec_id);
        setActiveBoxIndex(record);
        setFormData({
            ...formData,
            document_name: record.document_name,
            document_type: record.document_type,
            issuance_authority: record.issuance_authority,
            verified: record.verified,
            renewal_require: record.renewal_require,
            effective_date: record.effective_date,
            expiration_date: record.expiration_date,
            attachment: record.attachment
        });
        setfieldsDisable(true)
        setIsVerified(record.verified);
    };
    // const handleDeleteImage = (index) => {
    //     const updatedPaths = selectedImagePaths.filter((_, i) => i !== index);
    //     setSelectedImagePaths(updatedPaths);
    // };
    // const downloadImage = (imageUrl, imageName) => {
    //     const anchor = document.createElement("a");
    //     anchor.download = imageName;
    //     anchor.href = imageUrl;
    //     anchor.click();
    // };
    const handleFileChange = (e) => {
        const fieldName = e.target.name; // Get the name of the input field
        console.log(e.target.name, e.target.file);

        if (e.target.files[0]) {
            const fileSize = e.target.files[0].size / 1024;
            console.log(fileSize); // File size in KB
            if (fileSize <= 1000) {
                setFormData((prevData) => ({
                    ...prevData,
                    [fieldName]: e.target.files[0],
                }));
                setisattachmentselected(true)
                const selectedFilename = e.target.files[0].name; // Get the name of the selected file
                const selectedPath = URL.createObjectURL(e.target.files[0]); // Create URL for the selected file

                // Create an object with URL and filename
                const fileObject = { url: selectedPath, name: selectedFilename };

                event.target.value = null;
                setSelectedImagePaths(prevPaths => [...prevPaths, fileObject]);
            }
            else {
                toast.error("Image size exceeds 100KB", { position: "top-center", autoClose: 3000 })
            }
        }

    };
    const handleInputChange = (event, fieldName) => {
        setFormData({ ...formData, [fieldName]: event.target.value, });
    };

    const handleToggleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
    };


    const handleAddNewDocument = async (e) => {
        e.preventDefault();
        if (isRowSelected) {
            try {
                let formD = new FormData();
                formD.append('document_type', formData.document_type);
                formD.append('employee', formData.employee);
                formD.append("document_name", formData.document_name);
                formD.append("issuance_authority", formData.issuance_authority);
                formD.append("effective_date", formData.effective_date);
                formD.append("expiration_date", formData.expiration_date);
                if (formData.renewal_require == true) {

                    formD.append("renewal_date", formData.renewal_date);
                }
                if (typeof formData.attachment !== "undefined" && formData.attachment instanceof File) {
                    formD.append("attachment", formData.attachment);
                }
                formD.append("verified", formData.verified);
                // if()
                const res = await updatePersonalDocuments({ selectRowID, formD })
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                }
                else {
                    refetch();
                    showToast(`Record updated Successfully`, "success");
                    resetForm();
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
        else {


            try {

                e.preventDefault();
                let formD = new FormData();
                formD.append('document_type', formData.document_type);
                formD.append('employee', formData.employee);
                formD.append("document_name", formData.document_name);
                formD.append("issuance_authority", formData.issuance_authority);
                formD.append("effective_date", formData.effective_date);
                if (formData.expiration_date != "") {

                    formD.append("expiration_date", formData.expiration_date);
                }
                formD.append("renewal_require", formData.renewal_require);
                if (formData.renewal_require == true) {

                    formD.append("renewal_date", formData.renewal_date);
                }
                if (formData.attachment != "") {

                    formD.append("attachment", formData.attachment);
                }
                formD.append("verified", formData.verified);

                const res = await postPersonalDocuments(formD);
                if (res?.error && res.error.status) {
                    if (res?.error?.status === 422 && res?.error?.data?.code) {
                        return (showToast(`${res?.error?.data?.detail}`, "error"));
                    }
                    if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
                        return showToast(`${res?.error?.data?.non_field_errors}`, "error");
                    }
                    // Handle API errors here
                    setFormErrors(res?.error)
                    return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
                }
                else {
                    refetch();
                    showToast(`Record created Successfully`, "success");
                    resetForm();
                    setisattachmentselected(false);
                }
            } catch (err) {
                return showToast(`${err.message}`, "error");
            }
        }
    }


    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deletePersonalDocuments({ selectRowID });
            // error handling 
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            // success call 
            showToast(`Record Deleted Successfully`, "success");
            setFormData({
                document_name: '', document_type: '', attachment: null, issuance_authority: '', verified: false, renewal_require: false, effective_date: '', employee: id, expiration_date: '',
                renewal_date: '',
            })
            refetch();
            resetForm();
            setIsRowSelected(false)
            setfieldsDisable(false)

        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    }

    const resetForm = () => {
        setFormErrors({});
        setActiveTab(false);
        setSelectedRowID(null);
        setIsRowSelected(false)
        setActiveBoxIndex(null);
        setisattachmentselected(false)
        setfieldsDisable(false)
        setFormData({
            document_name: '', document_type: '', attachment: null, issuance_authority: '', verified: false, renewal_require: false, effective_date: '', employee: id, expiration_date: '',
            renewal_date: '',
        });
    };


    return (
        <div className='customBox'>
            <Box className="headContainer">
                <Breadcrumb title="Personal Documents" breadcrumbItem="Employee / Personal Document" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="new" onClick={resetForm} />

                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handleAddNewDocument} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
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
                </Box>
            </Box>
            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {data && data.results && data.results.length > 0 ? (
                            data.results.map((record) => (
                                <Box key={record.personal_document_rec_id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === record ? 'Box_Class' : ''} onClick={() => handleBoxClick(record)}>
                                    <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.document_name}</Typography>
                                    <Typography variant="body2" color="initial">{record.issuance_authority}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Personal Documents</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2 }}>
                            <HeadingBar title="Document Information" />
                        </Grid>
                        <form action=' '>

                            <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2, px: 2 }}>
                                    <InputField name="document_name" disabled={disableFields} label="Document Name" placeholder="Enter Document Name" type="text" fullWidth value={formData.document_name} onChange={(e) => handleInputChange(e, "document_name")} mandatory error={formErrors?.data?.document_name} />
                                    <InputField name="document_type" disabled={disableFields} label="Document Type" placeholder="Enter Document Type" type="text" fullWidth value={formData.document_type} onChange={(e) => handleInputChange(e, "document_type")} mandatory error={formErrors?.data?.document_type} />
                                    <InputField name="issuance_authority" disabled={disableFields} label="Issuance Authority" placeholder="Enter Issuance Authority" type="text" fullWidth value={formData.issuance_authority} onChange={(e) => handleInputChange(e, "issuance_authority")} mandatory error={formErrors?.data?.issuance_authority} />
                                    <Box>
                                        <Typography sx={{ fontSize: '14px' }}  > Verified:
                                            <Switch sx={{ ml: 11 }} size="small" name="verified" disabled={disableFields} value={formData.verified} checked={formData.verified} onChange={handleToggleChange} /></Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2, px: 2 }}>
                                    <InputField name="effective_date" label="Effective Date" disabled={disableFields} placeholder="Enter Effective Date" type="date" fullWidth value={formData.effective_date} onChange={(e) => handleInputChange(e, "effective_date")} mandatory error={formErrors?.data?.effective_date} />
                                    <InputField name="expiration_date" label="Expiration Date" disabled={disableFields} placeholder="Enter Expiration Date" type="date" fullWidth value={formData.expiration_date} onChange={(e) => handleInputChange(e, "expiration_date")} error={formErrors?.data?.expiration_date} />
                                    {formData.renewal_require && (
                                        <InputField name="renewal_date" label="Renewal Date" mandatory placeholder="Enter Renewal Date" type="date" disabled={disableFields} fullWidth value={formData.renewal_date} onChange={(e) => handleInputChange(e, "renewal_date")} error={formErrors?.data?.renewal_date} />)}

                                    <Box sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }} >
                                        <Typography sx={{ display: 'flex', fontSize: '14px', }}  > Renewal Required:
                                            <Switch sx={{ ml: 3 }} size="small" name="renewal_require" disabled={disableFields} value={formData.renewal_require} checked={formData.renewal_require} onChange={handleToggleChange} /></Typography>
                                    </Box>

                                </Grid>


                            </Grid>
                            <Grid item xs={12} md={6} ><HeadingBar title="Attachment's" />
                                <Grid sx={{ px: 2 }}>
                                    <InputField name="attachment" mandatory={true} label="Attachment" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} error={formErrors?.data?.attachment} />
                                    <Box
                                        sx={{
                                            ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                                            border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                                        }}
                                    >
                                        {formData.attachment && (
                                            <img
                                                src={isattachmentselected && !isRowSelected ? URL.createObjectURL(formData.attachment) : formData.attachment}
                                                alt="Attachments"
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                                            />
                                        )}
                                    </Box>

                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard userId={id} title="Processess" />
                </Grid>
            </Grid>
        </div>
    )
};

export default Document_Form