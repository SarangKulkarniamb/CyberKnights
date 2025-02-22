import express from 'express'
import { Profile } from '../../models/profile.model.js'

export const ProfileUpload = async function(req, res) {
    try {
        const { dob, name } = req.body;
        const profilePic = req.file?.path || 'https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png';

        const userid = req.userId;

        const profile = await Profile.findOneAndUpdate(
            { userid },
            { userid, dob, profilePic, displayName: name },
            { new: true, upsert: true, runValidators: true }
        );

        console.log("Profile Updated:", profile); // Debug log

        res.status(200).json({
            success: true,
            message: 'Profile uploaded successfully',
            profile,
        });

    } catch (error) {
        console.error('Error uploading profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload profile',
        });
    }
};

export const GetProfile = async function (req, res) {
    try {
        const userid = req.userId;
        const profile = await Profile.findOne({ userid });

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json({
            success: true,
            profile: {
                displayName: profile.displayName || "User",
                dob: profile.dob || "",
                profilePic: profile.profilePic || "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png",
            },
        });

    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ success: false, message: "Failed to get profile" });
    }
};
