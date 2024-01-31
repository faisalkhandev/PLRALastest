import { createTheme } from "@mui/material";

import { isOverflown } from "@mui/x-data-grid/utils/domUtils";

const font = "Segoe UI";

const Theme = createTheme({
  palette: {
    mode: "light",
    common: {
      black: "#201F1E",
      white: "#F3F2F1",
    },
    primary: {
      main: "#379237",
      light: "#49EE73",
      dark: "#00A32A",
      200: "#D6F5D6"
    },
    secondary: {   //blue
      main: "#0023FF",
      light: "#5D74FF",
      dark: "#011AAD",
    },
    error: {
      main: "#FF0000", // Red
      light: "#FF6565", // Light Red
      dark: "#B10202", // Dark Red
      600:"#df6d7c",
      300:"#efd5d5"
    },
    warning: {
      main: "#F18F01", // Yellow
      light: "#FFBA57", // Light Yellow
      dark: "#AF6800", // Dark Yellow
      600:"#ffa55c",
      300:"#ffebda"
    },
    info: {
      main: "#2196F3", // Light Blue
      light: "#90CAF9", // Lighter Blue
      dark: "#1565C0", // Darker Blue
      contrastText: "#fff", // White
    },
    success: {
      main: "#4CAF50", // Green
      light: "#81C784", // Light Green
      dark: "#388E3C", // Dark Green
      contrastText: "#fff", // White
      600:"#0e903a",
      300:"#c3f0eb"
    },
    gray: {
      main: "#A1A1A1",
      lightgray: "#BBBBBB",
      darkgray: "#6D6D6D",
      400: "#bcbcbc",
      200: "#F6F6F6",
      100: "#e2e1e0"
    },
    black: {
      800: "#000000",
      600: "#6D6D6D",
      300: "#e2e1e0", //Divider-Color
    },
    white: {
      800: "#ffffff",
    },
  },

  typography: {
    fontFamily: font,

    h1: {
      fontWeight: "300",
      fontSize: "6rem",
      lineHeight: 1.167,
      letterSpacing: "-0.01562em",
    },

    h2: {
      fontWeight: "300",
      fontSize: "3.75rem",
      lineHeight: 1.12,
      letterSpacing: "-0.00833em",
    },

    h3: {
      fontWeight: "300",
      fontSize: "2rem",
      lineHeight: 1.167,
      letterSpacing: "0em",
    },

    h4: {
      fontWeight: "400",
      fontSize: "1.5rem",
      lineHeight: 1.235,
      letterSpacing: "0.00735em",
    },

    h5: {
      fontWeight: "400",
      fontSize: "1.2rem",
      lineHeight: 1.334,
      letterSpacing: "0em",
      color: "#201F1E",
    },

    h6: {
      fontWeight: "400",
      fontSize: "1rem",
      lineHeight: 1.6,
      letterSpacing: "0.0075em",
    },

    subtitle1: {
      fontWeight: "400",
      fontSize: "13px",
      lineHeight: 1.75,
      letterSpacing: "0.00938em",
    },

    subtitle2: {
      fontWeight: "500",
      fontSize: "0.875rem",
      lineHeight: 1.57,
      letterSpacing: "0.00714em",
    },

    body1: {
      fontWeight: "400",
      fontSize: "12px",
      lineHeight: 1.5,
      letterSpacing: "0.00938em",
    },

    body2: {
      fontWeight: "400",
      fontSize: "12px",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
      color: "#201F1E",
    },
  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            padding: "0.2rem",
            paddingLeft: "0.67rem",
            borderRadius: "0.2rem",
            fontSize: "14px",
            height: "18px",
          },
          "& .MuiOutlinedInput-root": {
            padding: "0.2rem",
            borderRadius: "0.2rem",
            "&:hover fieldset": {
              padding: "0.2rem",
              border: "1px solid #379237",
              borderRadius: "0.2rem",
            },
            "&.Mui-focused fieldset": {
              padding: "0.2rem",
              border: "1px solid #379237",
              borderRadius: "0.2rem",
            },
          },
          width: "100%",
        },
        disabled: {
          // Style for disabled state
          "& .MuiOutlinedInput-root": {
            // Change to .MuiOutlinedInput-root
            border: "1px solid #fff",
            color: "#000",
          },
        },
      },
    },
    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
          textTransform: "none",
          height: "20px",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "rgba(41, 184, 77, 0.1)",
          },
        },
        contained: {
          backgroundColor: "#379237",
          color: "#fff",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: "#379237",
            borderRadius: 4,
            boxShadow: "0px 0px 9px 5px rgba(231, 231, 231, 0.5)",
          },
        },

        outlined: {
          backgroundColor: "transparent",
          color: "rgb(52,199,89)",
          border: "1px solid #379237",
          borderRadius: 6,
          "&:hover": {
            backgroundColor: "#379237",
            border: "1px solid rgb(52,199,89)",
            borderRadius: 6,
          },
        },
      },
    },

    // InputLabel

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#495057",
          fontSize: "0.85rem",
          marginTop: "-0.5rem",
          fontFamily: font,
          color: "#201F1E",
        },
      },
    },

    // Select

    MuiSelect: {
      styleOverrides: {
        root: {
          width: "100%",
          fontSize: "12px",
          height: "28.5px",
        },
      },
    },

    //Table

    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "1px solid #379237",

          borderRadius: "6px",
        },

        menuList: {
          borderRadius: "10px",

          width: "164px",

          backgroundColor: "#000",
        },

        columnHeaders: {
          backgroundColor: "#379237",

          color: "#FFFFFF",

          fontSize: 14,
        },

        columnSeparator: {
          height: "120px",
        },

        virtualScroller: {
          "&::-webkit-scrollbar": {
            width: "0.5rem",

            height: "0.5rem",
          },

          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(52, 199, 89)",

            borderRadius: "4px",
          },
        },

        menu: {
          maxWidth: "160px",
        },

        MenuItem: {
          maxWidth: "160px",

          padding: "3px 10px",
        },

        footerContainer: {
          minHeight: "20px",
        },

        panelFooter: {
          display: "none",
        },

        columnsPanelRow: {
          paddingLeft: "6px ",
          fontSize: "0.75rem",
        },

        paper: {
          minWidth: "90px",
          marginLeft: "10px",
          height: "230px",
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "24px",
          marginRight: "1px",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          maxWidth: "30px",
          padding: "3px 10px",
        },
      },
    },

    //Card

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#F9F8F7",
        },
      },
    },

    //Dialog

    MuiDialog: {
      styleOverrides: {
        paper: {
          width: "fit-contant", // Set the desired width here
          maxWidth: "none",
          borderRadius: "10px",
          backgroundColor: "#F9F8F7",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "10px",
        },
      },
    },

    //Drawar

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F3F2F1",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: "#201F1E",
          fontSize: "13px",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    MuiTabList: {
      styleOverrides: {
        root: {
          color: "#201F1E",
          maxHeight: "20px",
        },
      },
    },

    MuiTabList: {
      styleOverrides: {
        root: {
          minHeight: "30px",
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          width: "100%",
          padding: 0,
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 20, 
          padding: 0,
        },
        switchBase: {
          padding: 0,
          margin: "0.5px 0.1px",
          transitionDuration: "300ms",
          "&.Mui-checked": {
            transform: "translateX(18px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              // backgroundColor:'green',
              opacity: 1,
              border: 0,
              marginLeft: "3px",
            },
            "&.Mui-disabled + .MuiSwitch-track": {
              opacity: 0.5,
            },
          },
          "&.Mui-focusVisible .MuiSwitch-thumb": {
            color: "#33cf4d",
            border: "6px solid #fff",
          },
          "&.Mui-disabled .MuiSwitch-thumb": {
            color: "gray",
          },
          "&.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.7,
          },
        },

        thumb: {
          boxSizing: "border-box",
          width: 22,
          height: 22,
          marginTop: "-2.8px",
          marginBottom: -2,
        },
        track: {
          borderRadius: 20 / 2,
          backgroundColor: "#39393D",
          opacity: 1,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          color: "gray",
        },
        list: {
          fontSize: "12px",
          padding: "-30px",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          width: "160px",
        },
      },
    },

    MuiTextareaAutosize: {
      styleOverrides: {
        root: {
          width: "100%",
          backgroundColor: "red",
        },
      },
    },
  },
});

export default Theme;
