import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Verification from './pages/Verification';
import Dashboard from './pages/Dashboard';
import MainBody from './components/Dashboard/MainBody';
import Unauthorized from './pages/Unauthorized';
import CheckAuthStatus from './components/helper/CheckAuthStatus';
import Logout from './components/helper/Logout';
import { CreateTimeCapsule } from './components/Dashboard/CreateTimeCapsule';
import { ProfileView } from './components/Dashboard/ProfileView';
import { ExploreCapsules } from './components/Dashboard/ExploreCapsules';
import { CapsuleDetails } from './components/Dashboard/CapsuleDetails';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from './atoms/authAtom';
import { profileState } from './atoms/profileAtom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


const Protected = ({ children, isPublic = false }) => {
  const auth = useRecoilValue(authState);


  if (isPublic && auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (!isPublic && !auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const RequireProfile = () => {
  const setProfileState = useSetRecoilState(profileState);
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_PROFILE_API_URL}/me`,
        { withCredentials: true }
      );
  
      setProfileState({
        isAvailable: true,
        profile: response.data.profile,
      });
      return response.data.profile;
    },
    staleTime: 1000 * 60 * 5, 
  });

  const userProfile = useRecoilValue(profileState);

  if (isLoading) return <p>Loading profile...</p>;
  

  return userProfile.profile ? <Outlet /> : <Navigate to="profile" replace />;
};

const App = () => {
  return (
    <>
      <CheckAuthStatus />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Protected isPublic={true}><Homepage /></Protected>} />
        <Route path="/login" element={<Protected isPublic={true}><Loginpage /></Protected>} />
        <Route path="/register" element={<Protected isPublic={true}><Registerpage /></Protected>} />
        <Route path="/verify" element={<Protected isPublic={true}><Verification /></Protected>} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>}>
          {/* Profile route is always accessible so the user can set/update their profile */}
          <Route path="profile" element={<ProfileView />} />
          {/* All other dashboard routes require a profile */}
          <Route element={<RequireProfile />}>
            <Route path="" element={<MainBody />} />
            <Route path="create-capsule" element={<CreateTimeCapsule />} />
            <Route path="explore-capsules" element={<ExploreCapsules />} />
            <Route path="capsule/:id" element={<CapsuleDetails />} />
          </Route>
        </Route>

        <Route path="/logout" element={<Protected><Logout /></Protected>} />

        {/* Unauthorized Route */}
        <Route path="/unauth" element={<Unauthorized />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/unauth" />} />
      </Routes>
    </>
  );
};

export default App;
