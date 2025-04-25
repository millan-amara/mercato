import { Link } from "react-router-dom";
import { FaThList } from "react-icons/fa";
import { UserRound, PlusSquare, ShoppingCartIcon, Telescope } from "lucide-react";
import { MdOutlineExplore } from "react-icons/md";

const BottomNavbar = ({ user }) => {
  if (!user) return null; // Hide if user isn't logged in

  return (
    <div className="fixed z-10 bottom-0 left-0 w-full bg-white shadow-md border-t flex justify-around items-center py-3 md:hidden">
      <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <PlusSquare className="text-xl" />
        <span className="text-xs">Find</span>
      </Link>

      {user.business && (
        <Link to="/posts" className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
          <FaThList className="text-xl" />
          <span className="text-xs">Requests</span>
        </Link>
      )}
      <Link to="/explore" className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <Telescope className="text-xl" />
        <span className="text-xs">Explore</span>
      </Link>
      <Link to="/shop" className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <ShoppingCartIcon className="text-xl" />
        <span className="text-xs">Shop</span>
      </Link>

      <Link to={`/user/profile/${user._id}`} className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <UserRound className="text-xl" />
        <span className="text-xs">Profile</span>
      </Link> 


    </div>
  );
};

export default BottomNavbar;
