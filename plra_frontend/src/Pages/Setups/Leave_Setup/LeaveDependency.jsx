import React, { Fragment, useEffect, useState } from "react";
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
  useAdjustableDependecy_leaveDependency_trueQuery,
  useDeleteLeaveDependableDetailsMutation,
  useGetLeaveDependableDetailAPIQuery,
  useLeaveTypeQuery,
  usePostLeaveDependableDetailsMutation,
  useUpdateLeaveDependableDetailsMutation,
} from "../../../Features/API/SetupApi";
import { toast } from "react-toastify";
import { showToast } from "../../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from "../../../Components/Common/StatusCodeHandler.jsx";

function LeaveDependency() {

  const [formErrors, setFormErrors] = useState({});

  //States
  const theme = useTheme();
  const [centerDialog, setIsCenterDialog] = useState(false);
  const [leaveTypeDataDialog, setIsLeaveTypeDataDialog] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [adjustable, setAdjustable] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [isRowSelectedID, setIsRowSelectedID] = useState('');
  const [updateDialog, setUpdateDialog] = useState(false)
  const [deleteDialog, setdeleteDialog] = useState(false)
  const [formData, setFormData] = useState({ leave_with_adjustable: "", depends_upon: "", priority: "", });
  const [leave_with_adjustable_Name, setLeave_with_adjustable_Name] = useState("");
  const [depends_upon_Name, setDepends_upon_Name] = useState("");


  // API's
  const { data: leaveDependcyData, isLoading: loading, refetch, } = useAdjustableDependecy_leaveDependency_trueQuery();
  const { data: leaveTypeData, isLoading: LeaveTypeDataLoading, refetch: LeaveTypeDataRefetch, } = useLeaveTypeQuery();
  const { data: getLeaveDependable, isError, isLoading, refetch: leaveDependableRefresh, } = useGetLeaveDependableDetailAPIQuery();
  const [postLeaveDependableDetails] = usePostLeaveDependableDetailsMutation();
  const [deleteLeaveDependableDetails] = useDeleteLeaveDependableDetailsMutation();
  const [updateLeaveDependableDetails] = useUpdateLeaveDependableDetailsMutation();


  useEffect(() => {
    leaveDependableRefresh();
  }, [leaveDependableRefresh]);



  //Functions
  function leaveTypeClickHandler(selectedRow) {
    setLeaveType(selectedRow.leave_type);
    setFormData((prevData) => ({ ...prevData, leave_with_adjustable: selectedRow.leave_id, }));
    setIsCenterDialog(false);
  }

  function adjustableWithClickHandler(selectedRow) {
    setAdjustable(selectedRow.leave_type);
    setFormData((prevData) => ({ ...prevData, depends_upon: selectedRow.leave_id, }));
    setIsLeaveTypeDataDialog(false);
  }

  function handlePriorityChange(e) {
    const newPriorityValue = e.target.value;

    setPriorityValue(newPriorityValue);
    setFormData((prevData) => ({
      ...prevData,
      priority: newPriorityValue,
    }));
  }

  async function handleSaveData(e) {
    e.preventDefault();
    try {
      const res = await postLeaveDependableDetails(formData);
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
      setFormErrors({});
      setAdjustable("");
      setLeaveType("");
      setPriorityValue("");
      setFormData({
        leave_with_adjustable: "",
        depends_upon: "",
        priority: "",
      });
      leaveDependableRefresh();
    } catch (error) {
      showToast(`${err.message}`, "error");
    }

  }

  function hanldleRest() {
    setFormErrors({});
    setIsRowSelected(false);
    setIsRowSelectedID("")
    setAdjustable("");
    setLeaveType("");
    setPriorityValue("");
    setFormData({
      leave_with_adjustable: "",
      depends_upon: "",
      priority: "",
    });
  }

  async function handleDeleteData() {

    try {
      const res = await deleteLeaveDependableDetails(isRowSelectedID);
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      // success call
      showToast(`Record Deleted Successfully`, "success");
      setFormErrors({});
      setIsRowSelected(false);
      setAdjustable("");
      setLeaveType("");
      setPriorityValue("")
      setFormData({
        leave_with_adjustable: "",
        depends_upon: "",
        priority: "",
      });
      leaveDependableRefresh();
    } catch (error) {
      return showToast(`${err.message}`, "error");
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await updateLeaveDependableDetails({ id: isRowSelectedID, formData });
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
      setFormErrors({});
      setIsRowSelected(false);
      setIsRowSelectedID('')
      setFormData({
        leave_with_adjustable: "",
        depends_upon: "",
        priority: "",
      });
      setAdjustable('')
      setLeaveType('')
      leaveDependableRefresh()
    } catch (err) {
      showToast(`${err.message}`, "error");
    }
  };

  function handleRowClick(event) {
    setLeaveType(event?.row?.leave_with_adjustable?.leave_type)
    setAdjustable(event?.row?.depends_upon?.leave_type);
    setPriorityValue(event?.row?.priority)
    setFormData({
      leave_with_adjustable: event?.row?.leave_with_adjustable?.leave_id,
      depends_upon: event?.row?.depends_upon?.leave_id,
      priority: event?.row?.priority,
    });
    setIsRowSelected(true);
    setIsRowSelectedID(event.id)
  };

  const formattedData = getLeaveDependable?.results || [];

  function handleDeleteDialog() {
    if (isRowSelected) {
      setdeleteDialog(true)
    }
    else {
      showToast(`Record Not Selected`, "error");
    }
  };

  //Headers
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

  const LeaveDependencyHeader = [
    {
      field: "leave_type",
      headerName: "Leave Type",
      minWidth: 180,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params?.row?.leave_with_adjustable?.leave_type}
          </span>
        );
      },
    },
    {
      field: "depends_upon",
      headerName: "depends_upon",
      minWidth: 180,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column" >
            {params?.row?.depends_upon?.leave_type}
          </span>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 180,
      renderCell: (params) => {
        const onView = () => {
          handleRowClick(params);
        };
        return (
          <span onClick={onView} className="table_first_column">
            {params?.row?.priority}
          </span>
        );
      },
    },
  ];



  // Main 
  return (
    <Fragment>
      <Box sx={{ width: "100%", display: "flex", mb: 4, gap: 2, alignItems: "center", mt: 0.8, }}  >
        <Typography variant="h4" sx={{ width: "100%", color: theme.palette.primary.main, fontWeight: "500", fontSize: "20px", }} >
          Leave Adjustable Dependency
        </Typography>
        <Btn type="reset" onClick={hanldleRest} outerStyle={{ width: 1, display: "flex", justifyContent: "end", marginRight: 1, }} />
        <Btn type='save' onClick={
          isRowSelected ? () => setUpdateDialog(true)
            : handleSaveData
        }
        />
        {
          updateDialog ?
            <DialogBox
              open={updateDialog}
              onClose={() => setUpdateDialog(false)}
              closeClick={() => setUpdateDialog(false)}
              sureClick={() => { handleUpdate(); setUpdateDialog(false); }}
              title={"Are you sure you want to update the record?"}
            /> : ''
        }
        <Btn type="delete" onClick={handleDeleteDialog} />
        {
          deleteDialog ?
            <DialogBox
              open={deleteDialog}
              onClose={() => setdeleteDialog(false)}
              closeClick={() => setdeleteDialog(false)}
              sureClick={() => { handleDeleteData(); setdeleteDialog(false); }}
              title={"Are you sure you want to delete the record?"}
            /> : ''
        }
      </Box>

      <Box sx={{ margin: "10px 0" }}>
        <Grid container spacing={{ xs: 1, md: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 1 }} >
            {leaveDependcyData && leaveDependcyData.results ? (
              <div>
                <InputField
                  name="leave_with_adjustable"
                  mandatory={true}
                  label="Leave Type"
                  required={true}
                  type="text"
                  isShowIcon={true}
                  value={leaveType}
                  onClick={() => {
                    setIsCenterDialog(true);
                  }}
                  error={formErrors?.data?.leave_with_adjustable}
                />
                <Multi_Dropdown
                  isOpen={centerDialog}
                  onClose={() => setIsCenterDialog(false)}
                  MinimumWidth={"600px"}
                  tableRows={leaveDependcyData?.results || []}
                  tableHeader={LeaveTypeHeader}
                  onSelect={leaveTypeClickHandler}
                  RowFilterWith="leave_id"
                />
              </div>
            ) : (
              <InputField
                name="leave_with_adjustable"
                mandatory={true}
                label="Center "
                type="text"
                isShowIcon={true}
                value={leave_with_adjustable_Name}
                error={formErrors?.data?.leave_with_adjustable}
              />
            )}
            <InputField
              name="priority"
              label="Adjustable Priority"
              type="number"
              mandatory={true}
              value={formData.priority}
              onChange={handlePriorityChange}
              error={formErrors?.data?.priority}

            // onClick={handlePriority}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            {leaveTypeData && leaveTypeData.results ? (
              <div>
                <InputField
                  name="depends_upon"
                  mandatory={true}
                  label="Adjustable With"
                  required={true}
                  type="text"
                  isShowIcon={true}
                  value={adjustable}
                  onClick={() => {
                    setIsLeaveTypeDataDialog(true);
                  }}
                  error={formErrors?.data?.depends_upon}
                />
                <Multi_Dropdown
                  isOpen={leaveTypeDataDialog}
                  onClose={() => setIsLeaveTypeDataDialog(false)}
                  MinimumWidth={"600px"}
                  tableRows={leaveTypeData?.results || []}
                  tableHeader={LeaveTypeHeader}
                  onSelect={adjustableWithClickHandler}
                  RowFilterWith="leave_id"
                />
              </div>
            ) : (
              <InputField
                name="depends_upon"
                mandatory={true}
                label="Center "
                type="text"
                isShowIcon={true}
                value={depends_upon_Name}
                error={formErrors?.data?.depends_upon}

              />
            )}
          </Grid>
        </Grid>
      </Box>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}
      {getLeaveDependable && (
        <MyTableContainer
          columns={LeaveDependencyHeader}
          data={formattedData}
          onRowClick={handleRowClick}
          isAddNewButton={true}
          customPageSize={12}
          RowFilterWith="id"
          outerCSS={{ mt: 4 }}
          minHeight={"calc(100vh - 380px)"}
          getRowId={(row) => row.id}
        />
      )}

    </Fragment>
  );
}
export default LeaveDependency;
