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
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import "../../Styles.css";
import Select from 'react-select'



const BasicInformation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const goBack = () => { window.history.go(-1) };
  const [Roles, setRoles] = useState(null)

  //States
  const [isActive, setIsActive] = useState(false);
  const [states, setStates] = useState({ center: "", position: "", reportingofficer: "", counterassigning: "" });
  const [centerDialog, setIsCenterDialog] = useState(false);

  const [formData, setFormData] = useState({
    password: "", last_login: "", employee_no: "", cnic: "", date_of_joining: "", center: "",
    employee_title: "", center: "", e_t_rec_id: null, is_active: false, is_superuser: false, position: "",
    reporting_officer: "", counter_assigning_officer: "", first_name: "", last_name: "", father_name: "", is_staff: "",
    passport_number: "", service_duration: "", domicile_district: "", phoneNumber: "", employee_image: "",
    employee_cnic_front_image: "", employee_cnic_back_image: '"', employee_domicile_image: "", role: "", group: ""
  });


  //Queries
  const { data: EmployeeTitleData, isLoading: EmployeeTitleloading, isError: EmployeeTitlerefreshError, error: EmployeeTitlequeryError, refetch: EmployeeTitlerefetch } = useGetEmployeeTitleQuery();
  const { data: centerData, isLoading: centerloading, isError: centerrefreshError, error: centerequeryError, centerrefetch } = useGetCenterQuery();
  const { data: RoleData, isLoading: RoleLoading, isError: RoleRefreshError, error: RoleQueryError, refetch: RoleRefecth } = useGroupAPIQuery();
  const [EmployeePost] = usePostEmployeeMutation();

  const SelectOptions = RoleData?.results.map(item => ({ value: `${item.id}`, label: `${item.name}` })) || [];

  // functions
  const EmployeeTitle = EmployeeTitleData ? EmployeeTitleData.results.map(item => {
    return { id: item.e_t_rec_id, value: item.employee_title, label: item.employee_title };
  }) : null;

  const RolesData = RoleData ? RoleData.results.map(item => {
    return { id: item.id, value: item.name, label: item.name };
  }) : null;

  const handleFileChange = (e) => {
    const fieldName = e.target.name;
    setFormData(() => ({
      ...formData, [fieldName]: e.target.files[0],
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTitleChange = (event) => {
    const { name, value } = event.target;
    if (name === "employee_title") {
      const selectedTitle = EmployeeTitleData?.results.find((title) => title.employee_title === value);
      const e_t_rec_id = selectedTitle ? selectedTitle.e_t_rec_id : null;

      setFormData((prevData) => ({
        ...prevData, employee_title: value, e_t_rec_id: e_t_rec_id,
      }));
    }
  };

  const handleRoleChange = (event) => {
    const { name, value } = event.target;
    const selectedRole = RoleData?.results.find((role) => role.name === value);
    const roleId = selectedRole ? selectedRole.id : null;
    setFormData((prevData) => ({
      ...prevData, group: roleId, role: value
    }));
  };

  const CenterClickhandler = (selectedRow) => {
    setFormData({ ...formData, center: selectedRow.c_rec_id })
    setStates({ ...states, center: selectedRow.center_name })
    setIsCenterDialog(false)
  };

  const handlePostData = async (e) => {
    if (
      formData.first_name === '' ||
      formData.last_name === '' ||
      formData.father_name === '' ||
      formData.cnic === '' ||
      formData.passport_number === '' ||
      formData.center === ''
    ) {
      toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000 });
    } else {
      try {
        e.preventDefault();
        let formD = new FormData();
        formD.append('first_name', formData.first_name);
        formD.append('password', formData.cnic);
        formD.append('last_name', formData.last_name);
        formD.append('cnic', formData.cnic);
        formD.append('date_of_joining', formData.date_of_joining);
        formD.append('father_name', formData.father_name);
        formD.append('domicile_district', formData.domicile_district);
        if ((typeof formData.employee_domicile_image !== 'string') && formData.employee_domicile_image != null) {
          formD.append("employee_domicile_image", formData.employee_domicile_image);
        }
        if ((typeof formData.employee_image !== 'string') && formData.employee_image != null) {
          formD.append("employee_image", formData.employee_image);
        }
        if ((typeof formData.employee_cnic_front_image !== 'string') && formData.employee_cnic_front_image != null) {
          formD.append("employee_cnic_image_front", formData.employee_cnic_front_image);
        }
        if ((typeof formData.employee_cnic_back_image !== 'string') && formData.employee_cnic_back_image != null) {
          formD.append("employee_cnic_image_back", formData.employee_cnic_back_image);
        }
        formD.append('date_of_joining', formData.date_of_joining);
        formD.append('center', formData.center);
        formD.append('last_login', formData.last_login);
        formD.append('passport_number', formData.passport_number);
        formD.append('is_active', formData.is_active);
        formD.append('phoneNumber', formData.phoneNumber);
        formD.append('employee_no', formData.employee_no);
        formD.append('employee_title', formData.e_t_rec_id);
        formD.append('role', Roles);

        const res = await EmployeePost(formD);

        if (res.error && res.error.status === 400) {
          return toast.error('Record not created.', { position: 'top-center', autoClose: 3000, });
        } else {
          toast.success('Record created successfully.', { position: 'top-center', autoClose: 3000 });
          navigate('/employee')
        }
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!!!', { position: 'top-center', autoClose: 3000 });
      }
    }
  };
  const handleRoleChangeDropDown = (selectedOptions) => {
    const newArrayOfValues = selectedOptions?.map(item => (item.value)) || [];
    setRoles(newArrayOfValues)
  };




  return (
    <div className="customBox" style={{ maxWidth: "1300px", margin: '20px auto', height: "calc(100vh - 100px)" }}>
      <Box className="headContainer">
        <Breadcrumb
          title="Employee"
          breadcrumbItem="Employee / Basic Information"
        />
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
                      <InputField name="employee_no" label="Employee No " onChange={handleChange} type="text" fullWidth mandatory />
                      <SimpleDropdown name="employee_title" label="Title" value={formData.employee_title || ""} options={EmployeeTitle ? EmployeeTitle : ""} onChange={handleTitleChange} type="text" fullWidth />
                      <InputField name="first_name" onChange={handleChange} label=" First Name " mandatory={true} type="text" fullWidth />
                      <InputField name="last_name" label="Last Name" onChange={handleChange} mandatory={true} type="text" fullWidth />
                      <InputField name="father_name" label="Father Name " onChange={handleChange} mandatory={true} type="text" fullWidth />
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>CNIC <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span> :</label>
                        <InputMask mask="99999-9999999-9" name="cnic" value={formData.cnic} onChange={handleChange} type="text" className="FormInput" />
                      </Box>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>Phone Number <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span> :</label>
                        <InputMask mask="+999999999999" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="text" className="FormInput" placeholder="+92XXXXXXXXXX" />
                      </Box>
                      <InputField name="passport_number" label="Passport No" onChange={handleChange} mandatory={true} type="text" fullWidth />
                      <InputField name="domicile_district" label="Domicile District " onChange={handleChange} mandatory={true} type="text" fullWidth />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}> <HeadingBar title="Employee Details" /></Grid>
                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {centerData && centerData.results ?
                        <div>
                          <InputField name="center" mandatory={true} label="Center" required={true} type="text" isShowIcon={true} value={states.center || ""} onClick={() => { setIsCenterDialog(true); }} />
                          <Multi_Dropdown
                            isOpen={centerDialog}
                            onClose={() => setIsCenterDialog(false)}
                            MinimumWidth={'600px'}
                            tableRows={centerData.results}
                            tableHeader={CenterHeader}
                            onSelect={CenterClickhandler}
                            RowFilterWith='c_rec_id'
                          />
                        </div> : <InputField name="center" mandatory={true} label="Center " type="text" isShowIcon={true} value={states.center} />
                      }

                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row", alignItems: "center" }} >
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 6, fontSize: '15px' }} >Active:
                          <Switch size="small" checked={formData.is_active} onClick={(e) => { const handleSuperUser = !isActive; setIsActive(handleSuperUser); setFormData((prevData) => ({ ...prevData, is_active: handleSuperUser })); }} name='active' /></Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }} >

                      {/* ReactSelect  */}
                      <Box className="inputBox">
                        <label htmlFor="" >Role</label>
                        <Select
                          options={SelectOptions}
                          defaultInputValue={Roles}
                          placeholder="Select Role"
                          onChange={handleRoleChangeDropDown}
                          isMulti
                          isSearchable
                          noOptionsMessage={() => "No Role Fonnd..."}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              Color: state.isFocused ? 'red' : "yellow",
                              borderColor: 'green',
                              padding: 2,
                              width: "411px",
                              height: "31px",
                              minHeight: "unset",
                              padding: '0px',
                              cursor: 'pointer',
                            }),
                            multiValueRemove: (baseStyles, state) => ({
                              ...baseStyles,
                              Color: state.isFocused ? 'red' : "gray",
                              backgroundColor: state.isFocused ? 'red' : "gray",
                            }),
                            menuList: (baseStyles) => ({
                              ...baseStyles,
                              padding: 0,
                              maxHeight: "150px",
                            }),
                          }}
                        />
                      </Box>
                      {/* <SimpleDropdown name="employee_title" label="Role" value={formData.role || ""} options={RolesData ? RolesData : ""} onChange={handleRoleChange} type="text" fullWidth /> */}
                      <InputField name="date_of_joining" label="Date Of Joining" onChange={handleChange} placeholder="Enter Date Of Joining" type="date" fullWidth />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HeadingBar title="Employee Attachments" />
                </Grid>

                <Grid item xs={12} sx={{ mb: 3 }}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                      <InputField name="employee_image" label="Employee Image" onChange={handleFileChange} type="file" fullWidth />
                      <InputField name="employee_domicile_image" label="Employee Domicile" onChange={handleFileChange} type="file" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <InputField name="employee_cnic_front_image" label="CNIC Back Image" onChange={handleFileChange} type="file" fullWidth />
                      <InputField name="employee_cnic_back_image" label="CNIC Front Image" onChange={handleFileChange} type="file" fullWidth />
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
