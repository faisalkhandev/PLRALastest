import React, { Fragment, useState } from 'react';
import { Grid, Typography, Box, Paper } from '@mui/material';
import { Btn, InputField } from '../../Components/index';
import { useTheme } from '@emotion/react';
import SimpleDropdown from "../../Components/Common/SimpleDropDown.jsx";


function Wedlock_Rating_Formula() {
    const theme = useTheme();
    const [distanceCategory, setDistanceCategory] = useState()
    const [wedlockCategory, setWedlockCategory] = useState()
    const [tenureCategory, setTenureCategory] = useState()
    const [disabilityCategory, setDisabilityCategory] = useState()

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
    const handleDistanceCategory = (event) => {
        const { name, value } = event.target;
        setDistanceCategory(value)
    }
    const handleWedLockCategory = (event) => {
        const { name, value } = event.target;
        setWedlockCategory(value)
    }
    const handleTenureCategory = (event) => {
        const { name, value } = event.target;
        setTenureCategory(value)
    }
    const handleDisabilityCategory = (event) => {
        const { name, value } = event.target;
        setDisabilityCategory(value)
    }


    return (
        <Fragment>
            <Typography variant="h4" sx={{ width: '100%', display: 'flex', justifyContent: 'start', color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>TRANSFER POSTING RATING FORMULA</Typography>
            <Paper sx={{ p: 2, height: 'calc(100vh - 250px)', width: '100%', overflow: 'scroll' }} >
                <Grid container rowGap={2} >
                    <Grid item xs={12} md={6}   >
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', border: '1px solid #f2f2f2', mr: 2, }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>DISTANCE</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: "end", gap: 1, mb: 2 }}>
                                    <Btn type="save" />
                                    <Btn type="Edit" />
                                </Box>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" outerStyles={{}} innerStyles={{ width: '155%' }} placeholder="Enter Name" type="text" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" value={distanceCategory || ""} innerStyles={{ width: '155%' }} options={Category} onChange={handleDistanceCategory} type="text" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={12} >
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>WITH IN DISTRICT</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="within_district_perKm_marks" label="Per Km Marks" outerStyles={{}} placeholder="Enter Within District Per Km Marks" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="within_district_max_marks" label="Max Marks" outerStyles={{}} placeholder="Enter Within District Max Km Marks" type="number" />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>ACCROSS DISTRICT</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="accross_district_perKm_marks" label="Per Km Marks" outerStyles={{}} placeholder="Enter Accross District Per Km Marks" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="accross_district_max_marks" label="Max Marks" outerStyles={{}} placeholder="Enter Accross District Max Km Marks" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="from_km" label=" From Km " outerStyles={{}} placeholder="Enter Km" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="Allow_district_fixed_marks" label="Fixed Marks" outerStyles={{}} placeholder="Enter Allowed District Fixed Marks " type="number" />
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
                                    <Btn type="save" />
                                    <Btn type="Edit" />
                                </Box>
                            </Box>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" outerStyles={{}} innerStyles={{ width: '155%' }} placeholder="Enter Name" type="text" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" value={tenureCategory || ""} innerStyles={{ width: '155%' }} options={Category} onChange={handleTenureCategory} type="text" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', p: 1, mb: 1 }}>
                                        <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>TENURE</Typography>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="minimum_tenuremonths" label="Min Months " outerStyles={{}} placeholder="Enter Minimum Tenure Months " type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="total_tenuremonths" label="Total  Months " outerStyles={{}} placeholder="Enter Total Tenure Months " type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="max_marks" label="Max Marks" outerStyles={{}} placeholder="Enter  Max  Marks" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <InputField name="factor" label="Factor" outerStyles={{}} placeholder="Enter Factor " type="number" />
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
                                    <Btn type="save" />
                                    <Btn type="Edit" />
                                </Box>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" outerStyles={{}} innerStyles={{ width: '155%' }} placeholder="Enter Name" type="text" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" value={wedlockCategory || ""} innerStyles={{ width: '155%' }} options={Category} onChange={handleWedLockCategory} type="text" fullWidth />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', border: '1px solid #f2f2f2', py: 1, pr: 1, mb: 1 }}>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>WITH IN DISTRICT</Typography>
                                                <InputField name="within_district_perKm_marks" label="Per Km Marks" outerStyles={{}} placeholder="Enter Within District Per Km Marks" type="number" />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <Typography variant="h8" sx={{ color: theme.palette.primary.main, fontWeight: 'bold', display: 'flex', justifyContent: 'start', mb: 1 }}>ACCROSS DISTRICT </Typography>
                                                <InputField name="accross_district_max_marks" label="Max Marks " outerStyles={{}} placeholder="Enter Accross District Max Km Marks" type="number" />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Grid item xs={6} md={12}>
                                        <Box sx={{ py: 1, pr: 1, mb: 1 }}>
                                            <Grid container spacing={1} >
                                                <Grid item xs={6} md={6}>
                                                    <InputField name="max_marks" label="Max Marks" outerStyles={{}} placeholder="Enter  Max  Marks" type="number" />
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
                                    <Btn type="save" />
                                    <Btn type="Edit" />
                                </Box>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <InputField name="name" label="Name" outerStyles={{}} innerStyles={{ width: '155%' }} placeholder="Enter Name" type="text" />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <SimpleDropdown name="category" label="Category" value={disabilityCategory || ""} innerStyles={{ width: '155%' }} options={Category} onChange={handleDisabilityCategory} type="text" fullWidth />
                                </Grid>
                                <Grid item xs={6} md={12}>
                                    <Box sx={{ py: 1, pr: 1, mb: 1 }}>
                                        <Grid container spacing={1} >
                                            <Grid item xs={6} md={6}>
                                                <InputField name="max_marks" label="Max Marks" outerStyles={{}} placeholder="Enter  Max  Marks" type="number" />
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

export default Wedlock_Rating_Formula