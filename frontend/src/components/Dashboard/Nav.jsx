import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {useSetRecoilState , useRecoilValue} from 'recoil'
import { profileState } from '../../atoms/profileAtom'
export function Nav() {

  const setProfileState = useSetRecoilState(profileState)
  const {profile} = useRecoilValue(profileState)
  
  return (
    <>
      {/* Navigation Bar */}
      <div className="w-full flex justify-between bg-white shadow-md py-4 px-10">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-4 items-center">
          {profile ? (
            <div className="flex gap-4 items-center">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold">{profile.displayName}</h1>
            </div>
          ) : (
            <p className="text-gray-600">No profile data</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Nav;