import express from 'express'
import { Profile } from "../../models/profile.model.js"

export const ProfileUpload = async function (req, res) {
    try {
        const { dob, name, bio } = req.body
        const profilePic = req.file?.path // Only update if a new file is uploaded
        const userid = req.userId

        // Find existing profile
        let profile = await Profile.findOne({ userid })

        if (!profile) {
            // If no profile exists, create a new one with default values
            profile = new Profile({
                userid,
                dob: dob || "",
                profilePic:
                    profilePic ||
                    "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png",
                bio: bio || "",
                displayName: name || "User",
            })
        } else {
            // Update only provided fields
            if (dob) profile.dob = dob
            if (name) profile.displayName = name
            if (bio) profile.bio = bio
            if (profilePic) profile.profilePic = profilePic
        }

        await profile.save()

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile,
        })
    } catch (error) {
        console.error("Error updating profile:", error)
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        })
    }
}


export const GetProfile = async function (req, res) {
    try {
        const userid = req.userId
        const profile = await Profile.findOne({ userid })

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" })
        }

        res.status(200).json({
            success: true,
            profile: {
                bio: profile.bio || "",
                displayName: profile.displayName || "User",
                dob: profile.dob || "",
                profilePic: profile.profilePic || "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png",
            },
        })

    } catch (error) {
        console.error("Error getting profile:", error)
        res.status(500).json({ success: false, message: "Failed to get profile" })
    }
}
