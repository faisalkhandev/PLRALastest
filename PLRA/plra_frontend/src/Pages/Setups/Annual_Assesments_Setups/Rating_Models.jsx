import {
  Box,
  FormControl,
  Grid,
  NativeSelect,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Theme from "../../../Theme/Light__Theme";
import "../../table.css";
import { Btn, InputField, SimpleDropDown } from "../../../Components";

const Rating_Models = () => {
  // States
  const [inputClick, setInputClick] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [dropDown, setDropDown] = useState(["Select Type", "Point", "Likert Scale"]);
  const [selectedType, setSelectedType] = useState("Point");
  console.log("Selected Type: ", selectedType);

  //functions
  function handleNewButton() {
    setInputClick(true);
  }
  function handleSaveButton() {
    setInputClick(false);
  }
  function addNewRow() {
    if (tableData.length <= 3) {
      setTableData((prevTableData) => [
        ...prevTableData,
        { level: prevTableData.length + 1, percentile: "", grade: "" },
      ]);
    } else {
      alert("bas kar zalimaa");
    }
  }

  //json
  const options = dropDown.map((item, index) => ({
    id: index,
    value: item,
    label: item,
  }));

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
        <Typography
          variant="h4"
          sx={{
            width: "100%",
            color: Theme.palette.primary.main,
            fontWeight: "500",
          }}
        >
          Annual Assessment Rating Model
        </Typography>
        <Btn type="reset" />
        <Btn type="save" />
        <Btn type="edit" />
      </Box>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        {/* first Grid */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ gap: 1, display: "flex", flexDirection: "column" }}
        >
          <InputField label="Rating" />
          <SimpleDropDown label="Year" />
          {/* <DatePicker /> */}
        </Grid>
        {/* 2nd Grid */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ gap: 3, display: "flex", flexDirection: "column" }}
        >
          <Box>
            <SimpleDropDown
              label="Type"
              options={options}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mt: "10px",
              }}
            >
              <Typography
                sx={{
                  width: "31%",
                  display: "flex",
                  mt: 0.8,
                  fontWeight: "14px",
                }}
              >
                Active:
              </Typography>
              <Switch size="small" />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Buttons  */}
      {selectedType === "Point" && (
        <Box>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                gap: 2,
                alignItems: "center",
                mt: 8,
              }}
            >
              <Btn type="new" onClick={handleNewButton} />
              <Btn type="save" onClick={handleSaveButton} />
            </Box>

            {/* 1st Table  */}
            <table id="myTable">
              <thead>
                <tr>
                  <th>Leave</th>
                  <th>Description</th>
                  <th>Max Marks</th>
                  <th>Type</th>
                  <th>API</th>
                  <th>API Adress</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Job1</td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="Name"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>
                    {" "}
                    <input
                      className="inputTable"
                      type="text"
                      value="20"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>System Generated</td>
                  <td>
                    <Switch size="small" />
                  </td>
                  <td>192.0.0.0</td>
                </tr>
                <tr>
                  <td>Job2</td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="Name"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="20"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>System Generated</td>
                  <td>
                    <Switch size="small" />
                  </td>
                  <td>192.0.0.0</td>
                </tr>
                <tr>
                  <td>Source</td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="Name"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="20"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>System Generated</td>
                  <td>
                    <Switch size="small" />
                  </td>
                  <td>192.0.0.0</td>
                </tr>
                <tr>
                  <td>Job4</td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="Name"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid gray" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>
                    <input
                      className="inputTable"
                      type="text"
                      value="20"
                      disabled={inputClick ? false : true}
                      style={{
                        fontWeight: inputClick ? "600" : "",
                        border: inputClick ? "1px solid #808081" : "",
                        paddingLeft: "3px",
                      }}
                    />
                  </td>
                  <td>System Generated</td>
                  <td>
                    <Switch size="small" />
                  </td>
                  <td>192.0.0.0</td>
                </tr>
              </tbody>
            </table>
            <span className="totalAnnual">
              <b>Total: 100</b>
            </span>
          </Box>
        </Box>
      )}


      {/* 2nd Table  */}

      <Box>
        <Box sx={{ width: "100%" }}>
          {selectedType === "Likert Scale" && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                gap: 2,
                alignItems: "center",
                mt: 8,
              }}
            >
              <Btn type="new" onClick={addNewRow} />
            </Box>
          )}
          <Box>
            {/* 2nd Table  */}
            <table id="myTable">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Percentile</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.level}</td>
                    <td>
                      <input
                        className="inputTable"
                        type="text"
                        value={row.percentile}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid grey",
                          paddingLeft: "5px",
                          padding: "3px",
                        }}
                        placeholder="Enter Percentiles"
                      />
                    </td>
                    <td>
                      <input
                        className="inputTable"
                        type="text"
                        value={row.grade}
                        style={{
                          backgroundColor: "white",
                          border: "1px solid grey",
                          paddingLeft: "5px",
                          padding: "3px",
                        }}
                        placeholder="Enter Grade"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

export default Rating_Models;
