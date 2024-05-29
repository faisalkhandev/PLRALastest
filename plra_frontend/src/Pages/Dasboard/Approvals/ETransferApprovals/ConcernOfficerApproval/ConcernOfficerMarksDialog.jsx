import { Box, Grid, TextField, useTheme } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Btn } from "../../../../../Components/index.js";
import { usePutconcernofficermarksMutation } from "../../../../../Features/API/Transfer.js";

const ConcernOfficerMarksDialog = ({ DialogData }) => {
    const theme = useTheme();
    const [user_id, set_user_id] = useState(null);
    const [inputData, setInputData] = useState({});

    const [putconcernofficermarks] = usePutconcernofficermarksMutation();

    useEffect(() => {
        const id = Cookies.get("user_id");
        set_user_id(id);
    }, [user_id]);

    useEffect(() => {
        if (DialogData?.results) {
            setInputData(DialogData.results.reduce((acc, result) => {
                return {
                    ...acc,
                    [result.id]: {
                        ...result,
                        concerned_person_marks: result?.concerned_person_marks,
                    },
                };
            }, {}));
        }
    }, [DialogData]);


    console.log(DialogData);
    console.log(inputData);

    const handleSave = async () => {
        console.log(inputData);
        const savedData = Object.values(inputData).map((data) => ({
            id: data.id,
            concerned_person_marks: data.concerned_person_marks,
            category: data.category,
            max_marks: data.max_marks,
            system_generated_marks: data.system_generated_marks,
            employee: data.employee,
            e_transfer_process: data.e_transfer_process,
        }));
        console.log(savedData);
        if (savedData.length === 0) {
            toast.error("No steps added. Please add at least one step.");
            return;
        }
        if (savedData.length !== DialogData?.count) {
            toast.error(`Number of steps should be ${DialogData?.count}. Please provide values for each step.`);
            return;
        }
        try {
            const promises = savedData.map(async (data) => {
                const { id, concerned_person_marks, category, max_marks, system_generated_marks, employee, e_transfer_process } = data;
                console.log(data);
                await putconcernofficermarks({
                    formData: { concerned_person_marks, category, max_marks, system_generated_marks, employee, e_transfer_process },
                    id,
                });
            });

            await Promise.all(promises);
            toast.success("Updated Successfully", { position: "top-center", autoClose: 1000 });
        } catch (error) {
            toast.error(`Failed to update: ${error}`);
            return;
        }
    };


    useEffect(() => { console.log("inputData: ", inputData); }, [inputData]);

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        setInputData(prevInputData => ({
            ...prevInputData,
            [index]: {
                ...prevInputData[index],
                [name]: value
            }
        }));
    };


    const generateInputFields = () => {
        const inputFields = [];
        for (let i = 0; i < DialogData?.count; i++) {
            inputFields.push(
                <Grid container spacing={0} key={i}>
                    <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, pt: 2, }} name="sr_no">
                        {DialogData?.results[i]?.id}
                    </Grid>
                    <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {DialogData?.results[i]?.category}
                    </Grid>
                    <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {DialogData?.results[i]?.max_marks}
                    </Grid>
                    <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        {DialogData?.results[i]?.system_generated_marks}
                    </Grid>
                    <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7);", textAlign: "center", p: 0.6, fontWeight: 600, }}>
                        <TextField
                            name="concerned_person_marks"
                            placeholder="Enter Marks"
                            type="number"
                            value={inputData[DialogData?.results[i]?.id]?.concerned_person_marks}
                            onChange={(event) => handleInputChange(event, DialogData?.results[i]?.id)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            );
        }
        return inputFields;
    };

    return (
        <div>
            <Box sx={{ p: 1 }}>
                <Box sx={{ width: "100%", display: "flex", gap: 2, my: 1, justifyContent: "end", alignItems: "center", }}>
                    <Btn type="save" onClick={handleSave} />
                </Box>

                <Box sx={{ mt: 2, border: "1px solid white" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={1} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", borderRadius: "4px 0px 0px 0px", }}>
                            Id
                        </Grid>
                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                            Category
                        </Grid>
                        <Grid item xs={2} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                            Max Points
                        </Grid>
                        <Grid item xs={3} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                            System Generated Points
                        </Grid>
                        <Grid item xs={4} sx={{ border: "1px solid rgba(195, 195, 195,0.7)", textAlign: "center", p: 1, fontWeight: 600, background: theme.palette.primary.main, color: "#fff", }}>
                            Concern Officer marks
                        </Grid>
                    </Grid>
                    {generateInputFields()}
                </Box>
            </Box>
        </div>
    );
};

export default ConcernOfficerMarksDialog;