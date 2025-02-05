import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserLarge, FaDollarSign, FaPowerOff } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';


function Navbar() {

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user)
  }, [])

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }


  return (
    <div className="navbar flex justify-between items-center px-6 py-4">
        <Link to='/' className='brand text-3xl font-semibold text-fuchsia-700'>peskaya</Link>

        <div>
            <Link to="/posts" className='hover:underline font-semibold'>Posts</Link>
        </div>

        {user ? (
          <div className='flex items-center px-2 py-1'>
            <Link to='/makepay' className='flex justify-center items-center mr-2 bg-black hover:bg-slate-600 font-semibold text-white text-xs px-3 py-1 rounded-sm border-none'>
              <FaDollarSign />
              <span>Pay</span>
            </Link>
            <Link to={`/user/profile/${user._id}`} className='mr-2 hover:bg-fuchsia-300 px-2 py-2 rounded-full'>
              <FaUserLarge className='text-fuchsia-700' />
            </Link>
            <button onClick={onLogout} className='hover:bg-fuchsia-300 px-2 py-2 rounded-full'>
              <FaPowerOff className='text-fuchsia-700' />
            </button>
            
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