import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const CreateTimeCapsule = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    media: [],
    unlockDate: "",
    accessType: "private",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, media: e.target.files }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Capsule created successfully!");
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <Toaster />
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Create a Time Capsule
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Description</label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Upload Images/Videos
          </label>
          <input
            type="file"
            name="media"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg cursor-pointer focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">Unlock Date</label>
          <input
            type="date"
            name="unlockDate"
            value={formData.unlockDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Who can access?
          </label>
          <select
            name="accessType"
            value={formData.accessType}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500"
          >
            <option value="private">Only Me</option>
            <option value="shared">Specific People</option>
            <option value="public">Anyone (after unlock)</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Capsule
          </button>
        </div>
      </form>
    </div>
  );
};

