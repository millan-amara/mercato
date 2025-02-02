import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserLarge, FaDollarSign } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { MdMail } from 'react-icons/md';


function Navbar() {

  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(user)
  }, [])


  return (
    <div className="navbar flex justify-between items-center px-6 py-4">
        <Link to='/' className='brand text-2xl font-semibold text-fuchsia-700'>Shiftshop</Link>

        <div>
            <Link to="/posts" className='hover:underline font-semibold'>Posts</Link>
        </div>

        {user ? (
          <div className='flex items-center px-2 py-1'>
            <Link to='/makepay' className='flex justify-center items-center mr-4 bg-black font-semibold text-white text-xs px-3 py-1 rounded-sm border-none'>
              <FaDollarSign />
              <span>Pay</span>
            </Link>
            <Link to={`/user/profile/${user._id}`}>
              <FaUserLarge className='text-fuchsia-700' />
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/login" className="bg-fuchsia-900 font-semibold text-white text-xs px-3 py-1 rounded-md border-none">
              Log in
            </Link>
            <Link to="/register" className="text-fuchsia-900 ml-3 font-semibold border-slate-100 border-2 px-3 py-1 text-xs rounded-md">
              Sign up
            </Link>
          </div>
        )}  

    </div>
  )
}

export default Navbar