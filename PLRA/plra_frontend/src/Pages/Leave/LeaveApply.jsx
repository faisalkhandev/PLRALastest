import React, { useMemo, useState } from "react";
import { Box, Dialog, Grid, Typography } from "@mui/material";
import { Btn, InputField, SimpleDropdown, TextArea } from "../../Components";
import Theme from "../../Theme/Light__Theme";
import LeaveAnalysisCard from "../../Components/Common/LeaveAnalysisCard";
import { useNavigate } from "react-router-dom";
import {
  useLeaveTypeQuery,
  usePostLeaveApplyMutation,
} from "../../Features/API/SetupApi";
import { toast } from "react-toastify";

const LeaveApply = () => {
  //Navigate
  const navigate = useNavigate();

  // States
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    // attachment: null,
    from_date: "",
    to_date: "",
    notes: "",
    employee: sessionStorage.getItem("UserID") || "",
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


  // Event handler for date field changes
  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   if (name === "from_date" || name === "to_date") {
  //     const currentDate = new Date();
  //     const selectedDate = new Date(value);


  //     if (selectedDate < currentDate) {
  //       toast.error("Please select the current date.", {
  //         position: "top-center",
  //         autoClose: 3000,
  //       });
  //       return;
  //     }
  //   }
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };
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


  //SaveData
  const handleSaveData = async (e) => {
    e.preventDefault();

    if (
      // formData.attachment === "" ||
      formData.notes === "" ||
      formData.from_date === "" ||
      formData.to_date === "" ||
      formData.leave_id === ""
    ) {
      toast.error("Fields should not be empty! ", {
        position: "top-center",
        autoClose: "30000",
      });
    } else {
      // if (formData.employee) {
      //   const formD = new FormData();
      //   Object.entries(formData).forEach(([key, value]) => {
      //     formD.append(key, value);
      //   });

      const res = await postLeaveApply(formData);
      console.log("response: ", res);

      if (res.error?.status === 400) {
        toast.error("Something Went Wrong.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (res.error?.status === 500) {
        toast.error("Server problem", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.success("Leave Apply Created", {
          position: "top-center",
          autoClose: 1000,
        });

        setFormData({
          // attachment: null,
          from_date: "",
          to_date: "",
          notes: "",
          employee: sessionStorage.getItem("UserID") || "",
          leave_type: "",
        });

        setTimeout(() => {
          navigate("/leave");
        }, 1000);
      }
    }
  };

  //HandleApply
  function handleApplyClick() {
    if (
      formData.from_date === "" ||
      formData.to_date === "" ||
      formData.leave_type === "" ||
      formData.notes === ""
    ) {
      toast.error("All fields are required!", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      setOpenDialog(true);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  return (
    <div style={{ margin: "14px 30px 0 30px" }} className="EmployeeTableBox">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Box
            sx={{
              p: 2,
              border: "1px solid #e2e1e0",
              borderRadius: "4px",
              height: "calc(100vh - 150px)",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  width: "100%",
                  color: Theme.palette.primary.main,
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                Leave Apply
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Btn type="apply" onClick={handleApplyClick} />
              </Box>
            </Box>

            <Grid
              container
              spacing={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Grid
                item
                xs={6}
                sx={{ display: "flex", gap: 2, flexDirection: "column" }}
              >
                <InputField
                  name="from_date"
                  type="date"
                  label="From"
                  onChange={handleChange}
                  value={formData?.from_date}
                  min={getCurrentDate}
                />



                <SimpleDropdown
                  name="leave_type"
                  label="Leave Type"
                  options={leaveTypeDropDown}
                  onChange={handleChange}
                  value={formData?.leave_type}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: "flex", gap: 2, flexDirection: "column" }}
              >
                <InputField
                  name="to_date"
                  type="date"
                  label="To"
                  onChange={handleChange}
                  value={formData?.to_date}
                />

                <InputField
                  // name="attachment"
                  label="Attachment"
                  type="file"
                  fullWidth
                // onChange={handleChange}
                // value={formData?.attachment}
                />
              </Grid>

              <Grid item xs={6}>
                <TextArea
                  name="notes"
                  lable="Note"
                  rows={5}
                  placeholder="Write note here..."
                  onChange={handleChange}
                  value={formData?.notes}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <LeaveAnalysisCard />
        </Grid>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{ m: "auto" }}
      >
        <Box sx={{ minWidth: "400px", p: 4, }}>
          <Typography
            variant="h6"
            color="initial"
          >
            <b>From: </b>{formData.from_date}
            {" "}
            <b>To: </b>{formData.to_date}
            <br />
            <b>Leave Type: </b>{data?.results.find(leave => leave.leave_id === formData.leave_type)?.leave_type}
            <br />
            <b>Note: </b>{formData.notes}
          </Typography>



          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              mt: 4,
              gap: 1,
            }}
          >
            <Btn
              type="sure"
              onClick={(e) => {
                handleSaveData(e);
                setOpenDialog(false);
              }}
              outerStyle={{
                border: "2px solid ${theme.palette.primary.light}",
                borderRadius: "8px",
              }}
            />
            <Btn
              type="close"
              onClick={() => setOpenDialog(false)}
              outerStyle={{
                border: "2px solid ${theme.palette.error.light}",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </Dialog>

    </div >
  );
};

export default LeaveApply;
