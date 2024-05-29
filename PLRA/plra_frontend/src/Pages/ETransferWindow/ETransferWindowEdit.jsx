import { useTheme } from '@emotion/react';
import { Box, Grid, Switch, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoBack } from '../../Assets/Icons';
import { Breadcrumb, Btn, ErrorHandler, InputField, Loader, MyTableContainer, TextArea } from '../../Components';
import { useGetetransferwindowbyidQuery } from '../../Features/API/Transfer';
import axios from 'axios';

const ETransferWindowEdit = () => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate=useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        from_date: '',
        to_date: '',
        status: false,
        open_position: []
    });
    //Queries
    const { data: allEtransferWindow, isLoading: allEtransferWindowLoading, isError: allEtransferWindowisError, error: allEtransferWindowerror, refetch, } = useGetetransferwindowbyidQuery(id);
    console.log(allEtransferWindow);

    const allEtransferWindowRecord = allEtransferWindow?.results[0]?.open_position?.map((data) => ({
        id: data?.p_rec_id,
        job: data?.job?.job_title,
        ppg_level: data?.job?.ppg_level?.ppg_level,
        center: data?.location?.center_name,
        district: data?.location?.district?.district_name,
        division: data?.location?.division?.division_name,
        region: data?.location?.region?.region_name,
        tehsil: data?.location?.tehsil?.t_name,
        description: data?.position_desc,
        position_type: data?.position_type?.position_type_name,
        sub_wing: data?.sub_wing?.sub_wing_name,
        wing: data?.wing?.wing_name,
    })) || [];

    // Initialize formData when data is fetched
    React.useEffect(() => {
        if (allEtransferWindow) {
            setFormData({
                name: allEtransferWindow?.results[0]?.name,
                description: allEtransferWindow?.results[0]?.description,
                from_date: allEtransferWindow?.results[0]?.from_date,
                to_date: allEtransferWindow?.results[0]?.to_date,
                status: allEtransferWindow?.results[0]?.status,
            });
        }
    }, [allEtransferWindow])

    //functions
    const handleRowClick = async (params) => {
        // setSelectedResignation(params.row);
        // setDialogOpen(true);
        console.log(params);
    };

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

    function handleChangeActive(event) {
        setFormData(prevState => ({
            ...prevState,
            status: event.target.checked
        }));
    }

    const renderNullInRed = (params) => {
        const value = params.value;
        if (value === null) return <span style={{ color: "red" }}>Null</span>;
        return value;
    };

    const columns = [
        {
            field: "id", headerName: "ID", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <Link to={`/edittransferwindow/${params?.row?.id}`} style={{ color: "#379237", textDecoration: "underline" }}>
                    <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.id}</span></Link>
            },
        },
        {
            field: "job", headerName: "Job Title", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.job}</span>
            },
        },
        {
            field: "description", headerName: "Description", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.description}</span>
            },
        },
        {
            field: "position_type", headerName: "Position Type", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.position_type}</span>
            },
        },
        {
            field: "ppg_level", headerName: "PPG level", minWidth: 100, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.ppg_level}</span>
            },
        },
        {
            field: "center", headerName: "Center", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.center}</span>
            },
        },
        {
            field: "district", headerName: "District", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.district}</span>
            },
        },
        {
            field: "division", headerName: "Division", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.division}</span>
            },
        },
        {
            field: "region", headerName: "Region", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.region}</span>
            },
        },
        {
            field: "tehsil", headerName: "Tehsil", minWidth: 150, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.tehsil}</span>
            },
        },
        {
            field: "sub_wing", headerName: "Sub Wing", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.sub_wing}</span>
            },
        },
        {
            field: "wing", headerName: "Wing", minWidth: 200, renderCell: renderNullInRed,
            renderCell: (params) => {
                return <span style={{ whiteSpace: "pre-wrap" }} className="table_first_column">{params?.row?.wing}</span>
            },
        },
    ];

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    //SaveData
    const handleApplyClick = async (e) => {
        e.preventDefault();
        console.log(formData);
        let value;
        if(formData.status==true){
            value="True";
        }else{
            value="False";
        }
        const res = await axios.get(`http://127.0.0.1:8000/E_transfer/update_status/${id}/${value}`)
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
            toast.success("E Transfer Window Updated Successfully", {
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
        <div
            style={{ margin: "14px 30px 0 30px", height: "calc(100vh - 100px)" }}
            className="EmployeeTableBox"
        >
            <Box >
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, }}   >
                    <Box sx={{ display: "flex" }}>
                        <Box
                            sx={{
                                width: "40px", height: '40px', display: 'flex', justifyContent: 'center', alignItems: "center",
                                transform: "rotate(180deg)", cursor: 'pointer', m: 1, borderRadius: "6px", backgroundColor: `${theme.palette.white[800]}`,
                                boxShadow: `0 0 2px 3px ${theme.palette.common.white}`
                            }} onClick={() => window.history.go(-1)}><GoBack /></Box>
                        <Breadcrumb title="Open Transfer Window" breadcrumbItem="ETransfer / opentransferwindow" />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
                        <Btn type="Edit" onClick={toggleEditMode} />
                        <Btn type="Apply" onClick={handleApplyClick} />
                    </Box>
                </Box>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Grid item xs={12} md={6} sx={{ gap: 1, display: "flex", flexDirection: "column" }}>
                        <InputField
                            name="name"
                            label="Name"
                            placeholder="Enter Name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                            disabled
                        />
                        <InputField
                            name="to_date"
                            type="date"
                            label="To"
                            onChange={handleChange}
                            value={formData?.to_date}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ gap: 3, display: "flex", flexDirection: "column", }}>
                        <Box>
                            <InputField
                                name="from_date"
                                type="date"
                                label="From"
                                onChange={handleChange}
                                value={formData?.from_date}
                                min={getCurrentDate}
                                disabled
                            />
                            <Box sx={{ width: "100%", display: "flex", alignItems: "center", mt: "10px", }}>
                                <Typography sx={{ width: "36%", display: "flex", mt: 0.8, fontWeight: "14px", }}>
                                    Status:
                                </Typography>
                                <Switch size="small" checked={formData.status} onChange={handleChangeActive} disabled={!editMode} />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ gap: 3, display: "flex", flexDirection: "column", marginBottom: "30px" }}>
                        <Box>
                            <TextArea
                                Rows={8}
                                name="description"
                                label="Description"
                                placeholder="Write description...."
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Box>
                    </Grid>
                </Grid>
                {allEtransferWindowLoading ? <Loader placement={{ marginTop: '-100px' }} /> :
                    <>
                        {allEtransferWindowisError ? <ErrorHandler online={navigator.onLine} /> :
                            allEtransferWindow && allEtransferWindow?.results ?
                                <MyTableContainer columns={columns} data={allEtransferWindowRecord} RowFilterWith="id" customPageSize={25} minHeight="calc(100vh - 300px)" onRowClick={handleRowClick} /> : null
                        }
                    </>
                }
            </Box>
        </div>
    )
}

export default ETransferWindowEdit