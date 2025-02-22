import { useState } from "react";
import { Menu, User, Settings, Utensils ,Home } from "lucide-react";
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

      <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
          <Link to=""><Home size={20} /> {isOpen && "Home"}</Link>
        </button>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
          <Link to="profile"><User size={20} /> {isOpen && "Profile"}</Link>
        </button>
        <button>
          <Link to="create-capsule"><Utensils size={20} /> {isOpen && "Create Capsule"}</Link>
        </button>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-700">
          <Settings size={20} /> {isOpen && "Settings"}
        </button>
      </nav>
    </motion.div>
  );
}


export default Sidebar;