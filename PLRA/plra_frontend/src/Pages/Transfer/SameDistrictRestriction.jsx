import { useTheme } from "@emotion/react";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import {
    Btn,
    ErrorHandler,
    InputField,
    Loader,
    Multi_Dropdown,
    MyTableContainer,
} from "../../Components";
import { showToast } from "../../Components/shared/Toast_Card";
import { JobHeader } from "../../Data/Setup_Data/Setup_Data";
import { useGetJobQuery } from "../../Features/API/API";
import {
    useDeleteSameDistrictRestrictionMutation,
    useGetSameDistrictRestrictionQuery,
    usePostSameDistrictRestrictionMutation,
} from "../../Features/API/Transfer";
 
const SameDistrictRestriction = () => {
    const theme = useTheme();
 
    //states
    const [formData, setFormData] = useState({
        rule_rec_id: null,
        restriction_job: null,
    });
    const [jobName, setJobName] = useState();
    const [formErrors, setFormErrors] = useState({});
    const [jobTypeDialog, setjobTypeDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [selectedTableItem, setSelectedTableItem] = useState(null);
 
 
 
 
    //Queries
    const { data: jobData, isLoading: jobLoading, isError: jobRefreshError, error: jobQueryError, refetch: RefetchJob, } = useGetJobQuery();
 
    //POST Restriction
    const [postSameDistrictRestriction] = usePostSameDistrictRestrictionMutation();
 
    //GET Restriction
    const { data: SameDistrictData, isLoading: sameDistrictLoading, error: sameDistrictError, refetch: refetchSameDistrict, } = useGetSameDistrictRestrictionQuery();
 
    //Delete District Restriction
    const [deleteSameDistrictRestriction] = useDeleteSameDistrictRestrictionMutation();
 
 
    useEffect(() => {
        refetchSameDistrict();
        RefetchJob();
    }, []);
 
    //functions
 
    function handleRowClick(params) {
        setJobName(params.row.restriction_job.job_title);
        setSelectedTableItem(params)
    }
 
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
 
    const jobClickHandler = (selectedRow) => {
        setJobName(selectedRow.job_title);
        setFormData({
            ...formData,
            rule_rec_id: selectedRow.j_rec_id,
            restriction_job: selectedRow.j_rec_id,
        });
        setjobTypeDialog(false);
        setSelectedItem(selectedRow);
    };
 
    function hanldeReset() {
        setJobName("");
        setFormData({
            rule_rec_id: '',
            restriction_job: ''
        })
    }
 
    const handleSave = async () => {
        if (selectedItem) {
            setFormData({
                rule_rec_id: selectedItem.j_rec_id,
                restriction_job: selectedItem.j_rec_id,
            });
            try {
                const response = await postSameDistrictRestriction(formData).unwrap();
 
                setJobName("")
                showToast("Data saved successfully", "success");
                refetchSameDistrict();
            } catch (error) {
                showToast("Data Already Exist", "error");
            }
        } else {
            showToast("No Item Selected", 'warning');
        }
    };
 
    async function handleDelete() {
        if (selectedTableItem) {
            try {
                await deleteSameDistrictRestriction(selectedTableItem.row.rule_rec_id).unwrap();
                showToast("Row deleted successfully", "success");
                refetchSameDistrict();
                setSelectedTableItem(null);
                setJobName("")
            } catch (error) {
                showToast("Error deleting row", "error");
            }
        } else {
            showToast("No row selected", "warning");
        }
    }
 
    //columns
    const columns = useMemo(
        () => [
            {
                field: "job_title",
                headerName: "Job Title",
                minWidth: 250,
                renderCell: (params) => {
                    const onView = () => {
                        handleRowClick(params);
                    };
                    return (
                        <span onClick={onView} className="table_first_column">
                            {params?.row?.restriction_job?.job_title}
 
                        </span>
                    );
                },
            },
            {
                field: "ppg_level",
                headerName: "PPG",
                minWidth: 150,
                valueGetter: (params) => params.row?.ppg_level?.ppg_level || "",
                renderCell: (params) => {
                    const onView = () => {
                        handleRowClick(params);
                    };
                    return (
                        <span onClick={onView} className="table_first_column">
                            {params?.row?.restriction_job?.ppg_level?.ppg_level}
                        </span>
                    );
                },
            },
 
        ],
        [handleRowClick]
    );
 
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    mb: 3,
                    gap: 2,
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        width: "100%",
                        color: theme.palette.primary.main,
                        fontWeight: "500",
                        fontSize: "20px",
                    }}
                >
                    Same District Restriction Rule
                </Typography>
                <Btn
                    type="reset"
                    outerStyle={{ width: 1, display: "flex", justifyContent: "end" }}
                    onClick={hanldeReset}
                />
                <Btn type="save" onClick={handleSave} />
                <Btn type="delete" onClick={handleDelete} />
            </Box>
 
            <form action="">
                <Grid
                    container
                    columnSpacing={8}
                    spacing={{ md: 4, xs: 2 }}
                    sx={{ mb: 4 }}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                        {jobData && jobData?.results ? (
                            <div>
                                <InputField
                                    name="restriction_job"
                                    label="Job"
                                    placeholder="Enter Job "
                                    type="text"
                                    value={jobName}
                                    onChange={handleChange}
                                    isShowIcon={true}
                                    onClick={() => setjobTypeDialog(true)}
                                    error={formErrors?.data?.job}
                                />
                                <Multi_Dropdown
                                    isOpen={jobTypeDialog}
                                    onClose={() => setjobTypeDialog(false)}
                                    MinimumWidth={"500px"}
                                    tableRows={jobData.results}
                                    tableHeader={JobHeader}
                                    onSelect={jobClickHandler}
                                    RowFilterWith={"j_rec_id"}
                                />
                            </div>
                        ) : (
                            <InputField
                                name="restriction_job"
                                label="Job"
                                placeholder="Enter Job "
                                type="text"
                                value={jobName}
                                onChange={handleChange}
                                isShowIcon={true}
                                onClick={() => setjobTypeDialog(true)}
                                error={formErrors?.data?.job}
                            />
                        )}
                    </Grid>
                </Grid>
            </form>
 
            {sameDistrictLoading ? (
                <Loader placement={{ marginTop: "-100px" }} />
            ) : (
                <>
                    {sameDistrictError ? (
                        <ErrorHandler online={navigator.onLine} />
                    ) : SameDistrictData && SameDistrictData?.results ? (
                        <MyTableContainer
                            columns={columns}
                            data={SameDistrictData?.results}
                            isAddNewButton={true}
                            RowFilterWith="rule_rec_id"
                            onRowClick={handleRowClick}
                            customPageSize={9}
                            minHeight={"calc(100vh - 384px)"}
                        />
                    ) : null}
                </>
            )}
        </>
    );
};
 
export default SameDistrictRestriction;