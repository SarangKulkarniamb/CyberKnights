import {atom} from "recoil";

export const profileState = atom({
    key: "profileState",
    default: {
        name: "",
        dob: "",   
        profilePic: "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1633458672/default-profile-picture-300x300_vbqz7c.png", 
        bio: "",
    },
});

