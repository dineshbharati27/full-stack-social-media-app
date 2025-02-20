import { Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between md:hidden">
      {/* ✅ Logo */}
      <Link to="/home" className="text-xl font-bold text-gray-900">
        Vibesta
      </Link>

      {/* ✅ Icons (Right Side) */}
      <div className="flex items-center space-x-4">
        <Link to="/home/notifications">
          <Bell className="h-6 w-6 text-gray-700 cursor-pointer" />
        </Link>
        <Link to="/chat">
          <MessageCircle className="h-6 w-6 text-gray-700 cursor-pointer" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
