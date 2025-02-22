import { useRecoilValue } from "recoil";
import { authState } from "../../atoms/authAtom";
import DashboardGrid from "./contents"; 

export function MainBody() {
  const auth = useRecoilValue(authState);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome, {auth.user?.username}</h1> 
      <DashboardGrid />
    </div>
  );
}

export default MainBody;
