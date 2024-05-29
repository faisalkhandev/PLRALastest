import React, { useMemo, useState } from "react";
import { Box, Dialog, Grid, Typography } from "@mui/material";
import { GoBack } from '../../Assets/Icons'
import { Btn, InputField, SimpleDropdown, TextArea,Breadcrumb } from "../../Components";
import Theme from "../../Theme/Light__Theme";
import LeaveAnalysisCard from "../../Components/Common/LeaveAnalysisCard";
import { useNavigate } from "react-router-dom";
import {
  useLeaveTypeQuery,
  usePostLeaveApplyMutation,
} from "../../Features/API/SetupApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { showToast } from "../../Components/shared/Toast_Card";
import StatusCodeHandler from "../../Components/Common/StatusCodeHandler";
import MiniDashboardLeaveDetail from "../Dasboard/Approvals/LeaveApprovals/MiniDashboardLeaveDetailpage";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import { useTheme } from "@emotion/react";

const LeaveApply = () => {
  const theme = useTheme();

  const [formErrors, setFormErrors] = useState({});
  //Navigate
  const navigate = useNavigate();

  // States
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);

  const [formData, setFormData] = useState({
    attachment: null,
    from_date: "",
    to_date: "",
    notes: "",
    employee: Cookies.get("user_id") || "",
    leave_type: "",
  });

  // Queries
  const { data } = useLeaveTypeQuery();
  const [postLeaveApply] = usePostLeaveApplyMutation();

  // Memoized dropdown options
  const leaveTypeDropDown = useMemo(() => {
    return (
      data?.results.map((data) => ({
        id: data.leave_request_id,
        label: data.leave_type,
        value: data.leave_id,
      })) || []
    );
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "from_date" || name === "to_date") {
      const currentDate = new Date();
      const selectedDate = new Date(value);

      // Set hours, minutes, seconds, and milliseconds to 0 for both dates
      currentDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < currentDate) {
        toast.error("Please select the current date or a future date.", {
          position: "top-center",
          autoClose: 3000,
        });
        return;
      }
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  function handlefile(event) {
    const file = event.target.files[0];
    setFormData({
      ...formData,
      attachment: file,
    })
  }

  const handleCasualClick = (label) => {
    setSelectedLabel(label)
    console.log(`Casual mini card clicked with label: ${label}`);
  };

  //SaveData
  const handleSaveData = async (e) => {
    e.preventDefault();

    let formD = new FormData();

    formD.append("from_date", formData.from_date)
    formD.append("to_date", formData.to_date)
    formD.append("leave_type", formData.leave_type)
    formD.append("notes", formData.notes)
    formD.append("employee", formData.employee)
    if (typeof formData.attachment !== String && formData.attachment !== null) {
      formD.append("attachment", formData.attachment)
    }

    const res = await postLeaveApply(formD);
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
      showToast(`Leave Applied Successfully`, "success");
      resetForm();
      setFormData({
        attachment: null,
        from_date: "",
        to_date: "",
        notes: "",
        employee: Cookies.get("UserID") || "",
        leave_type: "",
      });

      // setTimeout(() => {
        navigate("/leave");
      // }, 1000);
    }
  };

  

  //HandleApply
  function handleApplyClick() {
    setOpenDialog(true);
  }

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const resetForm = () => {
    setFormErrors({});
  };


  return (
    <div style={{ margin: "14px 30px 0 30px" }} className="EmployeeTableBox">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          {selectedLabel === "Casual" || selectedLabel === "Medical" || selectedLabel === "Special" || selectedLabel === "Maternity" ||
            selectedLabel === "Earned" || selectedLabel === "Paternity" || selectedLabel === "Absent" ? (
            <Box>
              <MiniDashboardLeaveDetail fillter={`${selectedLabel}`} onCasualClick={handleCasualClick} userID={formData.employee} />
            </Box>
          ) : (
            <Box sx={{ p: 2, border: "1px solid #e2e1e0", borderRadius: "4px", height: "calc(100vh - 150px)", }} >
              <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
                <Box sx={{display:"flex",alignItems:"start"}}>
              <Box
            sx={{
              width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
              transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
              boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
            }} onClick={() => window.history.go(-1)}><GoBack /></Box>
          <Breadcrumb title="Leave Apply" breadcrumbItem="Employee / Leave" />
          </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                  <Btn type="apply" onClick={handleApplyClick} />
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}  >
                <Grid item xs={6} sx={{ display: "flex", gap: 2, flexDirection: "column" }}  >
                  <InputField name="from_date" type="date" label="From" onChange={handleChange} value={formData?.from_date} min={getCurrentDate} error={formErrors?.data?.from_date} mandatory={true}/>
                  <SimpleDropdown name="leave_type" label="Leave Type" options={leaveTypeDropDown} onChange={handleChange} value={formData?.leave_type} error={formErrors?.data?.leave_type} helperText={formErrors?.data?.leave_type} mandatory={true}/>
                </Grid>
                <Grid item xs={6} sx={{ display: "flex", gap: 2, flexDirection: "column" }} >
                  <InputField name="to_date" type="date" label="To" onChange={handleChange} value={formData?.to_date} error={formErrors?.data?.to_date} mandatory={true}/>
                  <InputField name="attachment" label="Attachment" type="file" fullWidth onChange={handlefile} error={formErrors?.data?.attachment} />
                </Grid>

                <Grid item xs={6}>
                  <TextArea name="notes" label="Notes" rows={5} placeholder="Write note here..." onChange={handleChange} value={formData?.notes} error={formErrors?.data?.notes} helperText={formErrors?.data?.notes} mandatory={true}/>
                </Grid>
              </Grid>
            </Box>
          )}

        </Grid>
        <Grid item xs={3}>
          <EmployeeFormDashboard userId={formData.employee} onCasualClick={handleCasualClick} dataType="leave" title="Leave Balance Detail" height="calc(100vh - 150px)" />
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{ m: "auto" }}
      >
        <Box sx={{ minWidth: "400px", p: 4 }}>
          <Typography variant="h6" color="initial">  <b>From: </b> {formData.from_date} <b>To: </b> {formData.to_date}  <br />  <b>Leave Type: </b>  {data?.results.find((leave) => leave.leave_id === formData.leave_type)?.leave_type}  <br />  <b>Note: </b> {formData.notes}
          </Typography>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 4, gap: 1, }} >
            <Btn type="sure" onClick={(e) => { handleSaveData(e); setOpenDialog(false); }} outerStyle={{ border: "2px solid ${theme.palette.primary.light}", borderRadius: "8px", }} />
            <Btn type="close" onClick={() => setOpenDialog(false)} outerStyle={{ border: "2px solid ${theme.palette.error.light}", borderRadius: "8px", }} />
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default LeaveApply;




