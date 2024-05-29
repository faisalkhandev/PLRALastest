import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Grid, Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Breadcrumb, Btn, InputField, SimpleDropDown, TextArea, } from "../../Components/index";
import Cookies from "js-cookie";
import { useGetUserByIdQuery } from "../../Features/API/Termination";
import { useGetNOCTypesQuery, usePostNOCApplyMutation } from "../../Features/API/NocAPI";
import { showToast } from "../../Components/shared/Toast_Card";
import StatusCodeHandler from "../../Components/Common/StatusCodeHandler";
import { useNavigate } from "react-router-dom";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import { GoBack } from "../../Assets/Icons";

const NocApply = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const [empId, setEmpId] = useState(null);
  const [formData, setFormData] = useState({
    employee: Cookies.get("user_id") || " ",
    noc_type: "",
    noc_middle_body_text: "",
    attachments: null,
  });

  useEffect(() => {
    const userID = Cookies.get("user_id");
    setEmpId(userID);
  }, []);


  //Quries
  const { data: employeeById, isLoading, refetch } = useGetUserByIdQuery(empId);

  const { data: nocTypes } = useGetNOCTypesQuery();

  const [postNOCApply] = usePostNOCApplyMutation();

  const EmployeeName = `${employeeById?.first_name || ""} ${employeeById?.last_name || ""}`;



  const nocType = useMemo(() => (
    nocTypes?.results.map((data) => ({
      id: data?.noc_rec_id,
      value: data?.noc_rec_id,
      label: data?.noc_type,
    }))
  ), [nocTypes]);



  const resetForm = () => {
    setFormErrors({});
    setFormData({
      noc_type: "",
      noc_middle_body_text: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  function handleFileInputChange(event) {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      attachments: file,
    });
  }


  async function handleSave(e) {
    try {
      e.preventDefault();
      let formD = new FormData();
      formD.append("employee", formData.employee)
      formD.append("noc_type", formData.noc_type)
      formD.append("noc_middle_body_text", formData.noc_middle_body_text)
      if (
        typeof formData.attachments !== "string" &&
        formData.attachments != null
      ) {
        formD.append("attachments", formData.attachments)
      }
      const res = await postNOCApply(formD);

      if (res?.error && res.error.status) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      else {
        setFormData({ noc_type: '', noc_middle_body_text: '' });
        showToast(`Record created Successfully`, "success");
        resetForm();
        navigate('/NOC')
      }
    } catch (error) {
      showToast(`${error.message}`, "error");
    }
  }


  return (
    <div style={{ margin: "14px 30px 0 30px" }} className="EmployeeTableBox">
      <Grid container spacing={2}>
        <Grid item xs={9}>

          <Box sx={{ p: 2, border: "1px solid #e2e1e0", borderRadius: "4px", height: "calc(100vh - 150px)", }} >
            <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                    transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                    boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
                  }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                <Breadcrumb
                  title="Apply NOC"
                  breadcrumbItem=" NOC / Apply NOC"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Btn type="apply" onClick={handleSave} />
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}  >
              <Grid xs={9} item sx={{ display: "flex", flexDirection: "column", gap: 2, m: " auto auto" }} >
                <InputField name="employee" type="text" label="Employe Name" disabled value={EmployeeName} mandatory error={formErrors?.data?.employee} />
                <SimpleDropDown name="noc_type" label="NOC Type" isShowIcon={true} options={nocType} onChange={handleChange} mandatory value={formData?.noc_type} error={formErrors?.data?.noc_type} helperText={formErrors?.data?.noc_type} />
                <InputField name="attachments" label="Attachment" onChange={handleFileInputChange} type="file" error={formErrors?.data?.attachments} />
                <TextArea Rows={10} name="noc_middle_body_text" label="Reason" placeholder="Write the Reason...." onChange={handleChange} value={formData?.noc_middle_body_text} error={formErrors?.data?.noc_middle_body_text} helperText={formErrors?.data?.noc_middle_body_text} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <EmployeeFormDashboard userId={formData.employee} title="Processess" processName="NOC" height="calc(100vh - 150px)" />
        </Grid>
      </Grid>

    </div>
  );
};

export default NocApply;
