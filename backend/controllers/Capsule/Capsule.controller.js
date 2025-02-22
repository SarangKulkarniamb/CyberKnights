import express from 'express';
import { Capsule } from '../../models/Capsule.model.js';

export const CapsuleUpload = async (req, res) => {
    try {
        
        const { Description, CapsuleName, Contributers } = req.body;
        
        const Banner = req.file?.path || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-banner.png';
        
        const Admin = req.userId;
        
        
        const capsule = await Capsule.findOneAndUpdate(
            { Admin }, 
            { Description, Banner, CapsuleName, Contributers, Admin },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Capsule uploaded successfully',
            capsule,
        });
    } catch (error) {
        console.error('Error uploading capsule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload capsule',
        });
    }
};
