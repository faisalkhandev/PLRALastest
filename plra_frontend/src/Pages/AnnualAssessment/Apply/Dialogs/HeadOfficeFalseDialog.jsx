import React, { Fragment } from 'react';
import {
    useTheme,
    Typography,
    Box,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useCcoApprovalByIDQuery } from '../../../../Features/API/AnnualAssessment';
import { Outlined_eye } from '../../../../Assets/Icons/index.jsx';


const HeadOfficeFalseDialog = ({ apprvalID }) => {
    const theme = useTheme();
    const openPdfInNewTab = () => { const pdfUrl = 'path/to/your/pdf/file.pdf'; window.open(pdfUrl, '_blank'); };




    // const leave_request_id = apprvalID;
    const { data: approvalData } = useCcoApprovalByIDQuery(apprvalID);

    console.log("apprvalID", apprvalID);
    console.log("approvalData", approvalData);
    console.log("Notes", approvalData?.results[0]?.approvals[0]?.aar_process?.notes);
    console.log("approvalData HeadOffice", approvalData?.results[0]?.is_head_office);

    const generateInputFields = () => {
        const inputFields = [];
        for (let i = 0; i < approvalData?.results?.count; i++) {
            inputFields.push(
                <Grid container spacing={0} key={i}>
                    <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, pt: 2, }} name="sr_no">
                        {approvalData?.results?.results[i]?.id}
                    </Grid>
                    <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {approvalData?.results?.results[i]?.category}
                    </Grid>
                    <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {approvalData?.results?.results[i]?.max_points}
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {approvalData?.results?.results[i]?.system_generated_points}
                    </Grid>
                    {approvalData?.results?.results[i]?.point_earned != null && (
                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                            {approvalData?.results?.results[i]?.point_earned}
                        </Grid>
                    )}
                    {approvalData?.results?.results[i]?.point_earned == null && (
                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                            <TextField name="point_earned" placeholder="Enter Points" type="number" onChange={(event) => handleInputChange(event, i)} fullWidth mandatory />
                        </Grid>
                    )}
                </Grid>
            );
        }
        return inputFields;
    };


    const rawDate = approvalData?.results[0]?.aar_apply_Date;
    const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString() : '';
    // const openPdfInNewTab = () => { const pdfUrl = 'path/to/your/pdf/file.pdf'; window.open(pdfUrl, '_blank'); };

    return (
        <div>
           
                <Box sx={{ p: 1 }}>
                    <Grid container spacing={0} sx={{ border: '1px solid #E4E4E4', m: -0.7 }}>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Approval ID:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.id}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>Employee Name: </Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.approvals[0]?.aar_process?.employee?.first_name}  {approvalData?.results[0]?.approvals[0]?.aar_process?.employee?.last_name} </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Attachment:</Typography>
                                <Box sx={{ display: "flex", alignItems: 'center' }}>
                                    <Box sx={{
                                        fontWeight: 600,
                                        px: 2, pt: 0.4,
                                        borderRadius: "4px",
                                        backgroundColor: theme.palette.success[300],
                                        color: theme.palette.success[600],
                                        mr: 2,
                                        cursor: 'pointer'
                                    }}
                                        onClick={openPdfInNewTab}
                                    >
                                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                                    </Box>

                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '100px' }}>Year:</Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.approvals[0]?.aar_process?.year?.hr_year} </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>Father Name: </Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.approvals[0]?.aar_process?.employee?.father_name}  </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: '1px solid #E4E4E4', p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '145px' }}>Apply Date:</Typography>
                                <Typography variant="subtitle1" color="initial" >{new Date(approvalData?.results[0]?.aar_apply_Date).toLocaleDateString("en-GB")}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{ border: '1px solid #E4E4E4', py: 2, px: 1 }}>
                            <Box sx={{ display: "flex", alignItems: 'center' }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: '120px' }}>Notes: </Typography>
                                <Typography variant="subtitle1" color="initial" >{approvalData?.results[0]?.approvals[0]?.aar_process?.notes}  </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    {/* Approval Status  */}
                    <Box>
                        <Typography variant="h6" color="initial" sx={{ mb: 1, mt: 2 }}> Approval Status:</Typography>
                        {approvalData?.results[0]?.approvals.map((data, index) => (
                            <Accordion key={index}>

                                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ width: '50%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                                                {data?.designation}
                                            </Typography>
                                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>|</Typography>
                                            <Typography variant="subtitle1" sx={{
                                                fontWeight: 600,
                                                px: 2,
                                                borderRadius: "4px",
                                                backgroundColor:
                                                    data?.status === "Approved" ? theme.palette.primary[200] :
                                                        data?.status === "In Process" ? theme.palette.warning[300] :
                                                            data?.status === "Rejected" ? theme.palette.error[300] : "black",
                                                color:
                                                    data?.status === "Approved" ? theme.palette.primary.main :
                                                        data?.status === "In Process" ? theme.palette.warning.main :
                                                            data?.status === "Rejected" ? theme.palette.error[600] : "black"
                                            }}>
                                                {data?.status}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'end', mr: 2 }}>
                                            Approval Date: {data?.aar_process?.aar_apply_Date}
                                        </Box>
                                    </Box>
                                </AccordionSummary>

                                {/* Officer Name */}
                                <AccordionDetails>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Officer Name: {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}
                                        </Typography>
                                    </Box>
                                </AccordionDetails>

                                {/* Reporting Officer */}
                                <AccordionDetails>
                                    {data?.designation == "REPORTING OFFICER" && data?.status == "Approved" && (
                                        <>
                                            <Grid container spacing={0}>
                                                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                            Overall Grading:
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial">
                                                            {data?.over_All_grading}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Fragment>
                                                <Box sx={{ mt: 2, border: "1px solid white" }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }}>
                                                            Id
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Category
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Max Points
                                                        </Grid>
                                                        <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            System Generated Points
                                                        </Grid>
                                                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "0px 4px 0px 0px", }}>
                                                            point earned
                                                        </Grid>
                                                    </Grid>
                                                    {generateInputFields()}
                                                </Box>
                                            </Fragment>
                                        </>
                                    )}
                                </AccordionDetails>

                                {/* Counter Signing  */}
                                <AccordionDetails>
                                    {data?.designation == "COUNTER-SIGNING-OFFICER" && data?.status == "In Process" && (
                                        <>
                                            <Grid container spacing={0}>
                                                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                            Overall Grading:
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial">
                                                            {data?.over_All_grading}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Fragment>
                                                <Box sx={{ mt: 2, border: "1px solid white" }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }}>
                                                            Id
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Category
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Max Points
                                                        </Grid>
                                                        <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            System Generated Points
                                                        </Grid>
                                                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "0px 4px 0px 0px", }}>
                                                            point earned
                                                        </Grid>
                                                    </Grid>
                                                    {generateInputFields()}
                                                </Box>
                                            </Fragment>
                                        </>
                                    )}
                                </AccordionDetails>

                                {/* COMPETENT AUTHORITY */}
                                <AccordionDetails>
                                    {data?.designation == "COMPETENT AUTHORITY" && data?.status == "Appproved" && (
                                        <>
                                            <Grid container spacing={0}>
                                                <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                                            Overall Grading:
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                                                        <Typography variant="subtitle1" color="initial">
                                                            {data?.over_All_grading}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Fragment>
                                                <Box sx={{ mt: 2, border: "1px solid white" }}>
                                                    <Grid container spacing={0}>
                                                        <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }}>
                                                            Id
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Category
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            Max Points
                                                        </Grid>
                                                        <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                                                            System Generated Points
                                                        </Grid>
                                                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "0px 4px 0px 0px", }}>
                                                            point earned
                                                        </Grid>
                                                    </Grid>
                                                    {generateInputFields()}
                                                </Box>
                                            </Fragment>
                                        </>
                                    )}
                                </AccordionDetails>

                            </Accordion>
                        ))}


                    </Box>
                </Box>
        </div>
    );
};

export default HeadOfficeFalseDialog;
