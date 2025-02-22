import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

export const CapsuleDetails = () => {
  const { id } = useParams(); 
  const [isRequesting, setIsRequesting] = useState(false);

  const fetchCapsuleDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
        { withCredentials: true }
      );
      return data; 
    } catch (error) {
      console.error("Error fetching capsule details:", error);
      toast.error("Failed to fetch capsule details");
      throw error;
    }
  };

  // Fetch capsule details and author profile
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  });

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError) return <p className="text-center mt-4">Failed to load capsule details.</p>;

  const { capsule, author_profile } = data; // Destructure capsule and author_profile

  // Function to request access
  const handleRequestAccess = async () => {
    if (capsule.viewRights === "public") {
      toast.error("This capsule is already public.");
      return;
    }
    if (capsule.viewRights === "onlyMe") {
      toast.error("This capsule is private.");
      return;
    }

    setIsRequesting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}/request-access`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      refetch(); // Refresh capsule details after request
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    }
    setIsRequesting(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-12">
        {capsule.CapsuleName}
      </h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <img
          src={capsule.banner}
          alt={capsule.CapsuleName}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <p className="text-gray-600 text-lg">{capsule.Description}</p>
          <p className="text-gray-600 text-lg">View Rights: {capsule.viewRights}</p>

          {/* Request Access Button */}
          {capsule.viewRights === "specificPeople" && (
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              onClick={handleRequestAccess}
              disabled={isRequesting}
            >
              {isRequesting ? "Requesting..." : "Request Access"}
            </button>
          )}

          {/* Author Section */}
          {author_profile && (
            <div className="mt-6 flex items-center space-x-4 border-t pt-4">
              <img
                src={author_profile.profilePic}
                alt={author_profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{author_profile.displayName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
