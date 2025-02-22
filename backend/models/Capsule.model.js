import mongoose from "mongoose";

const CapsuleSchema = new mongoose.Schema(
    {
        Description: {
            type: String,
            required: true, 
        },
        Banner: {
            type: String,
            required: true,
        },
        CapsuleName: {
            type: String,
            required: true,
        },
        Contributers: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true,
        },
        Admin: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true } 
);

export const Capsule = mongoose.model("Capsule", CapsuleSchema);
