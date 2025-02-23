import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import { profileState } from "../../atoms/profileAtom";

export const ProfileView = () => {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const setProfileState = useSetRecoilState(profileState);
    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_PROFILE_API_URL}/me`, { withCredentials: true });
            setProfileState({
                isAvailable: true,
                profile: response.data.profile,
            });
            return response.data.profile;
        },
    });

    const mutation = useMutation({
        mutationFn: async (formDataToSend) => {
            const response = await axios.post(`${import.meta.env.VITE_PROFILE_API_URL}/profile-upload`, formDataToSend, { withCredentials: true });
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success("Profile updated successfully!");
                queryClient.invalidateQueries(["profile"]); // Refresh profile data
                setIsEditing(false);
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            console.error("Error updating profile:", error.message);
            toast.error(error?.response?.data?.message || "There was an error.");
        },
    });

    const formatDOB = (dob) => {
        if (!dob) return ""; 
        const date = new Date(dob);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
    };

    if (isLoading) return <div>Loading...</div>;

    if (!profile) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
                <Toaster />
                <ProfileEditForm profile={null} mutation={mutation} onCancel={() => setIsEditing(false)} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg flex gap-6">
            <Toaster />
            {/* Profile Details */}
            <div className="flex-1">
                {!isEditing ? (
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
                        <div className="flex items-center space-x-4 mb-4">
                            <img
                                src={profile?.profilePic || "https://via.placeholder.com/150"}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-xl font-semibold">{profile?.displayName}</p>
                                <p className="text-gray-600">{profile?.bio}</p>
                            </div>
                        </div>
                        <p><strong>DOB:</strong> {formatDOB(profile?.dob)}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <ProfileEditForm profile={profile} mutation={mutation} onCancel={() => setIsEditing(false)} />
                )}
            </div>

            {/* Achievements Block */}
            <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Achievements</h2>
                <div className="text-center">
                    <p className="text-4xl font-bold text-blue-600">{profile?.capsules?.length || 0}</p>
                    <p className="text-gray-600">Capsules Created</p>
                </div>
            </div>
        </div>
    );
};

const ProfileEditForm = ({ profile, mutation, onCancel }) => {
    const [formData, setFormData] = useState({
        name: profile?.displayName || "",
        dob: profile?.dob ? new Date(profile.dob).toISOString().split("T")[0] : "", 
        bio: profile?.bio || "",
        profilePic: null,
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
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                <input
                    type="file"
                    name="profilePic"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                    accept="image/*"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Tell us something about yourself..."
                />
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Updating..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};