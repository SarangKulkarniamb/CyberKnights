import { Capsule } from '../../models/Capsule.model.js';

export const CapsuleUpload = async (req, res) => {
    try {
        const { Description, CapsuleName, viewRights } = req.body;

        // Ensure required fields are provided
        if (!CapsuleName || !Description || !viewRights) {
            return res.status(400).json({
                success: false,
                message: 'CapsuleName, Description, and viewRights are required',
            });
        }

        // Get the uploaded file path or use a default banner
        const banner = req.file?.path || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-banner.png';

        // Ensure Admin (userId) is available
        const Admin = req.userId;
        if (!Admin) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User ID not found',
            });
        }

        // Create or update the capsule
        const capsule = await Capsule.findOneAndUpdate(
            { Admin, CapsuleName }, // Ensure uniqueness by Admin and CapsuleName
            { Description, banner, CapsuleName, viewRights, Admin },
            { new: true, upsert: true, runValidators: true }
        );

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Capsule uploaded successfully',
            capsule,
        });
    } catch (error) {
        console.error('Error uploading capsule:', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to upload capsule',
        });
    }
};