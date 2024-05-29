// hooks/useDateFormat.js

const useDateFormat = () => {
    const formatDate = (inputDate) => {
        if (!inputDate) return ''; // Return empty string if no input date
        const parts = inputDate.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    return formatDate;
};

export default useDateFormat;
