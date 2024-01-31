import React from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@emotion/react';

const TextArea = (props) => {
    const theme = useTheme();
    const { outerStyles, Rows, lable, mandatory, placeholder, name, onChange, value } = props;


    return (
        <Box style={outerStyles} className='textArea'>
            <label htmlFor='ID' style={{ fontSize: '14px' }}>{lable} {
                mandatory && <span style={{ fontSize: '18px', color: `${theme.palette.error.main}` }}>*</span>
            } :</label>
            <textarea name={name} onChange={onChange} value={value} id="ID" rows={Rows} className='custom-textarea' placeholder={placeholder} style={{ backgroundColor: "#FDFDFD" }} />
        </Box>
    )
}

export default TextArea
