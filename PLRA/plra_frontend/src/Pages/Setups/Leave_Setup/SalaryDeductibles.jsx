import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Typography, Grid, Box, Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Warning } from "../../../Assets/Icons/index.jsx";
import {
  MyTableContainer,
  Btn,
  Multi_Dropdown,
  InputField,
  DialogBox,
} from "../../../Components/index.js";
import {
  useGetSalaryDeductibleQuery,
  useGetSalaryDeductibleeQuery,
  useSalaryDeductibleTypeMutation,
  useSalaryDeductible_LeaveTypeQuery,
  useDeleteSalaryDeductibleTypeMutation,
  useUpdateSalaryDeductibleTypeMutation
} from "../../../Features/API/SetupApi";
import { toast } from "react-toastify";
import { showToast } from "../../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler.jsx";

function SalaryDeductibles() {
  const theme = useTheme();
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({ leave_type: "", ppg_level: "" });
  const [ID, useDeductibleTypeID] = useState("");
  const [centerDialog, setIsCenterDialog] = useState(false);
  const [PPGDialog, setIsPPGDialog] = useState(false);
  const [leaveName, setLeaveName] = useState("");
  const [ppgLevelName, setPpgLevelName] = useState("");
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [updateSalaryDeductibleDialog, setUpdateSalaryDeductibleDialog] = useState(false);
  const [deleteSalaryDeductibleDialog, setdeleteSalaryDeductibleDialog] = useState(false);

  // API's
  const { data: SalaryDeductableData, isLoading: loading, refetch, } = useGetSalaryDeductibleQuery();
  const { data: LeaveTypeData, refetch: GetSalaryDeductibleRefetch } = useSalaryDeductible_LeaveTypeQuery();
  const { data: ppglevelData, refetch: GetSalaryDeductibleeRefetch } = useGetSalaryDeductibleeQuery();
  const [SalaryDeductionType] = useSalaryDeductibleTypeMutation();
  const [UpdateSalaryDeductibleType] = useUpdateSalaryDeductibleTypeMutation();
  const [deleteSarayDeductibleType] = useDeleteSalaryDeductibleTypeMutation();



  useEffect(() => {
    refetch();
    GetSalaryDeductibleRefetch();
    GetSalaryDeductibleeRefetch();
  }, [refetch, GetSalaryDeductibleeRefetch, GetSalaryDeductibleRefetch]);

  const leaveTypeClickHandler = (selectedRow) => {
    setLeaveName(selectedRow.leave_type);

    setFormData((prevData) => ({
      ...prevData,
      leave_type: selectedRow.leave_id,
    }));
    setIsCenterDialog(false);
  };

  const ppgLevelClickHandler = (selectedRow) => {
    console.log(selectedRow);
    setPpgLevelName(selectedRow.ppg_level);
    setFormData((prevData) => ({
      ...prevData,
      ppg_level: selectedRow.ppg_rec_id,
    }));
    setIsPPGDialog(false);
  };

  const handleSaveData = async (e) => {
    e.preventDefault();
    try {
      const res = await SalaryDeductionType(formData);
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record created Successfully`, "success");
      resetForm();
      setIsRowSelected(false);
      useDeductibleTypeID('')
      setFormData({ leave_type: "", ppg_level: "" });
      setLeaveName("");
      setPpgLevelName("");
      refetch();
    } catch (error) {
      showToast(`${err.message}`, "error");
    }

  }
  const handleUpdateData = async () => {
    try {
      const updatedata = {
        s_rec_id: ID,
        leave_type: formData.leave_type,
        ppg_level: formData.ppg_level
      }
      const res = await UpdateSalaryDeductibleType({ ID, updatedata });
      if (res?.error && res.error.status) {
        if (res?.error?.status == 400 && res?.error?.data?.non_field_errors) {
          return showToast(`${res?.error?.data?.non_field_errors}`, "error");
        }
        if (res?.error?.status === 422 && res?.error?.data?.code) {
          return (showToast(`${res?.error?.data?.detail}`, "error"));
        }
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      showToast(`Record updated Successfully`, "success");
      resetForm();
      setIsRowSelected(false);
      setFormData({ leave_type: "", ppg_level: "" });
      setLeaveName("");
      setPpgLevelName("");
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  const handleDeleteRecord = async () => {
    try {
      const res = await deleteSarayDeductibleType(ID);
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      // success call
      showToast(`Record Deleted Successfully`, "success");
      resetForm();
      setIsRowSelected(false);
      setFormData({ leave_type: "", ppg_level: "" });
      setLeaveName("");
      setPpgLevelName("");
      refetch();
    } catch (err) {
      showToast(`${err.message}`, "error");

    }
  };

  const resetForm = () => {
    setFormErrors({});
  };

  const handleEmptyDelete = () => {
    toast.error("No record selected.", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const handleReset = () => {
    resetForm();
    setIsRowSelected(false);
    useDeductibleTypeID("")
    setFormData({ leave_type: "", ppg_level: "" });
    setLeaveName("");
    setPpgLevelName("");
  };

  const handleRowClick = (event) => {
    setIsRowSelected(true);
    useDeductibleTypeID(event.id);
    setFormData({
      leave_type: event?.row?.leave_type?.leave_id,
      ppg_level: event?.row?.ppg_level?.ppg_rec_id,
    });
    setLeaveName(event?.row?.leave_type?.leave_type);
    setPpgLevelName(event?.row?.ppg_level?.ppg_level);
  };

  const handleDeleteDialog = useCallback(() => {
    if (isRowSelected) {
      setdeleteSalaryDeductibleDialog(true);
    } else {
      return showToast('Record not Selected', 'error');
    }
  }, [isRowSelected]);

  // Headers 
  const LeaveTypeHeader = [
    {
      field: "leave_id",
      headerName: "ID",
      minWidth: 120,
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      flex: true,
      renderCell: (params) => {
        return <span>{params.row.leave_type}</span>;
      },
    },
  ];

  const PPGLevelHeader = [
    {
      field: "ppg_rec_id",
      headerName: "ID",
      minWidth: 120,
    },
    {
      field: "ppg_level",
      headerName: "PPG Level",
      flex: true,
      renderCell: (params) => {
        return <span>{params.row.ppg_level}</span>;
      },
    },
  ];

  const Salary_Deductible_Role_Columns = [
    {
      field: "leave_type",
      headerName: "Leave Type",
      minWidth: 200,
      valueGetter: (params) => params.row?.leave_type?.leave_type || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
    {
      field: "ppg_level",
      headerName: "PPG Level",
      minWidth: 200,
      valueGetter: (params) => params.row?.ppg_level?.ppg_level || '',
      renderCell: (params) => {
        const onView = () => { handleRowClick(params) };
        return (
          <span onClick={onView} className='table_first_column'>{params.value}</span>
        );
      },
    },
  ];

  return (
    <Fragment>
      <form action="">
        <Box sx={{ width: "100%", display: "flex", mb: 4, gap: 2, alignItems: "center", mt: 0.8, }}  >
          <Typography variant="h4" sx={{ width: "100%", color: theme.palette.primary.main, fontWeight: "500", fontSize: "20px", }}  >
            {" "}
            Salary Deductible Rule
          </Typography>
          <Btn type="reset" outerStyle={{ width: 1, display: "flex", justifyContent: "end", marginRight: 1, }} onClick={handleReset} />
          <Btn type="save" onClick={isRowSelected ? () => setUpdateSalaryDeductibleDialog(true) : handleSaveData} />
          {
            updateSalaryDeductibleDialog ?
              <DialogBox
                open={editDialog}
                onClose={() => setUpdateSalaryDeductibleDialog(false)}
                closeClick={() => setUpdateSalaryDeductibleDialog(false)}
                sureClick={() => { handleUpdateData(); setUpdateSalaryDeductibleDialog(false); }}
                title={"Are you sure you want to update the record?"}
              /> : ''
          }
          <Btn type="delete" onClick={handleDeleteDialog} />
          {/* {
            deleteSalaryDeductibleDialog ?
              <DialogBox
                open={deleteDialog}
                onClose={() => setdeleteSalaryDeductibleDialog(false)}
                closeClick={() => setDeleteDialog(false)}
                sureClick={() => setdeleteSalaryDeductibleDialog(false)}
                title={"Are you sure you want to delete the record?"}
              /> : ''
          } */}
        </Box>
        <Box sx={{ margin: "10px 0" }}>
          <Grid container spacing={{ xs: 1, md: 4 }}>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 1 }}  >
              {LeaveTypeData && LeaveTypeData.results ? (
                <div>
                  <InputField
                    name="leave_type"
                    mandatory={true}
                    label="Leave Type"
                    required={true}
                    type="text"
                    isShowIcon={true}
                    value={leaveName || ""}
                    onClick={() => {
                      setIsCenterDialog(true);
                    }}
                    error={formErrors?.data?.leave_type}

                  />
                  <Multi_Dropdown
                    isOpen={centerDialog}
                    onClose={() => setIsCenterDialog(false)}
                    MinimumWidth={"600px"}
                    tableRows={LeaveTypeData?.results || []}
                    tableHeader={LeaveTypeHeader}
                    onSelect={leaveTypeClickHandler}
                    RowFilterWith="leave_id"
                  />
                </div>
              ) : (
                <InputField
                  name="center"
                  mandatory={true}
                  label="Center "
                  type="text"
                  isShowIcon={true}
                  value={leaveName}
                  error={formErrors?.data?.center}

                />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {ppglevelData && ppglevelData.results ? (
                <div>
                  <InputField
                    name="ppg_level"
                    mandatory={true}
                    label="PPG Level"
                    required={true}
                    type="text"
                    isShowIcon={true}
                    value={ppgLevelName || ""}
                    onClick={() => {
                      setIsPPGDialog(true);
                    }}
                    error={formErrors?.data?.ppg_level}

                  />
                  <Multi_Dropdown
                    isOpen={PPGDialog}
                    onClose={() => setIsPPGDialog(false)}
                    MinimumWidth={"600px"}
                    tableRows={ppglevelData?.results || []}
                    tableHeader={PPGLevelHeader}
                    onSelect={ppgLevelClickHandler}
                    RowFilterWith="ppg_rec_id"
                  />
                </div>
              ) : (
                <InputField
                  name="ppg_level"
                  mandatory={true}
                  label="PPG Level"
                  type="text"
                  isShowIcon={true}
                  value={ppgLevelName}
                  error={formErrors?.data?.ppg_level}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </form>

      {SalaryDeductableData && (
        <MyTableContainer
          columns={Salary_Deductible_Role_Columns}
          data={SalaryDeductableData.results}
          onRowClick={handleRowClick}
          isAddNewButton={true}
          customPageSize={10}
          RowFilterWith="s_rec_id"
          outerCSS={{ mt: 4 }}
          minHeight={"calc(100vh - 330px)"}
        />
      )}

      {/* <Dialog open={updateSalaryDeductibleDialog} onClose={() => setUpdateSalaryDeductibleDialog(false)} sx={{ m: "auto" }}>
        <Box sx={{ minWidth: "400px", p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: "flex", alignItems: "center", gap: 1 }}  >
            <Warning />
            Do you want to update that record.
          </Typography>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 4, gap: 1, }}   >
            <Btn type="sure" onClick={() => { handleUpdateData(); setUpdateSalaryDeductibleDialog(false); }} iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px", }} />
            <Btn type="close" onClick={() => setUpdateSalaryDeductibleDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px", }} />
          </Box>
        </Box>
      </Dialog> */}
      <Dialog open={deleteSalaryDeductibleDialog} onClose={() => setdeleteSalaryDeductibleDialog(false)} sx={{ m: "auto" }}  >
        <Box sx={{ minWidth: "400px", p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: "flex", alignItems: "center", gap: 1 }}  >
            <Warning />
            Do you want to delete that record.
          </Typography>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end", mt: 4, gap: 1, }}  >
            <Btn type="sure" onClick={() => { handleDeleteRecord(); setdeleteSalaryDeductibleDialog(false); }}
              iconStyle={{ color: theme.palette.primary.light }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px", }} />
            <Btn type="close" onClick={() => setdeleteSalaryDeductibleDialog(false)} iconStyle={{ color: theme.palette.error.light }} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px", }} />
          </Box>
        </Box>
      </Dialog>
    </Fragment>
  );
}

export default SalaryDeductibles;
