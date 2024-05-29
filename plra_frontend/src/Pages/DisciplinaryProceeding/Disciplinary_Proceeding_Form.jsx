import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Box, Grid } from "@mui/material";
import { Btn, InputField, Multi_Dropdown, Breadcrumb, HeadingBar, SimpleDropDown } from "../../Components";
import EmployeeFormDashboard from "../../Pages/Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import { useTheme } from "@emotion/react";
import { useDispatch } from 'react-redux';
import { setEmployeeData } from "../../Features/Counter/DPCounterSlice";
import { useParams } from 'react-router-dom';
import { useGetEmployeeByIDQuery } from "../../Features/API/Termination.js"
import "../../Pages/Styles.css";


const Disciplinary_Proceeding_Form = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const params = useParams();

  const [id, setId] = useState(null);
  const [employeetDialog, setEmployeeDialog] = useState(false);
  const [probOfficerDialog, setProbOfficerDialog] = useState(false);
  const [officerDialog, setOfficerDialog] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [formData, setFormData] = useState({
    employeeData: '', probOfficerData: '', officerData: '', inquiryReason: ''
  });


  useEffect(() => {
    const generatedId = generateUniqueId(); // You need to implement this function
    setFormData((prevData) => ({ ...prevData, id: generatedId }));
    setId(params?.id);
  }, []);

  const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError } = useGetEmployeeByIDQuery(id)

  const generateUniqueId = () => {
    return `ID-${Math.floor(Math.random() * 1000000)}`;
  };

  const inquiryTypes = [
    {
      value: 'intelligenceReport',
      label: 'Intelligence Report',
    },
    {
      value: 'complaint',
      label: 'Complaint',
    },
    {
      value: 'corruption',
      label: 'Corruption',
    },
    {
      value: 'misconduct',
      label: 'Misconduct',
    },
    {
      value: 'inefficiency',
      label: 'Inefficiency',
    },
    {
      value: 'referencefromAcDc',
      label: 'Reference from AC/DC',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];

  const tableRows = [
    {
      id: 1,
      employee_no: "emp-11111",
      cnic: "37938-2378347-1",
      first_name: "Haris Rauf",
      passport_number: "863838",
    },
    {
      id: 2,
      employee_no: "emp-11123",
      cnic: "37938-2378347-1",
      first_name: "Babar Azam",
      passport_number: "863838",
    },
    {
      id: 3,
      employee_no: "emp-11113",
      cnic: "37938-2378347-1",
      first_name: "Azam Khan",
      passport_number: "863838",
    },
    {
      id: 4,
      employee_no: "emp-11145",
      cnic: "37938-2378347-1",
      first_name: " Shoaib Malik",
      passport_number: "863838",
    },
    {
      id: 5,
      employee_no: "emp-11161",
      cnic: "37938-2378347-1",
      first_name: "Abdullah Shafique",
      passport_number: "863838",
    },
  ];

  const employeeHeader = [
    {
      field: "employee_no",
      headerName: "Employee Number",
      type: "string",
      flex: true,
      align: "left",
    },
    {
      field: "first_name",
      headerName: "Employee Name",
      type: "string",
      flex: true,

    },
    {
      field: "passport_number",
      headerName: "Passport Number ",
      type: "string",
      flex: true,
    },
  ];
  const employeeClickHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      employeeData: event.first_name,
    }));
    setEmployeeDialog(false);
  };

  const probOfficerClickHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      probOfficerData: event.first_name,
    }));
    setProbOfficerDialog(false);
  };

  const officerClickHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      officerData: event.first_name,
    }));
    setOfficerDialog(false);
  };

  const handleInquiryReasonChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      inquiryReason: event.target.value,
    }));
  };

  const handleStateData = () => {
    console.log(formData)
    dispatch(setEmployeeData(formData))

  }


  
  return (
    <div style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }} className='EmployeeTableBox' >
      <Box className="headContainer">
        <Breadcrumb title="Employee" breadcrumbItem="Employee / Disciplinary Proceeding Form" />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Link to="/DisciplinaryProceeding"><Btn type="back" /> </Link>
          <Link to="/DisciplinaryProceeding"><Btn type="save" onClick={handleStateData} /> </Link>
        </Box>
      </Box>
      <form action="" className="form">
        <Grid container columnSpacing={1} sx={{ height: "calc(100vh -280px)", mt: "-30px" }}  >
          <Grid item xs={12} md={9} className="employee_form_border">
            <Box sx={{ height: "calc(100vh - 280px)", overflowY: "scroll" }}>
              <Grid container columnSpacing={5} sx={{ pr: 1, mt: -2 }} >
                <Grid item xs={12} >
                  <HeadingBar title="Disciplinary Proceeding" />
                </Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                      <div sx={{ cursor: 'pointer' }}>
                        <InputField name="employee" label="Employee " placeholder="Select Employee" isShowIcon={true} value={formData.employeeData} type="text" onClick={() => setEmployeeDialog(true)} mandatory />
                        <Multi_Dropdown RowFilterWith={"id"} isOpen={employeetDialog} MinimumWidth={'500px'} tableHeader={employeeHeader} tableRows={tableRows} onSelect={employeeClickHandler} onClick={() => setEmployeeDialog(false)} />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <SimpleDropDown options={inquiryTypes} mandatory label="Inquiry Reason" onChange={handleInquiryReasonChange} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2, py: 1 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HeadingBar title="Officers Detail" />
                </Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                      <div sx={{ cursor: 'pointer' }}>
                        <InputField name="probofficer" label="Probe Officer" placeholder="Select ProbOfficer" mandatory isShowIcon={true} value={formData.probOfficerData} type="text" onClick={() => setProbOfficerDialog(true)} />
                        <Multi_Dropdown RowFilterWith={"id"} isOpen={probOfficerDialog} MinimumWidth={'500px'} tableHeader={employeeHeader} tableRows={tableRows} onSelect={probOfficerClickHandler} onClick={() => setProbOfficerDialog(true)} />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <div sx={{ cursor: 'pointer' }}>
                        <InputField name="officer" label=" Allegation Officer " placeholder="Select Allegation Officer" mandatory isShowIcon={true} value={formData.officerData} type="text" onClick={() => setOfficerDialog(true)} />
                        <Multi_Dropdown RowFilterWith={"id"} isOpen={officerDialog} MinimumWidth={'500px'} tableHeader={employeeHeader} tableRows={tableRows} onSelect={officerClickHandler} onClick={() => setOfficerDialog(true)} />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <EmployeeFormDashboard />
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default Disciplinary_Proceeding_Form
