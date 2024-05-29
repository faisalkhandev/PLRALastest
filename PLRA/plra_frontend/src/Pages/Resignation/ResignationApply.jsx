import { useTheme } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Btn, InputField, TextArea } from "../../Components";
import Breadcrumb from "../../Components/Common/BreadCrumb";
import { useGetUserByIdQuery } from "../../Features/API/EmployeeMasterDataAPI";
import {
  useAllResignationQuery,
  useCreateResignationMutation,
} from "../../Features/API/ResignationApi";
import Cookies from "js-cookie";
import StatusCodeHandler from "../../Components/Common/StatusCodeHandler";
import { showToast } from "../../Components/shared/Toast_Card";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import { GoBack } from "../../Assets/Icons";

const ResignationApply = () => {
  const [formErrors, setFormErrors] = useState({});

  //Navigate
  const navigate = useNavigate();
  const theme = useTheme();
  const [name, setname] = useState(null);
  const [createResignation] = useCreateResignationMutation();
  const [choice, setChoice] = useState(false);
  const [user_id, set_user_id] = useState(null);

  useEffect(() => {
    const id = Cookies.get("user_id");
    set_user_id(id);
  }, [user_id]);

  const [formData, setFormData] = useState({
    attachment: null,
    resignation_reason: "",
    notice_period: "",
    employee: user_id || "",
  });

  const { data, isLoading, isError, error, refetch } =
    useGetUserByIdQuery(user_id);
  const {
    data: allResignation,
    ResignationisLoading,
    ResignationisError,
    Resignationerror,
    Resignationrefetch,
  } = useAllResignationQuery();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (data) {
          setname(`${data.first_name} ${data.last_name}`);
        }
      } catch (error) {
        toast.error(`Error fetching data: ${error}`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, [data]);

  const resetForm = () => {
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notice_period' && parseInt(value) < 1) {
      toast.error(`Notice Period Cannot be negative Value`, {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      attachment: file,
    });
  };

  //SaveData
  const handleApplyClick = async (e) => {
    e.preventDefault();

    let formD = new FormData();
    formD.append("resignation_reason", formData.resignation_reason);
    formD.append("notice_period", formData.notice_period);
    formD.append("employee", user_id);
    if (
      typeof formData.attachment !== "string" &&
      formData.attachment != null
    ) {
      formD.append("attachment", formData.attachment);
    }
    const res = await createResignation(formD);

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
      showToast(`Resignation Applied Successfully`, "success");
      resetForm();
      setFormData({
        attachment: null, resignation_reason: "", notice_period: "", employee: user_id || "",  // attachment: null,
      });
      setTimeout(() => {
        navigate("/Resignation");
      }, 2000);
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
                <Breadcrumb title="Resignation" breadcrumbItem="Employee / Resignation" />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Btn type="apply" onClick={handleApplyClick} />

              </Box>
            </Box>

            <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}  >
              <Grid xs={9} item sx={{ display: "flex", flexDirection: "column", gap: 2, m: " auto auto" }} >
                <InputField name="employee" label="Employee Name" placeholder="Employee Name" type="text" value={name} fullWidth disabled mandatory error={formErrors?.data?.employee} />
                <InputField name="notice_period" label="Notice Period " placeholder="Number of months" type="number" value={formData.notice_period} onChange={handleInputChange} fullWidth mandatory error={formErrors?.data?.notice_period} />
                <InputField name="attachment" label="Attachment" type="file" fullWidth onChange={handleFileInputChange} error={formErrors?.data?.attachment} mandatory />
                <TextArea Rows={8} name="resignation_reason" label="Reason" placeholder="Write resignation reason...." value={formData.resignation_reason} onChange={handleInputChange} mandatory error={formErrors?.data?.resignation_reason} helperText={formErrors?.data?.resignation_reason} />
              </Grid>



            </Grid>
          </Box>

        </Grid>

        <Grid item xs={3}>
          <EmployeeFormDashboard userId={user_id} title="Processess" processName="Resignation" height="calc(100vh - 150px)" />

        </Grid>

      </Grid>


    </div>


  );
};

export default ResignationApply;
