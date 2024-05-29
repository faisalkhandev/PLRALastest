import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ToastCard = () => {
    return (
        <ToastContainer
            position="top-center"
            autoClose={2500}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
};

export const showToast = (message, type = 'success') => {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'info':
            toast.info(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        default:
            toast(message);
    }
};

export default ToastCard;
