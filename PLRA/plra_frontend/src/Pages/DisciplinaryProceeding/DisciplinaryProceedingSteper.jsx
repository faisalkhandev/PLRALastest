import React, { useEffect, useState, useCallback } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid } from "@mui/material"; // Import Grid
import Breadcrumb from '../../Components/Common/BreadCrumb';
import { Loader, CheckBoxDataGrid, BorderLessInput } from '../../Components';
import { showToast } from '../../Components/shared/Toast_Card.jsx';
import { useTheme } from '@emotion/react';
import { useGetAllEmployeeQuery } from '../../Features/API/API.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveData, removeData } from '../../Features/Counter/CounterSlice.js';
import '../Styles.css';
import EmployeeGrid from './steps/EmployeeGrid.jsx';
import Prob_Officer from './steps/Prob_Officer.jsx';
import Inquiry_Officer from './steps/Inquiry_Officer.jsx';
import Inquiry_Reason from './steps/Inquiry_Reason.jsx';
import { usePostDisciplinaryProceedingInquiryMutation } from '../../Features/API/DisciplinaryProceedings.js';

const steps = ['Select Employee', 'Inquiry Reason', 'Select Probe Officer', 'Select Inquiry Officer', 'Inquiry Review'];
const renderNullInRed = (params) => {
    const value = params.value;
    if (value === null) return <span style={{ color: 'red' }}>Null</span>;
    return value;
};

export default function DisciplinaryProceedingSteper() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const [selected, setSelected] = useState(null);
    const [disabledNext, setDisabledNext] = useState(true);
    const [showTextArea, setShowTextArea] = useState(false);
    const [textAreaValue, setTextAreaValue] = useState('');
    const [postDiscipllanaryProceeding] = usePostDisciplinaryProceedingInquiryMutation();
    const [selectedEmployee, setSelectedEmployee] = useState({
        employee: "",
        prob_officer: "",
        regular_inquiry_officer: "",
        inquiry_reason: "",
        remarks_for_other_inquiry_reason: "",
    });

    const [selectedEmployeeName, setSelectedEmployeeNames] = useState({
        employee_name: "",
        prob_officer_name: "",
        regular_inquiry_officer_name: "",
    });

 

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            try {
                const res = await postDiscipllanaryProceeding(selectedEmployee)
                showToast("Disciplinary proceeding initiated successfully.",res);
                setActiveStep(0);
                setTimeout(()=>{
                    navigate('/DisciplinaryProceeding');
                },[1000]) // Reset stepper to the first step
            } catch (error) {
                // Handle API call error
                showToast("Failed to initiate disciplinary proceeding.", "error");
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setDisabledNext(false);
    };

    return (
        <Box style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox'>
            <Breadcrumb title="Discplinary Proceeding" breadcrumbItem="Discplinary Proceeding" />
            <Box>
                <Stepper activeStep={activeStep} sx={{ width: "1000px", m: 'auto', my: 3 }}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (index === activeStep) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <StepLabel {...labelProps}></StepLabel>
                                <Typography variant="body1" color="initial">{label}</Typography>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={() => setActiveStep(0)}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'end', justifyContent: 'end', py: 2 }}>
                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
                        <Button disabled={activeStep === steps.length - 1 ?false :disabledNext} onClick={handleNext}>{activeStep === steps.length - 1 ? 'Initiate' : 'Next'}</Button>
                    </Box>
                    {activeStep === 0 && (
                        <EmployeeGrid
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            setDisabledNext={setDisabledNext}
                            selectedEmployeeName={selectedEmployeeName}
                        setSelectedEmployeeNames={setSelectedEmployeeNames}
                        />
                    )}
                    {activeStep === 1 && (
                        <Inquiry_Reason
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            setDisabledNext={setDisabledNext}
                          
                        />
                    )}
                    {activeStep === 2 && (
                        <Prob_Officer
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            setDisabledNext={setDisabledNext}
                            selectedEmployeeName={selectedEmployeeName}
                            setSelectedEmployeeNames={setSelectedEmployeeNames}
                        />
                    )}
                    {activeStep === 3 && (
                        <Inquiry_Officer
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            setDisabledNext={setDisabledNext}
                            selectedEmployeeName={selectedEmployeeName}
                            setSelectedEmployeeNames={setSelectedEmployeeNames}
                        />
                    )}
                    {activeStep === 4 && (
                        <Box sx={{ width: '80%', m: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}>
                            <Typography variant="h4" color="initial" sx={{ textAlign: 'center', fontWeight: 600 }}>Inquiry Review</Typography>
                            <Grid container xs={12}>
                                <Grid item xs={12}  >
                                    <BorderLessInput label="Employee"         value={selectedEmployeeName.employee_name}    />
                                    <BorderLessInput label="Inquiry Reason"  value={selectedEmployee.inquiry_reason}   />
                                    <BorderLessInput label="Probe Officer"   value={selectedEmployeeName.prob_officer_name}  />
                                    <BorderLessInput label="Inquiry Officer"  value={selectedEmployeeName.regular_inquiry_officer_name}    />
                                   {
                                    selectedEmployee.inquiry_reason === 'Other'?
                                   <BorderLessInput label="Inquiry Reason"  value={selectedEmployee.remarks_for_other_inquiry_reason}    />
                                :null}
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </React.Fragment>
            )}
           
        </Box>
    );
}
