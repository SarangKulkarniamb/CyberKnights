import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Toaster } from "react-hot-toast";

const StudentProfileForm = () => {
    const url = `${import.meta.env.VITE_STUDENT_API_URL}/profile-upload`;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        profilePic: null, // Stores the file object
        profilePicPreview: null, // Will store the file preview or Cloudinary URL
        dob: "",
        preference: "Veg",
    });

    useEffect(() => {
        // Fetch current profile data from the server when component mounts
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_STUDENT_API_URL}/get-profile`, { withCredentials: true });
                const { displayName, dob, preference, profilePic } = response.data.studentProfile;
                setFormData({
                    ...formData,
                    displayName,
                    dob,
                    preference,
                    profilePicPreview: profilePic || 'https://res.cloudinary.com/dqxvm8hrm/image/upload/v1739511938/icons8-plus_vximy6.gif', // Set profilePic if available
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfileData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            profilePic: file,
            profilePicPreview: URL.createObjectURL(file), // Set the preview URL for the image
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("profilePic", formData.profilePic);
        formDataToSend.append("displayName", formData.displayName);
        formDataToSend.append("dob", formData.dob);

        try {
            const response = await axios.post(url, formDataToSend, { withCredentials: true });
            if (!response.data.success) {
                toast.error(response.data.message);
            } else {
                toast.success("Profile Updated successfully!");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "There was an error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
            <div>
                <Toaster />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-center">Student Profile Form</h2>
            <form onSubmit={handleSubmit}>
                {/* Profile Picture */}
                <div className="mb-4 flex justify-center">
                    <label htmlFor="profilePic" className="cursor-pointer">
                        <div className="w-20 h-20 bg-white rounded-full flex justify-center items-center">
                            {formData.profilePicPreview ? (
                                <img
                                    src={formData.profilePicPreview}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <img
                                    src="https://res.cloudinary.com/dqxvm8hrm/image/upload/v1739511938/icons8-plus_vximy6.gif"
                                    alt="Plus GIF"
                                    className="w-16 h-16"
                                />
                            )}
                        </div>
                    </label>
                    <input
                        type="file"
                        name="profilePic"
                        id="profilePic"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                {/* Display Name */}
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

                {/* Date of Birth */}
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

                {/* Food Preference */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Food Preference</label>
                    <select
                        name="preference"
                        value={formData.preference}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="Veg">Veg</option>
                        <option value="Non-Veg">Non-Veg</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentProfileForm;
