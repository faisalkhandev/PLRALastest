import React, { useState } from 'react'
import { Box, Typography, Grid, Switch, Dialog } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, HeadingBar, CheckBoxField } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import SimpleDropdown from '../../../../Components/Common/SimpleDropDown'
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard";
import { Warning } from '../../../../Assets/Icons/index.jsx'
import { employeeDistrictHeader, employeeTehsilHeader, employeeCityHeader } from '../../../../Data/EmployeeMasterData/EmployeeMasterData'
import {
    useGetAddressQuery, usePostAddressMutation, useUpdateAddressMutation,
    useGetEmployeDistrictQuery, useGetEmployeeTehsilQuery, useGetEmployeeCityQuery, useDeleteAddressMutation
} from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'


const Address = () => {
    const theme = useTheme();
    const { id } = useParams()
    const goBack = () => {
        window.history.go(-1);
    };

    const Purpose_Single_Dropdown = [{
        id: '1',
        value: 'Home',
        label: 'Home'
    },
    {
        id: '2',
        value: 'Job',
        label: 'Job'
    },
    {
        id: '3',
        value: 'Other',
        label: 'Other'
    },
    ]

    //States
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [disableFields, setfieldsDisable] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null)
    const [districtData, setDistrictData] = useState("");
    const [districtDialog, setDistrictDialog] = useState(false);
    const [tehsilData, setTehsilData] = useState("");
    const [tehsilDialog, setTehsilDialog] = useState(false);
    const [cityData, setCityData] = useState("");
    const [cityDialog, setCityDialog] = useState(false);
    const [formData, setFormData] = useState({
        name: '', address: '', purpose: '', is_primary: false, district: '', employee: parseInt(id), tehsil: '', city: '',
    });

    //Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGetAddressQuery(id);
    const [postAddress] = usePostAddressMutation();
    const [updateAddress] = useUpdateAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();
    const { data: district_data, isLoading: district_loading, isError: district_refreshError, error: district_queryError, district_refetch } = useGetEmployeDistrictQuery();
    const { data: tehsil_data, isLoading: tehsil_loading, isError: tehsil_refreshError, error: tehsil_queryError, tehsil_refetch } = useGetEmployeeTehsilQuery();
    const { data: city_data, isLoading: city_loading, isError: city_refreshError, error: city_queryError, city_refetch } = useGetEmployeeCityQuery();

    //Functions
    const districtClickHandler = (district_data) => {
        setDistrictData(district_data.district_name);
        setFormData((prevFormData) => ({
            ...prevFormData,
            district: district_data.id,
        }));
        setDistrictDialog(false);
    };

    const tehsilClickHandler = (tehsil_data) => {
        console.log(tehsil_data);
        setTehsilData(tehsil_data.tehsil_name);
        setFormData((prevFormData) => ({
            ...prevFormData,
            tehsil: tehsil_data.id,
        }));
        setTehsilDialog(false);
    };

    const cityClickHandler = (city_data) => {
        setCityData(city_data.city_name);
        setFormData((prevFormData) => ({
            ...prevFormData,
            city: city_data.c_rec_id,
        }));
        setCityDialog(false);
    };

    //post method for new
    const handlePostData = async (e) => {
        e.preventDefault();
        try {
            if (isRowSelected) {
                const res = await updateAddress({ selectRowID, updateAddressData: formData });
                if (formData.name === "" || formData.district === "" || formData.address === "" || formData.tehsil === "" || formData.city === "" || formData.purpose === "") {
                    toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 });
                }
                else if (res.error) {
                    if (res.error.status === 400) {
                        toast.error("Record not updated.", { position: "top-center", autoClose: 3000 });
                    }
                    else {
                        refetch();
                        toast.success("Record updated successfully.", { position: "top-center", autoClose: 3000 });
                        resetForm();
                    }
                } else {
                    toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
                }
            }


            else {
                if (formData.name === "" || formData.district === "" || formData.address === "" || formData.tehsil === "" || formData.city === "" || formData.purpose === "") {
                    toast.error("Mandatory field's should not be empty.", { position: "top-center", autoClose: 3000 });
                } else {
                    const res = await postAddress(formData);
                    if (res.error) {
                        if (res.error.status === 400) {
                            toast.error("Record not created.", { position: "top-center", autoClose: 3000 });
                        } else {
                            refetch();
                            toast.success("Record created.", { position: "top-center", autoClose: 3000 });
                            resetForm();
                        }
                    } else {
                        toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 });
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteAddress({ selectRowID });
            // error handling
            if (res.error) {
                if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
                else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
                else {
                    return (
                        toast.success("Record Deleted successfully.", { position: "top-center", autoClose: 3000 }),
                        refetch(),
                        resetForm(),
                        setIsRowSelected(false)
                    )
                }
            }
            toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 })
        } catch (err) {
            console.error('Error Deleting Record:', err);
            toast.error(err.message, { position: "top-center", autoClose: 3000 });
        }
    }

    const handleBoxClick = (record, index) => {
        setSelectedRowID(record.e_a_rec_id);
        setActiveBoxIndex(index);
        setIsRowSelected(true);
        setDistrictData(record.district.district_name);
        setTehsilData(record.tehsil.tehsil_name);
        setCityData(record.city.city_name);
        setfieldsDisable(true);
        setFormData({
            employee: record.employee,
            name: record.name,
            address: record.address,
            purpose: record.purpose,
            is_primary: record.is_primary,
            district: record.district.id,
            tehsil: record.tehsil.id,
            city: record.city.c_rec_id,
        });
    };



    const handleInputChange = (event, fieldName) => {
        setFormData({ ...formData, [fieldName]: event.target.value });
    };

    const handleToggleChange = (event) => {
        const { name, checked } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: checked }));
    };

    const resetForm = () => {
        setSelectedRowID(null);
        setIsRowSelected(false);
        setActiveBoxIndex(null);
        setfieldsDisable(false);
        setDistrictData('');
        setTehsilData('');
        setCityData('');
        setFormData({
            name: '',
            address: '',
            purpose: '',
            is_primary: false,
            district: '',
            employee: id,
            tehsil: '',
            city: '',
        });
    };

    return (
        <div className='customBox'>
            <Box className='headContainer' >
                <Breadcrumb title="Address" breadcrumbItem="Employee / Address" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type='new' onClick={() => resetForm()} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
                    {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
                </Box>
            </Box>
            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2}>
                    <Box className="form_sidebar">
                        {data && data.results && data.results.length > 0 ? (
                            data.results.map((record, index) => (
                                <Box key={record.e_a_rec_id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                                    <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.name}</Typography>
                                    <Typography variant="body2" color="initial">{record.purpose}</Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Address</Typography>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={7} className="employee_form_border">
                    <Grid item xs={12}><HeadingBar title="Employee_Address" />
                    </Grid>
                    <Grid item xs={12} >
                        <form action=' ' onSubmit={handlePostData} >
                            <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="name" label="Name" disabled={disableFields} placeholder="Enter Name" type="text" value={formData.name} onChange={(e) => handleInputChange(e, "name")} mandatory fullWidth />
                                    <InputField name="address" label="Address" disabled={disableFields} placeholder="Enter Address" type="text" value={formData.address} onChange={(e) => handleInputChange(e, "address")} mandatory fullWidth />
                                    <SimpleDropdown
                                        label="Purpose"
                                        value={formData.purpose}
                                        mandatory
                                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                        options={Purpose_Single_Dropdown}
                                        disabled={disableFields}

                                    />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <div>
                                        <InputField name="district" label="District" disabled={disableFields} placeholder="Select District" value={districtData} isShowIcon={true} onClick={() => setDistrictDialog(true)} mandatory />
                                        <Multi_Dropdown RowFilterWith={"id"} isOpen={districtDialog} tableHeader={employeeDistrictHeader} tableRows={district_data && district_data.results} onSelect={districtClickHandler} onClose={() => setDistrictDialog(false)} />
                                    </div>
                                    <div>
                                        <InputField name="tehsil_name" label="Tehsil" disabled={disableFields} mandatory placeholder="Select Tehsil" value={tehsilData} isShowIcon={true} onClick={() => setTehsilDialog(true)} mandator />
                                        <Multi_Dropdown RowFilterWith={"id"} isOpen={tehsilDialog} tableHeader={employeeTehsilHeader} tableRows={tehsil_data && tehsil_data.results} onSelect={tehsilClickHandler} onClose={() => setTehsilDialog(false)} />
                                    </div>
                                    <div>
                                        <InputField name="city_name" label="City" disabled={disableFields} placeholder="Select City" value={cityData} isShowIcon={true} onClick={() => setCityDialog(true)} mandatory />
                                        <Multi_Dropdown RowFilterWith={"c_rec_id"} isOpen={cityDialog} tableHeader={employeeCityHeader} tableRows={city_data && city_data.results} onSelect={cityClickHandler} onClose={() => setCityDialog(false)} />
                                    </div>
                                    <Grid container columnSpacing={2}>
                                        <Grid item xs={6}>
                                            <Typography sx={{ display: 'flex' }}  >Is Primary:<Switch sx={{ ml: 10 }} disabled={disableFields} size="small" name="is_primary" value={formData.is_primary} checked={formData.is_primary} onChange={handleToggleChange} /></Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3}>
                    <EmployeeFormDashboard />
                </Grid>
            </Grid>
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
                <Box sx={{ minWidth: '400px', p: 2 }}>
                    <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure to delete record.</Typography>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                        <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: '2px solid ${theme.palette.primary.light}', borderRadius: "8px" }} />
                        <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: '2px solid ${theme.palette.error.light}', borderRadius: "8px" }} />
                    </Box>
                </Box>
            </Dialog>
        </div >
    );
}

export default Address
