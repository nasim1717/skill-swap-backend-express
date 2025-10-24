import { format } from "date-fns";

export const getUploadFilePath = (req) => {
    return `$${req.protocol}://${req.get('host')}/uploads/`;

};

export const formatDate = (date, formatType = "monthYear") => {
    if (!date) return "";

    const dateObj = new Date(date);

    const formats = {
        monthYear: "MMMM yyyy", // January 2024
        fullDate: "dd MMMM yyyy", // 18 October 2025
        shortDate: "dd/MM/yyyy", // 18/10/2025
        timeOnly: "hh:mm a", // 06:28 AM
        dateTime: "dd MMM yyyy, hh:mm a", // 18 Oct 2025, 06:28 AM
    };

    const pattern = formats[formatType] || formats.monthYear;

    try {
        return format(dateObj, pattern);
    } catch (error) {
        console.error("Date formatting error:", error.message);
        return date;
    }
};
