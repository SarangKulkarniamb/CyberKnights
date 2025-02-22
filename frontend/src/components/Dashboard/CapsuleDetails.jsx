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
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <Toaster />
      <h2 className="text-4xl font-bold text-blue-700 text-center mb-8">
        {capsule.CapsuleName}
      </h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-3xl">
        <img
          src={capsule.banner}
          alt={capsule.CapsuleName}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => (e.target.src = "https://via.placeholder.com/800x300")}
        />
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-lg leading-relaxed">{capsule.Description}</p>

          {/* Author Section */}
          {author_profile && (
            <div className="mt-6 flex items-center space-x-4 border-t pt-4">
              <img
                src={author_profile.profilePic}
                alt={author_profile.name}
                className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-blue-500"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-blue-700">{author_profile.displayName}</p>
                <p className="text-gray-500 text-sm">Capsule Creator</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
