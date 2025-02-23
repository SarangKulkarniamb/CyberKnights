import { Menu, User, Settings, Home, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <motion.div
      initial={{ width: 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full bg-blue-950 text-white p-4 overflow-hidden"
    >
      <button onClick={toggleSidebar} className="mb-4">
        <Menu size={24} />
      </button>
      <nav className="flex flex-col space-y-4">
        <Link to="" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
          <Home size={20} /> {isOpen && "Home"}
        </Link>
        <Link to="profile" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
          <User size={20} /> {isOpen && "Profile"}
        </Link>
        

        {/* Logout Button */}
        <Link to="/logout" className="flex items-center gap-2 p-2 mt-auto rounded-lg hover:bg-red-600">
          <LogOut size={20} /> {isOpen && "Logout"}
        </Link>
      </nav>
    </motion.div>
  );
}

export default Sidebar;
