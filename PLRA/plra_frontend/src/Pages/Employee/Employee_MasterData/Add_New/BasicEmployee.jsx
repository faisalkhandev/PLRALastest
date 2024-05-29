import React, { useState } from "react";
import { Box, Typography, Grid, Switch } from "@mui/material";
import { Btn, InputField, Multi_Dropdown, Breadcrumb, HeadingBar } from "../../../../Components";
import InputMask from 'react-input-mask';
import { CenterHeader } from '../../../../Data/Setup_Data/Setup_Data'
import {
  useGetCenterQuery, usePostEmployeeMutation, useGetEmployeeTitleQuery
} from '../../../../Features/API/API.js'
import { useGroupAPIQuery } from '../../../../Features/API/RoleManagement.js'
import SimpleDropdown from "../../../../Components/Common/SimpleDropDown.jsx";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import "../../Styles.css";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { showToast } from "../../../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from './../../../../Components/Common/StatusCodeHandler';



const BasicInformation = () => {
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();
  const goBack = () => { window.history.go(-1) };
  const [Roles, setRoles] = useState(null)

  //States
  const [isActive, setIsActive] = useState(false);
  const [states, setStates] = useState({ center: "", position: "", reportingofficer: "", counterassigning: "" });
  const [centerDialog, setIsCenterDialog] = useState(false);
  const animatedComponents = makeAnimated();

  const [formData, setFormData] = useState({
    password: null, employee_no: "", cnic: "", date_of_joining: null, center: null, passport_number: null,
    title: "", center: null, e_t_rec_id: null, is_active: false, is_superuser: false, position: null,
    reporting_officer: null, counter_assigning_officer: null, first_name: "", last_name: "", father_name: "", is_staff: null,
    passport_number: null, service_duration: null, domicile_district: "", phoneNumber: null, employee_image: null,
    employee_cnic_front_image: null, employee_cnic_back_image: null, employee_domicile_image: null, role: null, group: [],
  }); 


  //Queries
  const { data: EmployeeTitleData, isLoading: EmployeeTitleloading, isError: EmployeeTitlerefreshError, error: EmployeeTitlequeryError, refetch: EmployeeTitlerefetch } = useGetEmployeeTitleQuery();
  const { data: centerData, isLoading: centerloading, isError: centerrefreshError, error: centerequeryError, centerrefetch } = useGetCenterQuery();
  const { data: RoleData, isLoading: RoleLoading, isError: RoleRefreshError, error: RoleQueryError, refetch: RoleRefecth } = useGroupAPIQuery();
  const [EmployeePost] = usePostEmployeeMutation();

  const SelectOptions = RoleData?.results.map(item => ({ value: `${item.id}`, label: `${item.name}` })) || [];

  // functions
  const EmployeeTitle = EmployeeTitleData ? EmployeeTitleData.results.map(item => {
    return {
      id: item?.e_t_rec_id,
      value: item?.employee_title,
      label: item?.employee_title
    };
  }) : null;

  const options = RoleData?.results?.map(role => ({
    value: role?.id,
    label: role?.name
  })) || [];

  const handleFileChange = (e) => {
    const fieldName = e?.target?.name;
    setFormData(() => ({
      ...formData, [fieldName]: e?.target?.files[0],
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTitleChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") {
      const selectedTitle = EmployeeTitleData?.results.find((title) => title.employee_title === value);
      const e_t_rec_id = selectedTitle ? selectedTitle.e_t_rec_id : null;

      setFormData((prevData) => ({ ...prevData, title: value, e_t_rec_id: e_t_rec_id }));
    }
  };

  const handleRoleChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevData => ({
      ...prevData,
      group: selectedValues
    }));
  };
  


  const CenterClickhandler = (selectedRow) => {
    setFormData({ ...formData, center: selectedRow.c_rec_id })
    setStates({ ...states, center: selectedRow.center_name })
    setIsCenterDialog(false)
  };

  const handlePostData = async (e) => {
    try {
      e.preventDefault();
      let formD = new FormData();
      let cnicWithoutHyphens = formData?.cnic?.replace(/-/g, '');
      // Append form data
      formD.append('first_name', formData.first_name);
      formD.append('password', cnicWithoutHyphens);
      formD.append('last_name', formData.last_name);
      formD.append('cnic', cnicWithoutHyphens);
      formD.append('date_of_joining', formData.date_of_joining);
      formD.append('father_name', formData.father_name);
      formD.append('domicile_district', formData.domicile_district);
      // Append images if they are not null and not strings
      if (formData.employee_domicile_image instanceof File) {
        formD.append("employee_domicile_image", formData.employee_domicile_image);
      }
      if (formData.employee_image instanceof File) {
        formD.append("employee_image", formData.employee_image);
      }
      if (formData.employee_cnic_front_image instanceof File) {
        formD.append("employee_cnic_image_front", formData.employee_cnic_front_image);
      }
      if (formData.employee_cnic_back_image instanceof File) {
        formD.append("employee_cnic_image_back", formData.employee_cnic_back_image);
      }
      if (formData.e_t_rec_id) {
        formD.append('title', formData.e_t_rec_id);
      }
      // Append other form fields
      formD.append('date_of_joining', formData.date_of_joining);
      formD.append('center', formData.center);
      formD.append('is_active', formData.is_active);
      formD.append('phoneNumber', formData.phoneNumber);
      formD.append('passport_number', formData.passport_number);
      formD.append('employee_no', formData.employee_no);
      formD.append('title', formData.e_t_rec_id);

      if (formData.group && Array.isArray(formData.group)) {
        formData.group.forEach((group) => {
          formD.append("groups", group.toString()); 
        });
      }

      // Make POST request
      const res = await EmployeePost(formD);

      if (res?.error && res.error.status) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        // Handle API errors here
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      } else {
        showToast(`Record created Successfully`, "success");
        resetForm();
        navigate('/employee');
      }
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }

  const resetForm = () => {
    setFormErrors({});
  };




  return (
    <div className="customBox" style={{ maxWidth: "1300px", margin: '20px auto', height: "calc(100vh - 100px)" }}>
      <Box className="headContainer">
        <Breadcrumb title="Employee" breadcrumbItem="Employee / Basic Information" />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Btn type="back" onClick={() => window.history.go(-1)} />
          <Btn type="save" onClick={handlePostData} />
        </Box>
      </Box>
      <form action="" className="form">
        <Grid
          container
          columnSpacing={1}
          sx={{ height: "calc(100vh - 300px)", mt: "-40px" }} >
          <Grid item xs={12} className="employee_form_border">
            <Box style={{ height: "calc(100vh - 200px)", overflowY: "scroll" }}>
              <Grid container columnSpacing={5} sx={{ pr: 1, mt: -2 }}>
                <Grid item xs={12}>
                  <HeadingBar title="Basic Information" />
                </Grid>

                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                      <InputField name="employee_no" label="Employee No " onChange={handleChange} type="text" fullWidth mandatory error={formErrors?.data?.employee_no} />
                      <SimpleDropdown name="title" label="Title" value={formData.title} options={EmployeeTitle ? EmployeeTitle : ""} onChange={handleTitleChange} type="text" fullWidth error={formErrors?.data?.title} helperText={formErrors?.data?.title} />
                      <InputField name="first_name" onChange={handleChange} label=" First Name " mandatory={true} type="text" fullWidth error={formErrors?.data?.first_name} />
                      <InputField name="last_name" label="Last Name" onChange={handleChange} mandatory={true} type="text" fullWidth error={formErrors?.data?.last_name} />
                      <InputField name="father_name" label="Father Name" onChange={handleChange} mandatory={true} type="text" fullWidth error={formErrors?.data?.father_name} />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>CNIC<span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span> :</label>
                        <InputMask mask="99999-9999999-9" name="cnic" value={formData.cnic} onChange={handleChange} type="text" className="FormInput" style={{ border: formErrors?.data?.cnic ? '1px solid red' : '' }} />
                      </Box> {formErrors?.data?.cnic && (<span style={{ color: 'red', marginLeft: '160px', marginTop: '-12px' }}>  {formErrors?.data?.cnic}  </span>)}

                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>Phone Number<span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span> :</label>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'start', flexDirection: 'column' }}>
                          <InputMask mask="+999999999999" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="text" className="FormInput" placeholder="+92XXXXXXXXXX" error={formErrors?.data?.phoneNumber} style={{ border: formErrors?.data?.phoneNumber ? `1px solid ${theme.palette.error.main}` : '1px solid #ccc' }} />
                          {formErrors?.data?.phoneNumber && ( // Displaying error message if present
                            <span style={{ color: `${theme.palette.error.main}` }}>{formErrors.data.phoneNumber}</span>
                          )}
                        </div>
                      </Box>

                      <InputField name="passport_number" label="Passport No" onChange={handleChange} type="text" fullWidth error={formErrors?.data?.passport_number} />
                      <InputField name="domicile_district" label="Domicile District " onChange={handleChange} mandatory={true} type="text" fullWidth error={formErrors?.data?.domicile_district} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}> <HeadingBar title="Employee Details" /></Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {centerData && centerData.results ?
                        <div>
                          <InputField name="center" mandatory={true} label="Center" required={true} type="text" isShowIcon={true} value={states.center || ""} onClick={() => { setIsCenterDialog(true); }} error={formErrors?.data?.center} />
                          <Multi_Dropdown isOpen={centerDialog} onClose={() => setIsCenterDialog(false)} MinimumWidth={'600px'} tableRows={centerData.results} tableHeader={CenterHeader} onSelect={CenterClickhandler} RowFilterWith='c_rec_id' />
                        </div> : <InputField name="center" mandatory={true} label="Center " type="text" isShowIcon={true} value={states.center} error={formErrors?.data?.center} />
                      }

                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }} >
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 6, fontSize: '15px' }} >Active:
                          <Switch size="small" checked={formData.is_active} onClick={(e) => { const handleSuperUser = !isActive; setIsActive(handleSuperUser); setFormData((prevData) => ({ ...prevData, is_active: handleSuperUser })); }} name='active' /></Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }} >
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }} >Role
                          {/* <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>  */}
                          :</label>
                        <Box width={{ width: "100%" }}>
                          <Select
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            onChange={handleRoleChange}
                            options={options}
                            isMulti
                          />
                        </Box>
                        {/* <InputMask mask="99999-9999999-9" name="cnic" value={formData.cnic} onChange={handleChange} type="text" className="FormInput" /> */}
                      </Box>
                      {/* <SimpleDropdown name="employee_title" label="Role" value={formData.role || ""} options={RolesData ? RolesData : ""} onChange={handleRoleChange} type="text" fullWidth /> */}
                      <InputField name="date_of_joining" label="Date Of Joining" onChange={handleChange} placeholder="Enter Date Of Joining" type="date" fullWidth error={formErrors?.data?.date_of_joining} />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HeadingBar title="Employee Attachments" />
                </Grid>

                <Grid item xs={12} sx={{ mb: 3 }}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                      <InputField name="employee_image" label="Employee Image" onChange={handleFileChange} type="file" fullWidth error={formErrors?.data?.employee_image} />
                      <InputField name="employee_domicile_image" label="Employee Domicile" onChange={handleFileChange} type="file" fullWidth error={formErrors?.data?.employee_domicile_image} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <InputField name="employee_cnic_front_image" label="CNIC Front Image" onChange={handleFileChange} type="file" fullWidth error={formErrors?.data?.employee_cnic_front_image} />
                      <InputField name="employee_cnic_back_image" label="CNIC Back Image" onChange={handleFileChange} type="file" fullWidth error={formErrors?.data?.employee_cnic_back_image} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default BasicInformation;