import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default:
                "https://res.cloudinary.com/dqxvm8hrm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1739511183/user-profile-icon-vector-avatar-600nw-2247726673_bay0kd.webp",
        },
        dob: {
            type: Date,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Profile = mongoose.model("Profile", ProfileSchema);