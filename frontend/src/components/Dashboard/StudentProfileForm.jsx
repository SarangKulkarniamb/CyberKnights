import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const StudentProfileUpload = () => {
    const url = `${import.meta.env.VITE_PROFILE_API_URL}/profile-upload`;
    const [formData, setFormData] = useState({
        displayName: "",
        profilePic: null,
        dob: "",
    });

    const mutation = useMutation({
        mutationFn: async (formDataToSend) => {
            const response = await axios.post(url, formDataToSend, { withCredentials: true });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Profile Uploaded successfully!");
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            console.error("Error uploading profile:", error.message);
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
        formDataToSend.append("profilePic", formData.profilePic);
        formDataToSend.append("displayName", formData.displayName);
        formDataToSend.append("dob", formData.dob);

        mutation.mutate(formDataToSend);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <Toaster />
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input
                        type="file"
                        name="profilePic"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                        accept="image/*"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Display Name</label>
                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfileUpload;
