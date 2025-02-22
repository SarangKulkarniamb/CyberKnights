import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function Nav() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_PROFILE_API_URL}/me`, { withCredentials: true });
      return response.data.profile; 
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="w-full flex justify-between bg-white shadow-md py-4 px-10">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex gap-4">
        <div className="flex gap-4">
          <img 
            src={profile?.profilePic} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover" 
          />
          <h1 className="text-xl font-bold">{profile?.displayName}</h1>
        </div>
      </div>
    </div>
  );
}

export default Nav;
