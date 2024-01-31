import React from "react";

const BorderLessInput = ({ label, width, inputType }) => {
    const type = inputType ? inputType : 'text';
    return (
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'start' }}>
            <label htmlFor="" style={{ display: 'inline-block', width: width || '330px', fontSize: '14px' }}>{label}</label>
            <input
                type={type}
                style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid black",
                    backgroundColor: "transparent",
                    padding: '2px 2px',
                    fontSize: '15px'
                }}
            />
        </div>
    );
};

export default BorderLessInput;
