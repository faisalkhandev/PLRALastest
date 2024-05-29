import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { Btn, DialogBox, HeadingBar, InputField, Multi_Dropdown } from '../../../../Components'
import Breadcrumb from '../../../../Components/Common/BreadCrumb'
import { useTheme } from '@emotion/react'
import { EducationLevelHeader, CountryHeader } from "../../../../Data/Setup_Data/Setup_Data";
import { useGetEducationQuery, useGetCountryQuery, useUpdateEducationMutation, useGetLevelOfEducationQuery, usePostEducationMutation, useDeleteEducationMutation } from '../../../../Features/API/API.js'
import { toast } from 'react-toastify'

import EmployeeFormDashboard from './../EmployeeDashboard/EmployeeFormDashboard';
import { useParams } from 'react-router-dom'
import { showToast } from '../../../../Components/shared/Toast_Card.jsx'
import StatusCodeHandler from '../../../../Components/Common/StatusCodeHandler.jsx'



const Education = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});


  //states
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [formData, setFormData] = useState({
    education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
    grade: "", scale: "", level_of_education: "", institution_country: "", employee: id
  });
  const [educationLevelDialog, setEducationLevelDialog] = useState(false);
  const [employeeData, setEmployeeData] = useState("");
  const [educationLevelData, setEducationLevelData] = useState("");
  const [institution, setInstitution] = useState("");
  const [countryDialog, setCountryDialog] = useState(false);
  const [countryData, setCountryData] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectRowID, setSelectedRowID] = useState(null);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [disableFields, setfieldsDisable] = useState(false)
  const [isattachmentselected, setisattachmentselected] = useState(false)
  //Queries
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch: refetch } = useGetEducationQuery(id);
  const [updateEducation] = useUpdateEducationMutation();
  const [postEducation] = usePostEducationMutation()
  const { data: education_level_data, isLoading: education_level_loading, isError: education_level_refreshError, error: education_level_queryError, refetch: education_level_refetch } = useGetLevelOfEducationQuery();
  const { data: country_data, isLoading: country_loading, isError: country_refreshError, error: country_queryError, refetch: country_refetch } = useGetCountryQuery();
  const [deleteEducation] = useDeleteEducationMutation();


  //Functions
  useEffect(() => {
    refetch();
    education_level_refetch();
    country_refetch();
  }, [])

  const resetForm = () => {
    setFormErrors({});
    setCountryData(''), setEducationLevelData(''), setIsRowSelected(false);
    setFormData({
      education: null, major_subject: null, institution_name: null, education_start_date: null, education_end_date: null,
      grade: null, scale: null, level_of_education: null, institution_country: null, employee: id,
    });
  };

  //Education Level Dialog Click Listeners

  const educationLevelClickHandler = (selectedRow) => {
    setEducationLevelData(selectedRow.description)
    setFormData({ ...formData, level_of_education: selectedRow.level_of_education_rec_id });
    setEducationLevelDialog(false);
    console.log("EducationLevel", formData.level_of_education)

  };

  const countriesClickHandler = (selectedRow) => {
    setCountryData(selectedRow.country_name)
    setFormData({ ...formData, institution_country: selectedRow.country_rec_id, });
    setCountryDialog(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'scale' && parseInt(value) < 1) {
      toast.error(`Scale cannot be a negative value`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }


    setFormData(() => ({ ...formData, [name]: value }));
  };

  const handleBoxClick = (record, index) => {
    setIsRowSelected(true);
    setActiveBoxIndex(index);
    setFormData({
      ...formData,
      employee: record.employee,
      education: record.education,
      major_subject: record.major_subject,
      institution_name: record.institution_name,
      education_start_date: record.education_start_date,
      education_end_date: record.education_end_date,
      grade: record.grade,
      scale: record.scale,
      level_of_education: record.level_of_education.level_of_education_rec_id,
      institution_country: record.institution_country.country_rec_id,
      attachment: record.attachment
    });
    setCountryData(record.institution_country.country_name);
    setEducationLevelData(record.level_of_education.description);
    setSelectedRowID(record.education_rec_id);
    setfieldsDisable(true)
  };

  const handleFileChange = (e) => {
    const fieldName = e.target.name; // Get the name of the input field
    console.log(e.target.name, e.target.file);

    if (e.target.files[0]) {
      const fileSize = e.target.files[0].size / 1024;
      console.log(fileSize); // File size in KB
      if (fileSize <= 1000) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: e.target.files[0],
        }));
        setisattachmentselected(true)
        const selectedFilename = e.target.files[0].name; // Get the name of the selected file
        const selectedPath = URL.createObjectURL(e.target.files[0]); // Create URL for the selected file

        // Create an object with URL and filename
        const fileObject = { url: selectedPath, name: selectedFilename };

        event.target.value = null;
        setSelectedImagePaths(prevPaths => [...prevPaths, fileObject]);
      }
      else {
        toast.error("Image size exceeds 100KB", { position: "top-center", autoClose: 3000 })
      }
    }

  };

  const handlePostData = async (e) => {
    if (isRowSelected) {

      try {
        let formD = new FormData();
        formD.append('education', formData.education);
        formD.append('employee', formData.employee);
        formD.append("level_of_education", formData.level_of_education);
        formD.append("major_subject", formData.major_subject);
        formD.append("institution_name", formData.institution_name);
        formD.append("institution_country", formData.institution_country);
        formD.append("education_start_date", formData.education_start_date);
        formD.append("education_end_date", formData.education_end_date);
        formD.append("grade", formData.grade);
        formD.append("scale", formData.scale);
        if (formData.attachment != "") {
          formD.append("attachment", formData.attachment);
        }
        const res = await updateEducation({ selectRowID, educationData: formD });

        if (res?.error && res.error.status) {
          if (res?.error?.status === 422 && res?.error?.data?.code) {
            return (showToast(`${res?.error?.data?.detail}`, "error"));
          }
          if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
            return showToast(`${res?.error?.data?.non_field_errors}`, "error");
          }
          setFormErrors(res?.error)
          return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
        } else {
          showToast(`Record updated Successfully`, "success");
          setFormData({
            education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
            grade: "", scale: "", employee: id, level_of_education: "", institution_country: ""
          }); setEducationLevelData(""); setCountryData("")
          setIsRowSelected(false)
          setfieldsDisable(false)
          refetch();
          resetForm();
        }
      } catch (err) {
        return showToast(`${err.message}`, "error");
      }
    }
    else {
      try {
        let formD = new FormData();
        formD.append('education', formData.education);
        formD.append('employee', formData.employee);
        formD.append("level_of_education", formData.level_of_education);
        formD.append("institution_name", formData.institution_name);
        formD.append("institution_country", formData.institution_country);
        formD.append("education_start_date", formData.education_start_date);
        formD.append("major_subject", formData.major_subject);
        formD.append("education_end_date", formData.education_end_date);
        formD.append("grade", formData.grade);
        formD.append("scale", formData.scale);
        if (formData.attachment != "") {
          formD.append("attachment", formData.attachment);
        }
        const res = await postEducation(formD);
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
          setFormData({
            education: "", major_subject: "", institution_name: "", education_start_date: null, education_end_date: null,
            grade: "", scale: "", employee: id, level_of_education: '', institution_country: ""
          }); setEducationLevelData(""); setCountryData("")
          refetch();
          resetForm();
        }
      }
      catch (err) {
        return showToast(`${err.message}`, "error");
      }
    }
  }

  const UpdateDialogHandler = () => {
    if (isRowSelected) {
      setEditDialog(true)
    }
    else {
      toast.error("Record not selected", { position: "top-center", autoClose: 3000 })
    }
  }

  const handleDeleteData = async (e) => {
    try {
      // call api
      const res = await deleteEducation({ selectRowID });
      // error handling 
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      // success call 
      showToast(`Record Deleted Successfully`, "success");
      setFormData({
        education: "", major_subject: "", institution_name: "", education_start_date: "", education_end_date: "",
        grade: "", scale: "", employee: id, level_of_education: null, institution_country: ""
      }); setEducationLevelData(""); setCountryData("")
      refetch();
      setIsRowSelected(false),
        resetForm();
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  }


  return (

    <div className='customBox'>
      <Box className='headContainer'>
        <Breadcrumb title="Education" breadcrumbItem="Employee / Personal Document" />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Btn type="new" onClick={resetForm} />
          <Btn type={disableFields ? 'edit' : 'save'} onClick={disableFields ? () => setfieldsDisable(false) : handlePostData} />
          {isRowSelected ? <Btn type="delete" onClick={() => setDeleteDialog(true)} /> : null}
          {
            deleteDialog ?
              <DialogBox
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                closeClick={() => setDeleteDialog(false)}
                sureClick={() => { handleDeleteData(); setDeleteDialog(false); }}
                title={"Are you sure you want to delete the record?"}
              /> : ''
          }
        </Box>
      </Box>

      <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
        <Grid item xs={4} md={2}>
          <Box className="form_sidebar">
            {data && data.results && data.results.length > 0 ? (data.results.map((record, index) => (
              <Box key={record.id} sx={{ borderBottom: '1px solid #e2e1e0', p: 1, width: '100%', cursor: 'pointer' }} className={activeBoxIndex === index ? 'Box_Class' : ''} onClick={() => handleBoxClick(record, index)}>
                <Typography variant="h6" color="green" sx={{ textDecoration: 'none' }}>{record.education}</Typography>
                <Typography variant="body2" color="initial">{record.major_subject}</Typography>
              </Box>
            ))) : (
              <Box sx={{ width: '100%' }}>
                <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Education</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={7} className="employee_form_border">
          <Grid item xs={12} >
            <Grid item xs={12} sx={{ pr: 1, mt: -2, }}>
              <HeadingBar title="Education Information" />
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <Grid container columnSpacing={6} sx={{ px: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>

                <InputField name="education" label="Education" mandatory={true} disabled={disableFields} placeholder="Enter Education" value={formData.education} type="text" onChange={handleChange} fullWidth error={formErrors?.data?.education} />
                {education_level_data && education_level_data.results ?
                  <div>
                    <InputField name="level_of_education" disabled={disableFields} label="Education Level" Mini placeholder="Select Education Level" mandatory={true} value={educationLevelData || ""} isShowIcon={true} onClick={() => setEducationLevelDialog(true)} error={formErrors?.data?.level_of_education} />
                    <Multi_Dropdown RowFilterWith={"level_of_education_rec_id"} isOpen={educationLevelDialog} onClose={() => setEducationLevelDialog(false)} MinimumWidth={"500px"} tableHeader={EducationLevelHeader} tableRows={education_level_data.results} onSelect={educationLevelClickHandler} />
                  </div> : <InputField name="employee" label="Employee" placeholder="Select Employee" value={employeeData} mandatory={true} isShowIcon={true} error={formErrors?.data?.employee} />}

                {country_data && country_data.results ?
                  <div>
                    <InputField name="institution_country" disabled={disableFields} label="Country" minWidth={500} placeholder="Select Institution Country" mandatory={true} value={countryData} isShowIcon={true} onClick={() => { setCountryDialog(true); }} error={formErrors?.data?.institution_country} />
                    <Multi_Dropdown RowFilterWith={"country_rec_id"} isOpen={countryDialog} onClose={() => setCountryDialog(false)} MinimumWidth={"500px"} tableHeader={CountryHeader} tableRows={country_data.results} onSelect={countriesClickHandler} />
                  </div> : <InputField name="institution_country" disabled={disableFields} label="Institution Country" placeholder="Select Institution Country" mandatory={true} value={countryData} isShowIcon={true} onClick={() => { setCountryDialog(true); }} error={formErrors?.data?.institution_country} />}
                <InputField name="grade" label="Grade" mandatory={true} disabled={disableFields} placeholder="Enter Grade" type="text" value={formData.grade} fullWidth onChange={handleChange} error={formErrors?.data?.grade} />

              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: "column", gap: 2 }}>
                <InputField name="major_subject" disabled={disableFields} label="Major Subject" placeholder="Enter Major Subject" type="text" value={formData.major_subject} mandatory={true} onChange={handleChange} fullWidth error={formErrors?.data?.major_subject} />
                <InputField name="institution_name" disabled={disableFields} label="Institution" placeholder="Enter Institution Name" type="text" value={formData.institution_name} mandatory={true} onChange={handleChange} fullWidth error={formErrors?.data?.institution_name} />
                <InputField name="scale" label="Scale" disabled={disableFields} placeholder="Enter Scale" mandatory={true} type="number" value={formData.scale} fullWidth onChange={handleChange} error={formErrors?.data?.scale} />
              </Grid>
            </Grid>

            <Grid item xs={12}><HeadingBar title="Duration" /></Grid>
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Grid container columnSpacing={6} sx={{ px: 2 }}>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >

                  <InputField name="education_start_date" disabled={disableFields} mandatory={true} label="Start Date" placeholder="Education Start Date" value={formData.education_start_date} type="date" onChange={handleChange} fullWidth error={formErrors?.data?.education_start_date} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }}  >
                  <InputField name="education_end_date" mandatory={true} disabled={disableFields} label="End Date" placeholder="Enter Education End Date" value={formData.education_end_date} type="date" onChange={handleChange} fullWidth error={formErrors?.data?.education_end_date} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} ><HeadingBar title="Attachment's" />
              <Grid sx={{ px: 2 }}>
                <InputField name="attachment" mandatory={true} label="Attachment" onChange={handleFileChange} type="file" fullWidth disabled={disableFields} error={formErrors?.data?.attachment} />
                <Box
                  sx={{
                    ml: "150px", width: "calc(100% - 150px)", height: "150px", p: 2,
                    border: '2px solid gray', borderRadius: '6px', boxSizing: 'border-box', overflow: 'hidden',
                  }}
                >
                  {formData.attachment && (
                    <img
                      src={isattachmentselected && !isRowSelected ? URL.createObjectURL(formData.attachment) : formData.attachment}
                      alt="Attachments"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', margin: 'auto' }}
                    />
                  )}
                </Box>

              </Grid>
            </Grid>

          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <EmployeeFormDashboard userId={id} title="Processess" />

        </Grid>
      </Grid>
    </div >

  )
};

export default Education

