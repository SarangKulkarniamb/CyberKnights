import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        Description: {
            type: String,
            required: true, 
        },
        PostId: {
            type: mongoose.Schema.Types.ObjectId,
            unique: true,
        },
        Media: {
            type: String,
            required: true,
        },
        
       UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
     CapsuleId: {  
     type: mongoose.Schema.Types.ObjectId,
     ref: "Capsule",
     required: true, }
    },
    { timestamps: true } 
);

export const Post = mongoose.model("Post", PostSchema);
