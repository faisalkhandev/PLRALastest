import { useTheme } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Breadcrumb, Btn, InputField, TextArea } from "../../Components";
import { etransferwindow } from "../../Data/Setup_Data/Setup_Data";
import { useGetAllPositionQuery, useGetwindowpositionsQuery, usePosttransferwindowMutation } from "../../Features/API/Transfer";
import Check_Multi_Dropdown from "./Check_Multi_Dropdown";
import { GoBack } from "../../Assets/Icons";
import Cookies from "js-cookie";
import EmployeeFormDashboard from "../Employee/Employee_MasterData/EmployeeDashboard/EmployeeFormDashboard";

const ETransferWindowApply = () => {
    //Navigate
    const navigate = useNavigate();
    const theme = useTheme();
    const [states, setStates] = useState({ p_rec_id: "", position_desc: "", position_id: "", no_of_position: "" });
    const [posttransferwindow] = usePosttransferwindowMutation();
    const [centerDialog, setIsCenterDialog] = useState(false);
    const [user_id, set_user_id] = useState(null);
    const [positionData, setPositionData] = useState([]);
    const { data: Position, isLoading: PositionLoading, isError: PositionisError, error: PositionError, refetch: PositionRefectch, } = useGetwindowpositionsQuery();
    console.log(Position);

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    useEffect(() => { PositionRefectch() }, [PositionRefectch,]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        from_date: "",
        to_date: "",
        status: true,
        open_position: []
    });

    useEffect(() => {
        if (Position && Position.results) {
            const formattedPositions = Position.results.map(pos => ({
                ...pos,
                job_title: pos.job.job_title,  // Extracting job_title from the nested job object
                center_name:pos.location.center_name,
                district:pos.location.district.district_name,
                division:pos.location.division.division_name,
                region:pos.location.region.region_name,
                tehsil:pos.location.tehsil.t_name,
                position_type:pos.position_type.position_type_name,
                sub_wing:pos.sub_wing.sub_wing_name,
                wing:pos.wing.wing_name,
            }));
            setPositionData(formattedPositions);  // Assuming you have a state to hold this
        }
    }, [Position]);


    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "from_date" || name === "to_date") {
            const currentDate = new Date();
            const selectedDate = new Date(value);

            // Set hours, minutes, seconds, and milliseconds to 0 for both dates
            currentDate.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < currentDate) {
                toast.error("Please select the current date or a future date.", {
                    position: "top-center",
                    autoClose: 3000,
                });
                return;
            }
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectPositions = (selectedRows) => {
        const selectedPositions = selectedRows.map(row => row.p_rec_id);

        setFormData(prevData => ({
            ...prevData,
            open_position: selectedPositions
        }));

        setStates(prevStates => ({
            ...prevStates,
            p_rec_id: selectedPositions.join(', ')  // Join IDs with a comma for display
        }));

        // setIsCenterDialog(false);
    };


    //SaveData
    const handleApplyClick = async (e) => {
        e.preventDefault();
        // if (formData.open_position.length === 0) {
        //     toast.error("Please select open position.", {
        //         position: "top-center",
        //         autoClose: 3000,
        //     });
        //     return;
        // }
        const Data = {
            name: formData.name,
            description: formData.description,
            from_date: formData.from_date,
            to_date: formData.to_date,
            status: true,
            open_position: formData.open_position,
        }
        console.log(Data);
        const res = await posttransferwindow(Data);
        console.log(res);

        if (res.error?.status === 400) {
            toast.error("Something Went Wrong.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        } else if (res.error?.status === 500) {
            toast.error("Server problem", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        } else if (res.error?.status === 422) {
            toast.error("Window Period is already active", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        } else {
            toast.success("E Transfer Window Apply Created", {
                position: "top-center",
                autoClose: 1000,
            });

            setFormData({
                name: "",
                description: "",
                from_date: "",
                to_date: "",
                open_position: []
            });

            setTimeout(() => {
                navigate("/opentransferwindow");
            }, 2000);
        }
    };

    return (
        <div style={{ margin: "14px 30px 0 30px" }} className="EmployeeTableBox">
            <Grid container spacing={2}>
                <Grid item xs={9}>

                    <Box sx={{ p: 2, border: "1px solid #e2e1e0", borderRadius: "4px", height: "calc(100vh - 150px)", }} >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
                            <Box sx={{ display: "flex" }}>
                                <Box
                                    sx={{
                                        width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                                        transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                                        boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
                                    }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                                <Breadcrumb title="Open Transfer Window" breadcrumbItem="Employee / opentransferwindow" />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                                <Btn type="apply" onClick={handleApplyClick} />
                            </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ display: "flex", alignItems: "center" }}  >
                            <Grid xs={9} item sx={{ display: "flex", flexDirection: "column", gap: 2, m: " auto auto" }} >
                                <InputField
                                    name="name"
                                    label="Name"
                                    placeholder="Enter Name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    fullWidth
                                    mandatory
                                />
                                <TextArea
                                    Rows={8}
                                    name="description"
                                    label="Description"
                                    placeholder="Write description...."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    mandatory
                                />
                                <InputField
                                    name="from_date"
                                    type="date"
                                    label="From"
                                    onChange={handleChange}
                                    value={formData?.from_date}
                                    min={getCurrentDate}
                                    mandatory
                                />
                                <InputField
                                    name="to_date"
                                    type="date"
                                    label="To"
                                    onChange={handleChange}
                                    value={formData?.to_date}
                                    mandatory
                                />

                                {Position && Position?.results ?
                                    <div>
                                        <InputField name="open_position" mandatory={true} label="Open Positions" required={true} type="text" isShowIcon={true} value={states.p_rec_id || ""} onClick={() => { setIsCenterDialog(true); }} />
                                        <Check_Multi_Dropdown
                                            isOpen={centerDialog}
                                            onClose={() => setIsCenterDialog(false)}
                                            MinimumWidth={'1000px'}
                                            tableRows={positionData}  // Use the new state holding the formatted data
                                            tableHeader={etransferwindow}
                                            onSelect={handleSelectPositions}
                                            RowFilterWith='p_rec_id'
                                        />

                                    </div> : <InputField name="transfer_position" mandatory={true} label="Transfer Position " type="text" isShowIcon={true} value={states.p_rec_id} />
                                }
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid item xs={3}>
                    <EmployeeFormDashboard userId={user_id} title="Processess" processName="Resignation" height="calc(100vh - 150px)" />
                </Grid>
            </Grid>
        </div>
    );
};

export default ETransferWindowApply;
