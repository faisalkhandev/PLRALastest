import React, { Fragment, useState } from "react";
import { Box, Typography, Grid, Switch, Dialog } from "@mui/material";
import {
  Btn,
  CheckBoxField,
  HeadingBar,
  InputField,
} from "../../../../Components";
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

const Contact_Form = () => {
  const theme = useTheme();
  const { id } = useParams();

  //States
  const [activeBoxIndex, setActiveBoxIndex] = useState(0);
  const [formData, setFormData] = useState({
    purpose: "",
    type: "",
    contact_no_address: "",
    is_primary: false,
    employee: id,
  });
  const [selectRowID, setSelectedRowID] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [disableFields, setfieldsDisable] = useState(false);
  const [isRowSelected, setIsRowSelected] = useState(false);

  //Queries
  const {
    data: ContactData,
    isLoading: Contactloading,
    isError: ContactrefreshError,
    error: ContactqueryError,
    refetch: Contactrefetch,
  } = useGetContactInformationQuery(id);
  const [updateContactInformation] = useUpdateContactInformationMutation();
  const [postInformation] = usePostContactInformationMutation();
  const [deleteContactInformation] = useDeleteContactInformationMutation();

  //Functions

  const resetForm = () => {
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
        const res = await updateContactInformation({
          selectRowID,
          updateContactInformation: formData,
        });
        if (res.error) {
          if (res.error.status === 400) {
            toast.error("Record not updated.", {
              position: "top-center",
              autoClose: 3000,
            });
          } else {
            toast.error("Something is wrong!!!", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        } else {
          toast.success("Record updated successfully.", {
            position: "top-center",
            autoClose: 3000,
          });
          setFormData({
            purpose: "",
            type: "",
            contact_no_address: "",
            is_primary: false,
            employee: id,
          });
          setIsRowSelected(false);

          Contactrefetch();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      if (
        formData.purpose == "" ||
        formData.type == "" ||
        formData.contact_no_address == "" ||
        formData.education_end_date == ""
      ) {
        toast.error("Mandatory field's should not be empty.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        try {
          const res = await postInformation(formData);
          if (res.error) {
            if (res.error.status === 400) {
              toast.error("Record not updated.", {
                position: "top-center",
                autoClose: 3000,
              });
            } else {
              toast.error("Something is wrong!!!", {
                position: "top-center",
                autoClose: 3000,
              });
            }
          } else {
            toast.success("Record created successfully.", {
              position: "top-center",
              autoClose: 3000,
            });
            setFormData({
              purpose: "",
              type: "",
              contact_no_address: "",
              is_primary: false,
              employee: id,
            });
            setIsRowSelected(false);
            Contactrefetch();
          }
        } catch (err) {
          console.log(err);
        }
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
      // success call
      toast.success("Record Deleted successfully.", {
        position: "top-center",
        autoClose: 3000,
      });
      setFormData({
        purpose: "",
        type: "",
        contact_no_address: "",
        is_primary: false,
        employee: id,
      });
      Contactrefetch();
      setIsRowSelected(false);
    } catch (err) {
      console.error("Error Deleting Record:", err);
      toast.error(err.message, { position: "top-center", autoClose: 3000 });
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
        </Box>
      </Box>

      <Grid container columnSpacing={1} sx={{ height: "calc(100vh - 280px)" }}>
        <Grid item xs={4} md={2}>
          <Box className="form_sidebar">
            {ContactData &&
              ContactData.results &&
              ContactData.results.length > 0 ? (
              ContactData.results.map((record, index) => (
                <Box
                  key={record.id}
                  sx={{
                    borderBottom: "1px solid #e2e1e0",
                    p: 1,
                    width: "90%",
                    cursor: "pointer",
                  }}
                  className={activeBoxIndex === index ? "Box_Class" : ""}
                  onClick={() => handleBoxClick(record, index)}
                >
                  <Typography
                    variant="h6"
                    color="green"
                    sx={{ textDecoration: "none" }}
                  >
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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <SimpleDropdown
                  name="purpose"
                  label="Purpose "
                  disabled={disableFields}
                  mandatory={true}
                  value={formData.purpose}
                  onChange={handleChange}
                  options={Purpose}
                />

                <InputField
                  name="contact_no_address"
                  label="Contact Address"
                  disabled={disableFields}
                  mandatory={true}
                  value={formData.contact_no_address || ""}
                  placeholder="Enter Contact Address"
                  type="text"
                  fullWidth
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <SimpleDropdown
                  name="type"
                  label="Type"
                  disabled={disableFields}
                  mandatory={true}
                  value={formData.type}
                  onChange={handleChange}
                  options={types}
                />

                <Box className="inputBox" sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: "14px" }}>Is Primary:</Typography>
                  <Switch
                    sx={{ ml: 9 }}
                    size="small"
                    checked={formData.is_primary}
                    disabled={disableFields}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        is_primary: !formData.is_primary,
                      });
                    }}
                    name="active"
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <EmployeeFormDashboard />
        </Grid>
      </Grid>
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
                border: "2px solid ${theme.palette.primary.light}",
                borderRadius: "8px",
              }}
            />
            <Btn
              type="close"
              onClick={() => setDeleteDialog(false)}
              outerStyle={{
                border: "2px solid ${theme.palette.error.light}",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default Contact_Form;
