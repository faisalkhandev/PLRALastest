import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography, useTheme, } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlined_eye } from "../../Assets/Icons/index.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Btn, MyTableContainer } from "../../Components/index.js";
import Cookies from "js-cookie";

const TransferWindowDialog = ({ DialogData }) => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null)
    console.log("Dialog Data History Tab", DialogData);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    console.log(user_id);

    const allEtransferWindowRecord = DialogData?.open_position?.map((data) => ({
        id: data?.p_rec_id,
        job: data?.job?.job_title,
        ppg_level: data?.job?.ppg_level?.ppg_level,
        center: data?.location?.center_name,
        district: data?.location?.district?.district_name,
        division: data?.location?.division?.division_name,
        region: data?.location?.region?.region_name,
        tehsil: data?.location?.tehsil?.t_name,
        description: data?.position_desc,
        position_type: data?.position_type?.position_type_name,
        sub_wing: data?.sub_wing?.sub_wing_name,
        wing: data?.wing?.wing_name,
    })) || [];

    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const columns = [
        {
            field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <Link to={`/edittransferwindow/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                    <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span></Link>
            },
        },
        {
            field: "job", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.job}</span>
            },
        },
        {
            field: "description", headerName: "Description", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.description}</span>
            },
        },
        {
            field: "position_type", headerName: "Position Type", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.position_type}</span>
            },
        },
        {
            field: "ppg_level", headerName: "PPG level", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.ppg_level}</span>
            },
        },
        {
            field: "center", headerName: "Center", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.center}</span>
            },
        },
        {
            field: "district", headerName: "District", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.district}</span>
            },
        },
        {
            field: "division", headerName: "Division", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.division}</span>
            },
        },
        {
            field: "region", headerName: "Region", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.region}</span>
            },
        },
        {
            field: "tehsil", headerName: "Tehsil", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.tehsil}</span>
            },
        },
        {
            field: "sub_wing", headerName: "Sub Wing", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.sub_wing}</span>
            },
        },
        {
            field: "wing", headerName: "Wing", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.wing}</span>
            },
        },
    ];

    return (
        <div>
            <Box sx={{ p: 1 }}>
                <Grid
                    container
                    spacing={0}
                    sx={{ border: "1px solid #E4E4E4",mb:3 }}
                >
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                                ID:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.id}
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
                                {DialogData?.name}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "95px" }}>
                                From Date:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.from_date}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "100px" }}>
                                To Date:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.to_date}
                            </Typography>
                        </Box>
                    </Grid>
                    {/* <Grid item xs={4} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "105px" }}>
                                Status:
                            </Typography>
                            <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: backgroundColor, color: color }}>
                                {DialogData?.status}
                            </Typography>
                        </Box>
                    </Grid> */}
                    <Grid item xs={12} sx={{ border: "1px solid #E4E4E4", py: 2, px: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", mt: -2 }}>
                            <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "200px", pt: 1 }}>
                                Description:
                            </Typography>
                            <Typography variant="subtitle1" color="initial">
                                {DialogData?.description}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {
                    DialogData ?
                        <MyTableContainer columns={columns} data={allEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 300px)" /> : null
                }

                {/* <Box>
          <Typography variant="h6" color="initial" sx={{ mt: 2, mb: 2 }}>
            Approvals Status:
          </Typography>
          {DialogData?.approvals.map((data, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index + 1}-content`} id={`panel${index + 1}-header`}>
                <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", }}>
                  <Box sx={{ width: "50%", display: "flex", alignItems: "center", gap: 2, }}>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      {data?.approving_authority_designation}
                    </Typography>
                    <Typography variant="subtitle1" color="initial" sx={{ fontWeight: 600 }}>
                      |
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2, borderRadius: "4px", backgroundColor: getStatusStyle(data?.status, theme).backgroundColor, color: getStatusStyle(data?.status, theme).color, }}>
                      {data?.status}
                    </Typography>
                  </Box>
                  <Box sx={{ width: "50%", display: "flex", justifyContent: "end", mr: 2, }}>
                    Approval Date: {data?.status_date}
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial" fontWeight={600} sx={{ width: "150px" }}>
                        Officer Name:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1, borderBottom: "none", }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "start", }}>
                      <Typography variant="subtitle1" color="initial">
                        {data?.approving_authority?.first_name + " " + data?.approving_authority?.last_name}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {data?.approving_authority_designation === "HR DIRECTOR" && (
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={3}
                      sx={{
                        border: "1px solid #E4E4E4",
                        p: 1,
                        borderBottom: "none",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        {" "}
                        <Typography
                          variant="subtitle1"
                          color="initial"
                          fontWeight={600}
                          sx={{ width: "200px" }}
                        >
                          Effective date:
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      sx={{
                        border: "1px solid #E4E4E4",
                        p: 1,
                        borderBottom: "none",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                        }}
                      >
                        <Typography variant="subtitle1" color="initial">
                          {" "}
                          {data?.resignation_effective_date}{" "}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
                <Grid container spacing={0}>
                  <Grid item xs={3} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        color="initial"
                        fontWeight={600}
                        sx={{ width: "150px" }}
                      >
                        Comments:
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={9} sx={{ border: "1px solid #E4E4E4", p: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <Typography variant="subtitle1" color="initial">
                        {" "}
                        {data?.comments}{" "}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box> */}
            </Box>
        </div>
    );
};

export default TransferWindowDialog;