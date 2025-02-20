import React from 'react';
import { Home, Search, Film, MessageCircle, PlusSquare, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <Home />, label: 'Feed', link: "" },
    { icon: <Search />, label: 'Search', link: "search" },
    { icon: <MessageCircle />, label: 'Messages', link: "/chat" },
    { icon: <PlusSquare />, label: 'Create', link: "create" },
    { icon: <Film />, label: 'My Blogs', link: "myblogs" },
    { icon: <User />, label: 'Profile', link: "profile" },  
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="fixed z-50 bottom-0 left-0 w-full flex flex-row justify-around bg-white md:bg-gray-50 p-3 md:p-5 shadow-md md:shadow-none md:static md:w-1/6 md:flex-col md:h-full md:justify-start">
      {/* Blog App title - Only visible on medium+ screens */}
      <h1 className="text-3xl font-bold pl-4 mb-8 hidden md:block">Vibesta</h1>

      {/* Menu Items */}
      <ul className="flex flex-row md:flex-col w-full justify-around md:justify-start">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.link}>
            <li className="flex flex-col md:flex-row items-center md:space-x-4 py-3 cursor-pointer hover:bg-gray-200 rounded-lg p-2">
              <div className="text-2xl">{item.icon}</div>
              <span className="text-sm md:text-lg hidden md:block">{item.label}</span> {/* Hidden on small screens */}
            </li>
          </Link>
        ))}
      </ul>

      {/* Logout Button */}
      <div onClick={handleLogout} className="flex flex-col md:flex-row items-center space-x-0 md:space-x-4 py-3 cursor-pointer hover:bg-gray-200 rounded-lg p-2">
        <div className="text-2xl hidden md:block"><LogOut/></div>
        <span className="text-sm md:text-lg hidden md:block">Logout</span> {/* Hidden on small screens */}
      </div>
    </div>
  
  );
};

export default Sidebar;