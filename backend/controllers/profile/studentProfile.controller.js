import express from 'express'
import { StudentProfile } from '../../models/studentProfile.model.js'

export const studentProfileUpload = async function studentProfileUpload(req, res) {
    try {
        const { dob, preference, name } = req.body;
        const profilePic = req.file?.path || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png';

        const studentId = req.userId;

        const studentProfile = await StudentProfile.findOneAndUpdate(
            { studentId },
            { studentId, dob, preference, profilePic, displayName: name },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile uploaded successfully',
            studentProfile,
        });

    } catch (error) {
        console.error('Error uploading profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile',
        });
    }
};



