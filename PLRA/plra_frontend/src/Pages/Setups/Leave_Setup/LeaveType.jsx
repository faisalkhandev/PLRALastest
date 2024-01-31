import React, { useEffect, useState } from "react";
import { Typography, Grid, Box, Switch, Card, Dialog } from "@mui/material";
import { Btn, InputField, MyTableContainer } from "../../../Components/index";
import { useTheme } from "@emotion/react";
import SimpleDropdown from "../../../Components/Common/SimpleDropDown";
import {
  useDeleteLeaveTypeMutation,
  useLeaveTypeQuery,
  usePostLeaveTypeMutation,
  useUpdateLeaveTypeMutation
} from "../../../Features/API/SetupApi";
import { Warning } from "../../../Assets/Icons";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";



const LeaveType = () => {
  const theme = useTheme();

  // states
  const [formData, setFormData] = useState({
    leave_type: "",
    leave_description: "",
    gender_eligibility: "",
    accrue: false,
    prorate_calculation: false,
    accrue_annual_limit: null,
    balance_paid_annually: false,
    earning_code: "",
    entire_service_validity: false,
    avail_number_of_times: "",
    one_time_avail_limit: "",
    deduction_code: "",
    entire_service_limit: "",
    leave_dependency: false,
    salary_deduction_eligibility_rule: false,
    visible_at_leave_apply_time: false,
  });
  const [isRowSelected, setIsRowSelected] = useState(false)
  const [isRowSelectedID, setIsRowSelectedID] = useState(null)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const options = [
    { id: 1, value: "Male", label: "Male" },
    { id: 2, value: "Female", label: "Female" },
    { id: 3, value: "All", label: "All" },
  ];




  // Query
  const { data, loading, refetch } = useLeaveTypeQuery();
  const [Post_Leave_Type_API] = usePostLeaveTypeMutation();
  const [DeleteLeaveType] = useDeleteLeaveTypeMutation();
  const [updateLeaveType] = useUpdateLeaveTypeMutation()

  // functions
  const handleSwitchChange = (name) => {
    setFormData((prevData) => ({ ...prevData, [name]: !prevData[name] }));
  };

  const handleAccrueSwitchChange = () => {
    let updatedFormData = {
      ...formData,
      accrue: !formData.accrue,
    };

    if (updatedFormData.accrue) {
      updatedFormData = {
        ...updatedFormData,
        entire_service_validity: false,
      };
    }
    setFormData(updatedFormData);
  };

  const handleVisibleSwitchChange = () => {
    let updatedFormData = { ...formData, entire_service_validity: !formData.entire_service_validity, };
    if (updatedFormData.entire_service_validity) {
      updatedFormData = { ...updatedFormData, accrue: false };
    }
    setFormData(updatedFormData);
  };

  const handleBalancePaidAnnuallyChange = () => {
    setFormData({
      ...formData,
      balance_paid_annually: !formData.balance_paid_annually,
      earning_code: !formData.balance_paid_annually
        ? ""
        : formData.earning_code,
    });
  };

  const handleAvailNumberChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      avail_number_of_times: value,
      entire_service_limit:
        (parseInt(value, 10) || 0) *
        (parseInt(formData.one_time_avail_limit, 10) || 0),
    }));
  };

  const handleOneTimeLimitChange = (e) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      one_time_avail_limit: value,
      entire_service_limit:
        (parseInt(formData.avail_number_of_times, 10) || 0) *
        (parseInt(value, 10) || 0),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Call specific functions for special cases
    if (name === "avail_number_of_times") {
      handleAvailNumberChange(e);
    } else if (name === "one_time_avail_limit") {
      handleOneTimeLimitChange(e);
    }
  };

  const ResetForm = (e) => {
    setIsRowSelected(false)
    setFormData({
      leave_type: "",
      leave_description: "",
      gender_eligibility: "",
      accrue: false,
      prorate_calculation: false,
      accrue_annual_limit: "",
      balance_paid_annually: false,
      earning_code: "",
      entire_service_validity: false,
      avail_number_of_times: "",
      one_time_avail_limit: "",
      deduction_code: "",
      entire_service_limit: "",
      leave_dependency: false,
      salary_deduction_eligibility_rule: false,
      visible_at_leave_apply_time: false,
    });
  };

  const handleSave = async (e) => {

    e.preventDefault();
    if (formData.leave_type === "" || formData.leave_description === "" || formData.gender_eligibility === "") {
      return toast.error(`Mandatory fields should not be empty.`, { position: "top-center", autoClose: 3000, });
    }
    else {
      let Leave_Type_Data = {
        leave_type: formData.leave_type,
        leave_description: formData.leave_description,
        gender_eligibility: formData.gender_eligibility,
        visible_at_leave_apply_time: formData.visible_at_leave_apply_time,
        salary_deduction_eligibility_rule:
          formData.salary_deduction_eligibility_rule,

        entire_service_validity: formData.entire_service_validity,
        accrue: formData.accrue,
        prorate_calculation: formData.prorate_calculation,
        leave_dependency: formData.leave_dependency,
      };

      if (formData.salary_deduction_eligibility_rule) {
        if (formData.deduction_code === "") {
          return toast.error("Deduction Code should not be empty.", { position: "top-center", autoClose: 3000 });
        } else {
          Leave_Type_Data = {
            ...Leave_Type_Data,
            deduction_code: formData.deduction_code
          };
        }
      }

      if (formData.accrue) {
        if (formData.accrue_annual_limit === "") {
          return toast.error("Accrue Annual Limit should not be empty.", { position: "top-center", autoClose: 3000 });
        } else {
          if (formData.balance_paid_annually && formData.earning_code === "") {
            return toast.error("Earning code should not be empty when balance_paid_annually is true.", { position: "top-center", autoClose: 3000, });
          } else if (formData.balance_paid_annually) {
            Leave_Type_Data = {
              ...Leave_Type_Data,
              earning_code: formData.earning_code,
            };
          }
          Leave_Type_Data = {
            ...Leave_Type_Data,
            accrue_annual_limit: formData.accrue_annual_limit,
            balance_paid_annually: formData.balance_paid_annually,
          };
        }
      }

      if (formData.entire_service_validity) {
        Leave_Type_Data = {
          ...Leave_Type_Data,
          avail_number_of_times: formData.avail_number_of_times,
          one_time_avail_limit: formData.one_time_avail_limit,
        };
      }

      const res = await Post_Leave_Type_API(Leave_Type_Data);
      if (res.error) {
        if (res.error.status === 400) { return toast.error("ID already exists.", { position: "top-center", autoClose: 3000, }); }
        else if (res.error.status === 500) { return toast.error("Server is not working", { position: "top-center", autoClose: 3000, }) }
        else { return toast.error("Unexpected Error Occurred", { position: "top-center", autoClose: 3000, }); }
      }
      toast.success("Record delete successfully.", { position: "top-center", autoClose: 3000, });
      setFormData({
        leave_type: "",
        leave_description: "",
        gender_eligibility: "",
        accrue: false,
        prorate_calculation: false,
        accrue_annual_limit: "",
        balance_paid_annually: false,
        earning_code: "",
        entire_service_validity: false,
        avail_number_of_times: "",
        one_time_avail_limit: "",
        deduction_code: "",
        entire_service_limit: "",
        leave_dependency: false,
        salary_deduction_eligibility_rule: false,
        visible_at_leave_apply_time: false,
      });
      setIsRowSelected(false);
      refetch();
    }
  };

  async function handleUpdateData(e) {
    let Leave_Type_Data = {
      leave_type: formData.leave_type,
      leave_description: formData.leave_description,
      gender_eligibility: formData.gender_eligibility,
      visible_at_leave_apply_time: formData.visible_at_leave_apply_time,
      salary_deduction_eligibility_rule:
        formData.salary_deduction_eligibility_rule,

      entire_service_validity: formData.entire_service_validity,
      accrue: formData.accrue,
      prorate_calculation: formData.prorate_calculation,
      leave_dependency: formData.leave_dependency,
    };
    if (formData.salary_deduction_eligibility_rule) {
      Leave_Type_Data = {
        ...Leave_Type_Data,
        deduction_code: formData.deduction_code,
      };
    }
    if (formData.accrue) {
      Leave_Type_Data = {
        ...Leave_Type_Data,
        accrue_annual_limit: formData.accrue_annual_limit,
        balance_paid_annually: formData.balance_paid_annually,
      };

      if (formData.balance_paid_annually) {
        Leave_Type_Data = {
          ...Leave_Type_Data,
          earning_code: formData.earning_code,
        };
      }
    }
    if (formData.entire_service_validity) {
      Leave_Type_Data = {
        ...Leave_Type_Data,
        avail_number_of_times: formData.avail_number_of_times,
        one_time_avail_limit: formData.one_time_avail_limit,
      };
    }
    try {
      const res = await updateLeaveType({ isRowSelectedID, Leave_Type_Data });

      if (res.error) {
        if (res.error.status === 400) {
          return toast.error("ID already exists.", {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (res.error.status === 500) {
          return toast.error("Server is not working", {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (res.error.status === 409) {
          return toast.error("Record updation failed due to linking.", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          return toast.error("Unexpected Error Occurred", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
      // Success case
      toast.success("Record Updated successfully.", {
        position: "top-center",
        autoClose: 3000,
      });
      setIsRowSelected(false);
      setEditDialog(false);
      setFormData({
        leave_type: "",
        leave_description: "",
        gender_eligibility: "",
        accrue: false,
        prorate_calculation: false,
        accrue_annual_limit: "",
        balance_paid_annually: false,
        earning_code: "",
        entire_service_validity: false,
        avail_number_of_times: "",
        one_time_avail_limit: "",
        deduction_code: "",
        entire_service_limit: "",
        leave_dependency: false,
        salary_deduction_eligibility_rule: false,
        visible_at_leave_apply_time: false,
      });
      refetch(); // Move refetch here
    }

    catch (err) {
      console.error("Error updating :", err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
    }

  }

  function handleRowClick(event) {
    setIsRowSelected(true)
    setFormData({
      leave_type: event?.row?.leave_type,
      leave_description: event?.row?.leave_description,
      gender_eligibility: event?.row?.gender_eligibility,
      accrue: event?.row?.accrue,
      prorate_calculation: event?.row?.prorate_calculation,
      accrue_annual_limit: event?.row?.accrue_annual_limit,
      balance_paid_annually: event?.row?.balance_paid_annually,
      earning_code: event?.row?.earning_code,
      entire_service_validity: event?.row?.entire_service_validity,
      avail_number_of_times: event?.row?.avail_number_of_times,
      one_time_avail_limit: event?.row?.one_time_avail_limit,
      deduction_code: event?.row?.deduction_code,
      entire_service_limit: event?.row?.entire_service_limit,
      leave_dependency: event?.row?.leave_dependency,
      salary_deduction_eligibility_rule: event?.row?.salary_deduction_eligibility_rule,
      visible_at_leave_apply_time: event?.row?.visible_at_leave_apply_time,

    })
    setIsRowSelectedID(event?.row?.leave_id)
    // console.log(isRowSelectedID)
  };

  function handleDeleteDialog() {
    if (isRowSelected) {
      setDeleteDialog(true)
    }
    else {
      toast.error("Record Not Selected", {
        position: 'top-center',
        autoClose: '3000'
      })
    }
  };

  async function handleDeleteData(e) {
    try {
      console.log(isRowSelected);
      if (!isRowSelected) {
        return toast.error("No Record Selected", { position: "top-center", autoClose: 3000 });
      }

      const res = await DeleteLeaveType(isRowSelectedID);
      if (res.error) {
        if (res.error.status === 500) {
          return toast.error("Server is not working", {
            position: "top-center",
            autoClose: 3000,
          });
        } else if (res.error.status === 409) {
          return toast.error("Record deletion failed due to linking.", {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          return toast.error("Unexpected Error Occurred", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      }
      toast.success("Record Deleted successfully.", {
        position: "top-center",
        autoClose: 3000,
      });

      refetch();
      setIsRowSelected(false);
      setFormData({
        leave_type: "",
        leave_description: "",
        gender_eligibility: "",
        accrue: false,
        prorate_calculation: false,
        accrue_annual_limit: "",
        balance_paid_annually: false,
        earning_code: "",
        entire_service_validity: false,
        avail_number_of_times: "",
        one_time_avail_limit: "",
        deduction_code: "",
        entire_service_limit: "",
        leave_dependency: false,
        salary_deduction_eligibility_rule: false,
        visible_at_leave_apply_time: false,
      });
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error as needed, e.g., show a generic error message.
      toast.error("An unexpected error occurred.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }

  useEffect(() => {
    refetch();
  }, []);


  // headers 
  const LeaveDependeableColumns = [
    {
      field: "leave_id",
      headerName: "Leave Type",
      minWidth: 170,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column" >
            {params?.row?.leave_type}
          </span>
        );
      },
    },
    {
      field: "gender_eligibility",
      headerName: "Gender Eligibility",
      minWidth: 150,
    },
    {
      field: "entire_service_validity",
      headerName: "Entire Leave Validity",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table-icons" style={{ color: params?.row?.entire_service_validity ? "green" : 'red' }}>
            {params?.row?.entire_service_validity ? <FaCheck /> : <RxCross2 />}
          </span>
        );
      },
    },
    {
      field: "accrue",
      headerName: "Accrue",
      minWidth: 100,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table-icons" style={{ color: params?.row?.accrue ? "green" : 'red' }}>
            {params?.row?.accrue ? <FaCheck /> : <RxCross2 />}
          </span>
        );
      },
    },
    {
      field: "visible_at_leave_apply_time",
      headerName: "Visible",
      minWidth: 50,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table-icons" style={{ color: params?.row?.visible_at_leave_apply_time ? "green" : 'red' }}>
            {params?.row?.visible_at_leave_apply_time ? <FaCheck /> : <RxCross2 />}
          </span>
        );
      },
    },
    {
      field: "salary_deduction_eligibility_rule",
      headerName: "Salary deduction",
      minWidth: 150,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table-icons" style={{ color: params?.row?.salary_deduction_eligibility_rule ? "green" : 'red' }}>
            {params?.row?.salary_deduction_eligibility_rule ? <FaCheck /> : <RxCross2 />}
          </span>
        );
      },
    },
  ];



  // Main 
  return (
    <Box sx={{ height: "calc(100vh - 200px)", overflowY: "scroll", pr: 1 }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          mb: 4,
          gap: 2,
          alignItems: "center",
          mt: 0.8,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            width: "100%",
            color: theme.palette.primary.main,
            fontWeight: "500",
            fontSize: "20px",
          }}
        >
          Leave Type Setup
        </Typography>
        <Btn
          type="reset"
          outerStyle={{
            width: 1,
            display: "flex",
            justifyContent: "end",
            marginRight: 1,
          }}
          Button_Type={"button"}
          onClick={ResetForm}
        />
        <Btn type="save" onClick={isRowSelected ? () => setEditDialog(true) : handleSave} />
        <Btn type="delete" onClick={handleDeleteDialog} />
      </Box>
      <Box sx={{ margin: "10px 0", height: "calc(100vh - 61vh)", mb: 8 }}>
        {/* Section 1 */}
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: 'center',
            gap: 1,
            p: 1,
            mb: 2,
          }}
        >
          <Grid container spacing={{ xs: 1, md: 4 }}>
            <Grid item xs={12} md={6} sx={{ gap: 1, display: "flex", flexDirection: "column" }}  >
              <InputField name="leave_type" label="Leave Name" type="text" value={formData.leave_type} onChange={handleChange} mandatory={true} required />
              <InputField name="leave_description" label="Leave Description" type="text" multiline={true} value={formData.leave_description} onChange={handleChange} mandatory={true} required />
              <SimpleDropdown label="Gender Eligibility" value={formData.gender_eligibility} onChange={(e) => setFormData({ ...formData, gender_eligibility: e.target.value, })} options={options} mandatory required />
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }} >
                <Typography sx={{ width: "32%", display: "flex", mt: 0.8, fontSize: "14px", }} > Visible:  </Typography>
                <Switch sx={{ mt: 1 }} size="small" name="visible_at_leave_apply_time" value={formData.visible_at_leave_apply_time || false} checked={formData.visible_at_leave_apply_time || false} onClick={() => handleSwitchChange("visible_at_leave_apply_time")} />
              </Box>
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}  >
                <Typography
                  sx={{ width: "32%", display: "flex", mt: 0.8, fontSize: "14px", }} > Salary Deduction Rule: </Typography>
                <Switch sx={{ mt: 1 }} size="small" name="salary_deduction_eligibility_rule" value={formData.salary_deduction_eligibility_rule} checked={formData.salary_deduction_eligibility_rule} onClick={() => handleSwitchChange("salary_deduction_eligibility_rule")} /> </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ gap: 1, display: "flex", flexDirection: "column" }} >
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "40%", display: "flex", mt: 0.8, fontSize: "14px", }} > Entire service Validity: </Typography>
                <Switch sx={{ mt: 1 }} size="small" name="entire_service_validity" value={formData.entire_service_validity || false} checked={formData.entire_service_validity || false} onClick={handleVisibleSwitchChange} />
              </Box>
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "40%", display: "flex", mt: 0.8, fontSize: "14px", }} >Accrue : </Typography>
                <Switch sx={{ mt: 1 }} size="small" name="accrue" value={formData.accrue || false} checked={formData.accrue || false} onClick={handleAccrueSwitchChange} />
              </Box>

              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }} >
                <Typography sx={{ width: "40%", display: "flex", mt: 0.8, fontSize: "14px", }} > Pro Rate Calculation: </Typography>
                <Switch sx={{ mt: 1 }} size="small" checked={formData.prorate_calculation || false} name="prorate_calculation" value={formData.prorate_calculation || false} onClick={() => handleSwitchChange("prorate_calculation")} />
              </Box>
              <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: "40%", display: "flex", mt: 0.8, fontSize: "14px", }}> Leave Dependency: </Typography>
                <Switch sx={{ mt: 1 }} size="small" name="leave_dependency" value={formData.leave_dependency || false} checked={formData.leave_dependency || false} onClick={() => handleSwitchChange("leave_dependency")} />
              </Box>
              {formData.salary_deduction_eligibility_rule && (
                <InputField name="deduction_code" label="Deduction Code" type="number" value={formData.deduction_code || ""} onChange={handleChange} />)}
            </Grid>
          </Grid>
        </Card>
        {/* Section 2 */}
        {formData.accrue ? (
          <Card sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, mb: 2, }} >
            <Typography variant="h6" fontWeight={600}>Accrue Setup:</Typography>
            <Grid container spacing={{ xs: 1, md: 4 }}>
              <Grid item xs={12} md={6} sx={{ gap: 1, display: "flex", flexDirection: "column" }}  >
                <InputField name="accrue_annual_limit" label="Accrue Annual Limit" type="number" value={formData.accrue_annual_limit} onChange={handleChange} mandatory={true} />
                {formData.balance_paid_annually && (
                  <InputField name="earning_code" label="Earning Code" type="text" value={formData.earning_code} onChange={handleChange} mandatory={true} />)}
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ gap: 1, display: "flex", flexDirection: "column" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      width: "40%",
                      display: "flex",
                      mt: 0.8,
                      fontSize: "14px",
                    }}
                  >
                    Balance Paid Annually:
                  </Typography>
                  <Switch
                    sx={{ mt: 1 }}
                    size="small"
                    name="balance_paid_annually"
                    value={formData.balance_paid_annually || false}
                    checked={formData.balance_paid_annually || false}
                    onClick={handleBalancePaidAnnuallyChange}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        ) : null}
        {/* Section 3 */}
        {formData.entire_service_validity ? (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: 1,
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Service validity setup:
            </Typography>
            <Grid container spacing={{ xs: 1, md: 4 }}>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ gap: 1, display: "flex", flexDirection: "column" }}
              >
                <InputField
                  name="avail_number_of_times"
                  label="Avail no. of Times"
                  type="number"
                  value={formData.avail_number_of_times}
                  onChange={handleChange}
                />
                <InputField
                  name="one_time_avail_limit"
                  label="Days Available Time"
                  type="number"
                  value={formData.one_time_avail_limit}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ gap: 1, display: "flex", flexDirection: "column" }}
              >
                <InputField
                  name="entire_service_limit"
                  label="Entire Service Limit"
                  type="number"
                  value={formData.entire_service_limit}
                  onChange={handleChange}
                  InputState={true}
                />
              </Grid>
            </Grid>
          </Card>
        ) : null}
      </Box>


      {/* Table  */}
      {data && (
        <MyTableContainer
          columns={LeaveDependeableColumns}
          data={data.results}
          isAddNewButton={true}
          customPageSize={7}
          RowFilterWith="leave_id"
          onRowClick={handleRowClick}
          minHeight={"calc(100vh - 650px)"}
        />
      )}


      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        sx={{ m: "auto" }}
      >
        <Box sx={{ minWidth: "400px", p: 2 }}>
          <Typography
            variant="h6"
            color="initial"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Warning />
            Are you sure to update record.
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
              onClick={() => {
                handleUpdateData();
                setEditDialog(false);
              }}
              outerStyle={{
                border: `2px solid ${theme.palette.primary.light}`,
                borderRadius: "8px",
              }}
            />
            <Btn
              type="close"
              onClick={() => setEditDialog(false)}
              outerStyle={{
                border: `2px solid ${theme.palette.error.light}`,
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </Dialog>

      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        sx={{ m: "auto" }}
      >
        <Box sx={{ minWidth: "400px", p: 2 }}>
          <Typography
            variant="h6"
            color="initial"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Warning />
            Are you sure to delete record.
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
              onClick={() => {
                handleDeleteData();
                setDeleteDialog(false);
              }}
              outerStyle={{
                border: `2px solid ${theme.palette.primary.light}`,
                borderRadius: "8px",
              }}
            />
            <Btn
              type="close"
              onClick={() => setDeleteDialog(false)}
              outerStyle={{
                border: `2px solid ${theme.palette.error.light}`,
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </Dialog>


    </Box>

  );
};

export default LeaveType;
