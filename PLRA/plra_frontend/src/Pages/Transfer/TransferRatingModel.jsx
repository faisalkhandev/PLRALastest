import { Box, Grid, Switch, Typography } from "@mui/material";
import React, { useState } from "react";
import { Btn, InputField, SimpleDropDown } from "../../Components";
import Theme from "../../Theme/Light__Theme";
import "../table.css";

const TransferRatingModel = () => {
    // States
    const [date, setDate] = useState();
    const [inputClick, setInputClick] = useState(false);

    //functions

    function handleNewButton() {
        setInputClick(true);
    }

    function handleSaveButton() {
        setInputClick(false);
    }
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
                        color: Theme.palette.primary.main,
                        fontWeight: "500",

                    }}
                >
                    Transfer Rating Model
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
                        <InputField label="Description" />
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
                <table id="myTable">
                    <thead>
                        <tr>
                            <th>Leave</th>
                            <th>Type</th>
                            <th>ID</th>
                            <th >Name</th>
                            <th>Max Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>TestingJob1</span>{" "}
                            </td>
                            <td>
                                <span>TestingJob1</span>{" "}
                            </td>
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
                                        paddingLeft: '3px'
                                    }}
                                />
                            </td>
                            <td td>
                                {" "}
                                <input
                                    className="inputTable"
                                    type="text"
                                    value="20"
                                    disabled={inputClick ? false : true}
                                    style={{
                                        fontWeight: inputClick ? "600" : "",
                                        border: inputClick ? "1px solid gray" : "",
                                        paddingLeft: '3px'
                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>TestingJob2</span>{" "}
                            </td>
                            <td>
                                <span>TestingJob2</span>{" "}
                            </td>
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
                                        paddingLeft: '3px'

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
                                        paddingLeft: '3px'

                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>TestingJob3</span>{" "}
                            </td>
                            <td>
                                <span>TestingJob3</span>{" "}
                            </td>
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
                                        paddingLeft: '3px'

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
                                        paddingLeft: '3px'

                                    }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>TestingJob4</span>{" "}
                            </td>
                            <td>
                                <span>TestingJob4</span>{" "}
                            </td>
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
                                        paddingLeft: '3px'

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
                                        paddingLeft: '3px'

                                    }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span className="total">
                    <b>Total: 100</b>
                </span>
            </Box>
        </Box>
    );
};

export default TransferRatingModel;
