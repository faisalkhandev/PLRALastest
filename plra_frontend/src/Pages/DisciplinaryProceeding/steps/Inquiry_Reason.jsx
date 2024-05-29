import React, { useState,useEffect } from 'react';
import { Box, Typography, TextField } from "@mui/material";

function Inquiry_Reason({ selectedEmployee, setSelectedEmployee, setDisabledNext }) {

    const inquiryTypes = [
        { value: 'Intelligence report', label: 'Intelligence report' },
        { value: 'Complaint', label: 'Complaint' },
        { value: 'Corruption', label: 'Corruption' },
        { value: 'Misconduct', label: 'Misconduct' },
        { value: 'Inefficiency', label: 'Inefficiency' },
        { value: 'Reference from DC/AC', label: 'Reference from DC/AC' },
        { value: 'Other', label: 'Other' },
    ];
   
    

    const [textAreaValue, setTextAreaValue] = useState(selectedEmployee.remarks_for_other_inquiry_reason)
    const [selectedInquiry, setSelectedInquiry] = useState(selectedEmployee.inquiry_reason);

    const handleTextAreaChange = (event) => {
        setTextAreaValue(event.target.value);
        setSelectedEmployee({
            ...selectedEmployee,
            remarks_for_other_inquiry_reason: event.target.value
        });
    };

    const handleClick = (type) => {
     
        setSelectedInquiry(type.label);
        setSelectedEmployee({
            ...selectedEmployee,
            inquiry_reason: type.label
        });
    };
    useEffect(() => {
        const isEmployeeSelected = !!selectedEmployee.inquiry_reason;
        setDisabledNext(!isEmployeeSelected);
    }, [selectedEmployee.inquiry_reason]);

    return (
        <Box sx={{ width: '80%', m: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" color="initial" sx={{ textAlign: 'center', fontWeight: 600 }}>Inquiry Reason</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {inquiryTypes.map((type, index) => (
                    <Typography
                        key={index}
                        variant="h6"
                        color="initial"
                        onClick={() => handleClick(type)}
                        sx={{
                            p: 1,
                            bgcolor: selectedInquiry === type.label ? 'green' : '#D5D5D5',
                            color: selectedInquiry === type.label ? '#fff' : '#000',
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
                {selectedInquiry === 'Other' && (
                    <TextField
                        label="Other Reason"
                        multiline
                        rows={4}
                        value={textAreaValue}
                        onChange={handleTextAreaChange}
                        sx={{ marginTop: '20px' }}
                    />
                )}
            </Box>
        </Box>
    );
}

export default Inquiry_Reason;
