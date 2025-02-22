import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import Verification from './pages/Verification'
import Dashboard from './pages/Dashboard'
import MainBody from './components/Dashboard/MainBody'
import Unauthorized from './pages/Unauthorized'
import { useRecoilValue } from 'recoil'
import { authState } from './atoms/authAtom'
import CheckAuthStatus from './components/helper/CheckAuthStatus'
import Logout from './components/helper/Logout'
import {CreateTimeCapsule} from './components/Dashboard/CreateTimeCapsule'
import {ProfileView} from './components/Dashboard/ProfileView'
// Protected route component
const Protected = ({ children, isPublic = false }) => {
  const auth = useRecoilValue(authState);

  // Public route logic
  if (isPublic && auth.isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // Private route logic
  if (!isPublic && !auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
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

        {/* Protected Dashboard Route with Nested Routes */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>}>
          <Route path="" element={<MainBody />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="create-capsule" element={<CreateTimeCapsule/>} />

        </Route>
        
        <Route path="/logout" element={<Protected><Logout /></Protected>} />

        {/* Unauthorized Route */}
        <Route path="/unauth" element={<Unauthorized />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/unauth" />} />
      </Routes>
    </>
  )
}

export default App
