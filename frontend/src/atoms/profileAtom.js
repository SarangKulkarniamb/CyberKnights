import {atom} from "recoil";

export const profileState = atom({
    key: "profileState",
    default:{
        isAvailble: false,
        profile: null, 
    }
});

