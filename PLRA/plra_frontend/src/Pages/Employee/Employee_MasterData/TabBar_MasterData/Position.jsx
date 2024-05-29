import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Switch,
    List,
    ListItemButton,
    Collapse,
    ListItemText,
} from "@mui/material";
import {
    Btn,
    HeadingBar,
    InputField,
    Multi_Dropdown,
} from "../../../../Components/index.js";
import Breadcrumb from "../../../../Components/Common/BreadCrumb.jsx";
import {
    useGetJobQuery,
    useGetEmployeeQuery,
    useGetPositionbyJobCenterFilterQuery,
    useGetJobLevelAssignmentQuery,
    useGetJobLevelIDQuery,
    useUpdatePositionAssignmentMutation,
    useUpdateJobLevelAssignmentMutation,
    useGetPositionAssignmentQuery,
    useDeletePositionAssignmentMutation,
    useDeleteJobLevelAssignmentMutation,
    usePostPositionAssignmentMutation,
    usePostJobLevelAssignmentforPositionMutation,
} from "../../../../Features/API/API.js";
import { useGetCurrentDateQuery } from '../../../../Features/API/NocAPI.js'
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard.jsx";
import {
    JobHeader,
    PositionHeader,
    JobLevelHeader,
} from "../../../../Data/Setup_Data/Setup_Data.jsx";
import { useParams } from "react-router-dom";
import { showToast } from "../../../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from "../../../../Components/Common/StatusCodeHandler.jsx";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
// import { useGetCurrentDateQuery } from "../../../../Features/API/EmployeeApi.js";

const Position = () => {
    const [open, setOpen] = useState({});
    const [selectedPositionDesc, setSelectedPositionDesc] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const { id } = useParams();
    const [jobDialogOpen, setjobDialogOpen] = useState(false);
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [jobName, setJobName] = useState("");
    const [positionName, setPositionName] = useState("");
    const [joblevelName, setJobLevelName] = useState("");
    const [job_rec_id, setJob_rec_id] = useState("");
    const [matchingJobLevelAssignments, setMatchingJobLevelAssignments] = useState([]);
    const [formPositionData, setformPositionData] = useState({
        position: null,
        assignment_start: null,
        assignment_end: null,
        active: true,
        primary_position: false,
        employee: id,
    });
    const [formJoblevelAssignmentData, setformJoblevelAssignmentData] = useState({
        job_level: null,
        assignment_start: null,
        active: true,
        employee: id,
    });
    const [combinedData, setCombinedData] = useState([])


    const [isjobLevelActive, setIsJobLevelActive] = useState(
        formJoblevelAssignmentData.active
    );
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [JobID, setJobID] = useState(null);
    const [CenterID, setCenterID] = useState(null);
    const [positionDialog, setPositionDialog] = useState(false);
    const [joblevelDialog, setJobLevelDialog] = useState(false);
    const [selectRowID, setSelectedRowID] = useState(null);
    const [selectedJobId, setSelectedJobID] = useState(0);
    const [disableFields, setfieldsDisable] = useState(false);
    const [jobLevelAssignmentField, setjobLevelAssignmentField] = useState(true);
    const [jobLevelAssignmentToggle, setjobLevelAssignmentToggle] = useState(true);
    const [positionAssignmentID, setPositionAssignmentID] = useState("")

    const jobClickHandler = (selectedRow) => {
        setJobID(selectedRow.j_rec_id);
        setJobName(selectedRow.job_title);
        setPositionName("");
        setformPositionData({ ...formPositionData, position: "" });
        setJobLevelName("");
        setformJoblevelAssignmentData({
            ...formJoblevelAssignmentData,
            job_level: "",
        });
        PositionbyFilterdatarefetch();
        Jobleveldatarefetch();
        setjobDialogOpen(false);
    };

    //Get Queries
    const { data: Jobdata, refetch: jobrefetch, } = useGetJobQuery();
    const { data: Positionassignmentdata, refetch: positionrefetch, } = useGetPositionAssignmentQuery(id);
    const { data: Employeedata, } = useGetEmployeeQuery(id);
    const { data: Jobleveldata, refetch: Jobleveldatarefetch, } = useGetJobLevelIDQuery(JobID);
    const { data: JoblevelAssignmentdata, refetch: jobLevelrefetch, } = useGetJobLevelAssignmentQuery(id);
    const { data: PositionbyFilterdata, refetch: PositionbyFilterdatarefetch, } = useGetPositionbyJobCenterFilterQuery({ JobID, CenterID });

    //post position assignment
    const [postPositioAssignment] = usePostPositionAssignmentMutation();
    const [postJobLevelAssignment] = usePostJobLevelAssignmentforPositionMutation();
    const [deleteJobLevelAssignment] = useDeleteJobLevelAssignmentMutation();
    const [deletePositionAssignment] = useDeletePositionAssignmentMutation();
    const [updatePositionAssignment] = useUpdatePositionAssignmentMutation();
    const [updateJobLevelAssignment] = useUpdateJobLevelAssignmentMutation();
    const { data: getCurrentDate, isLoading, isError, error } = useGetCurrentDateQuery();



    useEffect(() => {
        jobrefetch();
        positionrefetch();
        PositionbyFilterdatarefetch();
        Jobleveldatarefetch();
        jobLevelrefetch();
        if (Employeedata?.center !== null) {
            setCenterID(Employeedata?.center.c_rec_id);
        } else {
            setCenterID(Employeedata?.center);
        }
        setPositionAssignmentID(Positionassignmentdata?.results[0]?.id);
        positionrefetch();

    }, []);


    useEffect(() => {
        if (JobID !== null) {
            PositionbyFilterdatarefetch();
        }
    }, [JobID]);

    const handleBoxClick = (record, index, joblevel) => {

        setfieldsDisable(true);
        setIsRowSelected(true);
        setActiveBoxIndex(index);
        setSelectedRowID(record?.positionAssignment?.id);
        setSelectedJobID(record?.jobLevelAssignment?.id);

        setformPositionData({
            job: record?.positionAssignment?.position?.job?.j_rec_id,
            employee: record?.positionAssignment?.employee?.id,
            position: record?.positionAssignment?.position?.p_rec_id,
            assignment_start: record?.positionAssignment?.assignment_start,
            assignment_end: record?.positionAssignment?.assignment_end,
            active: record?.positionAssignment?.active,
            primary_position: record?.positionAssignment?.primary_position,
        });

        if (record?.jobLevelAssignment) {
            setformJoblevelAssignmentData({
                job_level: joblevel?.job_level?.j_l_rec_id,
                assignment_start: joblevel?.assignment_start,
                assignment_end: joblevel?.assignment_end,
                active: joblevel?.active,
                employee: joblevel?.employee?.id,
            });
        } else {
            setformJoblevelAssignmentData({
                job_level: "",
                assignment_start: "",
                assignment_end: "",
                active: true,
                employee: "",
            });
        }

        setJobName(record?.positionAssignment?.position?.job?.job_title);
        setPositionName(record?.positionAssignment?.position?.position_id);
        setJobLevelName(`${joblevel?.job_level?.job_abbrivation}  ${joblevel?.job_level?.job_abbrivation_seniority}`);
        setJob_rec_id(record?.positionAssignment?.position?.job?.j_rec_id);  // Here you set j_rec_id to job_rec_id state


    };


    const handleChange = (event) => {
        const { name, value } = event.target;
        setformJoblevelAssignmentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handlePositionChange = (event) => {
        const { name, value } = event.target;
        setformPositionData(prevData => ({ ...prevData, [name]: value }));
    };

    const positionClickHandler = (selectedRow) => {
        setPositionName(selectedRow?.position_id);
        setformPositionData({
            ...formPositionData,
            position: selectedRow.p_rec_id,
        });
        setPositionDialog(false);
    };
    const jobLevelClickHandler = (selectedRow) => {
        setJobLevelName(
            selectedRow.job_abbrivation + "-" + selectedRow.job_abbrivation_seniority
        );
        setformJoblevelAssignmentData({
            ...formJoblevelAssignmentData,
            job_level: selectedRow.j_l_rec_id,
        });
        setJobLevelDialog(false);
    };


    const handleErrorResponse = (error) => {
        if (error.status === 400 && error.data?.non_field_errors) {
            showToast(`${error.data.non_field_errors}`, "error");
        } else {
            showToast(<StatusCodeHandler error={error.status} />, "error");
        }
        setFormErrors(error);
    };


    const resetAllForms = () => {
        setformPositionData({
            job: "",
            position: "",
            assignment_start: "",
            assignment_end: "",
            active: true,
            primary_position: false,
            employee: id,
        });
        setformJoblevelAssignmentData({
            job_level: "",
            assignment_start: "",
            assignment_end: "",
            active: true,
            employee: id,
        });
        setJobName("");
        setJobLevelName("");
        setIsRowSelected(false);
        setPositionName("");
        positionrefetch();
        jobLevelrefetch();
    };


    const handlePostJobLevelAssignmentData = async () => {
        if (!isRowSelected) {
            setjobLevelAssignmentField(false);
        }

        try {

            if (!formJoblevelAssignmentData?.job_level && !formJoblevelAssignmentData?.assignment_start) {
                showToast("Job level must be selected before proceeding.", "error");
                return;
            }



            const jobLevelRes = isRowSelected
                ? await updateJobLevelAssignment({ selectedJobId, formJoblevelAssignmentData })
                : await postJobLevelAssignment(formJoblevelAssignmentData);


            if (jobLevelRes?.error) {
                handleErrorResponse(jobLevelRes.error);
                return;
            }

            const positionRes = isRowSelected
                ? await updatePositionAssignment({ selectRowID, formPositionData })
                : await postPositioAssignment(formPositionData);

            console.log("isRowSelected:::", selectRowID)

            if (positionRes?.error) {
                handleErrorResponse(positionRes.error);
                return;
            }
            resetAllForms();
            showToast("Position and job level assigned successfully.", "success");
        } catch (error) {
            showToast(`Error: ${error.message}`, "error");
        }
    };

    useEffect(() => {
        if (Positionassignmentdata && JoblevelAssignmentdata) {
            const newCombinedData = Positionassignmentdata.results.map(api1Item => {
                const correspondingApi2Item = JoblevelAssignmentdata.results.find(
                    api2Item => api2Item.employee.id === api1Item.employee.id
                );

                return {
                    positionAssignment: { ...api1Item },
                    jobLevelAssignment: { ...correspondingApi2Item },
                };
            });

            setCombinedData(newCombinedData);
        }
    }, [Positionassignmentdata, JoblevelAssignmentdata]);

    const checkCompleteness = () => {
        const complete =
            formPositionData?.job !== "" &&
            formPositionData?.position !== "" &&
            formPositionData?.assignment_start !== "";

        // Update isPositionDataComplete state
        setjobLevelAssignmentField(!complete);
    };
    useEffect(() => {
        checkCompleteness();
    });

    const resetForm = () => {
        setFormErrors({});
        setformPositionData({
            job: "",
            position: "",
            assignment_start: "",
            assignment_end: "",
            active: true,
            primary_position: false,
            employee: id,
        });
        positionrefetch();
        setformJoblevelAssignmentData({
            job_level: "",
            assignment_start: "",
            assignment_end: "",
            active: true,
            employee: id,
        });
        setJobName("");
        setJobLevelName("");
        setIsRowSelected(false);
        setPositionName("");
        positionrefetch();
        jobLevelrefetch();
        setfieldsDisable(false);
    };

    const handleClick = (record, index) => {

        setOpen(prevOpen => {
            // Collapse all items except the one that was clicked
            const newOpen = {};
            Object.keys(prevOpen).forEach(key => {
                newOpen[key] = false;
            });
            // Toggle the clicked item - if it was already open, close it, otherwise open it
            newOpen[index] = !prevOpen[index];
            return newOpen;
        });
        setJob_rec_id(record?.positionAssignment?.position?.job?.j_rec_id)
    };

    useEffect(() => {
        if (Positionassignmentdata && Positionassignmentdata?.results?.length > 0) {
            setJob_rec_id(Positionassignmentdata?.results?.position?.job?.j_rec_id);

        }
    }, [Positionassignmentdata]);

    useEffect(() => {
        setJobID(combinedData?.jobLevelAssignment?.job_level?.job?.j_rec_id)
        if (JoblevelAssignmentdata && JoblevelAssignmentdata?.results) {
            const matches = JoblevelAssignmentdata?.results.filter(assignment =>
                assignment?.job_level?.job?.j_rec_id === job_rec_id
            );
            setMatchingJobLevelAssignments(matches);
        }




    }, [job_rec_id]);

    useEffect(() => {

        if (Positionassignmentdata?.results?.length > 0) {
            console.log("Setting up positionAssignmentID:", Positionassignmentdata.results[0].id);
            setPositionAssignmentID([Positionassignmentdata.results[0].id]);
        } else {
            console.log("Setting positionAssignmentID as empty array");
            setPositionAssignmentID([]);
        }
    }, [Positionassignmentdata]);


    //positionDelete
    const handleDeletePositionAssignment = async (positionAssignmentId, assignmentStartDate, jobLevelAssignmentId) => {

        if (!getCurrentDate || isLoading) {
            showToast("Waiting for date data...", "info");
            return;
        }
        const dateString = getCurrentDate?.current_date;
        const [day, month, year] = dateString.split('/');
        const currentDate = new Date(year, month - 1, day);
        const assignmentDate = new Date(assignmentStartDate);

        if (currentDate.getTime() <= assignmentDate.getTime()) {
            try {

                if (jobLevelAssignmentId) {
                    const jobLevelResult = await deleteJobLevelAssignment({ jobLevelAssignmentId });
                    if (jobLevelResult.error) {
                        console.log("Job Level Assignment Deletion Error:", jobLevelResult.error);
                        showToast("Failed to delete job level assignment.", "error");
                        return;
                    }
                    else {
                        console.log("joblevelDelete nahi howa??")
                    }
                }

                const result = await deletePositionAssignment({ positionAssignmentId });
                if (result.error) {
                    console.log("result.error::", result.error)
                    showToast("Failed to delete position assignment.", "error");

                } else {
                    showToast("Position assignment deleted successfully.", "success");
                    positionrefetch();
                    const updatedData = combinedData.filter(item => item.positionAssignment.id !== positionAssignmentId);
                    setCombinedData(updatedData);
                    resetAllForms();
                    resetForm();

                }
            } catch (error) {
                showToast(`Error: ${error.message}`, "error");
            }
        } else {
            showToast("Cannot delete position assignments that have started.", "error");
        }
    };

    console.log("combineData:::", combinedData)


    return (
        <div className="customBox">
            <Box Box className="headContainer">
                <Breadcrumb title="Employee" breadcrumbItem="Employee / Position" />
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Btn type="back" onClick={() => window.history.go(-1)} />
                    <Btn type="new" onClick={() => resetForm()} />
                    <Btn type="delete" onClick={() => {
                        if (positionAssignmentID.length > 0) {
                            handleDeletePositionAssignment(positionAssignmentID[0], formPositionData?.assignment_start, JoblevelAssignmentdata?.results[0]?.id);
                        } else {
                            console.error('positionAssignmentID is undefined or empty');
                        }
                    }} />

                    <Btn
                        type={disableFields ? "edit" : "save"}

                        onClick={
                            disableFields
                                ? () => setfieldsDisable(false)
                                : handlePostJobLevelAssignmentData
                        }
                    />
                </Box>
            </Box>

            {/* make changes  here. i want the dropdown menu here  */}

            {/* Start Dropdown Menu */}
            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={2}>
                    <Box className="form_sidebar">
                        <List
                            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            {combinedData?.map((record, index) => (
                                <React.Fragment key={index}>
                                    <ListItemButton
                                        sx={{ backgroundColor: '#F0F0F0', borderRadius: '4px' }}
                                        onClick={() => handleClick(record, index)}
                                    >
                                        <ListItemText
                                            primary={record?.positionAssignment?.position?.job?.job_title}
                                        />
                                        {open[index] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                        {matchingJobLevelAssignments?.map((jobLevel, index) => (
                                            <List component="div" disablePadding key={index}>
                                                <ListItemButton sx={{ pl: 4 }} onClick={() => handleBoxClick(record, index, jobLevel)}>
                                                    <ListItemText primary={`${jobLevel?.job_level?.job?.job_abbrivation} ${jobLevel?.job_level?.job_abbrivation_seniority}`} />
                                                </ListItemButton>
                                            </List>
                                        ))}
                                    </Collapse>
                                </React.Fragment>
                            ))}
                        </List>

                    </Box>
                </Grid>
                {/* End Dropdown Menu */}

                <Grid item xs={12} md={7} className="employee_form_border">
                    {/* position assignment  */}
                    <Grid item xs={12} sx={{ pr: 1, mt: -3 }}>
                        <HeadingBar title="Position Assignment" />
                        <Grid container columnSpacing={6} sx={{ px: 2 }}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            >
                                {Jobdata && Jobdata.results ? (
                                    <div>
                                        <InputField
                                            name="job"
                                            label="Job"
                                            disabled={disableFields}
                                            placeholder="Enter Job "
                                            type="text"
                                            value={jobName || ""}
                                            isShowIcon={true}
                                            onClick={() => setjobDialogOpen(true)}
                                            mandatory
                                            error={formErrors?.data?.job}
                                        />
                                        <Multi_Dropdown
                                            isOpen={jobDialogOpen}
                                            onClose={() => setjobDialogOpen(false)}
                                            tableRows={Jobdata.results}
                                            tableHeader={JobHeader}
                                            onSelect={jobClickHandler}
                                            RowFilterWith={"j_rec_id"}
                                            MinimumWidth={"500px"}
                                        />
                                    </div>
                                ) : (
                                    <InputField
                                        name="job"
                                        label="Job"
                                        disabled={disableFields}
                                        placeholder="Select Job "
                                        type="text"
                                        value={jobName || ""}
                                        isShowIcon={true}
                                        onClick={() => setjobDialogOpen(true)}
                                        error={formErrors?.data?.job}
                                    />
                                )}

                                <InputField
                                    name="assignment_start"
                                    label="Start Date"
                                    disabled={disableFields}
                                    placeholder="Select Start Date "
                                    type="date"
                                    value={formPositionData.assignment_start}
                                    mandatory={true}
                                    onChange={handlePositionChange}
                                    error={formErrors?.data?.assignment_start}
                                />
                                <InputField
                                    name="assignment_end"
                                    label="End Date"
                                    disabled={disableFields}
                                    placeholder="Select End Date "
                                    type="date"
                                    value={formPositionData.assignment_end}
                                    mandatory={true}
                                    onChange={handlePositionChange}
                                    error={formErrors?.data?.assignment_end}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            >
                                {PositionbyFilterdata && PositionbyFilterdata.results ? (
                                    <div>
                                        <InputField
                                            name="position"
                                            label="Position"
                                            mandatory={true}
                                            disabled={disableFields}
                                            placeholder="Select Position "
                                            value={positionName || ""}
                                            type="text"
                                            isShowIcon={true}
                                            onClick={() => setPositionDialog(true)}
                                            error={formErrors?.data?.position}
                                        />
                                        <Multi_Dropdown
                                            isOpen={positionDialog}
                                            onClose={() => setPositionDialog(false)}
                                            MinimumWidth={"800px"}
                                            tableHeader={PositionHeader}
                                            tableRows={PositionbyFilterdata.results}
                                            onSelect={positionClickHandler}
                                            RowFilterWith={"p_rec_id"}
                                        />
                                    </div>
                                ) : (
                                    <InputField
                                        name="position"
                                        label="Position"
                                        disabled={disableFields}
                                        placeholder="Select Position "
                                        type="text"
                                        InputState={true}
                                        value={positionName ? positionName : ""}
                                        error={formErrors?.data?.position}
                                    />
                                )}
                                <Box
                                    className="inputBox"
                                    sx={{ width: "100%", display: "flex" }}
                                >
                                    <Box
                                        sx={{
                                            width: "40%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "14px", mt: 0.8 }}>
                                            Active:{" "}
                                        </Typography>
                                        <Switch
                                            sx={{ mt: 0.8 }}
                                            size="small"
                                            checked={formPositionData.active}
                                            disabled={disableFields}
                                            onClick={() => {
                                                const handleIsActive = !formPositionData.active;
                                                setformPositionData((prevData) => ({
                                                    ...prevData,
                                                    active: handleIsActive,
                                                }));
                                            }}
                                            name="active"
                                        />
                                    </Box>
                                    <Box sx={{ width: "20%" }} />
                                    <Box
                                        sx={{
                                            width: "40%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                justifyContent: "start",
                                                mt: 0.8,
                                                fontSize: "14px",
                                            }}
                                        >
                                            Primary:{" "}
                                        </Typography>
                                        <Switch
                                            sx={{ mt: 0.8 }}
                                            size="small"
                                            checked={formPositionData.primary_position}
                                            disabled={disableFields}
                                            onClick={() => {
                                                const handleIsPrimary =
                                                    !formPositionData.primary_position;
                                                setformPositionData((prevData) => ({
                                                    ...prevData,
                                                    primary_position: handleIsPrimary,
                                                }));
                                            }}
                                            name="primary_position"
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            ></Grid>
                        </Grid>
                    </Grid>
                    {/* Job Level Assignment  */}
                    <Grid item xs={12} sx={{ pr: 1, mt: -3 }}>
                        <HeadingBar title="Job Level Assignment" />
                        <Grid container columnSpacing={6} sx={{ px: 2 }}>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            >
                                {Jobleveldata && Jobleveldata.results ? (
                                    <div>
                                        <InputField
                                            name="job_level"
                                            mandatory={true}
                                            label="Job Level"
                                            disabled={disableFields}
                                            placeholder="Select Job Level "
                                            value={joblevelName || ""}
                                            type="text"
                                            isShowIcon={true}
                                            onClick={() => setJobLevelDialog(true)}
                                            error={formErrors?.data?.job_level}
                                        />
                                        <Multi_Dropdown
                                            isOpen={joblevelDialog}
                                            onClose={() => setJobLevelDialog(false)}
                                            MinimumWidth={"600px"}
                                            tableHeader={JobLevelHeader}
                                            tableRows={Jobleveldata.results}
                                            onSelect={jobLevelClickHandler}
                                            RowFilterWith={"j_l_rec_id"}
                                        />
                                    </div>
                                ) : (
                                    <InputField
                                        name="job_level"
                                        mandatory={true}
                                        label="Job Level"
                                        disabled={disableFields}
                                        placeholder="Select Job Level "
                                        value={joblevelName || ""}
                                        type="text"
                                        InputState={false}
                                        error={formErrors?.data?.job_level}
                                    />
                                )}
                                <InputField
                                    name="assignment_end"
                                    mandatory={true}
                                    label="End Date"
                                    disabled={jobLevelAssignmentToggle}
                                    placeholder="Select Start Date "
                                    type="date"
                                    value={formJoblevelAssignmentData.assignment_end || " "}
                                    onChange={handleChange}
                                    error={formErrors?.data?.assignment_end}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            >
                                <InputField
                                    name="assignment_start"
                                    mandatory={true}
                                    label="Start Date"
                                    disabled={disableFields}
                                    placeholder="Select Start Date "
                                    type="date"
                                    value={formJoblevelAssignmentData.assignment_start}
                                    onChange={handleChange}
                                    error={formErrors?.data?.assignment_start}
                                />
                                <Box className="inputBox">
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            justifyContent: "start",
                                            mt: 0.8,
                                            gap: 8,
                                            fontSize: "14px",
                                        }}
                                    >
                                        Job Active:{" "}
                                    </Typography>
                                    <Switch
                                        sx={{ ml: 7.5 }}
                                        size="small"
                                        checked={formJoblevelAssignmentData?.active}
                                        disabled={jobLevelAssignmentToggle}
                                        onClick={() => {
                                            const handleIsJobLevelActive =
                                                !formJoblevelAssignmentData?.active;
                                            setIsJobLevelActive(handleIsJobLevelActive);
                                            setformJoblevelAssignmentData((prevData) => ({
                                                ...prevData,
                                                active: handleIsJobLevelActive,
                                            }));
                                        }}
                                        name="active"
                                    />
                                </Box>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            ></Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={2.5}>
                    <EmployeeFormDashboard userId={id} title="Processess" />

                </Grid>
            </Grid>
        </div >
    );
};

export default Position;