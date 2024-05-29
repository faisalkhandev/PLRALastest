import React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom'
import { faPlus, faPenToSquare, faTrash, faFloppyDisk } from "../../Assets/Icons/Icons";


const Breadcrumb = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        mb: 1, mt: 1, pl: 0.3
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" component="h4" sx={{ margin: 0, fontWeight: "bold",color:props.titleColor?props.titleColor:"black" }}>{props.title}</Typography>
        <Link underline="hover" to="/">
          <Typography variant="body2" sx={{ mt: "-1px", fontWeight: 400, letterSpacing: '1px' }}>
            {props.breadcrumbItem}
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string,
};

export default Breadcrumb;
