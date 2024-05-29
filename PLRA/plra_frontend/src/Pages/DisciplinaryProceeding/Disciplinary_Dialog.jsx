import React from 'react';
import {
    useTheme,
    Typography,
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { useSelector } from 'react-redux';

const Disciplinary_Dialog = () => {
    const EmployeeData = useSelector((state) => state.disciplinaryProceeding.EmployeeData);
    console.log(EmployeeData);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        console.log(params.row);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedRow(null);
    };

    return (
        <>
            <Box sx={{ p: 1 }}>
                <Grid container spacing={0} sx={{ border: '1px solid #E4E4E4', m: -0.7 }}>
                    <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} >Employee Number:</Typography>
                            <Typography variant="subtitle1" color="initial" >{selectedRow.id}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} >Employee Name:</Typography>
                            <Typography variant="subtitle1" color="initial" > {selectedRow.employeeData}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} >Inquiry Reason:</Typography>
                            <Typography variant="subtitle1" color="initial" sx={{ textTransform: 'capitalize' }}> {selectedRow.inquiryReason}</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Reporting Officer:</Typography>
                            <Typography variant="subtitle1" color="initial" >Reporting Officer</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Prob Officer:</Typography>
                            <Typography variant="subtitle1" color="initial" >Prob Officer</Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: 'center', }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '150px' }}>Other Reason:</Typography>
                            <Typography variant="subtitle1" color="initial" >Reason</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            {/* Status: */}
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                        HR User
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                    <Typography variant="subtitle1" sx={{
                        fontWeight: 600,
                        px: 2,
                        borderRadius: "4px",
                        backgroundColor: theme.palette.warning[300],
                        color: theme.palette.warning.main,
                    }}>
                    </Typography>
                </Box>
                <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>
                    Approval Date: 2-10-2021
                </Box>
            </Box>
        </>
    )
}

export default Disciplinary_Dialog