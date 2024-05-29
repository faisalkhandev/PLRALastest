// ErrorMessage.jsx
import React from 'react';

const ErrorHandler = ({ online }) => (
  <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px' }}>
    <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Oops! Something went wrong</p>
    {online ? (
      <>
        <p style={{ fontSize: '16px' }}>We couldn't fetch the data at the moment.</p>
        <p style={{ fontSize: '16px' }}>Server is not responseding.</p>
      </>
    ) : (
      <p style={{ fontSize: '16px' }}>It seems you are offline. Please check your internet connection and try again.</p>
    )}
  </div>
);

export default ErrorHandler;
