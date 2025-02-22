import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpiresAt: {
            type: Date,
        },
        verificationToken: {
            type: String,
        },
        verificationTokenExpiresAt: {
            type: Date,
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Capsule",
        },
    },
    { timestamps: true } 
);

// Optional index for token expiration (if using TTL on verificationTokenExpiresAt)
userSchema.index({ verificationTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);