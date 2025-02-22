import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/authAtom";
import DashboardGrid from "./contents"; 
import { profileState } from "../../atoms/profileAtom";
export function MainBody() {
  const auth = useRecoilValue(authState);
  const userProfile = useRecoilValue(profileState);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome, {userProfile.profile?.displayName}</h1> 
      <DashboardGrid />
    </div>
  );
}

export default MainBody;
