import { Link } from "react-router-dom";
import { FaPlusCircle, FaUsers, FaHistory, FaShareAlt } from "react-icons/fa";

const DashboardGrid = () => {
  const options = [
    { name: "Add Capsule", icon: <FaPlusCircle />, link: "/add-capsule" },
    { name: "Collaborate", icon: <FaUsers />, link: "/collaborate" },
    { name: "History", icon: <FaHistory />, link: "/history" },
    { name: "Share", icon: <FaShareAlt />, link: "/share" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
