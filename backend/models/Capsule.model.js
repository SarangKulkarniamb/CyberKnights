import mongoose from "mongoose";

const CapsuleSchema = new mongoose.Schema(
    {
        Description: {
            type: String,
            required: true, 
        },
        banner: {
            type: String,
            required: true,
        },
        CapsuleName: {
            type: String,
            required: true,
        },
        Admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        viewRights: { 
            type: String, 
            enum: ["public","onlyMe","specificPeople"], 
            default: "specificPeople",
            required: true
        },
        access: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        requests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        locked: {
            type: Boolean,
            default: false,
        },
        lockedUntil: {
            type: Date,
        },
    },
    { timestamps: true } 
);

export const Capsule = mongoose.model("Capsule", CapsuleSchema);
