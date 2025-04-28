import { Link, useLocation } from "react-router-dom";
import { FaThList } from "react-icons/fa";
import { UserRound, PlusSquare, ShoppingCartIcon, Telescope } from "lucide-react";


const BottomNavbar = ({ user }) => {
  const location = useLocation();
  
  if (!user) return null; // Hide if user isn't logged in

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const activeClasses = "text-fuchsia-700";  // Highlight color
  const normalClasses = "text-gray-700 hover:text-fuchsia-700";

  return (
    <div className="fixed z-10 bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around items-center py-3 md:hidden">
      <Link to="/posthouse" className={`flex flex-col items-center ${isActive('/posthouse') ? activeClasses : normalClasses}`}>
        <PlusSquare className="text-xl" />
        <span className="text-xs">Post</span>
      </Link>

      {user.business && (
        <Link to="/posts" className={`flex flex-col items-center ${isActive('/posts') ? activeClasses : normalClasses}`}>
          <FaThList className="text-xl" />
          <span className="text-xs">Requests</span>
        </Link>
      )}

      <Link to="/" className={`flex flex-col items-center ${location.pathname === "/" ? activeClasses : normalClasses}`}>
        <Telescope className="text-xl" />
        <span className="text-xs">Explore</span>
      </Link>

      <Link to="/shop" className={`flex flex-col items-center ${isActive('/shop') ? activeClasses : normalClasses}`}>
        <ShoppingCartIcon className="text-xl" />
        <span className="text-xs">Shop</span>
      </Link>

      <Link to={`/user/profile/${user._id}`} className={`flex flex-col items-center ${isActive(`/user/profile/${user._id}`) ? activeClasses : normalClasses}`}>
        <UserRound className="text-xl" />
        <span className="text-xs">Profile</span>
      </Link> 
    </div>
  );
};

export default BottomNavbar;
