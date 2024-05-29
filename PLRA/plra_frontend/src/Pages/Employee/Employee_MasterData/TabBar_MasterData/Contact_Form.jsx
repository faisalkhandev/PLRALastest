import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography, Grid, Switch, Dialog } from "@mui/material";
import { Btn, CheckBoxField, DialogBox, HeadingBar, InputField, } from "../../../../Components";
import Breadcrumb from "../../../../Components/Common/BreadCrumb";
import { useTheme } from "@emotion/react";
import SimpleDropdown from "../../../../Components/Common/SimpleDropDown";
import {
  useUpdateContactInformationMutation,
  useGetContactInformationQuery,
  useDeleteContactInformationMutation,
} from "../../../../Features/API/API";
import { toast } from "react-toastify";
import EmployeeFormDashboard from "../EmployeeDashboard/EmployeeFormDashboard";
import { usePostContactInformationMutation } from "../../../../Features/API/API";
import { useParams } from "react-router-dom";
import { Warning } from "../../../../Assets/Icons/index.jsx";
import InputMask from "react-input-mask";
import { showToast } from "../../../../Components/shared/Toast_Card.jsx";
import StatusCodeHandler from "../../../../Components/Common/StatusCodeHandler.jsx";

const Contact_Form = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState({});

  //States
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [formData, setFormData] = useState({
    purpose: null,
    type: null,
    contact_no_address: null,
    is_primary: false,
    employee: id,
  });
  const [selectRowID, setSelectedRowID] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableFields, setfieldsDisable] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);

  //Queries
  const { data: ContactData, isLoading: Contactloading, isError: ContactrefreshError, error: ContactqueryError, refetch: Contactrefetch, } = useGetContactInformationQuery(id);
  const [updateContactInformation] = useUpdateContactInformationMutation();
  const [postInformation] = usePostContactInformationMutation();
  const [deleteContactInformation] = useDeleteContactInformationMutation();

  //Functions

  useEffect(() => {
    Contactrefetch();
  }, []);



  const resetForm = () => {
    setFormErrors({});
    setSelectedRowID(null);
    setIsRowSelected(false);
    setActiveBoxIndex(null);
    setfieldsDisable(false);
    setFormData({
      purpose: "",
      type: "",
      contact_no_address: "",
      is_primary: false,
      employee: id,
    });
  };

  const handleBoxClick = (record, index) => {
    setIsRowSelected(true);
    setActiveBoxIndex(index);
    setSelectedRowID(record.e_c_i_rec_id);
    setFormData({
      ...formData,
      purpose: record.purpose,
      type: record.type,
      contact_no_address: record.contact_no_address,
      is_primary: record.is_primary,
      employee: record.employee,
    });
    setfieldsDisable(true);
  };

  const handlePostData = async (e) => {
    if (isRowSelected) {
      try {
        const res = await updateContactInformation({ selectRowID, updateContactInformation: formData, });
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
          setFormData({ purpose: "", type: "", contact_no_address: "", is_primary: false, employee: id, });
          setIsRowSelected(false);
          Contactrefetch();
        }
      } catch (err) {
        return showToast(`${err.message}`, "error");
      }
    } else {
      try {
        const res = await postInformation(formData);
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
          showToast(`Record created Successfully`, "success");
          setFormData({ purpose: "", type: "", contact_no_address: "", is_primary: false, employee: id, });
          setIsRowSelected(false);
          Contactrefetch();
        }
      } catch (err) {
        return showToast(`${err.message}`, "error");
      }
    }
  };

  const UpdateDialogHandler = () => {
    if (isRowSelected) {
      setEditDialog(true);
    } else {
      toast.error("Record not selected", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(event);
  };

  const handleDeleteData = async (e) => {
    try {
      // call api
      const res = await deleteContactInformation({ selectRowID });
      // error handling
      if (res?.error && res.error.status) {
        setFormErrors(res?.error)
        return showToast(<StatusCodeHandler error={res.error.status} />, 'error');
      }
      // success call
      showToast(`Record Deleted Successfully`, "success");
      setFormData({ purpose: "", type: "", contact_no_address: "", is_primary: false, employee: id, });
      Contactrefetch();
      setIsRowSelected(false);
    } catch (err) {
      return showToast(`${err.message}`, "error");
    }
  };

  const types = [
    { id: "1", value: "Phone", label: "Phone" },
    { id: "2", value: "Email-Address", label: "Email-Address" },
    { id: "3", value: "Fax", label: "Fax" },
    { id: "4", value: "Facebook", label: "Facebook" },
    { id: "5", value: "Twitter", label: "Twitter" },
    { id: "6", value: "LinkedIn", label: "LinkedIn" },
    { id: "8", value: "URL", label: "URL" },
  ];

  const Purpose = [
    { id: "1", value: "Home", label: "Home" },
    { id: "2", value: "Job", label: "Job" },
    { id: "3", value: "Other", label: "Other" },
  ];

  return (
    <div className="customBox">
      <Box className="headContainer">
        <Breadcrumb
          title="Contact Information"
          breadcrumbItem="Employee / Contact Info"
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Btn type="new" onClick={resetForm} />
          <Btn
            type={disableFields ? "edit" : "save"}
            onClick={
              disableFields ? () => setfieldsDisable(false) : handlePostData
            }
          />
          {isRowSelected ? (
            <Btn type="delete" onClick={() => setDeleteDialog(true)} />

          ) : null}
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
            {ContactData && ContactData.results && ContactData.results.length > 0 ? (ContactData.results.map((record, index) => (
              <Box key={record.id} sx={{ borderBottom: "1px solid #e2e1e0", p: 1, width: "90%", cursor: "pointer", }} className={activeBoxIndex === index ? "Box_Class" : ""} onClick={() => handleBoxClick(record, index)}  >
                <Typography variant="h6" color="green" sx={{ textDecoration: "none" }}  >
                  {record.purpose}
                </Typography>
                <Typography variant="body2" color="initial">
                  {record.contact_no_address}
                </Typography>{" "}
              </Box>
            ))
            ) : (
              <Typography sx={{ fontSize: '14px', m: 1, color: theme.palette.primary.main, fontWeight: 500 }}>Add Contact Information</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={7} className="employee_form_border">
          <Grid item xs={12} sx={{ pr: 1, mt: -2 }}>
            <HeadingBar title="Contact Information" />
          </Grid>
          <Grid item xs={12}>
            <Grid container columnSpacing={6} sx={{ px: 2 }}>
              <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                <SimpleDropdown name="purpose" label="Purpose" disabled={disableFields} mandatory={true} value={formData.purpose} onChange={handleChange} options={Purpose} error={formErrors?.data?.purpose} helperText={formErrors?.data?.purpose} />

                <InputField name="contact_no_address" label="Contact Address" disabled={disableFields} mandatory={true} value={formData.contact_no_address || ""} placeholder="Enter Contact Address" type="text" fullWidth onChange={handleChange} error={formErrors?.data?.contact_no_address} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 2 }} >
                <SimpleDropdown name="type" label="Type" disabled={disableFields} mandatory={true} value={formData.type} onChange={handleChange} options={types} error={formErrors?.data?.type} helperText={formErrors?.data?.type} />

                <Box className="inputBox" sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: "14px" }}>Is Primary:</Typography>
                  <Switch sx={{ ml: 9 }} size="small" checked={formData.is_primary} disabled={disableFields} onClick={() => { setFormData({ ...formData, is_primary: !formData.is_primary, }); }} name="active" />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <EmployeeFormDashboard userId={id} title="Processess" />
        </Grid>
      </Grid>
    </div>
  );
};

export default Contact_Form;
