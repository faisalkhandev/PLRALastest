

import {
  Box,
  FormControl,
  Grid,
  NativeSelect,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Theme from "../../../Theme/Light__Theme";
import "../../table.css";
import { Breadcrumb, Btn, InputField, SimpleDropDown, TextArea } from "../../../Components";
import { Trash } from "../../../Assets/Icons/index"
import { toast } from "react-toastify";
import { useGetHRCalendarYearQuery, usePostRatingPointsMutation, usePostRatingModelMutation, useGetRatingPointsQuery } from "../../../Features/API/AnnualAssessment";
import { useNavigate } from "react-router-dom";
import { useGetRatingModelTypesQuery } from "../../../Features/API/API";
const Rating_Models = ({ onSaveSuccess,Id }) => {
  const navigate = useNavigate();
  // States
  const [inputClick, setInputClick] = useState(true);

 
  const [selectedType, setSelectedType] = useState("Point");
  const { data: HRYear, isLoading: HRYearLoading, isError: HRYearisError, error: HRYearError, refetch: HRYearRefectch, } = useGetHRCalendarYearQuery(true);
  const { data: RatingPoints, isLoading: RatingPointsLoading, isError: RatingPointsisError, error: RatingPointsError, refetch: RatingPointsRefectch, } = useGetRatingPointsQuery(Id);
  const [postRatingModel] = usePostRatingModelMutation();
  const [postRatingPointsType] = usePostRatingPointsMutation();
  const [disabled, setDisabled] = useState(Id?true:false);
  const [data, setData] = useState([]);
  
  const [formData, setFormData] = useState({
    name:"",
    description:  "",
    type:  "",
    year: ""
  });
  useEffect(() => {
    if (RatingPoints && RatingPoints.results[0]) {
      setFormData({
        name: RatingPoints.results[0].rating_model.name || "",
        description: RatingPoints.results[0].rating_model.description || "",
        type: RatingPoints.results[0].rating_model.type || "",
        year: RatingPoints.results[0].rating_model.year || ""
      });
  
      setData([
        {
          rating_model: RatingPoints.results[0].rating_model.id,
          category: RatingPoints.results[0].category || "",
          max_points: RatingPoints.results[0].max_points || "",
          type: RatingPoints.results[0].type || "",
          api: RatingPoints.results[0].api || false,
          api_address: RatingPoints.results[0].api_address || ""
        }
      ]);
    }
  }, [RatingPoints]);
  
  const type = [
    {
      id: 1,
      value: "system generated",
      label: "System Generated",
    },
    {
      id: 2,
      value: "counter signing officer",
      label: "Counter Signing Officer",
    },
    {
      id: 3,
      value: "reporting officer",
      label: "Reporting Officer"
    }
  ]
  //functions


  useEffect(() => { HRYearRefectch() }, [HRYearRefectch,Id]);


  const hr_year = HRYear?.results?.map(item => ({
    value: item?.id,
    label: item?.hr_year
  }));
  const handleDropDownChange = (event, field) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const options = [{
    id: 1,
    value: "Points",
    label: "Points",
  }]

  const handlereset = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      year: ""
    });
    setInputClick(false)

  }
  const handleSave = async (e) => {


    e.preventDefault();
    const totalMaxMarks = data.reduce((total, rowData) => {
      let max = parseInt(rowData.max_points); // Parse max as an integer
      return total + max; // Return the sum directly
    }, 0);

    if (totalMaxMarks > 100) {
      toast.error("Total Max Marks should not exceed 100! ", {
        position: "top-center",
        autoClose: "30000",
      });
      return;
    }
    if (formData.rating_model_rec_id === "" || formData.description === "" || formData.year === "" || formData.type === "") {
      toast.error("Fields should not be empty! ", {
        position: "top-center",
        autoClose: "30000",
      });
    } else {
      if (data.length == 0 || data.some(rowData => rowData.rating_model === "" || rowData.category === "" || rowData.max_points === "" || rowData.type === "")) {
        toast.error("Table Fields should not be empty! ", {
          position: "top-center",
          autoClose: "30000",
        });
        return; // Exit early if any field is empty
      }
      const res = await postRatingModel(formData);

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

        try {
          if (data) {
            for (const rowData of data) {

              // Modify ID to rating_model_rec_id
              rowData.rating_model = res?.data?.id;
              const res2 = await postRatingPointsType(rowData);

              if (res2.error?.status === 400) {
                toast.error("Something Went Wrong.", {
                  position: "top-center",
                  autoClose: 3000,
                });
              } else if (res2.error?.status === 500) {
                toast.error("Server problem", {
                  position: "top-center",
                  autoClose: 3000,
                });
              }
            }
            toast.success("Annual Assessment Rating Model Created", {
              position: "top-center",
              autoClose: 1000,
            });

          }
        } catch (error) {
          console.error(error);
          toast.error("Error posting data to API", {
            position: "top-center",
            autoClose: 3000,
          });
        }
        setFormData({
          name: "",
          description: "",
          type: "",
          year: ""
        })
        setData([])
        setDisabled(true)
        setInputClick(false)
        onSaveSuccess();
        setTimeout(() => {
          navigate("/employee/setup/Rating_Model");
        }, 3000);

      }
    }
  }


  const handleChangeTableData = (index, field, value) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  function addNewRow() {

    const newId = data.length + 1;
    const newRow = {
      rating_model:newId,
      category: "",
      max_points: "",
      type: "",
      api:false,
      api_address:""
    };

    setData((prevTableData) => [...prevTableData, newRow]);
    setInputClick(true)
    setDisabled(false)


  }
  const handleDeleteRow = (index) => {
    setData(prevData => prevData.filter((_, idx) => idx !== index));
  };
  return (
    <Box sx={{ height: "calc(100vh - 200px)", osverflowY: "scroll", pr: 1 }}>
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
        <Box sx={{ width: "100%",}}>
        <Breadcrumb title=" Annual Assessment Rating Model" titleColor={Theme.palette.primary.main} breadcrumbItem="Rating Model / Rating Model List" />
        </Box>
{
  RatingPoints?.results?
 null :<Btn type="reset" onClick={handlereset} />
}
{
  RatingPoints?.results?
  <Btn type="back" onClick={()=>onSaveSuccess()} /> :
  <Btn type="save" onClick={handleSave} />
}   
      </Box>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        {/* first Grid */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ gap: 2, display: "flex", flexDirection: "column" }}
        >
          <InputField label="Rating" name="name"  disabled={disabled} value={formData.name || ""} onChange={handleInputChange} />

          <TextArea Rows={5}  label="Description" name="description"  disabled={disabled} value={formData.description || ""} onChange={handleInputChange} placeholder="Write the description..." />
          {/* <DatePicker /> */}
        </Grid>
        {/* 2nd Grid */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ gap: 2, display: "flex", flexDirection: "column" }}
        >
          <Box>
            <SimpleDropDown
              name="type"
              label="Type" 
              disabled={disabled} 
              options={options}
              value={formData.type || ""}
              onChange={handleInputChange}
            />
          </Box>

          <SimpleDropDown name="year" label="Year" isShowIcon={true} disabled={disabled}  value={formData.year} options={hr_year} onChange={(event) => handleDropDownChange(event, "year")} />


        </Grid>
      </Grid>

      {/* Buttons  */}
      {selectedType === "Point" && (
        <Box sx={{ display: "flex", flexDirection: "column", mt: 4 }}>
          <Box sx={{ alignSelf: "end" }}>
            <Btn type="New" onClick={addNewRow} />
          </Box>

          <Box sx={{ width: "100%", mt: 2, position: "relative" }}>



            {/* 1st Table  */}
            <Grid container xs={12}  >
              <Grid item xs={1} sx={{ fontSize: '13px', fontWeight: 'bold' }}>Sr.No</Grid>
              <Grid item xs={2} sx={{ fontSize: '13px', fontWeight: 'bold' }}>Category</Grid>
              <Grid item xs={2} sx={{ fontSize: '13px', fontWeight: 'bold' }}>Max Points</Grid>
              <Grid item xs={2.5} sx={{ fontSize: '13px', fontWeight: 'bold' }}>Type</Grid>
              <Grid item xs={1.5} sx={{ fontSize: '13px', fontWeight: 'bold', textAlign: "center" }}>API</Grid>
              {data && data.some(item => item.api) ? (
                <Grid item xs={2} sx={{ fontSize: '13px', fontWeight: 'bold' }}>API Address</Grid>
              ) : (
                <></>
              )}
              <Grid item xs={1} />
            </Grid>

            <Box sx={{ height: "calc(100vh - 500px)", overflow: "scroll", }}>
              {data && data.map((rowData, index) => (
                <>
                  <Grid container key={index} sx={{ my: 2 }} xs={12}>

                    <Grid item xs={1} >{rowData.rating_model}</Grid>
                    <Grid item xs={2} ><input
                      name="category"
                      type="text"
                      disabled={disabled}
                      value={rowData.category || ""}
                      onChange={(e) => handleChangeTableData(index, "category", e.target.value)}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                        width: "70%"
                      }} />
                    </Grid>
                    <Grid item xs={2} > <input
                      name="max_points"
                      type="text"
                      disabled={disabled}
                      value={rowData.max_points || ""}
                      onChange={(e) => handleChangeTableData(index, "max_points", e.target.value)}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                        width: "70%"

                      }}
                    /></Grid>
                    <Grid item xs={2.5}>
                      <select
                        name="type"
                        value={rowData.type}
                        style={{ width: '100%' }}
                        onChange={(e) => handleChangeTableData(index, "type", e.target.value)}
                      >
                        {/* Default option */}
                        <option value="">Select Type</option>

                        {/* Other options */}
                        {type.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </Grid>
                    <Grid item xs={1.5} sx={{ textAlign: 'center' }} >  <Switch
                      size="small"
                      checked={rowData.api}
                      onChange={(e) => {
                        handleChangeTableData(index, "api", e.target.checked);
                        if (!e.target.checked) {
                          handleChangeTableData(index, "api_address", ""); // Clear api_address when unchecked
                        }
                      }}
                    /></Grid>
                    {

                      rowData.api ? <Grid item xs={2} >  <input
                        name="api_address"
                        type="text"
                        disabled={disabled}
                        value={rowData.api_address || ""}
                        onChange={(e) => handleChangeTableData(index, "api_address", e.target.value)}
                        style={{
                          fontWeight: inputClick ? "600" : "",
                          border: inputClick ? "1px solid gray" : "",
                          width: "70%"

                        }}
                      /></Grid> : <Grid item xs={2}></Grid>
                    }
                    <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Box onClick={() => { handleDeleteRow(index); console.log("hi"); }}>
                        <Trash />
                      </Box>

                    </Grid>
                  </Grid>
                </>

              ))}

            </Box>
            <span className="totalAnnual" style={{ position: "absolute", right: "0px", top: "4px" }}>
              <b>Total Points: 100</b>
            </span>
          </Box>
        </Box>
      )}


      {/* 2nd Table  */}


    </Box >
  );
};

export default Rating_Models;