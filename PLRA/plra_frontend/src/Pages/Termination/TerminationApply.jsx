import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import Breadcrumb from "../../Components/Common/BreadCrumb";
import { Btn, InputField, TextArea } from "../../Components";
import { useTheme } from "@emotion/react";
import { SimpleDropDown } from "../../Components";
import { useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  usePostTerminationMutation,
  useGetEmployeeByIDQuery
} from "../../Features/API/Termination.js"
import { showToast } from "../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from "../../Components/Common/StatusCodeHandler.jsx";
import Cookies from 'js-cookie'
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard.jsx";
import { GoBack } from "../../Assets/Icons/index.jsx";
import { toast } from "react-toastify";



const category = [
  { id: 1, value: "Compulsory Retirement", label: "Compulsory Retirement" },
  { id: 2, value: "Removal from service", label: "Removal from service" },
  { id: 3, value: "Dismissal from service", label: "Dismissal from service" },
  { id: 3, value: "Deceased", label: "Deceased" },
];

const TerminationApply = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  // states
  const [empId, setEmpId] = useState(null);

  const [formData, setFormData] = useState({
    termination_category: null,
    termination_reason: "",
    notice_period: null,
    attachment: null,
  });

  useEffect(() => {
    setEmpId(Cookies.get("user_id"));
  }, [empId]);


  const currentURL = window.location.href;
  const urlParts = currentURL.split('/');
  const id = urlParts[urlParts.length - 1];

  // Queries
  const { data: EmployeeData, isLoading: Employeeloading, isError: EmployeerefreshError } = useGetEmployeeByIDQuery(id);
  const { data: employeeById, isError, isLoading, refetch, } = useGetUserByIdQuery(empId);
  const [postTermination] = usePostTerminationMutation();
  // functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notice_period' && parseInt(value) < 1) {
      toast.error(`Notice Period Cannot be negative Value`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        attachment: file,
      }));
    }
  };

  const handleSaveDataTermination = async (e) => {
    try {
      let formD = new FormData();
      formD.append("employee", id);
      formD.append('notice_period', formData.notice_period);
      formD.append('termination_reason', formData.termination_reason);
      formD.append('termination_category', formData.termination_category);
      if (
        typeof formData.attachment !== "string" &&
        formData.attachment != null
      ) {
        formD.append("attachment", formData.attachment);
      }

      const res = await postTermination(formD);
      if (res?.error && res.error.status) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.originalStatus} />, 'error');
      } else {
        showToast(`Termination Applied Successfully`, "success");
        setFormData({
          termination_category: "",
          termination_reason: "",
          notice_period: "",
          attachment: null,
        });
        setTimeout(() => {
          navigate("/Termination");
        }, 2000);
      }
    } catch (error) {
      showToast(`${error.message}`, "error");
    }
  };


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
                <Breadcrumb title="Apply Termination"
                  breadcrumbItem="Employee / Termination" />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Btn type="apply" onClick={handleSaveDataTermination} />

              </Box>
            </Box>

            <Grid container spacing={2} sx={{ display: "flex" }}  >
              <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                <InputField name="employee" type="text" placeholder="Employee Name" label="Employee Name" disabled onChange={handleChange} value={EmployeeData?.first_name + ' ' + EmployeeData?.last_name} error={formErrors?.data?.employee} />
                <InputField name="notice_period" label="Notice Period" placeholder="Number of months" type="number" fullWidth mandatory value={formData.notice_period} onChange={handleChange} error={formErrors?.data?.notice_period} />
                <TextArea Rows={8} name="termination_reason" label="Termination Reason" placeholder="Write termination reason...." mandatory onChange={handleChange} error={formErrors?.data?.termination_reason} helperText={formErrors?.data?.termination_reason} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2, }}>
                <SimpleDropDown name="termination_category" label="Category" isShowIcon={true} options={category} mandatory onChange={handleChange} error={formErrors?.data?.termination_category} helperText={formErrors?.data?.termination_category} />
                <InputField name="attachment" label="Attachment" mandatory onChange={handleFileChange} type="file" error={formErrors?.data?.attachment} />
              </Grid>
            </Grid>
          </Box>

        </Grid>

        <Grid item xs={3}>
          <EmployeeFormDashboard userId={id} title="Processess" processName="Termination" height="calc(100vh - 150px)" />
        </Grid>
      </Grid>
    </div>
  );
};

export default TerminationApply;
