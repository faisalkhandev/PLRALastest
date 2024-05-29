import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  IconButton,
  Avatar,
  Dialog,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import Handling__Route from "../Routes/Handle_Route/Handling__Route.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "../Assets/Icons/Icons.js";
import { Btn } from "../Components/index.js";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { updateRoutes } from '../Features/Counter/CounterSlice.js';
import { selectButton } from "../Features/Counter/CounterSlice.js";
import {
  SlideBarData,
  Sidebar_header,
  TabBarData,
} from "../Data/Side_Bar_Data/Side__Bar__Data.js";
import { useParams, useNavigate } from "react-router-dom";
import { Login } from "../Pages";
import { useLogOutMutation } from "../Features/API/Authentication.js";
import Cookies from "js-cookie";
import { Warning } from "../Assets/Icons";
import "./Style.css";
import { useGetRoutesQuery } from "../Features/API/RoleManagement.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Tooltip } from '@mui/material'


const drawerWidth = 220;

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
  backgroundColor: "#9DFFB5",
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
  const location = useLocation();

  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const token = sessionStorage.getItem("authToken");
  const [AuthToken, setAuthToken] = useState("");
  const [editDialog, setEditDialog] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const [isCollapse, setIsCollapse] = useState({
    payroll: false,
    hr: false,
  });
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [activeMainTab, setActiveMaintab] = useState("");


  const getPathFromHash = (hash) => {
    return hash.replace(/^#\/?/, "").split("?")[0];
  };

  const currentRoute = getPathFromHash(location.hash);

  const isActive = (route) => {
    return currentRoute === route;
  };

  const handleMenuItemClick = (key) => {
    setActiveMenuItem(key);
  };

  function handleMainTab(tabName) {
    setActiveMaintab(tabName);
  }

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    setAccessToken(authToken);
  }, []);

  // Query
  const {
    data: routesData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetRoutesQuery(accessToken);

  const [LogOut] = useLogOutMutation();

  useEffect(() => {
    if (routesData) {
      dispatch(updateRoutes(routesData));
    }
  }, [routesData, dispatch]);


  const SideabarController = () => {
    setOpen(!open);
    setActiveDropdown(null);
  };

  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCollapse = (dropdown) => {
    setIsCollapse((prevState) => ({
      ...prevState,
      [dropdown]: !prevState[dropdown],
    }));
  };

  const logout = async () => {
    try {
      const res = await LogOut(token);
      if (res.data.message == 200) {
        Cookies.remove("sessionid");
        sessionStorage.removeItem("authToken");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error while logging out:", error);
    }
  };

  //Redux

  const viewPermissions = useSelector(state => state.counter.viewPermissions.processes || []);
  console.log("viewPermissions",viewPermissions);

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
          <Toolbar sx={{ display: "flex" }}>
            <IconButton sx={{ padding: "0px" }} onClick={SideabarController}>
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
              <img src={"/static/Logo.png"} alt="" style={{ width: "55px" }} />
              <Box sx={{ display: "flex", flexDirection: "column", ml: 1.5 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="initial"
                  sx={{ fontSize: { xs: "12px", md: "15px" } }}
                >
                  Government of Punjab - PLRA
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
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  onClick={handleClick}
                >
                  <Avatar
                    alt=""
                    src={"/static/profile.png"}
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
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setEditDialog(true);
                    }}
                  >
                    <Logout sx={{ width: 20, height: 20, marginRight: 2 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.gray.main }}
                    >
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Divider />
          <List sx={{ padding: "0px" }}>
            <ListItem
              sx={{
                display: "block",
                backgroundColor: "lightgrey",
                padding: "0px",
                boxShadow: `{theme.palette.gray[100]}`,
                borderLeft:
                  activeMainTab === "hr" || !open ? "4px solid green" : "none",
                mb: 0,
              }}
              onClick={() => {
                handleCollapse("hr");
                handleMainTab("hr");
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PersonOutlineOutlinedIcon style={{ color: "green" }} />
                </ListItemIcon>
                <ListItemText primary="HR"
                  sx={{ opacity: open ? 1 : 0, }}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
                {isCollapse.hr ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>

            <Collapse in={isCollapse.hr} timeout="auto" unmountOnExit>
              {SlideBarData.map((data, index) => {
                if (Array.isArray(viewPermissions) && viewPermissions.includes(data.text)) {
                  return (
                    <ListItem key={data.key} disablePadding sx={{ display: "block" }}>
                      <Tooltip title={data.text} placement="right">
                        <Link to={`/${data.route}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ListItemButton
                            sx={{
                              minHeight: 48,
                              justifyContent: open ? "initial" : "center",
                              px: 2.5,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                              {React.createElement(data.icon)}
                            </ListItemIcon>
                            <ListItemText primary={data.text} sx={{ opacity: open ? 1 : 0 }} />
                          </ListItemButton>
                        </Link>
                      </Tooltip>
                    </ListItem>
                  );
                }
                return null;
              })}
            </Collapse>

            <ListItem
              sx={{
                display: "block",
                backgroundColor: "lightgrey",
                padding: "0px",
                boxShadow: `{theme.palette.gray[100]}`,
                borderLeft: activeMainTab === "payroll" || !open ? "4px solid green" : "none",
              }}
              onClick={() => {
                handleCollapse("payroll");
                handleMainTab("payroll");
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <PaidOutlinedIcon style={{ color: "green" }} />
                </ListItemIcon>
                <ListItemText
                  primary="PayRoll"
                  sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
                {isCollapse.payroll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItemButton>
            </ListItem>

            <Collapse in={isCollapse.payroll} timeout="auto" unmountOnExit>
              {TabBarData.map((data, index) => (
                <ListItem
                  key={data.key}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <Link
                    to={`/${data.route}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={data.icon}
                          style={{ color: "green" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={data.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </Collapse>
          </List>
        </Drawer >
        <Box
          sx={{
            minHeight: "100vh",
            flexGrow: 1,
            pt: 1,
            maxWidth: "100%",
            overflowX: "hidden",
            bgcolor: "#f7f7f7",
          }}
          onClick={() => {
            setOpen(false);
            setActiveDropdown(false);
          }}
        >
          <DrawerHeader />
          <Handling__Route />
          <Dialog
            open={editDialog}
            onClose={() => setEditDialog(false)}
            sx={{ m: "auto" }}
          >
            <Box sx={{ minWidth: "400px", p: 2 }}>
              <Typography
                variant="h6"
                color="initial"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Warning />
                Are you sure you want to Logout?
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                  mt: 4,
                  gap: 1,
                }}
              >
                <Btn
                  type="sure"
                  onClick={() => {
                    logout();
                    setEditDialog(false);
                  }}
                  outerStyle={{
                    border: `2px solid ${theme.palette.primary.light}`,
                    borderRadius: "8px",
                  }}
                />
                <Btn
                  type="close"
                  onClick={() => setEditDialog(false)}
                  outerStyle={{
                    border: `2px solid ${theme.palette.error.light}`,
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>
          </Dialog>
        </Box>
      </Box >
    );
  }
};
export default Sidebar;
