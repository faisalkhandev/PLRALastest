import React, { Fragment, useState, useLayoutEffect, useEffect } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import { Btn, InputField } from '../../Components/index';
import { useTheme } from '@emotion/react';
import SimpleDropdown from "../../Components/Common/SimpleDropDown.jsx";
import { toast } from 'react-toastify';
import {
    useGetDistanceQuery, useGetDisabilityQuery, useGetTenureQuery, useGetWedlockQuery,
    useUpdateDistanceMutation, useUpdateDisabilityMutation, useUpdateTenureMutation, useUpdateWedlockMutation,
} from '../../Features/API/Transfer.js';
import { showToast } from '../../Components/shared/Toast_Card.jsx';
import StatusCodeHandler from '../../Components/Common/StatusCodeHandler.jsx';

function Wedlock_Rating_Formula() {
    const theme = useTheme();
    const [formErrors, setFormErrors] = useState({});

    const [fieldDistanceDisable, setFieldsDistanceDisable] = useState(false);
    const [fieldTenureDisable, setFieldsTenureDisable] = useState(false);
    const [fieldWedlockDisable, setFieldsWedlockDisable] = useState(false);
    const [fieldDisabilityDisable, setFieldsDisabilityDisable] = useState(false);


    const { data: distanceData, refetch: distanceRefetch } = useGetDistanceQuery();
    const { data: tenureData, refetch: tenureRefetch } = useGetTenureQuery();
    const { data: disabilityData, refetch: disabilityRefetch } = useGetDisabilityQuery();
    const { data: wedlockData, refetch: wedlockRefetch } = useGetWedlockQuery();

    // Api

    const [updateDistanceData] = useUpdateDistanceMutation();
    const [updateWedlockData] = useUpdateWedlockMutation();
    const [updateDisabilityData] = useUpdateDisabilityMutation();
    const [updateTenureData] = useUpdateTenureMutation();

    const [formData, setFormData] = useState({
        Distance: {
            id: '',
            name: '',
            category: "",
            within_district_per_km_marks: "",
            within_district_max_marks: "",
            across_district_per_km_marks: "",
            across_district_max_marks: "",
            from_km: "",
            allow_district_fixed_marks: "",
            formula_type: "",
        },
        Tenure: {
            id: '',
            name: "",
            category: "",
            formula_type: "",
            minimum_tenure_months: "",
            total_tenure_months: "",
            max_marks: "",
            factor: "",
        },
        Wedlock: {
            id: '',
            name: "",
            category: "",
            formula_type: "",
            within_district_fixed_marks: "",
            across_district_fixed_marks: "",
            max_marks: "",
        },
        Disability: {
            id: '',
            name: "",
            category: "",
            formula_type: "",
            max_marks: ""
        },
    });

    const Category = [
        {
            id: '1',
            value: 'Open Merit',
            label: 'Open Merit'
        },
        {
            id: '2',
            value: 'Hardship',
            label: 'Hardship'
        },
    ]
    useLayoutEffect(() => {
        const fetchData = async () => {
            try {

                if (disabilityData && distanceData && wedlockData && tenureData) {

                    setFormData({
                        Distance: {
                            id: distanceData?.results[0]?.id,
                            name: distanceData?.results[0]?.name,
                            category: distanceData?.results[0]?.category,
                            within_district_per_km_marks: distanceData?.results[0]?.within_district_per_km_marks,
                            within_district_max_marks: distanceData?.results[0]?.within_district_max_marks,
                            across_district_per_km_marks: distanceData?.results[0]?.across_district_per_km_marks,
                            across_district_max_marks: distanceData?.results[0]?.across_district_max_marks,
                            from_km: distanceData?.results[0]?.from_km,
                            allow_district_fixed_marks: distanceData?.results[0]?.allow_district_fixed_marks,
                            formula_type: distanceData?.results[0]?.formula_type,
                        },
                        Tenure: {
                            id: tenureData?.results[0]?.id,
                            name: tenureData?.results[0]?.name,
                            category: tenureData?.results[0]?.category,
                            formula_type: tenureData?.results[0]?.formula_type,
                            minimum_tenure_months: tenureData?.results[0]?.minimum_tenure_months,
                            total_tenure_months: tenureData?.results[0]?.total_tenure_months,
                            max_marks: tenureData?.results[0]?.max_marks,
                            factor: tenureData?.results[0]?.factor,
                        },
                        Wedlock: {
                            id: wedlockData?.results[0]?.id,
                            name: wedlockData?.results[0]?.name,
                            category: wedlockData?.results[0]?.category,
                            formula_type: wedlockData?.results[0]?.formula_type,
                            within_district_fixed_marks: wedlockData?.results[0]?.within_district_fixed_marks,
                            across_district_fixed_marks: wedlockData?.results[0]?.across_district_fixed_marks,
                            max_marks: wedlockData?.results[0]?.max_marks,
                        },
                        Disability: {
                            id: disabilityData?.results[0]?.id,
                            name: disabilityData?.results[0]?.name,
                            category: disabilityData?.results[0]?.category,
                            formula_type: disabilityData?.results[0]?.formula_type,
                            max_marks: disabilityData?.results[0]?.max_marks,
                        },
                    });
                }
                setFieldsTenureDisable(true);
                setFieldsDisabilityDisable(true);
                setFieldsDistanceDisable(true);
                setFieldsWedlockDisable(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

    }, [distanceData, tenureData, disabilityData, wedlockData]);


    const handleDistanceOnChange = (event) => {
        const { name, value } = event.target;
        if (name == 'category') {
            setFormData((prevState) => ({
                ...prevState,
                Distance: {
                    ...prevState.Distance,
                    [name]: value,
                },
            }));
        }
        else {
            setFormData((prevState) => ({
                ...prevState,
                Distance: {
                    ...prevState.Distance,
                    [name]: value,
                },
            }));
        }
    };


    const handleDisabilityOnChange = (event) => {
        const { name, value } = event.target;
        if (name == 'category') {
            setFormData((prevState) => ({
                ...prevState,
                Disability: {
                    ...prevState.Disability,
                    [name]: value,
                },
            }));
        }
        else {
            setFormData((prevState) => ({
                ...prevState,
                Disability: {
                    ...prevState.Disability,
                    [name]: value,
                },
            }));
        }
    };


    const handleWedlockOnChange = (event) => {
        const { name, value } = event.target;
        if (name == 'category') {
            setFormData((prevState) => ({
                ...prevState,
                Wedlock: {
                    ...prevState.Wedlock,
                    [name]: value,
                },
            }));
        }
        else {
            setFormData((prevState) => ({
                ...prevState,
                Wedlock: {
                    ...prevState.Wedlock,
                    [name]: value,
                },
            }));
        }
    };


    const handleTenureOnChange = (event) => {
        const { name, value } = event.target;
        if (name == 'category') {
            setFormData((prevState) => ({
                ...prevState,
                Tenure: {
                    ...prevState.Tenure,
                    [name]: value,
                },
            }));
        }
        else {
            setFormData((prevState) => ({
                ...prevState,
                Tenure: {
                    ...prevState.Tenure,
                    [name]: value,
                },
            }));
        }
    };


    const handleDistanceSaveData = async (e) => {
        e.preventDefault();
        const res = await updateDistanceData({ id: formData.Distance.id, formData: formData.Distance });
        if (res?.error && res.error.status) {
            if (res?.error?.status === 422 && res?.error?.data?.code) {
                return (showToast(`${res?.error?.data?.detail}`, "error"));
            }
            // Handle API errors here
            setFormErrors(res?.error)
            return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        showToast(`Record updated successfully`, "success");
        distanceRefetch();
        setFormErrors({});
    }


    const handleTenureSaveData = async (e) => {
        e.preventDefault();
        const res = await updateTenureData({ id: formData.Tenure.id, formData: formData.Tenure });
        if (res?.error && res.error.status) {
            if (res?.error?.status === 422 && res?.error?.data?.code) {
                return (showToast(`${res?.error?.data?.detail}`, "error"));
            }
            // Handle API errors here
            setFormErrors(res?.error)
            return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        showToast(`Record updated successfully`, "success");
        tenureRefetch();
        setFormErrors({});
    }


    const handlewedlockSaveData = async (e) => {
        e.preventDefault();
        const res = await updateWedlockData({ id: formData.Wedlock.id, formData: formData.Wedlock });
        if (res?.error && res.error.status) {
            if (res?.error?.status === 422 && res?.error?.data?.code) {
                return (showToast(`${res?.error?.data?.detail}`, "error"));
            }
            // Handle API errors here
            setFormErrors(res?.error)
            return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        showToast(`Record updated successfully`, "success");
        wedlockRefetch();
        setFormErrors({});
    }


    const handleDisabilitySaveData = async (e) => {
        e.preventDefault();
        const res = await updateDisabilityData({ id: formData.Disability.id, formData: formData.Disability });
        if (res?.error && res.error.status) {
            if (res?.error?.status === 422 && res?.error?.data?.code) {
                return (showToast(`${res?.error?.data?.detail}`, "error"));
            }
            // Handle API errors here
            setFormErrors(res?.error)
            return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        }
        showToast(`Record updated successfully`, "success");
        disabilityRefetch();
        setFormErrors({});
    }

    const DistanceEdit = () => setFieldsDistanceDisable(false)

    const TenureEdit = () => setFieldsTenureDisable(false)


    const WedlockEdit = () => setFieldsWedlockDisable(false)


    const DisabilityEdit = () => setFieldsDisabilityDisable(false)


    return (
        <Fragment>
            <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'start', color: theme.palette.primary.main,  fontWeight: "500",
                        fontSize: "20px", mb: 2 }}>E-Transfer Posting Rating Formula</Typography>
            <Paper sx={{ p: 2, height: 'calc(100vh - 250px)', width: '100%', overflow: 'scroll' }} >
                <Grid container rowGap={2} >
                    <Grid item xs={12} md={6}   >
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #f2f2f2', mr: 2, }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>DISTANCE</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 2 }}>
                                    <Btn type="save" onClick={handleDistanceSaveData} />
                                    <Btn type="Edit" onClick={DistanceEdit} />
                                </Box>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" value={formData.Distance.name} disabled={fieldDistanceDisable} outerStyles={{}} placeholder="Enter Name" type="text" onChange={handleDistanceOnChange} error={formErrors?.data?.name} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" disabled={fieldDistanceDisable} value={formData.Distance.category} options={Category} onChange={handleDistanceOnChange} type="text" fullWidth error={formErrors?.data?.category} helperText={formErrors?.data?.category} />
                                </Grid>
                                <Grid item xs={12} md={12} >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>WITHIN DISTRICT</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="within_district_per_km_marks" label="Per KM Marks" disabled={fieldDistanceDisable} value={formData.Distance.within_district_per_km_marks} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Within District Per Km Marks" type="number" error={formErrors?.data?.within_district_per_km_marks} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="within_district_max_marks" label="Max Marks" disabled={fieldDistanceDisable} value={formData.Distance.within_district_max_marks} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Within District Max Km Marks" type="number" error={formErrors?.data?.within_district_max_marks} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>ACCROSS DISTRICT</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="across_district_perKm_marks" label="Per KM Marks" disabled={fieldDistanceDisable} value={formData.Distance.across_district_per_km_marks} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Accross District Per Km Marks" type="number" error={formErrors?.data?.across_district_perKm_marks} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="across_district_max_marks" label="Max Marks" disabled={fieldDistanceDisable} value={formData.Distance.across_district_max_marks} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Accross District Max Km Marks" type="number" error={formErrors?.data?.across_district_max_marks} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="from_km" label=" From KM" disabled={fieldDistanceDisable} value={formData.Distance.from_km} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Km" type="number" error={formErrors?.data?.from_km} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="allow_district_fixed_marks" label="Fixed Marks" disabled={fieldDistanceDisable} value={formData.Distance.allow_district_fixed_marks} onChange={handleDistanceOnChange} outerStyles={{}} placeholder="Enter Allowed District Fixed Marks " type="number" error={formErrors?.data?.allow_district_fixed_marks} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>

                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #f2f2f2', mr: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>TENURE</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 2 }}>
                                    <Btn type="save" onClick={handleTenureSaveData} />
                                    <Btn type="Edit" onClick={TenureEdit} />
                                </Box>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" value={formData.Tenure.name} disabled={fieldTenureDisable} outerStyles={{}} onChange={handleTenureOnChange} placeholder="Enter Name" type="text" error={formErrors?.data?.name} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" disabled={fieldTenureDisable} value={formData.Tenure.category} options={Category} onChange={handleTenureOnChange} type="text" fullWidth error={formErrors?.data?.category} helperText={formErrors?.data?.category} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>TENURE PERIOD</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="minimum_tenure_months" disabled={fieldTenureDisable} label="Min Months " value={formData.Tenure.minimum_tenure_months} outerStyles={{}} onChange={handleTenureOnChange} placeholder="Enter Minimum Tenure Months " type="number" error={formErrors?.data?.minimum_tenure_months} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="total_tenure_months" disabled={fieldTenureDisable} label="Total  Months " value={formData.Tenure.total_tenure_months} outerStyles={{}} onChange={handleTenureOnChange} placeholder="Enter Total Tenure Months " type="number" error={formErrors?.data?.total_tenure_months} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="max_marks" label="Max Marks" disabled={fieldTenureDisable} value={formData.Tenure.max_marks} outerStyles={{}} onChange={handleTenureOnChange} placeholder="Enter  Max  Marks" type="number" error={formErrors?.data?.max_marks} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="factor" label="Factor" disabled={fieldTenureDisable} value={formData.Tenure.factor} outerStyles={{}} onChange={handleTenureOnChange} placeholder="Enter Factor " type="number" error={formErrors?.data?.factor} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #f2f2f2', mr: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>WEDLOCK</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 2 }}>
                                    <Btn type="save" onClick={handlewedlockSaveData} />
                                    <Btn type="Edit" onClick={WedlockEdit} />
                                </Box>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" value={formData.Wedlock.name} disabled={fieldWedlockDisable} onChange={handleWedlockOnChange} outerStyles={{}} placeholder="Enter Name" type="text" error={formErrors?.data?.name} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" disabled={fieldWedlockDisable} value={formData.Wedlock.category} onChange={handleWedlockOnChange} options={Category} type="text" fullWidth error={formErrors?.data?.category} helperText={formErrors?.data?.category} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1, }}>WITHIN DISTRICT</Typography>
                                                <InputField name="within_district_fixed_marks" label="Fixed Marks" disabled={fieldWedlockDisable} value={formData.Wedlock.within_district_fixed_marks} onChange={handleWedlockOnChange} outerStyles={{}} placeholder="Enter Within District Per Km Marks" type="number" error={formErrors?.data?.within_district_fixed_marks} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>ACCROSS DISTRICT </Typography>
                                                <InputField name="across_district_fixed_marks" label="Fixed Marks " disabled={fieldWedlockDisable} value={formData.Wedlock.across_district_fixed_marks} onChange={handleWedlockOnChange} outerStyles={{}} placeholder="Enter Accross District Max Km Marks" type="number" error={formErrors?.data?.across_district_fixed_marks} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Grid item xs={6} md={12}>
                                        <Box sx={{ py: 1, pr: 1, mb: 1 }}>
                                            <Grid container spacing={1} >
                                                <Grid item xs={6} md={6}>
                                                    <InputField name="max_marks" label="Max Marks" disabled={fieldWedlockDisable} value={formData.Wedlock.max_marks} onChange={handleWedlockOnChange} outerStyles={{}} placeholder="Enter  Max  Marks" type="number" error={formErrors?.data?.max_marks} />
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} >
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #f2f2f2', mr: 2, height: '100%' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>DISABILITY</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 2 }}>
                                    <Btn type="save" onClick={handleDisabilitySaveData} />
                                    <Btn type="Edit" onClick={DisabilityEdit} />
                                </Box>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" disabled={fieldDisabilityDisable} value={formData.Disability.name} outerStyles={{}} onChange={handleDisabilityOnChange} placeholder="Enter Name" type="text" error={formErrors?.data?.name} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" disabled={fieldDisabilityDisable} value={formData.Disability.category} options={Category} onChange={handleDisabilityOnChange} type="text" fullWidth error={formErrors?.data?.category} helperText={formErrors?.data?.category} />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', py: 1, pr: 1, pl: 1, mb: 1 }}>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>DISABILITY</Typography>
                                                <InputField name="max_marks" label="Max Marks" disabled={fieldDisabilityDisable} value={formData.Disability.max_marks} onChange={handleDisabilityOnChange} outerStyles={{}} placeholder="Enter  Max  Marks" type="number" error={formErrors?.data?.max_marks} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

        </Fragment>
    )

}

export default Wedlock_Rating_Formula;
