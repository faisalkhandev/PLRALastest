import { Grid, Box, Typography, Grow } from '@mui/material';

const EmployeeDetailBox = ({ value, total, label, onClick }) => (

    <Grow in={true} timeout={{ enter: 800, exit: 1000 }}>
        <Box className="employee_form_dashboard_detail_box">
            <Typography variant="h5" color="initial" sx={{ fontWeight: 600, fontSize: '12px' }}>
                <span style={{ fontSize: "30px" }}>{value}</span> /{total}
            </Typography>
            <Typography
                variant="body1"
                color="initial"
                onClick={onClick}
                sx={{
                    "&:hover": {
                        color: 'green',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }
                }}
            >
                {label}
            </Typography>
        </Box>
    </Grow>
);

export default EmployeeDetailBox