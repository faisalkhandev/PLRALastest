import { Box, Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Btn, InputField, SimpleDropDown } from "../../../Components";
import { useGetHRCalendarYearQuery } from "../../../Features/API/AnnualAssessment";
import { useGettransferratingtypesQuery, usePostratingformulastypesMutation, usePosttransferratingmodelMutation } from "../../../Features/API/Transfer";
import Theme from "../../../Theme/Light__Theme";
import "../../table.css";
import { useNavigate } from "react-router-dom";

const TransferRatingModelApply = () => {
    // States
    const navigate = useNavigate();
    const { data: HRYear, isLoading: HRYearLoading, isError: HRYearisError, error: HRYearError, refetch: HRYearRefectch, } = useGetHRCalendarYearQuery(true);
    const { data: TransferRatingTypes, isLoading: TransferRatingTypesLoading, isError: TransferRatingTypesisError, error: TransferRatingTypesError, refetch: TransferRatingTypesRefectch, } = useGettransferratingtypesQuery();
    const [posttransferratingmodel] = usePosttransferratingmodelMutation();
    const [postratingformulastypes] = usePostratingformulastypesMutation();
    const [formData, setFormData] = useState({ rating_model_rec_id: "", description: "", active: false, year: "", totalMarks: null });
    const [formData1, setFormData1] = useState({ marks1: 0, marks2: 0, marks3: 0, marks4: 0 })

    useEffect(() => {
        HRYearRefectch(); TransferRatingTypesRefectch();
    }, [HRYearRefectch, TransferRatingTypesRefectch])

    const transferRatingTypesMap = {};
    TransferRatingTypes?.results?.forEach((type) => {
        transferRatingTypesMap[type.name] = type.id;
    });
    const hr_year = HRYear?.results?.map(item => ({
        value: item?.id,
        label: item?.hr_year
    }));

    //functions
    function handleChangeActive(event) {
        setFormData(prevState => ({
            ...prevState,
            active: event.target.checked
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "rating_model_rec_id" && parseInt(value) < 1) {
            toast.error("Rating Model can't be a negative value",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            )
            return;
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDropDownChange = (event, field) => {
        setFormData((prevFormData) => ({ ...prevFormData, [field]: event.target.value, }));
    };

    const handleChangeMarks = (e, field) => {
        const { value } = e.target;
        if (parseInt(value) > 100 || parseInt(value) < 1) {
            // Display an error message or handle the invalid input as needed
            toast.error("Points earned should be between 1 and 100", { position: "top-center", autoClose: 3000 });
            return;
        }

        // Update marks for the specific field
        setFormData1(prevState => ({
            ...prevState,
            [field]: parseInt(value),
        }), () => {
            // Recalculate total marks after state update
            const newTotalMarks = Object.values(formData1).reduce((total, currentMark) => total + currentMark, 0);

            // Update totalMarks in formData
            setFormData(prevState => ({
                ...prevState,
                totalMarks: newTotalMarks
            }));
        });
    };



    const handleReset = () => {
        setFormData({ rating_model_rec_id: "", description: "", active: "", year: "" });
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const totalMaxMarks = Array.from(document.querySelectorAll("#myTable tbody tr"))
            .reduce((total, row) => total + parseInt(row.querySelector(".inputTable").value) || 0, 0);

        console.log(totalMaxMarks);

        // Check if total maxMarks exceed 100
        if (totalMaxMarks > 100) {
            toast.error("Total Max Marks should not exceed 100! ", {
                position: "top-center",
                autoClose: "30000",
            });
            return;
        }
        if (formData.rating_model_rec_id === "" || formData.description === "" || formData.year === "") {
            toast.error("Fields should not be empty! ", {
                position: "top-center",
                autoClose: "30000",
            });
        } else {
            console.log(formData);
            const res = await posttransferratingmodel(formData);

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
                console.log(res);
                console.log("Rating Model Rec ID:", res?.data?.rating_model_rec_id);
                toast.success("Transfer Rating Model Created", {
                    position: "top-center",
                    autoClose: 1000,
                });

                const rows = document.querySelectorAll("#myTable tbody tr");
                const tableData = [];

                // Loop through each row and extract column values
                rows.forEach((row) => {
                    const columns = row.querySelectorAll("td");

                    // Skip if there are no columns
                    if (columns.length === 0) {
                        return;
                    }
                    const rowData = {
                        tranfer_type_category: columns[3].innerText.trim(),
                        max_marks: columns[4].querySelector("input").value.trim(),
                        model: res?.data?.rating_model_rec_id,
                        type: transferRatingTypesMap[columns[1].innerText.trim().toLowerCase()]
                    };

                    // Add row data to tableData array
                    tableData.push(rowData);
                });

                console.log(tableData)

                if (tableData.some((rowData) => rowData.max_marks === "")) {
                    toast.error("Max Marks should not be empty! ", {
                        position: "top-center",
                        autoClose: "30000",
                    });
                    return;
                }

                try {
                    for (const rowData of tableData) {
                        const res = await postratingformulastypes(rowData);
                    }
                    await Promise.all(res);
                    toast.success("Transfer Rating Formulas Created", {
                        position: "top-center",
                        autoClose: 1000,
                    });
                } catch (error) {
                    console.error(error);
                    toast.error("Error posting data to API", {
                        position: "top-center",
                        autoClose: 3000,
                    });
                }

                setFormData({
                    rating_model_rec_id: "",
                    description: "",
                    active: "",
                    year: ""
                });

                setTimeout(() => {
                    navigate("/employee/setup/Transfer_Rating_Model");
                }, 3000);
            }
        }
    }
    return (
        <>
            <Box sx={{ width: "100%", display: "flex", mb: 4, gap: 2, alignItems: "center", mt: 0.8, }}>
                <Typography variant="h4" sx={{ width: "100%", color: Theme.palette.primary.main, fontWeight: "500", }}>
                    E Transfer Rating Model
                </Typography>
                <Btn type="back" onClick={() => window.history.go(-1)} />
                <Btn type="reset" onClick={handleReset} />
                <Btn type="save" onClick={handleSave} />
            </Box>

            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                <Grid item xs={12} md={6} sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
                    <InputField name="rating_model_rec_id" label="Rating Model Id" type="number" value={formData.rating_model_rec_id} fullWidth onChange={handleInputChange} />
                    <SimpleDropDown name="year" label="Year" isShowIcon={true} value={formData.year} options={hr_year} sx={{ marginRight: 0 }} onChange={(event) => handleDropDownChange(event, "year")} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
                    <Box>
                        <InputField name="description" label="Description" type="text" value={formData.description} fullWidth onChange={handleInputChange} />
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", mt: "10px", }}>
                            <Typography sx={{ width: "36%", display: "flex", mt: 0.8, fontWeight: "14px", }}>
                                Active:
                            </Typography>
                            <Switch size="small" checked={formData.active} onChange={handleChangeActive} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ width: "100%" }}>
                <table id="myTable">
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Type</th>
                            <th>ID</th>
                            <th >Name</th>
                            <th>Max Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <span>1</span>
                            </td>
                            <td>
                                <span>Distance</span>
                            </td>
                            <td>D1</td>
                            <td>
                                <span>Distance</span>
                            </td>
                            <td td>
                                <input className="inputTable" type="number" style={{ fontWeight: "600", border: "1px solid gray", paddingLeft: '3px' }} value={formData1.marks1} onChange={(e) => handleChangeMarks(e, 'marks1')} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>2</span>
                            </td>
                            <td>
                                <span>Tenure</span>
                            </td>
                            <td>T1</td>
                            <td>
                                <span>Tenure</span>
                            </td>
                            <td>
                                <input className="inputTable" type="number" style={{ fontWeight: "600", border: "1px solid gray", paddingLeft: '3px' }} value={formData1.marks2} onChange={(e) => handleChangeMarks(e, 'marks2')} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>3</span>
                            </td>
                            <td>
                                <span>Wedlock</span>
                            </td>
                            <td>W1</td>
                            <td>
                                <span>Wedlock</span>
                            </td>
                            <td>
                                <input className="inputTable" type="number" style={{ fontWeight: "600", border: "1px solid gray", paddingLeft: '3px' }} value={formData1.marks3} onChange={(e) => handleChangeMarks(e, 'marks3')} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>4</span>
                            </td>
                            <td>
                                <span>Disability</span>
                            </td>
                            <td>D1</td>
                            <td>
                                <span>Disability</span>
                            </td>
                            <td>
                                <input className="inputTable" type="number" style={{ fontWeight: "600", border: "1px solid gray", paddingLeft: '3px' }} value={formData1.marks4} onChange={(e) => handleChangeMarks(e, 'marks4')} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <span className="total">
                    <b>Total: 100</b>
                </span>
            </Box>
        </>
    )
}

export default TransferRatingModelApply