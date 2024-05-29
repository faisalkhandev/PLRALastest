import { useTheme } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Btn, InputField, TextArea } from "../../../Components";
import { etransferwindow } from "../../../Data/Setup_Data/Setup_Data";
import { useGetAllPositionQuery, usePosttransferwindowMutation } from "../../../Features/API/Transfer";
import Check_Multi_Dropdown from "./Check_Multi_Dropdown";

const ETransferWindowApply = () => {
    //Navigate
    const navigate = useNavigate();
    const theme = useTheme();
    const [states, setStates] = useState({ p_rec_id: "", position_desc: "", position_id: "", no_of_position: "" });
    const [posttransferwindow] = usePosttransferwindowMutation();
    const [centerDialog, setIsCenterDialog] = useState(false);
    const { data: Position, isLoading: PositionLoading, isError: PositionisError, error: PositionError, refetch: PositionRefectch, } = useGetAllPositionQuery(true);
    console.log(Position);

    useEffect(() => { PositionRefectch() }, [PositionRefectch,]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        from_date: "",
        to_date: "",
        status: true,
        open_position: []
    });

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
                navigate("/employee/setup/E_Transfer_Window_Period");
            }, 2000);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box className="headContainer">
                <Typography variant="h4" sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>E Transfer Window </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Btn type="back" onClick={() => window.history.go(-1)} />
                    <Btn type="apply" onClick={handleApplyClick} />
                </Box>
            </Box>
            <form enctype="multipart/form-data">
                <Grid container columnSpacing={8} sx={{ px: 4 }}>
                    <Grid md={2}></Grid>
                    <Grid
                        item
                        md={6}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
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
                                    MinimumWidth={'700px'}
                                    tableRows={Position?.results}
                                    tableHeader={etransferwindow}
                                    onSelect={handleSelectPositions}
                                    RowFilterWith='p_rec_id'
                                />
                            </div> : <InputField name="transfer_position" mandatory={true} label="Transfer Position " type="text" isShowIcon={true} value={states.p_rec_id} />
                        }

                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};

export default ETransferWindowApply;
