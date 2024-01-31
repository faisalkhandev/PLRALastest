import React, { Fragment, useState } from "react";
import EmployeeFormDashboard from "../../Pages/Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Switch } from "@mui/material";
import {
  Btn,
  InputField,
  Multi_Dropdown,
  Breadcrumb,
  FileInput,
  HeadingBar, CheckBoxField
} from "../../Components";
import { useTheme } from "@emotion/react";
import "../../Pages/Styles.css";


const Disciplinary_Proceeding_Form = () => {
  const theme = useTheme();
  return (
    <div className="customBox" >
      <Box className="headContainer">
        <Breadcrumb
          title="Employee"
          breadcrumbItem="Employee / Disciplinary Proceeding Form"
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Link to="/DisciplinaryProceeding"><Btn type="back" /> </Link>
          <Btn type="save" />
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
                      <InputField name="employee_no" label="Employee No " placeholder="Enter Employee No" type="text" fullWidth />
                      <InputField name="father_name " label="Father Name " placeholder="Enter Father Name " type="text" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <InputField name="cnic" label="CNIC" placeholder="Enter CNIC" type="text" fullWidth />
                      <InputField name="password" label="Password" placeholder="Enter Password" type="text" fullWidth />


                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HeadingBar title="Employee Details" />
                </Grid>
                <Grid item xs={12}>
                <Grid container columnSpacing={6} sx={{ px: 2 }}>
                  <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                    <InputField name="employee_no" label="Employee Name " placeholder="Enter Employee No" type="text" fullWidth />
                    <InputField name="father_name " label="Wing " placeholder="Enter Father Name " type="text" fullWidth />
                  </Grid>

                  <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                    <InputField name="cnic" label="CNIC" placeholder="Enter CNIC" type="text" fullWidth />
                    <InputField name="password" label="Password" placeholder="Enter Password" type="text" fullWidth />


                  </Grid>
                </Grid>
              </Grid>



                <Grid item xs={12}>
                  <HeadingBar title="Employee Attachments" />
                </Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                      <InputField name="employee_no" label="Employee Name " placeholder="Enter Employee No" type="text" fullWidth />
                      <InputField name="father_name " label="Wing " placeholder="Enter Father Name " type="text" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <InputField name="cnic" label="CNIC" placeholder="Enter CNIC" type="text" fullWidth />
                      <InputField name="password" label="Password" placeholder="Enter Password" type="text" fullWidth />


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
