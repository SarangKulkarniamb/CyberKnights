import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const CapsuleDetails = () => {
  const { id } = useParams(); // Get the capsule ID from the URL

  const fetchCapsuleDetails = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_CAPSULE_API_URL}/${id}`,
        { withCredentials: true }
      );
      return data.capsule;
    } catch (error) {
      console.error("Error fetching capsule details:", error);
      toast.error("Failed to fetch capsule details");
      throw error;
    }
  };

  const { data: capsule, isLoading, isError } = useQuery({
    queryKey: ["capsule", id],
    queryFn: fetchCapsuleDetails,
  });

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError) return <p className="text-center mt-4">Failed to load capsule details.</p>;

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
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x300";
          }}
        />
        <div className="p-6">
          <p className="text-gray-600 text-lg">{capsule.Description}</p>
        </div>
      </div>
    </div>
  );
};