import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export const CapsuleDetails = () => {
  const { id } = useParams(); // Get the capsule ID from the URL

  // Fetch capsule details and author profile
  const fetchCapsuleDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
        { withCredentials: true }
      );
      return data; // Return both capsule and author_profile
    } catch (error) {
      console.error("Error fetching capsule details:", error);
      toast.error("Failed to fetch capsule details");
      throw error;
    }
  };

  // UseQuery for capsule details and author profile
  const { data, isLoading, isError } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  });

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError) return <p className="text-center mt-4">Failed to load capsule details.</p>;

  const { capsule, author_profile } = data; // Destructure capsule and author_profile from the response

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
          onError={(e) => (e.target.src = "https://via.placeholder.com/800x300")}
        />
        <div className="p-6">
          <p className="text-gray-600 text-lg">{capsule.Description}</p>

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