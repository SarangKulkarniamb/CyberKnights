import mongoose from "mongoose";

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
    },
    { timestamps: true } 
);

userSchema.index({ verificationTokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
