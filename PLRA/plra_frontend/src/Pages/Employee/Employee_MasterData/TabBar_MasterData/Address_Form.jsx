import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, InputField, Multi_Dropdown, HeadingBar, DialogBox } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import SimpleDropdown from '../../../../Components/Common/SimpleDropDown'
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard";
import { employeeDistrictHeader, employeeTehsilHeader, employeeCityHeader } from '../../../../Data/EmployeeMasterData/EmployeeMasterData'
import {
    useGetAddressQuery, usePostAddressMutation, useUpdateAddressMutation,
    useGetEmployeDistrictQuery, useGetEmployeeTehsilQuery, useGetEmployeeCityQuery, useDeleteAddressMutation
} from '../../../../Features/API/EmployeeMasterDataAPI'
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'


const Address = () => {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams()
    const goBack = () => {
        window.history.go(-1);
    };

    const Purpose_Single_Dropdown = [{ id: '1', value: 'Home', label: 'Home' },
    { id: '2', value: 'Job', label: 'Job' },
    { id: '3', value: 'Other', label: 'Other' },
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
        name: null, address: null, purpose: null, is_primary: false, district: null, employee: parseInt(id), tehsil: null, city: null,
    });

    //Queries
    const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetAddressQuery(id);
    const [postAddress] = usePostAddressMutation();
    const [updateAddress] = useUpdateAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();
    const { data: district_data, isLoading: district_loading, isError: district_refreshError, error: district_queryError, refetch: district_refetch } = useGetEmployeDistrictQuery();
    const { data: tehsil_data, isLoading: tehsil_loading, isError: tehsil_refreshError, error: tehsil_queryError, refetch: tehsil_refetch } = useGetEmployeeTehsilQuery();
    const { data: city_data, isLoading: city_loading, isError: city_refreshError, error: city_queryError, refetch: city_refetch } = useGetEmployeeCityQuery();

    //Functions

    useEffect(() => {
        refetch();
        district_refetch();
        tehsil_refetch();
        city_refetch();
    }, [])

    const districtClickHandler = (district_data) => {
        setDistrictData(district_data.district_name);
        setFormData((prevFormData) => ({
            ...prevFormData,
            district: district_data?.id,
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
        if (isRowSelected) {
            try {
                const res = await updateAddress({ selectRowID, updateAddressData: formData });
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
                showToast(`${err.message}`, "error");
            }
        }


        else {
            const res = await postAddress(formData);
            try {
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
                } else {
                    refetch();
                    showToast(`Record created Successfully`, "success");

                    resetForm();
                }
            } catch (err) {
                showToast(`${err.message}`, "error");
            }
        }
    };

    const handleDeleteData = async (e) => {
        try {
            // call api
            const res = await deleteAddress({ selectRowID });
            // error handling
            if (res?.error && res.error.status) {
                setFormErrors(res?.error)
                return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
            }
            else {
                return (
                    refetch(),
                    showToast(`Record Deleted Successfully`, "success"),
                    resetForm(),
                    setIsRowSelected(false)
                )
            }
        } catch (err) {
            return showToast(`${err.message}`, "error");
        }
    }

    const handleBoxClick = (record, index) => {
        console.log("Clicked record:", record);
        setSelectedRowID(record?.e_a_rec_id);
        setActiveBoxIndex(index);
        setIsRowSelected(true);
        setDistrictData(record?.district?.district_name);
        setTehsilData(record?.tehsil?.tehsil_name);
        setCityData(record?.city?.city_name);
        setfieldsDisable(true);
        setFormData({
            employee: record.employee,
            name: record.name,
            address: record.address,
            purpose: record.purpose,
            is_primary: record.is_primary,
            district: record.district?.id,
            tehsil: record.tehsil?.id,
            city: record.city?.c_rec_id,
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
        setFormErrors({});
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
                        {data && data?.results && data?.results?.length > 0 ? (
                            data?.results.map((record, index) => (
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
                    <Grid item xs={12} >
                        <Grid item xs={12} sx={{ pr: 1, mt: -2, }}>
                            <HeadingBar title="Employee Address" />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <form action=' ' onSubmit={handlePostData} >
                            <Grid container columnSpacing={6} sx={{ px: 2 }}>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <InputField name="name" label="Name" disabled={disableFields} placeholder="Enter Name" type="text" value={formData.name} onChange={(e) => handleInputChange(e, "name")} mandatory fullWidth error={formErrors?.data?.name} />
                                    <InputField name="address" label="Address" disabled={disableFields} placeholder="Enter Address" type="text" value={formData.address} onChange={(e) => handleInputChange(e, "address")} mandatory fullWidth error={formErrors?.data?.address} />
                                    <SimpleDropdown label="Purpose" value={formData.purpose} mandatory onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} options={Purpose_Single_Dropdown} disabled={disableFields} error={formErrors?.data?.purpose} helperText={formErrors?.data?.purpose} />
                                </Grid>
                                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                    <div>
                                        <InputField name="district" label="District" disabled={disableFields} placeholder="Select District" value={districtData} isShowIcon={true} onClick={() => setDistrictDialog(true)} mandatory error={formErrors?.data?.district} />
                                        <Multi_Dropdown RowFilterWith={"id"} isOpen={districtDialog} tableHeader={employeeDistrictHeader} tableRows={district_data && district_data.results} onSelect={districtClickHandler} onClose={() => setDistrictDialog(false)} />
                                    </div>
                                    <div>
                                        <InputField name="tehsil_name" label="Tehsil" disabled={disableFields} mandatory placeholder="Select Tehsil" value={tehsilData} isShowIcon={true} onClick={() => setTehsilDialog(true)} mandator error={formErrors?.data?.tehsil} />
                                        <Multi_Dropdown RowFilterWith={"id"} isOpen={tehsilDialog} tableHeader={employeeTehsilHeader} tableRows={tehsil_data && tehsil_data.results} onSelect={tehsilClickHandler} onClose={() => setTehsilDialog(false)} />
                                    </div>
                                    <div>
                                        <InputField name="city_name" label="City" disabled={disableFields} placeholder="Select City" value={cityData} isShowIcon={true} onClick={() => setCityDialog(true)} mandatory error={formErrors?.data?.city} />
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
                    <EmployeeFormDashboard userId={id} title="Processess" />
                </Grid>
            </Grid>
        </div >
    );
}

export default Address
