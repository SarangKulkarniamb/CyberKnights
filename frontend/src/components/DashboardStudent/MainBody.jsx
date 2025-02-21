import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { authState } from '../../atoms/authAtom'


export function MainBody() {
    const auth = useRecoilValue(authState) 
      return (
        <div className="p-6">
          <h1>Welcome, {auth.user?.username}</h1> 
           <Link to="/logout"> <button className='border border-black p-2' >LOGOUT</button> </Link>
        </div>
      );
    }
      

    export default MainBody