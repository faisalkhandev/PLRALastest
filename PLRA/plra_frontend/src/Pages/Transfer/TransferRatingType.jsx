import React from "react";
import { Box, Button, Grid, InputLabel, MenuItem, Paper, TextField, Typography } from '@mui/material';
// import New from './New';



function TransferRatingType() {

    const categories = ['Open Merit', 'Hardship'];

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "100vh" }}
        >
            <Grid item>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                textTransform: "uppercase",
                                fontWeight: "600",
                                fontSize: "30px",
                                color: "green",
                            }}
                        >
                            Transfer Posting Rating Formula
                        </Typography>
                    </Box>
                </Box>
                <Paper
                    elevation={3}
                    sx={{ padding: 3, textAlign: "center", width: "80vw" }}
                >
                    <Grid container spacing={2}>
                        {/* Distance Formula Box */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    border: "1px solid #f2f2f2",
                                    p: "10px",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                color: "green",
                                            }}
                                        >
                                            Distance
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="14px"
                                                    height="14px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                                </svg>
                                            }
                                        >
                                            {" "}
                                            Save{" "}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 540"
                                                    width="14px"
                                                    height="12px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                </svg>
                                            }
                                        >
                                            Edit{" "}
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>ID:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Name:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Category:</InputLabel>
                                        <TextField
                                            select
                                            variant="outlined"
                                            size="small"
                                            sx={{ width: "13.9rem" }}
                                        >
                                            {categories.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {" "}
                                                    {option}{" "}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    {/* Additional Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Within District / KM Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Max Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Accross District / KM Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>From KM:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Accross District Fixed Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        {/* Wedlock Formula Box */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    border: "1px solid #f2f2f2",
                                    p: "10px",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                color: "green",
                                            }}
                                        >
                                            Wedlock
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="14px"
                                                    height="14px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                                </svg>
                                            }
                                        >
                                            {" "}
                                            Save{" "}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 540"
                                                    width="14px"
                                                    height="12px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                </svg>
                                            }
                                        >
                                            Edit{" "}
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                    {/* Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>ID:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Name:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Category:</InputLabel>
                                        <TextField
                                            select
                                            variant="outlined"
                                            size="small"
                                            sx={{ width: "13.9rem" }}
                                        >
                                            {categories.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {" "}
                                                    {option}{" "}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    {/* Additional Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Within District Fixed Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Max Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Accross District Fixed Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Total Revenue:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        {/* Tensure Formula Box */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    border: "1px solid #f2f2f2",
                                    p: "10px",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                color: "green",
                                            }}
                                        >
                                            Tenure
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="14px"
                                                    height="14px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                                </svg>
                                            }
                                        >
                                            {" "}
                                            Save{" "}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 540"
                                                    width="14px"
                                                    height="12px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                </svg>
                                            }
                                        >
                                            Edit{" "}
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                    {/* Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>ID:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Name:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Category:</InputLabel>
                                        <TextField
                                            select
                                            variant="outlined"
                                            size="small"
                                            sx={{ width: "13.9rem" }}
                                        >
                                            {categories.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {" "}
                                                    {option}{" "}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    {/* Additional Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Max Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Min Tensure Month:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Factor:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        {/* Disability Formula Box */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    textAlign: "center",
                                    border: "1px solid #f2f2f2",
                                    p: "10px",
                                    height: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                textTransform: "uppercase",
                                                fontWeight: "600",
                                                fontSize: "18px",
                                                color: "green",
                                            }}
                                        >
                                            Disability
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    width="14px"
                                                    height="14px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                                                </svg>
                                            }
                                        >
                                            {" "}
                                            Save{" "}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="success"
                                            sx={{
                                                margin: "8px",
                                                backgroundColor: "#fff",
                                                color: "#000",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                                                "&:hover": { color: "#fff" },
                                            }}
                                            startIcon={
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 540"
                                                    width="14px"
                                                    height="12px"
                                                    fill="currentColor"
                                                >
                                                    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                                                </svg>
                                            }
                                        >
                                            Edit{" "}
                                        </Button>
                                    </Box>
                                </Box>
                                <Box
                                    sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
                                >
                                    {/* Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>ID:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Name:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Category:</InputLabel>
                                        <TextField
                                            select
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" }, width: "13.9rem" }}
                                        >
                                            {categories.map((option) => (
                                                <MenuItem key={option} value={option}>
                                                    {" "}
                                                    {option}{" "}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                    {/* Additional Fields */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Max Marks:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            width: "27rem",
                                        }}
                                    >
                                        <InputLabel>Factor:</InputLabel>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            sx={{ "& input": { height: "0.9rem" } }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default TransferRatingType;
