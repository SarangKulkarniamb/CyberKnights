import mongoose from "mongoose";

const messProfileSchema = new mongoose.Schema(
    {
        messId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        
        messName: {
            type: String,
            required: true,
        },
        
        messLocation: {
            type: String,
            required: true,
        },

        messContact: {
            type: String,
            required: true,
        },
        
        messDescription: {
            type: String,
            required: true,
        },
        
        messImages: {
            type: [String],
            default: ["https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png"],
        },
    },
    { timestamps: true }
);

export const MessProfile = mongoose.model("MessProfile", messProfileSchema);