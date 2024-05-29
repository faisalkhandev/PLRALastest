import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'

const InquiryReason = () => {

    const [selected, setSelected] = useState(null);
    const [showTextArea, setShowTextArea] = useState(false);



    const handleClick = (index) => {
        setSelected(index);
        setShowTextArea(true);
    };
    const handleTextAreaChange = (event) => setTextAreaValue(event.target.value);

    const inquiryTypes = [
        {
            value: 'intelligenceReport',
            label: 'Intelligence Report',
        },
        {
            value: 'complaint',
            label: 'Complaint',
        },
        {
            value: 'corruption',
            label: 'Corruption',
        },
        {
            value: 'misconduct',
            label: 'Misconduct',
        },
        {
            value: 'inefficiency',
            label: 'Inefficiency',
        },
        {
            value: 'referencefromAcDc',
            label: 'Reference from AC/DC',
        },
        {
            value: 'other',
            label: 'Other',
        },
    ];

    return (
        <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {inquiryTypes.map((type, index) => (
                    <Typography
                        key={index}
                        variant="h6"
                        color="initial"
                        onClick={() => handleClick(index)}
                        sx={{
                            p: 1,
                            bgcolor: selected === index ? 'green' : '#D5D5D5',
                            color: selected === index ? '#fff' : '#000',
                            borderRadius: "30px",
                            marginRight: '8px',
                            marginBottom: '8px',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            px: 2
                        }}
                    >
                        {type.label}
                    </Typography>
                ))}
                {selected === inquiryTypes.length - 1 && (
                    <TextField
                        label="Other Reson"
                        multiline
                        rows={4}
                        value={textAreaValue}
                        onChange={handleTextAreaChange}
                        sx={{ marginTop: '20px' }}
                    />
                )}
            </Box>
        </>
    )
}

export default InquiryReason
