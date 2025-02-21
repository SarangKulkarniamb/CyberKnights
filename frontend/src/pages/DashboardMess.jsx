import { useRecoilValue } from 'recoil'
import { authState } from '../atoms/authAtom'
import { Link } from 'react-router-dom'

const DashboardMess = () => {
  const auth = useRecoilValue(authState) // Getting auth state

  return (
    <div>
      <h1>Welcome, {auth.user?.username}</h1> 
       
      <Link to="/logout"> <button className='border border-black p-2' >LOGOUT</button> </Link>
      
      {/* Dashboard content */}
    </div>
  )
}

export default DashboardMess