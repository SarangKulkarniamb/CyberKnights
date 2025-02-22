import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRecoilState } from "recoil";
import { profileState } from "../../atoms/profileAtom";

export function Nav() {
  const [profile, setProfile] = useRecoilState(profileState);

  const { data, isLoading, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_PROFILE_API_URL}/me`, { withCredentials: true });
      return response.data.profile; // Ensure we return the profile object
    },
    onSuccess: (data) => {
      setProfile(data); // Store in Recoil
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div className="w-full flex justify-around bg-white shadow-md p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex gap-4">
        <div className="flex gap-4">
          <img src={profile?.profilePic} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          <h1 className="text-xl font-bold">{profile?.displayName}</h1>
        </div>
      </div>
    </div>
  );
}

export default Nav;
