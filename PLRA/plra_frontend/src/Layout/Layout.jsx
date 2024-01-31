import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Toolbar, IconButton, Avatar, Dialog } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import Handling__Route from "../Routes/Handle_Route/Handling__Route.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "../Assets/Icons/Icons.js";
import { TabBar, Btn } from "../Components/index.js";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { selectButton } from "../Features/Counter/CounterSlice.js";
import { SlideBarData, Sidebar_header, SlideBarBottomData } from "../Data/Side_Bar_Data/Side__Bar__Data.js";
import { useParams, useNavigate } from "react-router-dom";
import { Login } from "../Pages";
import { useLogOutMutation } from '../Features/API/Authentication.js'
import Cookies from 'js-cookie';
import { Warning } from '../Assets/Icons';
import "./Style.css";
import { useGetRoutesQuery } from "../Features/API/RoleManagement.js";


const drawerWidth = 200;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  backgroundColor: "#9DFFB5", // Apply the background color directly to the Drawer component
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const token = sessionStorage.getItem('authToken');
  const [AuthToken, setAuthToken] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    setAccessToken(authToken)
  }, [])


  // Query 
  const { data: routesData, isLoading, isError, error, refetch } = useGetRoutesQuery(accessToken);
  const [LogOut] = useLogOutMutation();

   const hasSetupRoutes = routesData && Array.isArray(routesData) && routesData.length > 0 && routesData.some(route => route.isSetup);

  const handleDropdownClick = (index) => {
    setActiveDropdown((prevState) => (prevState === index ? null : index));
  };
  const SideabarController = () => {
    setOpen(!open);
    setActiveDropdown(null);
  };
  const nestedBar = () => {
    setActiveDropdown(null);
  };
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickSidebar = () => {
    setOpen(true);
  };
  const handleItemClick = async (index) => {
    setActiveItem(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      const res = await LogOut(token);
      if (res.data.message == 200) {
        Cookies.remove('sessionid');
        sessionStorage.removeItem('authToken');
        navigate("/login");
      }
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };


  //Redux
  const dispatch = useDispatch();
  const handleClickWithRedux = (id) => { dispatch(selectButton(id)) };
  const param = useParams();
  const currentRoute = window.location.pathname;

  if (currentRoute === "/login") {
    return (
      <Box sx={{ width: "100%", height: "100vh", mt: 6 }}>
        <Login />
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: "flex", width: "100%" }}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: theme.palette.common.white,
            boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
            borderBottom: "1px solid #d5d5d4",
          }}
        >
          <Toolbar sx={{ display: "flex", }}>
            <IconButton sx={{ padding: '0px' }} onClick={SideabarController} >
              <FontAwesomeIcon icon={faBars} />
            </IconButton>
            <Box
              sx={{
                ml: 2,
                p: 1,
                display: "flex",
                width: { xs: "80%", md: "60%" },
                alignItems: "center",
              }}
            >
              <img
                src={Sidebar_header.Logo_Image}
                alt=""
                style={{ width: "60px" }}
              />
              <Link to='/login'>
                <button>Login</button>
              </Link>
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="initial"
                  sx={{ fontSize: { xs: "12px", md: "15px" } }}
                >
                  Goverment of punjab - PLRA
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="initial"
                  sx={{ fontSize: { xs: "12px", md: "15px" } }}
                >
                  Punjab Land Records Authority
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: { xs: "none", md: "flex" },
                justifyContent: "space-between",
                pr: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: theme.palette.common.black }}
              ></Typography>
              <Box
                sx={{
                  color: theme.palette.primary.main,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <FontAwesomeIcon
                  icon={Sidebar_header.messageIcon}
                  style={{ fontSize: "20px", cursor: "pointer" }}
                />
                <FontAwesomeIcon
                  icon={Sidebar_header.settingIcon}
                  style={{ fontSize: "20px", cursor: "pointer" }}
                />
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  onClick={handleClick}
                >
                  <Avatar
                    alt=""
                    src={Sidebar_header.avatar}
                    sx={{ cursor: "pointer", borderRadius: "10px" }}
                  />
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMenu}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      width: "150px",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.12))",
                      mt: 1.5,
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem onClick={handleClose}>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        marginRight: 2,
                        bgcolor: theme.palette.gray.main,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.gray.main }}
                    >
                      My Profile
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleClose(); setEditDialog(true); }}>
                    <Logout sx={{ width: 20, height: 20, marginRight: 2 }} />
                    <Typography variant="body2" sx={{ color: theme.palette.gray.main }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            backgroundColor: theme.palette.common.white,
            display: { xs: "none", lg: "block" },
          }}
        >
          <DrawerHeader />
          <Box
            sx={{ maxWidth: "205px", height: "100vh", pt: 2 }}
            onClick={() => setOpen(true)}
          >
            <Box
              sx={{
                pl: 1.5,
                zIndex: 99,
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
                overflowY: "scroll",
                mt: 2,
              }}
            >
              {SlideBarData.map((data, index) => (
                !(routesData && routesData.length === 0 && data.isSetup) && (
                  <Link
                    to={`/${data.route}`}
                    key={data.key}
                    style={{ color: "black" }}
                  >
                    <Box
                      sx={{
                        width: open ? "173px" : "40px",
                        height: "35px",
                        pl: 0.9,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "5px",
                        border: '2px solid transparent',
                        cursor: "pointer",
                        bgcolor: activeItem === data.key ? "#ffff" : (open ? "" : theme.palette.black[300]),
                        boxShadow: activeItem === data.key ? "0 0 15px 2px #efefef" : "",
                        transition: "background-color 0.5s",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.7)",
                          boxShadow: "0 0 15px 2px #efefef",
                          border: '2px solid #d8dee6',
                        }
                      }}
                      onClick={() => handleItemClick(data.key)}
                    >
                      <img src={data.icon} height='25px' style={{ display: 'flex', justifyContent: 'start', width: '25px', marginRight: '6px' }} />
                      {open ? (
                        <span variant="body1" sx={{ color: theme.palette.common.black, width: "100%" }}>{data.text}</span>
                      ) : (
                        <>
                        </>
                      )}
                    </Box>
                  </Link>
                )
              ))}
            </Box>
            <Box
              sx={{
                pl: 1.5,
                width: "100%",
                height: "12vh",
                display: "flex",
                flexDirection: "column",
                gap: 1.4,
                bgcolor: theme.palette.common.white,
                position: "absolute",
                bottom: 0,
                zIndex: 999,
                borderTop: `1px solid ${theme.palette.black[300]}`,
                pt: 2,
              }}
            >
              {SlideBarBottomData.map((data, index) => (
                <Link
                  to={`/${data.route}`}
                  key={data.key}
                  style={{ color: "black" }}
                >
                  <Box
                    sx={{
                      width: open ? "173px" : "40px",
                      height: "25px",
                      pl: 0.9,
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "5px",
                      cursor: "pointer",
                      bgcolor: open ? "" : theme.palette.black[300],
                      transition: "background-color 0.5s",
                      "&:hover": { bgcolor: theme.palette.black[300] },
                    }}
                  >
                    <FontAwesomeIcon
                      icon={data.icon}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        color: "#379237",
                        width: "25px",
                        marginRight: "6px",
                        fontSize: "16px",
                      }}
                    />
                    {open ? (
                      <span
                        variant="body2"
                        sx={{
                          color: theme.palette.common.black,
                          width: "100%",
                        }}
                      >
                        {data.text}
                      </span>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Drawer>
        <Box
          sx={{ minHeight: "100vh", flexGrow: 1, pt: 1, maxWidth: "100%", overflowX: 'hidden', bgcolor: '#f7f7f7' }}
          onClick={() => { setOpen(false); setActiveDropdown(false) }}>
          <DrawerHeader />
          <TabBar />
          <Handling__Route />
          <Dialog open={editDialog} onClose={() => setEditDialog(false)} sx={{ m: 'auto' }}>
            <Box sx={{ minWidth: '400px', p: 2 }}>
              <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning />You've been logged out</Typography>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
                <Btn type="sure" onClick={() => { logout(); setEditDialog(false); }} outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: "8px" }} />
                <Btn type="close" onClick={() => setEditDialog(false)} outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: "8px" }} />
              </Box>
            </Box>
          </Dialog>
        </Box>
      </Box>
    );
  }
};
export default Sidebar;
