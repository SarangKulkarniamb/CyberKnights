import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/authAtom";
import DashboardGrid from "./contents"; 
import { profileState } from "../../atoms/profileAtom";
import { useNavigate } from "react-router-dom";
export function MainBody() {
  const navigate = useNavigate();
  const userProfile = useRecoilValue(profileState);
  if(userProfile.profile === null){
    console.log("User Profile is null")
    navigate("profile")
  }
  console.log("User Profile:", userProfile.profile);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome, {userProfile.profile?.displayName}</h1> 
      <DashboardGrid />
    </div>
  );
}

export default MainBody;
