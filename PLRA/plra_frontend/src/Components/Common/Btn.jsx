import React from 'react';
import { Box } from "@mui/material";
import {
    AngleDown, AngleUp, Check, Download, FloppyDisk, BackArrow,
    PaperClip, PenToSquare, Plus, Setting, Trash, Upload, Xmark, Rotate,
    Angle_right_arrow
} from '../../Assets/Icons/index.jsx'
import { useTheme } from '@emotion/react';


const Btn = (props) => {
    const { onClick, type, innerStyle, outerStyle, iconStyle, Button_Type } = props;

    let icon = null;
    let tooltipText = "";

    switch (type.toLowerCase()) {
        case 'back':
            icon = <BackArrow />;
            tooltipText = 'Go Back';
            break;
        case 'reset':
            icon = <Rotate />;
            tooltipText = 'Clear';
            break;
        case 'new':
            icon = <Plus />;
            tooltipText = 'New';
            break;
        case 'apply': 
            icon = <Plus />;
            tooltipText = 'Apply';
            break;
        case 'Apply_New_Leave': 
            icon = <Plus />;
            tooltipText = 'Apply New Leave';
            break;
        case 'add':
            icon = <Plus />;
            tooltipText = 'Add';
            break;
        case 'delete':
            icon = <Trash />;
            tooltipText = 'Delete';
            break;
        case 'save':
            icon = <FloppyDisk />;
            tooltipText = 'Save';
            break;
        case 'edit':
            icon = <PenToSquare />;
            tooltipText = 'Edit';
            break;
        case 'attachment':
            icon = <PaperClip />;
            tooltipText = 'Attachment';
            break;
        case 'upload':
            icon = < Upload />;
            tooltipText = 'Upload';
            break;
        case 'download':
            icon = <Download />;
            tooltipText = 'Download';
            break;
        case 'close':
            icon = <Xmark />;
            tooltipText = 'Close';
            break;
        case 'confirm':
            icon = <Check />;
            tooltipText = 'confirm';
            break;
        case 'sure':
            icon = <Check />;
            tooltipText = 'sure';
            break;
        case 'setting':
            icon = <Setting />;
            tooltipText = 'Setting';
            break;
        case 'up':
            icon = <AngleUp />;
            tooltipText = 'Up';
            break;
        case 'down':
            icon = <AngleDown />;
            tooltipText = 'Down';
            break;
        case 'right':
            icon = <ArrowRight />;
            tooltipText = 'Next';
            break;
        case 'left':
            icon = <ArrowLeft />;
            tooltipText = 'Previous';
            break;
        case 'apply':
            icon = <ApplyArrow />;
            tooltipText = 'Apply Now';
            break;
        default:
            icon = null;
            tooltipText = 'Unknown';
            break;
    }


    const theme = useTheme();

    return (
        <Box sx={{ ...outerStyle }}>
            <button onClick={onClick} style={{ ...innerStyle }} className='button' type={Button_Type || 'button'}>
                <span className='icon'>{icon}</span><span style={{ textTransform: "capitalize", fontWeight: 400, marginTop: "-2px" }}>{type}</span>
            </button>
        </Box>

    );
}

export default Btn;