import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme, } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlined_eye } from "../../Assets/Icons/index.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Btn } from "../../Components/index.js";
import Cookies from "js-cookie";

const TransferProcessDialog = ({ DialogData }) => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null)
    console.log("Dialog Data History Tab", DialogData);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    console.log(user_id);


    // function
    const openPdfInNewTab = (path) => {
        if (!path) toast.error("No Attachment", { position: "top-center", autoClose: 3000, });
        else window.open(path, "_blank");
    };

    const getStatusStyle = (status, theme) => {
        let backgroundColor, color;

        switch (status) {
            case "Approved":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Proved":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Closed":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to Competent Authority":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to DG":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Refer to Director HR":
                backgroundColor = theme.palette.primary[200];
                color = theme.palette.primary.main;
                break;
            case "Pending":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "In process":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "In Process":
                backgroundColor = theme.palette.warning[300];
                color = theme.palette.warning.main;
                break;
            case "Rejected":
                backgroundColor = theme.palette.error[300];
                color = theme.palette.error[600];
                break;
            case "Unapproved":
                backgroundColor = theme.palette.error[300];
                color = theme.palette.error[600];
                break;
            default:
                backgroundColor = "black";
                color = "black";
        }

        return { backgroundColor, color };
    };
    const status = DialogData?.status;
    const { backgroundColor, color } = getStatusStyle(status, theme);

    return (
        <div>
            {DialogData?.status === "Approved" && DialogData?.approvals[1]?.approving_authority_designation === "HR DIRECTOR" && DialogData?.approvals[1]?.approving_authority?.id === user_id && (
                <Link to={`/resignationreport/${DialogData.id}`} style={{ float: 'right', marginBottom: '10px' }}>
                    <Btn type="Generate Report" />
                </Link>
            )}

            <Box sx={{ p: 1 }}>
                <Grid
                    container
                    spacing={0}
                    sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
                >
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                ID:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData.id}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                width
                                    : "100px"
                            }}>
                                Name:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData.emp_name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                Attachment:
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Box sx={{ fontWeight: 600, px: 2, pt: 0.4, borderRadius: "4px", backgroundColor: theme.palette.success[300], color: theme.palette.success[600], cursor: "pointer", }}>
                                    <div onClick={() => { openPdfInNewTab(DialogData?.attachments); }}>
                                        <Outlined_eye color={`${theme.palette.success[600]}`} />
                                    </div>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "95px" }}>
                                Category:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.transfer_category}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                Apply Date:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.e_transfer_apply_date}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "105px" }}>
                                Status:
                            </Typography>
                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                                {DialogData?.status}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box>
                    <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2 }}>
                        Previous Position:
                    </Typography>
                    <Grid
                        container
                        spacing={0}
                        sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
                    >
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                    ID:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.p_rec_id}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                    width
                                        : "100px"
                                }}>
                                    Job:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.job?.job_title}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                    width
                                        : "100px"
                                }}>
                                    PPG level:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.job?.ppg_level?.ppg_level}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Center:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.location?.center_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    District:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.location?.district?.district_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Division:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.location?.division?.division_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Region:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.location?.region?.region_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Tehsil:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.location?.tehsil?.t_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Position Type:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.position_type?.position_type_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Sub Wing:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.sub_wing?.sub_wing_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Wing:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.wing?.wing_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Description:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.previous_position?.position_desc}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2 }}>
                        Transfer Position:
                    </Typography>
                    <Grid
                        container
                        spacing={0}
                        sx={{ border: "1px solid #E4E4E4", m: -0.7 }}
                    >
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                    ID:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.p_rec_id}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                    width
                                        : "100px"
                                }}>
                                    Job:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.job?.job_title}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{
                                    width
                                        : "100px"
                                }}>
                                    PPG level:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.job?.ppg_level?.ppg_level}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Center:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.location?.center_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    District:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.location?.district?.district_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Division:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.location?.division?.division_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Region:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.location?.region?.region_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Tehsil:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.location?.tehsil?.t_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Position Type:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.position_type?.position_type_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Sub Wing:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.sub_wing?.sub_wing_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Wing:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.wing?.wing_name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "120px" }}>
                                    Description:
                                </Typography>
                                <Typography variant="subtitle1" color="initial">
                                    {DialogData.transfer_position?.position_desc}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
};

export default TransferProcessDialog;