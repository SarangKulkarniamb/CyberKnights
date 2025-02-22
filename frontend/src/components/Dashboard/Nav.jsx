import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function Nav() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_PROFILE_API_URL}/me`,
        { withCredentials: true }
      );
      return response.data.profile;
    },
  });

  return (
    <>
      {/* Navigation Bar */}
      <div className="w-full flex justify-between bg-white shadow-md py-4 px-10">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-500">Error loading profile</p>
          ) : profile ? (
            <div className="flex gap-4 items-center">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold">{profile.displayName}</h1>
            </div>
          ) : (
            <p className="text-gray-600">No profile data</p>
          )}
        </div>
      </div>

      {/* Profile Warning Banner (Only shown if profile is missing) */}
      {!isLoading && !error && !profile && (
        <div className="w-full bg-yellow-500 text-black text-center py-2 font-semibold">
          <p>You haven't set up your profile yet. Please add your profile information.</p>
        </div>
      )}
    </>
  );
}

export default Nav;