import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        media: {
            type: String,
            required: true,
        },
        capsule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Capsule",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        }
    },
    { timestamps: true } 
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
