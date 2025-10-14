import path from 'path';
import prisma from '../config/db.js';
import { getUploadFilePath } from '../utils/helper.js';

export const uploadImage = async (req, res) => {
    const { user_id } = req.user;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadPath = await prisma.users.update({
            where: { id: user_id },
            data: {
                profile_picture: req.file.filename,
            },
        });

        const domain = getUploadFilePath(req);
        const imageUrl = `${domain}${req.file.filename}`;

        return res.status(200).json({
            message: 'Image uploaded successfully',
            url: imageUrl,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};
