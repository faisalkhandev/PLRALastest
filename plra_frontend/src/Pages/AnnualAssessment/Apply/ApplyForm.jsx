import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  Btn,
  InputField,
  Multi_Dropdown,
  TextArea,
} from "../../../Components";
import { Box, Grid } from "@mui/material";
import {
  useGetUserByIdQuery,
  usePostAnnualAssessmentProocessListMutation,
  useGetUserJobByIdQuery,
  useGetHRCalendarYearQuery,
} from "../../../Features/API/AnnualAssessment";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../Components/shared/Toast_Card";
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler";
import EmployeeFormDashboard from "../../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";
import Cookies from "js-cookie";
import { GoBack } from "../../../Assets/Icons";
import { useTheme } from "@emotion/react";

const ApplyForm = () => {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});
  const [empId, setEmpId] = useState("");
  const [hrYearDialog, setHrYearDialog] = useState(false);
  const [hrData, setHrData] = useState(null);
  const [hrStartDate, setHrStartDate] = useState(null);
  const [hrEndDate, setHrEndDate] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    year: "",
    attachment: null,
    notes: "",
    employee: empId,
    job_description: "",
    brief_achievements: "",
  });

  useLayoutEffect(() => {
    setEmpId(Cookies.get("user_id"));
    setFormData({
      employee: empId,
    });
    console.log("ID uin Annual ", empId);
  }, [empId]);

  console.log("EmpID", empId);
  // Queries
  const {
    data: HrYearData,
    isLoading: loading,
    isError: refreshError,
    error: queryError,
    refetch: refetchHrYear,
  } = useGetHRCalendarYearQuery();
  const {
    data: jobData,
    isLoading: jobloading,
    isError: jobrefreshError,
    error: jobqueryError,
    refetch: refetchjob,
  } = useGetUserJobByIdQuery(empId);

  const {
    data: employeeById,
    isError,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(empId);
  const [postAnnuualAssessment] = usePostAnnualAssessmentProocessListMutation();

  const empName = ` ${employeeById?.first_name || ""} ${
    employeeById?.last_name || ""
  } `;

  // functions
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSaveData = async (e) => {
    e.preventDefault();
    try {
      let formD = new FormData();
      formD.append("year", formData.year);
      formD.append("employee", empId);
      formD.append("notes", formData.notes);
      formD.append("job_description", formData.job_description);
      formD.append("brief_achievements", formData.brief_achievements);

      if (
        typeof formData.attachment !== "string" &&
        formData.attachment != null
      ) {
        formD.append("attachments", formData.attachment);
      }

      const res = await postAnnuualAssessment(formD);

      if (res?.error && res.error.status) {
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return showToast(`${res?.error?.data?.detail}`, "error");
        }
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        setFormErrors(res?.error);
        return showToast(
          <StatusCodeHandler error={res.error.status} />,
          "error"
        );
      } else {
        showToast(`Annual Assessment Applied Successfully`, "success");
        setFormErrors({});
        navigate("/AnnualAssessment");
        setFormData({
          year: " ",
          notes: "",
          attachment: null,
          job_description: "",
          brief_achievements: "",
          employee: sessionStorage.getItem("UserID") || "",
        });
      }
    } catch (error) {
      showToast(`${error.message}`, "error");
    }
  };

  const hrYearClickHandler = useCallback(
    (selectedRow) => {
      setHrData(selectedRow.hr_year);
      setHrStartDate(selectedRow.hr_celander_starting_date);
      setHrEndDate(selectedRow.hr_celander_ending_date);
      setFormData({
        ...formData,
        year: selectedRow.id,
      });
      setHrYearDialog(false);
    },
    [formData]
  );

  const hrYearHeader = useMemo(
    () => [
      {
        field: "id",
        headerName: "Year ID",
        type: "string",
        flex: true,
        align: "left",
      },
      {
        field: "hr_year",
        headerName: "HR Year",
        type: "string",
        flex: true,
        align: "left",
      },
      {
        field: "hr_celander_starting_date",
        headerName: "Start Date",
        type: "string",
        flex: true,
      },

      {
        field: "hr_celander_ending_date",
        headerName: "End Date",
        type: "string",
        flex: true,
      },
    ],
    []
  );

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
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: "rotate(180deg)",
                    cursor: "pointer",
                    m: 1,
                    borderRadius: "6px",
                    backgroundColor: `${theme.palette.white[800]}`,
                    boxShadow: `0 0 2px 3px ${theme.palette.common.white}`,
                  }}
                  onClick={() => window.history.go(-1)}
                >
                  <GoBack />
                </Box>
                <Breadcrumb
                  title="Annual Assessment"
                  breadcrumbItem="Employee / Annual Assessment"
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                <Btn type="apply" onClick={handleSaveData} />
              </Box>
            </Box>

            <Grid
              container
              spacing={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Grid
                xs={9}
                item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  m: " auto auto",
                }}
              >
                {HrYearData && HrYearData.results ? (
                  <div>
                    <InputField
                      name="year"
                      label="Year"
                      placeholder="Select Year"
                      value={hrData || ""}
                      type="text"
                      isShowIcon={true}
                      onClick={() => setHrYearDialog(true)}
                      mandatory
                      error={formErrors?.data?.year}
                      fullWidth
                    />
                    <Multi_Dropdown
                      RowFilterWith={"id"}
                      onClose={() => setHrYearDialog(false)}
                      isOpen={hrYearDialog}
                      tableHeader={hrYearHeader}
                      tableRows={HrYearData.results}
                      onSelect={hrYearClickHandler}
                      MinimumWidth={"500px"}
                    />
                  </div>
                ) : (
                  <InputField
                    name="year"
                    label="Year"
                    placeholder="Select Year"
                    value={hrData || ""}
                    type="text"
                    isShowIcon={true}
                    onClick={() => setHrYearDialog(true)}
                    error={formErrors?.data?.year}
                  />
                )}
                <InputField
                  name="start_date"
                  label="Start Date"
                  placeholder=""
                  value={hrStartDate || ""}
                  type="date"
                  fullWidth
                  onChange={handleChange}
                  disabled
                  error={formErrors?.data?.start_date}
                />
                <InputField
                  name="end_date"
                  label="End Date"
                  placeholder=""
                  value={hrEndDate || ""}
                  type="date"
                  fullWidth
                  onChange={handleChange}
                  disabled
                  error={formErrors?.data?.end_date}
                />
                <InputField
                  name="attachment"
                  label="Attachment"
                  placeholder=""
                  type="file"
                  fullWidth
                  mandatory
                  onChange={handleFileChange}
                  error={formErrors?.data?.attachments}
                />
                <TextArea
                  Rows={4}
                  name="notes"
                  value={formData.notes}
                  label="Notes"
                  placeholder="Write Notes...."
                  onChange={handleChange}
                  error={formErrors?.data?.notes}
                  helperText={formErrors?.data?.notes}
                />
                {jobData?.results[0]?.headoffice && (
                  <TextArea
                    Rows={4}
                    outerStyles={{ ml: 2 }}
                    name="job_description"
                    value={formData.job_description}
                    label="Job Description"
                    placeholder="Write Description...."
                    onChange={handleChange}
                    error={formErrors?.data?.job_description}
                    helperText={formErrors?.data?.job_description}
                  />
                )}
                {jobData?.results[0]?.headoffice && (
                  <TextArea
                    Rows={4}
                    name="brief_achievements"
                    value={formData.brief_achievements}
                    label="Brief Achievements"
                    placeholder="Write Brief Achievements...."
                    onChange={handleChange}
                    error={formErrors?.data?.brief_achievements}
                    helperText={formErrors?.data?.brief_achievements}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={3}>
          <EmployeeFormDashboard
            userId={empId}
            title="Processess"
            processName="Annual Assessment"
            height="calc(100vh - 150px)"
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default ApplyForm;


