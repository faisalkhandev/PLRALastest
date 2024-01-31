import React, { Fragment, useEffect, useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import { Btn, SimpleDropdown, InputField, SmartInput } from "../../../Components";
import { useTheme } from "@emotion/react";
import { toast } from "react-toastify";
import {
    useLeave_count_postMutation,
    useLeave_approvals_postMutation
} from "../../../Features/API/SetupApi";
import { useNavigate } from "react-router-dom";


const New_Leave_Approvals = () => {
    const [selectedNoOfSteps, setSelectedNoOfSteps] = useState(1);
    const [inputData, setInputData] = useState([]);
    const [from_data, set_from_data] = useState(0);
    const [to_data, set_to_data] = useState(0);

    const theme = useTheme();
    const navigate = useNavigate()

    const No_of_Steps = [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
    ];

    const Authority = [
        { label: "Select The Officer", value: "Select The Officer" },
        { label: "REPORTING OFFICER", value: "REPORTING OFFICER" },
        { label: "DIRECTOR CONCERN", value: "DIRECTOR CONCERN" },
        { label: "ADG ADMIN", value: "ADG ADMIN" },
        { label: "DG", value: "DG" },
    ];

    const approvalTime = [
        { label: "0", value: "0" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ];

    const [Leave_count_post, { data: countData, error: countError, isError: count_is_Error }] = useLeave_count_postMutation();
    const [Leave_approvals_post, { data: leaveApprovalsData, error: leaveApprovalsError, isError: leaveApprovalsIsError }] = useLeave_approvals_postMutation();

    const generateInputFields = () => {
        const inputFields = [];
        for (let i = 1; i <= selectedNoOfSteps; i++) {
            inputFields.push(
                <Grid container spacing={0} key={i}>
                    <Grid
                        item
                        xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, pt: 2, }} name="sr_no"  >
                        {i}
                    </Grid>
                    <Grid item xs={6} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }} >
                        <select
                            name="officer"
                            id={`authority${i}`}
                            className="leave_approval_dropdown"
                            onChange={(event) => handleInputChange(event, i)}
                        >
                            {Authority.map((option) => (
                                <option key={option.value} value={option.value} >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }} >
                        <select
                            name="days"
                            id={`approvalTime${i}`}
                            className="leave_approval_dropdown"
                            onChange={(event) => handleInputChange(event, i)}
                        >
                            {approvalTime.map((option) => (
                                <option key={option.value} value={option.value} >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </Grid>
                </Grid>
            );
        }
        return inputFields;
    };

    const handleGoBack = () => {
        window.history.go(-1);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedInputData = [...inputData];
        updatedInputData[index - 1] = {
            ...updatedInputData[index - 1],
            [name]: value,
        };
        setInputData(updatedInputData);
    };

    const handleNoOfStepsChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedNoOfSteps(selectedValue);
        console.log("Selected No of Approvals:", selectedValue);
    };

    const isDataValid = () => {
        for (const data of inputData) {
            if (!data.days || !data.officer) {
                return false;
            }
        }
        return true;
    };

    const handleSave = async () => {
        if (!from_data || isNaN(from_data) || from_data === 0 || !to_data || isNaN(to_data) || to_data === 0) { toast.error("Please provide valid values for 'From Da' and 'To yDay'."); return; }
        const savedData = inputData.map((data, index) => {
            return {
                NO: index + 1,
                ApprovalAuthority: data.officer,
                ApprovalTime: data.days,
            };
        });

        if (savedData.length !== selectedNoOfSteps) { toast.error(`Number of steps should be ${selectedNoOfSteps}. Please provide values for each step.`); return; }
        if (savedData.length === 0) { toast.error("No steps added. Please add at least one step."); return; }
        const uniqueApprovalAuthorities = new Set(savedData.map(data => data.ApprovalAuthority));
        if (uniqueApprovalAuthorities.size !== savedData.length) { toast.error("Approval Authority must be unique for each step."); return; }
        if (savedData.some(data => !data.ApprovalAuthority)) { toast.error("Approval Authority cannot be empty for any step."); return; }
        if (savedData.some(data => !data.ApprovalTime)) { toast.error("Approval Time cannot be empty for any step."); return; }



        const leavecount_data = {
            min_count: from_data,
            max_count: to_data,
            total_approvals_days: selectedNoOfSteps
        }

        const leave_count_response = await Leave_count_post(leavecount_data);
        const leave_id = leave_count_response?.data?.id;
        if (leave_count_response?.error?.status === 400) {
            console.log(leave_count_response?.error);
            if (leave_count_response?.error?.data?.min_count) {
                toast.error(`${leave_count_response?.error?.data?.min_count}`);
                return
            }
            if (leave_count_response?.error?.data?.max_count) {
                toast.error(`${leave_count_response?.error?.data?.max_count}`);
                return
            }
            if (leave_count_response?.error?.data?.max_count) {
                toast.error(`${leave_count_response?.error?.data?.max_count}`);
                return
            }
        }

        if (selectedNoOfSteps > 0) {
            for (let i = 0; i < selectedNoOfSteps; i++) {
                const leave_approvals_data = {
                    approving_authority: savedData[i].ApprovalAuthority,
                    order: savedData[i].NO,
                    approving_time: savedData[i].ApprovalTime,
                    leave_count: leave_id,
                };
                const approvals_response = await Leave_approvals_post(leave_approvals_data);
                console.log(`Leave_approvals_post response for step ${i + 1}:`, approvals_response);
            }
            setInputData([]);
            set_from_data(0);
            set_to_data(0);
            toast.success("Approvals saved successfully!");

            setTimeout(() => {
                navigate('/employee/setup/Leave_Approvals');
            }, 3000);


        }
        else {
            toast.error("Please provide values for 'Days' and 'Approval Authority' for each step.");
        }
    };



    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "from_date") {
            set_from_data(value);
        } else if (name === "to_date") {
            set_to_data(value);
        }
    };

    const handleReset = () => {
        setInputData([]);
        set_from_data(0);
        set_to_data(0);
        setSelectedNoOfSteps(0);
    };



    useEffect(() => {
        console.log('inputData: ', inputData);
    }, [inputData]);

    return (
        <Fragment>
            <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, alignItems: "center", }} >
                <Typography variant="h4" sx={{ width: "100%", color: theme.palette.primary.main, fontWeight: "500", fontSize: "20px", }} > Leave Approval</Typography>
                <Btn type="back" onClick={handleGoBack} />
                <Btn type="reset" onClick={handleReset} />
                <Btn type="save" onClick={handleSave} />
            </Box>

            <Grid container spacing={4} sx={{ mt: 1 }}>
                <Grid item xs={6} sx={{ display: "flex", gap: 2, alignItems: "center" }} >
                    <SmartInput label="From" name="from_date" value={from_data} onChange={handleChange} />
                    <SmartInput label="To" name="to_date" value={to_data} onChange={handleChange} />
                </Grid>
                <Grid item xs={6}>
                    <SimpleDropdown name='Days' label="No of Approvals" options={No_of_Steps} onChange={handleNoOfStepsChange} value={selectedNoOfSteps} />
                </Grid>
            </Grid>

            <Box sx={{ mt: 2, border: "1px solid white" }}>
                <Grid container spacing={0}>
                    <Grid
                        item
                        xs={2}
                        sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }} >
                        NO#
                    </Grid>
                    <Grid item xs={6} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }} > Approval Authority  </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "0px 4px 0px 0px", }}  >   Approval Time
                    </Grid>
                </Grid>
                {generateInputFields()}
            </Box>
        </Fragment>
    );
};

export default New_Leave_Approvals;
