export const getUploadFilePath = (req) => {
    return `$${req.protocol}://${req.get('host')}/uploads/`;

}