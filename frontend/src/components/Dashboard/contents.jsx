import { Link } from "react-router-dom";
import { FaPlusCircle, FaSearch ,  } from "react-icons/fa";
import {Settings} from "lucide-react"
const DashboardGrid = () => {
  const options = [
    { name: "Add Capsule", icon: <FaPlusCircle />, link: "create-capsule" },
    { name: "Explore Capsules", icon: <FaSearch />, link: "explore-capsules" },
    { name: "Manage Capsules", icon: < Settings />, link: "manage-capsules" },
  ];
  
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">

        {options.map((option, index) => (
          <Link
            to={option.link}
            key={index}
            className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition duration-300 shadow-md"
          >
            <div className="text-4xl text-blue-600">{option.icon}</div>
            <p className="mt-2 text-lg font-medium">{option.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;
