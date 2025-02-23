import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRecoilValue , useSetRecoilState} from "recoil";

export const StudentProfileForm = ({ onSuccess }) => {
    const url = `${import.meta.env.VITE_PROFILE_API_URL}/profile-upload`;
    const profileState = useRecoilValue(profileState)
    const setProfileState = useSetRecoilState(profileState)
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        profilePic: null,
        dob: "",
        bio: "",
    });

    const mutation = useMutation({
        mutationFn: async (formDataToSend) => {
            const response = await axios.post(url, formDataToSend, { withCredentials: true });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Profile updated successfully!");
                queryClient.invalidateQueries(["profile"]);
                onSuccess(); 
            } else {
                toast.error(data.message);
                setProfileState({
                    isAvailable : true,
                    profile : data.profile
                })
            }
        },
        onError: (error) => {
            console.error("Error updating profile:", error.message);
            toast.error(error?.response?.data?.message || "There was an error.");
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        if (formData.profilePic) formDataToSend.append("profilePic", formData.profilePic);
        if (formData.name) formDataToSend.append("name", formData.name);
        if (formData.dob) formDataToSend.append("dob", formData.dob);
        if (formData.bio) formDataToSend.append("bio", formData.bio);

        mutation.mutate(formDataToSend);
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <Toaster />
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input type="file" name="profilePic" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="3"
                    />
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                        {mutation.isPending ? "Updating..." : "Save"}
                    </button>
                    <button type="button" onClick={onSuccess} className="px-4 py-2 bg-gray-500 text-white rounded-md">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
