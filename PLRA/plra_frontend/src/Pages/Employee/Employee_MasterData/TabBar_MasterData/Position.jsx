import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid, Switch } from '@mui/material'
import { Btn, HeadingBar, InputField, Multi_Dropdown } from '../../../../Components/index.js'
import Breadcrumb from '../../../../Components/Common/BreadCrumb.jsx'
import { useTheme } from '@emotion/react'
import { toast } from 'react-toastify'
import {
    useGetJobQuery, useGetEmployeeQuery, useGetPositionbyJobCenterFilterQuery,
    useGetJobLevelAssignmentQuery, useGetJobLevelQuery, useUpdatePositionAssignmentMutation,
    useUpdateJobLevelAssignmentMutation, useGetPositionAssignmentQuery, useDeletePositionAssignmentMutation,
    useDeleteJobLevelAssignmentMutation, usePostPositionAssignmentMutation, usePostJobLevelAssignmentforPositionMutation
} from "../../../../Features/API/API.js";
import EmployeeFormDashboard from '../EmployeeDashboard/EmployeeFormDashboard.jsx';
import { JobHeader, PositionHeader, JobLevelHeader } from "../../../../Data/Setup_Data/Setup_Data.jsx";
import { useParams } from 'react-router-dom';





const Position = () => {
    const theme = useTheme();
    const { id } = useParams();
    const [jobDialogOpen, setjobDialogOpen] = useState(false);
    const [activeBoxIndex, setActiveBoxIndex] = useState(0);
    const [jobName, setJobName] = useState("");
    const [positionName, setPositionName] = useState("");
    const [joblevelName, setJobLevelName] = useState("");
    const [formPositionData, setformPositionData] = useState({ position: '', assignment_start: '', active: true, primary_position: false, employee: id });
    const [formJoblevelAssignmentData, setformJoblevelAssignmentData] = useState({ job_level: '', assignment_start: '', active: true, employee: id });
    const [isPrimary, setIsPrimary] = useState(formPositionData.primary_position);
    const [isActive, setIsActive] = useState(formPositionData.active);
    const [isjobLevelActive, setIsJobLevelActive] = useState(formJoblevelAssignmentData.active);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [JobID, setJobID] = useState(null);
    const [CenterID, setCenterID] = useState(null);
    const [positionDialog, setPositionDialog] = useState(false)
    const [joblevelDialog, setJobLevelDialog] = useState(false)
    const [selectRowID, setSelectedRowID] = useState(null);
    const [selectedJobId, setSelectedJobID] = useState(null);
    const [disableFields, setfieldsDisable] = useState(false)
    const [jobLevelAssignmentField, setjobLevelAssignmentField] = useState(true)

    const jobClickHandler = (selectedRow) => {
        setJobID(selectedRow.j_rec_id)
        setJobName(selectedRow.job_title);
        PositionbyFilterdatarefetch()
        setjobDialogOpen(false);
    };



    const { data: Jobdata, isLoading: loading1, isError: refreshError1, error: queryError1 } = useGetJobQuery();
    const { data: Positionassignmentdata, isLoading: loading6, isError: refreshError6, error: queryError6, refetch: positionrefetch } = useGetPositionAssignmentQuery(id);
    const { data: Employeedata, isLoading: loading2, isError: refreshError2, error: queryError2 } = useGetEmployeeQuery(id);
    const { data: PositionbyFilterdata, isLoading: loading3, isError: refreshError3, error: queryError3, refetch: PositionbyFilterdatarefetch } = useGetPositionbyJobCenterFilterQuery({ JobID, CenterID });
    const { data: Jobleveldata, isLoading: loading4, isError: refreshError4, error: queryError4 } = useGetJobLevelQuery({ JobID });
    const { data: JoblevelAssignmentdata, isLoading: loading5, isError: refreshError5, error: queryError5, refetch: jobLevelrefetch } = useGetJobLevelAssignmentQuery(id);

    //post position assignment
    const [postPositioAssignment] = usePostPositionAssignmentMutation();
    const [postJobLevelAssignment] = usePostJobLevelAssignmentforPositionMutation();
    const [jobLevelAssignmentDelete] = useDeleteJobLevelAssignmentMutation();
    const [positiionAssignmentDelete] = useDeletePositionAssignmentMutation();
    const [updatePositionAssignment] = useUpdatePositionAssignmentMutation();
    const [updateJobLevelAssignment] = useUpdateJobLevelAssignmentMutation();

    useEffect(() => {
        if (Employeedata.center !== null) { setCenterID(Employeedata.center) }
        else { setCenterID(Employeedata.center) }
    }, [])

    useEffect(() => {
        if (JobID !== null) {
            PositionbyFilterdatarefetch();
        }
    }, [JobID]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setformJoblevelAssignmentData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handlePositionChange = (event) => {
        const { name, value } = event.target;
        setformPositionData((prevData) => ({ ...prevData, [name]: value }));
    };
    const positionClickHandler = (selectedRow) => {
        setPositionName(selectedRow.position_desc);
        setformPositionData({ ...formPositionData, position: selectedRow.p_rec_id });
        setPositionDialog(false);
    };
    const jobLevelClickHandler = (selectedRow) => {
        setJobLevelName(selectedRow.job_abbrivation + "-" + selectedRow.job_abbrivation_seniority);
        setformJoblevelAssignmentData({ ...formJoblevelAssignmentData, job_level: selectedRow.j_l_rec_id });
        setJobLevelDialog(false);
        console.log(formJoblevelAssignmentData.job_level);
    };
    const handleBoxClick = (record, index) => {
        setfieldsDisable(true)
        setIsRowSelected(true)
        setActiveBoxIndex(index);
        setSelectedRowID(record.positionAssignment.id)
        setSelectedJobID(record.jobLevelAssignment.id)
        setformPositionData({
            job: record.positionAssignment.position.job.j_rec_id, employee: record.positionAssignment.employee.id, position: record.positionAssignment.position.p_rec_id, assignment_start: record.positionAssignment.assignment_start, active: record.positionAssignment.active,
            primary_position: record.positionAssignment.primary_position
        })
        setformJoblevelAssignmentData({ job_level: record.jobLevelAssignment.job_level.j_l_rec_id, assignment_start: record.jobLevelAssignment.assignment_start, active: record.jobLevelAssignment.active, employee: record.jobLevelAssignment.employee.id })
        setJobName(record.positionAssignment.position.job.job_title)
        setPositionName(record.positionAssignment.position.position_desc)
        setJobLevelName(record.jobLevelAssignment.job_level.job_abbrivation)

    };
    const handlePostJobLevelAssignmentData = async (e) => {
        if (isRowSelected) {
            try {
                // Ensure that both promises are started simultaneously
                const positionRes = await updatePositionAssignment({ selectRowID, formPositionData });
                // Handle response for position assignment
                if (positionRes.error) {
                    if (positionRes.error.status === 400) {
                        toast.error("Position ID already exists.", { position: "top-center", autoClose: 3000 });
                    } else {
                        toast.error("Something is wrong with position assignment!!!", { position: "top-center", autoClose: 3000 });
                    }
                } else {
                    const jobLevelRes = await updateJobLevelAssignment({ selectedJobId, formJoblevelAssignmentData });
                    if (jobLevelRes.error) {
                        if (jobLevelRes.error.status === 400) {
                            toast.error("Job Level ID already exists.", { position: "top-center", autoClose: 3000 });
                        } else {
                            toast.error("Something is wrong with job level assignment!!!", { position: "top-center", autoClose: 3000 });
                        }
                    }
                    else {
                        toast.success("Position and job Level data updated successfully.", { position: "top-center", autoClose: 3000 });
                        setformPositionData({ job: '', position: '', assignment_start: '', active: true, primary_position: false, employee: id });
                        positionrefetch();
                        setformJoblevelAssignmentData({ job_level: '', assignment_start: '', active: true, employee: id });
                        positionrefetch();
                        setJobName("")
                        setJobLevelName("")
                        setPositionName("")
                        setfieldsDisable(false)
                        jobLevelrefetch()
                    }
                }
            } catch (err) {
                console.error('Error Assigning Position:', err);
            }
        }
        else {
            if (formPositionData.employee == '' || formPositionData.position == '' || formJoblevelAssignmentData.employee == '' || formJoblevelAssignmentData.assignment_start == '' || formJoblevelAssignmentData.job_level == '') {
                toast.error(`Mandatory field's should not be empty.`, { position: "top-center", autoClose: 3000 })
            }
            else {
                setjobLevelAssignmentField(false)

                try {
                    // Ensure that both promises are started simultaneously
                    const positionRes = await postPositioAssignment(formPositionData);
                    // Handle response for position assignment
                    if (positionRes.error) {
                        if (positionRes.error.status === 400) {
                            toast.error("Position ID already exists.", { position: "top-center", autoClose: 3000 });
                        } else {
                            toast.error("Something is wrong with position assignment!!!", { position: "top-center", autoClose: 3000 });
                        }
                    } else {
                        const jobLevelRes = await postJobLevelAssignment(formJoblevelAssignmentData);
                        if (jobLevelRes.error) {
                            if (jobLevelRes.error.status === 400) {
                                toast.error("Job Level ID already exists.", { position: "top-center", autoClose: 3000 });
                            } else {
                                toast.error("Something is wrong with job level assignment!!!", { position: "top-center", autoClose: 3000 });
                            }
                        }
                        else {
                            toast.success("Position and job Level assigned successfully.", { position: "top-center", autoClose: 3000 });
                            setformPositionData({ job: '', position: '', assignment_start: '', active: true, primary_position: false, employee: id });
                            positionrefetch();
                            setformJoblevelAssignmentData({ job_level: '', assignment_start: '', active: true, employee: id });
                            setJobName("")
                            setJobLevelName("")
                            positionrefetch();
                            jobLevelrefetch()
                            setIsRowSelected(false)
                            setPositionName("")
                        }
                    }
                } catch (err) {
                    console.error('Error Assigning Position:', err);
                }
            }
        }
    };
    const handleDeleteData = async (e) => {
        try {
            const positionRes = await jobLevelAssignmentDelete({ selectedJobId });
            // Handle response for position assignment
            if (positionRes.error) {

                if (positionRes.error.status === 409) { toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 }) }
                else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
            }
            else {
                const jobLevelRes = await positiionAssignmentDelete({ selectRowID });
                // Handle response for job level assignment
                if (jobLevelRes.error) {
                    if (jobLevelRes.error.status === 409) {
                        toast.error("Record not deleted due to connectivity.", { position: "top-center", autoClose: 3000 });
                    } else {
                        toast.error("Something is wrong with job level assignment!!!", { position: "top-center", autoClose: 3000 });
                    }
                } else {
                    toast.success("Position and Job Level data deleted successfully.", { position: "top-center", autoClose: 3000 });
                    setformPositionData({ job: '', position: '', assignment_start: '', active: true, primary_position: false, employee: id });
                    positionrefetch();
                    setformJoblevelAssignmentData({ job_level: '', assignment_start: '', active: true, employee: id });
                    setJobName("")
                    setJobLevelName("")
                    setIsRowSelected(false)
                    setPositionName("")
                    positionrefetch()
                    jobLevelrefetch()
                    setfieldsDisable(false)
                }
            }


        } catch (err) {
            console.error('Error Assigning Position:', err);
        }
    }
    const handleNewRecord = () => {
        setformPositionData({ job: '', position: '', assignment_start: '', active: true, primary_position: false, employee: id });
        setformJoblevelAssignmentData({ job_level: '', assignment_start: '', active: true, employee: id });
        setJobName("")
        setPositionName("")
        setfieldsDisable(false)
        setIsRowSelected(false)
        setJobLevelName("")



    }
    const combinedData = Positionassignmentdata ? Positionassignmentdata.results.map(api1Item => {
        const correspondingApi2Item = JoblevelAssignmentdata ? JoblevelAssignmentdata.results.find(api2Item => api2Item.employee.id === api1Item.employee.id) : null;

        return {
            positionAssignment: { ...api1Item },
            jobLevelAssignment: { ...correspondingApi2Item },
        };
    }) : null;
    const checkCompleteness = () => {
        const complete =
            formPositionData.job !== '' &&
            formPositionData.position !== '' &&
            formPositionData.assignment_start !== '';

        // Update isPositionDataComplete state
        setjobLevelAssignmentField(!complete);
    };
    useEffect(() => {
        checkCompleteness();
    });

    return (
        <div className='customBox'>
            <Box Box className='headContainer' >
                <Breadcrumb title="Employee" breadcrumbItem="Employee / Position" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Btn type="back" onClick={() => window.history.go(-1)} />
                    <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostJobLevelAssignmentData} />
                    {isRowSelected ? <Btn type="delete" onClick={handleDeleteData} /> : null}


                    <Btn type="add" onClick={handleNewRecord} />
                </Box>
            </Box >

            <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
                <Grid item xs={4} md={2.5}>
                    <Box className="form_sidebar">
                        {combinedData && combinedData.length > 0 ? (combinedData.map((record, index) => (

                            <Box key={record.id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                                <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.positionAssignment.position.position_desc}{record.jobLevelAssignment.job_level?.job_abbrivation_seniority}</Typography>
                                <Typography variant="body2" color="initial">{record.positionAssignment.assignment_start}{record.positionAssignment.primary_position}</Typography>
                            </Box>
                        ))) : (
                            <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add position information</Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12} md={7} className="employee_form_border">
                    {/* position assignment  */}
                    <Grid item xs={12} sx={{ pr: 1, mt: -3 }}><HeadingBar title="Position Assignment" />
                        <Grid container columnSpacing={6} sx={{ px: 2 }}>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                {Jobdata && Jobdata.results ?
                                    <div>
                                        <InputField name="job" label="Job" disabled={disableFields} placeholder="Enter Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setjobDialogOpen(true)} mandatory />
                                        <Multi_Dropdown isOpen={jobDialogOpen} onClose={() => setjobDialogOpen(false)} tableRows={Jobdata.results} tableHeader={JobHeader}
                                            onSelect={jobClickHandler}
                                            RowFilterWith={"j_rec_id"}
                                            MinimumWidth={'500px'}
                                        />
                                    </div>
                                    : <InputField name="job" label="Job" disabled={disableFields} placeholder="Select Job " type="text" value={jobName || ""} isShowIcon={true} onClick={() => setjobDialogOpen(true)} />
                                }

                                <InputField name="assignment_start" label="Start Date" disabled={disableFields} placeholder="Select Start Date " type="date" value={formPositionData.assignment_start} mandatory={true} onChange={handlePositionChange} />

                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                {PositionbyFilterdata && PositionbyFilterdata.results ?
                                    <div>
                                        <InputField name="position" label="Position" mandatory={true} disabled={disableFields} placeholder="Select Position " value={positionName || ""} type="text" isShowIcon={true} onClick={() => setPositionDialog(true)} />
                                        <Multi_Dropdown isOpen={positionDialog} onClose={() => setPositionDialog(false)} MinimumWidth={'600px'} tableHeader={PositionHeader} tableRows={PositionbyFilterdata.results}
                                            onSelect={positionClickHandler}
                                            RowFilterWith={"p_rec_id"} />
                                    </div>
                                    :
                                    <InputField name="position" label="Position" disabled={disableFields} placeholder="Select Position " type="text" InputState={true} value={positionName ? positionName : ""} />
                                }
                                <Box className="inputBox" >
                                    <Typography sx={{ fontSize: '14px', mt: 0.8, }} >Active: </Typography>
                                    <Switch sx={{ ml: 12, mr: 3 }} size="small" checked={formPositionData.active} disabled={disableFields} onClick={(e) => { const handleIsActive = !formPositionData.active; setformPositionData((prevData) => ({ ...prevData, active: handleIsActive })); }} name='active' />
                                    <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, fontSize: '14px' }} >Primary: </Typography>
                                    <Switch sx={{ ml: 7.5 }} size="small" checked={formPositionData.primary_position} disabled={disableFields} onClick={(e) => { const handleIsPrimary = !formPositionData.primary_position; setformPositionData((prevData) => ({ ...prevData, primary_position: handleIsPrimary })); }} name='primary_position' />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Job Level Assignment  */}
                    <Grid item xs={12} sx={{ pr: 1, mt: -3 }}><HeadingBar title="Job Level Assignment" />
                        <Grid container columnSpacing={6} sx={{ px: 2 }}>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                {Jobleveldata && Jobleveldata.results ?
                                    <div>
                                        <InputField name="job_level" mandatory={true} label="Job Level" disabled={disableFields || jobLevelAssignmentField} placeholder="Select Job Level " value={joblevelName || ""} type="text" isShowIcon={true} onClick={() => setJobLevelDialog(true)} />
                                        <Multi_Dropdown isOpen={joblevelDialog} onClose={() => setJobLevelDialog(false)} MinimumWidth={'600px'} tableHeader={JobLevelHeader} tableRows={Jobleveldata.results}
                                            onSelect={jobLevelClickHandler}
                                            RowFilterWith={"j_l_rec_id"} />
                                    </div>
                                    :
                                    <InputField name="job_level" mandatory={true} label="Job Level" disabled={disableFields || jobLevelAssignmentField} placeholder="Select Job Level " value={joblevelName || ""} type="text" InputState={true} />
                                }
                                <Box className="inputBox" >
                                    <Typography sx={{ display: 'flex', justifyContent: 'start', mt: 0.8, gap: 8, fontSize: '14px' }} >Job Active: </Typography>
                                    <Switch sx={{ ml: 7.5 }} size="small" checked={formJoblevelAssignmentData.active} disabled={disableFields || jobLevelAssignmentField} onClick={(e) => { const handleIsJobLevelActive = !formJoblevelAssignmentData.active; setIsJobLevelActive(handleIsJobLevelActive); setformJoblevelAssignmentData((prevData) => ({ ...prevData, active: handleIsJobLevelActive })); }} name='active' />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                                <InputField name="assignment_start" mandatory={true} label="Start Date" disabled={disableFields || jobLevelAssignmentField} placeholder="Select Start Date " type="date" value={formJoblevelAssignmentData.assignment_start} onChange={handleChange} />

                            </Grid>

                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={2.5}>
                    <EmployeeFormDashboard />
                </Grid>
            </Grid>


        </div >

    )
}

export default Position