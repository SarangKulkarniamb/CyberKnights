import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaLeaf } from "react-icons/fa";

export const CreateTimeCapsule = () => {
  const [loading, setLoading] = useState(false)
  const url = `${import.meta.env.VITE_CAPSULE_API_URL}/Capsule-upload`;

  const [formData, setFormData] = useState({
    CapsuleName: "",
    Description: "",
    banner: null,
    viewRights: "onlyMe",
    locked: false,
    lockedUntil: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner: "File size must be less than 5MB" }));
    } else {
      setFormData((prev) => ({ ...prev, banner: file }));
      setErrors((prev) => ({ ...prev, banner: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.CapsuleName.trim()) {
      newErrors.CapsuleName = "Capsule Name is required";
    }
    if (!formData.Description.trim()) {
      newErrors.Description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createCapsuleMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append("CapsuleName", data.CapsuleName);
      formDataToSend.append("Description", data.Description);
      formDataToSend.append("viewRights", data.viewRights);
      formDataToSend.append("locked", data.locked);
      formDataToSend.append("lockedUntil", data.lockedUntil);

      if (data.banner) {
        formDataToSend.append("banner", data.banner);
      }

      // Artificial delay for testing (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post(url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      setLoading(false)
      toast.success("Capsule created successfully!");
      setFormData({
        CapsuleName: "",
        Description: "",
        banner: null,
        viewRights: "onlyMe",
        locked: false,
        lockedUntil: "",
      });
      setErrors({});
    },
    onError: (error) => {
      setLoading(false)
      toast.error(error.response?.data?.message || "Failed to create capsule.");
    },
  });

  const handleSubmit = (e) => {
    setLoading(true)
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    createCapsuleMutation.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <Toaster />
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Create a Time Capsule
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold">Capsule Name</label>
          <input
            type="text"
            name="CapsuleName"
            value={formData.CapsuleName}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 ${
              errors.CapsuleName ? "border-red-500" : ""
            }`}
          />
          {errors.CapsuleName && (
            <p className="text-red-500 text-sm mt-1">{errors.CapsuleName}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="Description"
            rows="4"
            value={formData.Description}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 ${
              errors.Description ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.Description && (
            <p className="text-red-500 text-sm mt-1">{errors.Description}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Upload Banner Image</label>
          <input
            type="file"
            name="banner"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full px-4 py-2 border rounded-lg cursor-pointer focus:ring-blue-500 ${
              errors.banner ? "border-red-500" : ""
            }`}
          />
          {errors.banner && (
            <p className="text-red-500 text-sm mt-1">{errors.banner}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">View Rights</label>
          <select
            name="viewRights"
            value={formData.viewRights}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="public">Anyone can see and post in your capsule.</option>
            <option value="onlyMe">You can grant access to users.</option>
            <option value="specificPeople">Users can ask for access</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="locked"
            checked={formData.locked}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700 font-semibold">Locked</label>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Locked Until</label>
          <input
            type="datetime-local"
            name="lockedUntil"
            value={formData.lockedUntil}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={createCapsuleMutation.isLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ${
              createCapsuleMutation.isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Capsule"}
          </button>
        </div>
      </form>
    </div>
  );
};
