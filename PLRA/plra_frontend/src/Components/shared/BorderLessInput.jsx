import React from "react";

const BorderLessInput = ({ label, width, value, name, onChange, inputType,inputWidth, disabled ,...rest}) => {
    const type = inputType ? inputType : 'text';
    return (
        <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'start',}}>
            <label htmlFor={name} style={{ display: 'inline-block', width: width || '350px', fontSize: '14px', marginRight:'1px' }}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                id={name}
                disabled={disabled} 
                style={{
                    width: inputWidth||"90%",
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
