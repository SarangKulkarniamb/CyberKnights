import React from "react";
import { IoRestaurantSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import Menu from "./Menu";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  function toggleMenu() {
    setOpen(!open);
  }

  let rotate = open ? 180 : 0;

  return (
    <>
      <nav className="border-b-2 lg:px-40 border-gray-150">
        <div className="container flex justify-between items-center py-5">
          {/* Logo */}
          <Link to="/">
            <div className="text-2xl flex gap-2 items-center">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5566b5f4e4b01b9595a5f165/1433474027138-T9FRBKEZ51IYKIKSA5L1/Time-Capsule-Logo-Final.jpg?format=1000w"
                alt="TimeCapsule Logo"
                className="h-12 w-auto" // Adjust size as needed
              />
              <p className="font-medium tracking-tighter">Time Capsule</p>
            </div>
          </Link>

          {/* Links */}
          <div className="flex gap-5 items-center">
            {/* Mobile Menu */}
            <div className="md:hidden">
              <motion.div
                animate={{ rotate: rotate }}
                transition={{ duration: 0.4 }}
              >
                <button onClick={toggleMenu}>
                  <FiMenu />
                </button>
              </motion.div>
            </div>

            {/* Desktop Links */}
            <motion.div
              className="hidden md:flex gap-4 items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8 }}
            >
              <Link to="/login">
                <button className="flex items-center justify-center text-sm bg-white text-black p-5 h-8 w-24 rounded-xl border">
                  <p>Login</p>
                </button>
              </Link>
            </motion.div>
            <motion.div
              className="hidden md:flex gap-4 items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.8 }}
            >
              <Link to="/register">
                <button className="flex items-center justify-center text-sm bg-blue-950 text-white p-5 h-8 w-34 rounded-xl font-medium">
                  <p>Register</p>
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </nav>

      {/* Menu */}
      <Menu open={open} />
    </>
  );
};

export default Navbar;
