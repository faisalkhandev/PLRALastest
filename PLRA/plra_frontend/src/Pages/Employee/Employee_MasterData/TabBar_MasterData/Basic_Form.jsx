import React, { useMemo, useLayoutEffect, useState, useEffect } from "react";
import { Box, Typography, Grid, Switch, Dialog } from "@mui/material";
import {
  Btn, InputField, Multi_Dropdown, Breadcrumb, HeadingBar
} from "../../../../Components";
import { useTheme } from "@emotion/react";
import "../../Styles.css";
import SimpleDropdown from "../../../../Components/Common/SimpleDropDown";
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard";
import { toast } from 'react-toastify'
import { CenterHeader, CounterAssigningHeader, PositionHeader, ReportingHeader } from '../../../../Data/Setup_Data/Setup_Data'
import {
  useGetCenterQuery, useGetEmployeeQuery, useGetEmployeeTitleQuery,
  useGetAllEmployeeQuery, useGetPositionQuery, useUpdateEmployeeMutation, useGetDistrictQuery
} from '../../../../Features/API/API.js'
import { useParams } from "react-router-dom";
import InputMask from 'react-input-mask';
import { useGroupAPIQuery } from '../../../../Features/API/RoleManagement.js'
import { Warning } from "../../../../Assets/Icons/index.jsx";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';



const Basic_Form = () => {
  const theme = useTheme()
  //States
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [states, setStates] = useState({ title: "", center: "", position: "", reportingofficer: "", counterassigning: "" })
  const [centerDialog, setIsCenterDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [positionDialog, setIsPositionDialog] = useState(false);
  const [reportingofficerDialog, setIsReportingofficerDialog] = useState(false);
  const [districtDialog, setDistrictDialog] = useState(false);
  const [districtData, setDistrictData] = useState("");
  const [counterassigningDialog, setIsCounterassigningDialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [disableFields, setfieldsDisable] = useState(false)
  const [allwaysDisable, setAllwaysDisable] = useState(false);

  const [selectedImagePaths, setSelectedImagePaths] = useState([]);
  const [selectedDomicilePaths, setSelectedDomicilePaths] = useState([]);
  const [selectedCnicPaths, setSelectedCnicPaths] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const animatedComponents = makeAnimated();


  const [formData, setFormData] = useState({
    // password: "",
    employee_no: "", cnic: "", date_of_joining: "", title: "", center: "",
    is_active: false, is_superuser: false, position: "", reporting_officer: "",
    counter_assigning_officer: "", first_name: "", last_name: "", father_name: "", is_staff: "",
    passport_number: "", service_duration: "", domicile_district: "", phoneNumber: "", role: "", group: "",
    employee_image: "", employee_cnic_image_front: "", employee_cnic_image_back: "", employee_domicile_image: ""
  });


  //Queries
  const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError, error: EmployeequeryError, refetch: Employeerefetch } = useGetEmployeeQuery(id);
  const { data: reportingData, isLoading: reportingloading, isError: reportingrefreshError, error: reportingqueryError, reportingrefetch } = useGetAllEmployeeQuery();
  const { data: counterAssigning, isLoading: counterAssigningloading, isError: counterAssigningrefreshError, error: counterAssigningqueryError, counterAssigningrefetch } = useGetAllEmployeeQuery();
  const { data: centerData, isLoading: centerloading, isError: centerrefreshError, error: centerequeryError, centerrefetch } = useGetCenterQuery();
  const { data: positionData, isLoading: positionloading, isError: positionrefreshError, error: positionError, positionrefetch } = useGetPositionQuery();
  const { data: EmployeeTitleData, isLoading: EmployeeTitleloading, isError: EmployeeTitlerefreshError, error: EmployeeTitlequeryError, refetch: EmployeeTitlerefetch } = useGetEmployeeTitleQuery();
  const { data: d_data, isLoading: d_loading, isError: d_refreshError, error: d_queryError } = useGetDistrictQuery();
  const { data: RoleData, isLoading: RoleLoading, isError: RoleRefreshError, error: RoleQueryError, refetch: RoleRefecth } = useGroupAPIQuery();
  const [EmployeeUpdate] = useUpdateEmployeeMutation();
  const [assignedGroups, setAssignedGroups] = useState([]);

  const options = useMemo(() => {
    return RoleData?.results?.map(role => ({
      value: role.id,
      label: role.name
    })) || [];
  }, [RoleData]);


  useEffect(() => {
    if (EmployeeData && options.length > 0) {
      const newAssignedRoles = options.filter(option =>
        EmployeeData.groups.some(group => group.id === option.value)
      );
      setAssignedGroups(newAssignedRoles);
    }
  }, [EmployeeData, options]);  // Include options in the dependencies



  // useEffect(() => {
  //   if (EmployeeData && EmployeeData.groups?.length > 0) {
  //     console.log("assignedRoles========>", EmployeeData.groups);
  //     const assignedRoles = options.filter(option =>
  //       EmployeeData.groups.includes(option.value)
  //     );
  //     console.log("Old  Assigned Roles:", assignedRoles);
  //     setAssignedGroups(assignedRoles);
  //   }
  // }, [EmployeeData, options]);


  const handleRoleChange = (selectedOptions) => {
    setAssignedGroups(selectedOptions);
  };


  const getFilteredOptions = () => {
    return options.filter(option =>
      !assignedGroups.map(group => group.value).includes(option.value)
    );
  };


  const EmployeeTitle = EmployeeTitleData ? EmployeeTitleData?.results?.map(item => {
    return {
      id: item.e_t_rec_id,
      value: item.employee_title,
      label: item.employee_title
    };
  }) : null;

  useEffect(() => {
    if (EmployeeData) {
      const {
        id, employee_no, cnic, first_name, last_name,
        father_name,
        domicile_district, phoneNumber, employee_image, employee_cnic_image_back,
        employee_domicile_image, date_of_joining, service_duration, is_staff, is_active, is_superuser, title,
        center, position, reporting_officer, counter_assigning_officer, employee_cnic_image_front, passport_number
      } = EmployeeData;
      setSelectedRowID(id)
      const mappedTitle = EmployeeTitleData && EmployeeTitleData?.results?.find(item => item?.e_t_rec_id === title);
      const mappedCenter = centerData && centerData?.results?.find(item => item?.c_rec_id === center);

      setStates({
        ...states,
        title: title?.employee_title,
        center: center?.center_name,
        counterassigning: counter_assigning_officer ? counter_assigning_officer?.first_name + " " + counter_assigning_officer?.last_name : null,
        reportingofficer: reporting_officer ? reporting_officer?.first_name + " " + reporting_officer?.last_name : null,
        position: position?.position_desc
      });

      setFormData({
        first_name: first_name, employee_no: employee_no, cnic: cnic,
        // password: cnic,
        date_of_joining: date_of_joining, title: title?.e_t_rec_id, center: center?.c_rec_id,
        is_active: is_active, is_superuser: is_superuser, position: position, reporting_officer: reporting_officer ? reporting_officer?.id : null,
        counter_assigning_officer: counter_assigning_officer ? counter_assigning_officer?.id : null, last_name: last_name, father_name: father_name, is_staff: is_staff,
        passport_number: passport_number, service_duration: service_duration, domicile_district: domicile_district, phoneNumber: phoneNumber,
        employee_image: employee_image, employee_domicile_image: employee_domicile_image,
        employee_cnic_image_front: employee_cnic_image_front, employee_cnic_image_back: employee_cnic_image_back,
      });
      setfieldsDisable(true);
      setAllwaysDisable(true);
    }
  }, [EmployeeData, EmployeeTitleData, centerData]);

  const CenterClickhandler = (selectedRow) => {
    setFormData({ ...formData, center: selectedRow?.c_rec_id })
    setStates({ ...states, center: selectedRow?.center_name })
    setIsCenterDialog(false)
  }

  const PositionClickhandler = (selectedRow) => {
    setFormData({ ...formData, position: selectedRow?.p_rec_id })
    setStates({ ...states, position: selectedRow?.position_desc })
    setIsPositionDialog(false)
  }

  const ReportingOfficerClickhandler = (selectedRow) => {
    setFormData({ ...formData, reporting_officer: selectedRow?.id })
    setStates({ ...states, reportingofficer: selectedRow?.first_name })
    setIsReportingofficerDialog(false)
  }

  const CounterAssigningClickhandler = (selectedRow) => {
    setFormData({ ...formData, counter_assigning_officer: selectedRow?.id })
    setStates({ ...states, counterassigning: selectedRow?.first_name })
    setIsCounterassigningDialog(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleFileChange = (e) => {
    const fieldName = e.target.name;
    setFormData(() => ({ ...formData, [fieldName]: e?.target?.files[0] }));
  };

  const extractGroupValues = (groups) => {
    return groups.map(group => group.value);
  }

  const handleUpdateData = async (e) => {
    try {
      e.preventDefault();
      let formD = new FormData();
      formD.append('first_name', formData?.first_name);
      // formD.append('password', formData.password);
      formD.append("last_name", formData?.last_name);
      formD.append("passport_number", formData?.passport_number);
      formD.append("cnic", formData?.cnic);
      if (formData?.title !== undefined) {
        formD.append("title", formData?.title);
      }
      formD.append("date_of_joining", formData?.date_of_joining);
      formD.append("father_name", formData?.father_name);
      formD.append("domicile_district", formData?.domicile_district);
      if ((typeof formData?.employee_domicile_image !== 'string') && formData?.employee_domicile_image != null) {
        formD.append("employee_domicile_image", formData?.employee_domicile_image);
      }
      if ((typeof formData?.employee_image !== 'string') && formData?.employee_image != null) {
        formD.append("employee_image", formData?.employee_image);
      }
      if ((typeof formData?.employee_cnic_image_front !== 'string') && formData?.employee_cnic_image_front != null) {
        formD.append("employee_cnic_image_front", formData?.employee_cnic_image_front);
      }
      if ((typeof formData?.employee_cnic_image_back !== 'string') && formData?.employee_cnic_image_back != null) {
        formD.append("employee_cnic_image_back", formData.employee_cnic_image_back);
      }
      formD.append("date_of_joining", formData?.date_of_joining);
      formD.append("center", formData?.center);
      formD.append("is_active", formData?.is_active);
      formD.append("phoneNumber", formData?.phoneNumber);
      const groupValues = extractGroupValues(assignedGroups);

      if (groupValues) {
        groupValues.forEach(value => {
          formD.append("groups", value);
        });
      }
      const res = await EmployeeUpdate({ id, formD });
      if (res?.error) {
        if (res?.error?.status === 400) { toast.error("Record not updated.", { position: "top-center", autoClose: 3000 }) } else if (res?.error?.status === 409) {
          toast.error("Conflict: The resource is already linked.", { position: "top-center", autoClose: 3000 });
        }
        else { toast.error("Something is wrong!!!", { position: "top-center", autoClose: 3000 }) }
      } else {
        toast.success("Record updated.", { position: "top-center", autoClose: 3000 });
        setfieldsDisable(false)
      }
      Employeerefetch();
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleTitleChange = (event) => {
    const { name, value } = event.target;
    if (name === "employee_title") {
      const selectedTitle = EmployeeTitleData?.results?.find((title) => title?.employee_title === value);
      const e_t_rec_id = selectedTitle ? selectedTitle?.e_t_rec_id : null;
      setStates((prevData) => ({
        ...prevData,
        title: value
      }));

      setFormData((prevData) => ({
        ...prevData,
        employee_title: value,
        title: e_t_rec_id,
      }));
    }
  };

  const handleDeleteData = async (e) => {
    try {
      // call api
      const res = await DeleteEmployee({ id });
      // error handling
      if (res.error) {
        if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000 }) }
        else if (res.error.status === 409) { return toast.error("Record deletion failed due to linking.", { position: "top-center", autoClose: 3000 }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000 }) }
      }
      // success call
      toast.success("Employee Deleted successfully.", { position: "top-center", autoClose: 3000 });
      Employeerefetch();
      setIsRowSelected(false)

    } catch (err) {
      console.error('Error Deleting Record:', err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }
  }

  return (
    <div className="customBox">
      <Box className="headContainer">
        <Breadcrumb title="Basic Information" breadcrumbItem="Employee / Basic Information" />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handleUpdateData} />
          <Btn type="delete" onClick={() => setDeleteDialog(true)} />
        </Box>
      </Box>

      <form action="" className="form">
        <Grid container columnSpacing={1} sx={{ height: "calc(100vh -280px)", mt: "-30px", }} >
          <Grid item xs={12} md={9} className="employee_form_border">
            <Box sx={{ height: "calc(100vh - 280px)", overflowY: "scroll" }}>
              <Grid container columnSpacing={5} sx={{ pr: 1, mt: -2 }}>
                <Grid item xs={12} >
                  <HeadingBar title="Basic Information" />
                </Grid>

                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                      <InputField name="employee_no" label="Employee No" disabled={disableFields} placeholder="Enter Employee No" type="text" fullWidth value={formData?.employee_no} />
                      <SimpleDropdown name="employee_title" label="Title" disabled={disableFields} value={states?.title || ""} options={EmployeeTitle ? EmployeeTitle : ""} onChange={handleTitleChange} type="text" fullWidth />
                      <InputField name="first_name" label=" First Name " mandatory={true} disabled={disableFields} placeholder="Enter Firstname " value={formData?.first_name} onChange={handleChange} type="text" fullWidth />
                      <InputField name="last_name" label="Last Name" mandatory={true} disabled={disableFields} placeholder="Enter Lastname" type="text" value={formData?.last_name} onChange={handleChange} fullWidth />
                      <InputField name="father_name " label="Father Name" mandatory={true} disabled={disableFields} placeholder="Enter Father Name" value={formData?.father_name} onChange={handleChange} type="text" fullWidth />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>CNIC<span style={{ fontSize: '18px', color: `${theme?.palette?.error?.main}` }}>*</span> :</label>
                        <InputMask mask="99999-9999999-9" name="cnic" disabled={disableFields} value={formData.cnic} onChange={handleChange} type="text" className="FormInput" placeholder="XXXXX-XXXXXXX-X" />
                      </Box>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>Phone Number<span style={{ fontSize: '18px', color: `${theme?.palette?.error?.main}` }}>*</span> :</label>
                        <InputMask mask="+999999999999" name="phoneNumber" disabled={disableFields} value={formData?.phoneNumber} onChange={handleChange} type="text" className="FormInput" placeholder="+92-XXXXXXXXXX" />
                      </Box>
                      <InputField name="passport_number" label="Passport No" disabled={disableFields} placeholder="Passport No" type="text" value={formData?.passport_number} onChange={handleChange} fullWidth />
                      <InputField name="domicile_district" label="Domicile District" disabled={disableFields} placeholder="Enter Domicile District" value={formData?.domicile_district} onChange={handleChange} type="text" fullWidth />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}><HeadingBar title="Employee Details" /></Grid>

                <Grid item xs={12}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {centerData && centerData?.results ?
                        <div>
                          <InputField name="center" label="Center" disabled={disableFields} placeholder="Select Center" required={true} type="text" isShowIcon={true} value={states?.center || ""} onClick={() => { setIsCenterDialog(true); }} />
                          <Multi_Dropdown isOpen={centerDialog} onClose={() => setIsCenterDialog(false)} MinimumWidth={'600px'} tableRows={centerData?.results} tableHeader={CenterHeader} onSelect={CenterClickhandler} RowFilterWith='c_rec_id' />
                        </div> : <InputField name="center" label="Center " disabled={disableFields} placeholder="Select Center" type="text" isShowIcon={true} value={states.center} />}
                      {positionData && positionData?.results ?
                        <div>
                          <InputField name="position" label="Position" disabled={allwaysDisable} placeholder="Select Position" type="text" isShowIcon={true} value={states?.position} onChange={handleChange} onClick={() => { setIsPositionDialog(true) }} />
                          <Multi_Dropdown isOpen={positionDialog} onClose={() => setIsPositionDialog(false)} MinimumWidth={'600px'} tableRows={positionData.results} onChange={handleChange} tableHeader={PositionHeader} onSelect={PositionClickhandler} RowFilterWith='p_rec_id' />
                        </div> : <InputField name="position" label="Position" disabled={allwaysDisable} placeholder="Select Position" type="text" isShowIcon={true} onChange={handleChange} value={states.position} />}
                      {reportingData && reportingData?.results ?
                        <div>
                          <InputField name="reporting_officer" label="Reporting Officer" disabled={allwaysDisable} placeholder="Select Reporting Officer" type="text" isShowIcon={true} value={states.reportingofficer || ""} onClick={() => { setIsReportingofficerDialog(true) }} />
                          <Multi_Dropdown isOpen={reportingofficerDialog} onClose={() => setIsReportingofficerDialog(false)} MinimumWidth={'600px'} tableRows={reportingData?.results} tableHeader={ReportingHeader} onSelect={ReportingOfficerClickhandler} RowFilterWith='id' />
                        </div> : <InputField name="reporting_officer" label="Reporting Officer" disabled={allwaysDisable} placeholder="Select Reporting Officer" type="text" isShowIcon={true} value={states.reportingofficer} />}
                      {counterAssigning && counterAssigning?.results ?
                        <div>
                          <InputField name="counter_assigning_officer" disabled={allwaysDisable} label="Counter Signing" placeholder="Select Countersigning Officer" type="text" isShowIcon={true} value={states?.counterassigning || ""} onClick={() => { setIsCounterassigningDialog(true) }} />
                          <Multi_Dropdown isOpen={counterassigningDialog} onClose={() => setIsCounterassigningDialog(false)} MinimumWidth={'600px'} tableRows={counterAssigning?.results} tableHeader={CounterAssigningHeader} onSelect={CounterAssigningClickhandler} RowFilterWith='employee_no' />
                        </div> : <InputField name="counter_assigning_officer" disabled={allwaysDisable} label="Counter Assigning" placeholder="Select Countersigning Officer" type="text" isShowIcon={true} value={states?.counterassigning} />}
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }} >
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', flexDirection: 'row', }}>
                        <label htmlFor="" style={{ fontSize: "14px", width: "228px" }}>Role
                          {/* <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>  */}
                          :</label>
                        <Box width={{ width: "100%" }}>
                          <Select
                            isDisabled={disableFields}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={getFilteredOptions()}
                            value={assignedGroups || []}
                            onChange={handleRoleChange}
                          />
                        </Box>
                        {/* <InputMask mask="99999-9999999-9" name="cnic" value={formData.cnic} onChange={handleChange} type="text" className="FormInput" /> */}
                      </Box>
                      {
                        console.log("assignedGroups", assignedGroups)
                      }
                      <InputField name="service_duration" label="Service Duration" disabled={true} placeholder="Service Duration" value={formData?.service_duration || ''} type="text" fullWidth />
                      <InputField name="date_of_joining" label="Date Of Joining" disabled={disableFields} placeholder="Enter Date Of Joining" value={formData?.date_of_joining} onChange={handleChange} type="date" fullWidth />
                      <Grid item xs={6} sx={{ display: 'flex', flexDirection: "row" }} >
                        <Typography sx={{ display: 'flex', justifyContent: 'flex-start', mt: 0.8, gap: 13, fontSize: '14px' }} >Active:
                          <Switch size="small" checked={formData?.is_active} disabled={disableFields} onClick={(e) => { const handleSuperUser = !isActive; setIsActive(handleSuperUser); setFormData((prevData) => ({ ...prevData, is_active: handleSuperUser })); }} name='active' /></Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HeadingBar title="Attachments" />
                </Grid>

                <Grid item xs={12} sx={{ mb: 3 }}>
                  <Grid container columnSpacing={6} sx={{ px: 2 }}>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                      <InputField name="employee_image" label="Employee Image" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} />
                      <Box
                        sx={{
                          ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                          border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                        }}
                      >
                        {formData.employee_image && (
                          <img
                            src={formData.employee_image}
                            alt="Employee CNIC"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                          />
                        )}
                      </Box>

                      <InputField name="employee_domicile_image" label="Employee Domicile" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} />
                      <Box
                        sx={{
                          ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                          border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                        }}
                      >
                        {formData.employee_domicile_image && (
                          <img
                            src={formData.employee_domicile_image}
                            alt="Employee CNIC"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                          />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <InputField name="employee_cnic_image_front" label="CNIC Front Image" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} />
                      <Box
                        sx={{
                          ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                          border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                        }} >
                        {formData.employee_cnic_image_front && (
                          <img
                            src={formData.employee_cnic_image_front}
                            alt="Employee CNIC"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                          />
                        )}
                      </Box>
                      <InputField name="employee_cnic_image_back" label="CNIC Back Image" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} />
                      <Box
                        sx={{
                          ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                          border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                        }} >
                        {formData.employee_cnic_image_back && (
                          <img
                            src={formData.employee_cnic_image_back}
                            alt="Employee CNIC"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <EmployeeFormDashboard userId={id} title="Processess" />


          </Grid>
        </Grid>
      </form>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />Are you sure you want to delete the record?</Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn type="sure" onClick={() => { handleDeleteData(); setDeleteDialog(false); }} outerStyle={{ border: '2px solid ${theme.palette.primary.light}', borderRadius: "8px" }} />
            <Btn type="close" onClick={() => setDeleteDialog(false)} outerStyle={{ border: '2px solid ${theme.palette.error.light}', borderRadius: "8px" }} />
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default Basic_Form;