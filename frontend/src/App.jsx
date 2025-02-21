import { Routes, Route, Navigate } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Loginpage from './pages/Loginpage'
import Registerpage from './pages/Registerpage'
import Verification from './pages/Verification'
import DashboardMess from './pages/DashboardMess'
import DashboardStudent from './pages/DashboardStudent'
import Unauthorized from './pages/Unauthorized'
import { useRecoilValue } from 'recoil'
import { authState } from './atoms/authAtom'
import CheckAuthStatus from './components/helper/CheckAuthStatus'
import Logout from './components/helper/Logout'
import StudentProfileForm from './components/DashboardStudent/StudentProfileForm'
import MainBody from './components/DashboardStudent/MainBody'
// Protected route component
const Protected = ({ children, allowedRoles, isPublic = false }) => {
  const auth = useRecoilValue(authState);

  // Public route logic
  if (isPublic && auth.isAuthenticated) {
    if (auth.user.role.toLowerCase() === 'student') {
      return <Navigate to="/student/dashboard" />;
    }
    if (auth.user.role.toLowerCase() === 'mess') {
      return <Navigate to="/mess/dashboard" />;
    }
  }

  // Private route logic
  if (!isPublic && !auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Unauthorized route logic
  if (allowedRoles && !allowedRoles.includes(auth.user.role.toLowerCase())) {
    return <Navigate to="/unauth" replace />;
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

        {/* Protected Routes */}
        <Route path="/student/dashboard" element={<Protected allowedRoles={['student']}><DashboardStudent /></Protected>}>
          <Route path="profile" element={<Protected allowedRoles={['student']}><StudentProfileForm /></Protected>} />
          <Route path="" element={<Protected allowedRoles={['student']}><MainBody /></Protected>} />
        </Route>
        <Route path="/mess/dashboard" element={<Protected allowedRoles={['mess']}><DashboardMess /></Protected>} />
        <Route path="/logout" element = { <Protected><Logout/></Protected> }></Route>

        {/* Unauthorized Route */}
        <Route path="/unauth" element={<Unauthorized />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/unauth" />} />
      </Routes>
    </>
  )
}

export default App
