import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Menu = ({ open }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute top-24 w-full transform -translate-x-1/2 z-20 md:hidden bg-blue-700 shadow-lg rounded-3xl"
        >
          <div className="py-6 text-center text-white font-medium">
            <ul className="flex flex-col gap-6">
              <li>
                <Link
                  to="/login"
                  className="hover:text-gray-300 transition "
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-gray-300 transition"
                >
                  Join Now
                </Link>
              </li>
          
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
