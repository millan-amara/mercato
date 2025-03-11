import { Link } from "react-router-dom";
import { FaDollarSign, FaPlus, FaUserLarge } from "react-icons/fa6";
import { FaThList } from "react-icons/fa";
import { PlusCircle, PlusSquare } from "lucide-react";

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

      <Link to="/makepay" className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <FaDollarSign className="text-xl" />
        <span className="text-xs">Pay</span>
      </Link>

      <Link to={`/user/profile/${user._id}`} className="flex flex-col items-center text-gray-700 hover:text-fuchsia-700">
        <FaUserLarge className="text-xl" />
        <span className="text-xs">Profile</span>
      </Link>
    </div>
  );
};

export default BottomNavbar;
