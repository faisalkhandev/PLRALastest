import React, { Fragment } from "react";
import Setup_SideBar from "../../Components/Setup/Setup_SideBar.jsx";
import { Grid, Box } from "@mui/material";
import Right_Sidebar from '../../Components/Setup/Setup_Routes.jsx'


const Layout = () => {





  return (
    <Box sx={{ p: 4 }}>
      <Box className="setup_customBox">
        <Grid container columnSpacing={2} sx={{ height: "calc(100vh - 115px)", pt: 2 }}>
          <Grid item xs={1.8}
            sx={{
              width: "100%", borderRight: '2px solid #e2e1e0', overflow: 'hidden',
              height: 'calc(100vh - 172px)', display: { xs: 'none', md: "flex" },
              border: '1px solid #e2e1e0', borderRadius: "6px",
            }}>
            <Setup_SideBar />
          </Grid>
          <Grid item xs={12} md={10} sx={{
            maxWidth: "100%", borderRight: '2px solid #e2e1e0', overflow: 'hidden',
            height: 'calc(100vh - 172px)', marginLeft: '6px',
            border: '1px solid #e2e1e0', borderRadius: "6px", display: 'flex', justifyContent: 'center'
          }}>
            <Box sx={{ width: "1050px" }}>
              <Right_Sidebar />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Layout;
