import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserLarge, FaDollarSign, FaPowerOff } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }


  return (
    <nav className="flex justify-between items-center px-2 md:px-6 py-4 bg-white shadow-md">
        <Link to='/create' className='text-3xl'>
            <span>PES<span className='text-fuchsia-700 font-bold text-6xl'>K</span>AYA</span>
        </Link>

        {/* Hamburger Button - Visible on Small Screens */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center'>
          {user ? (
            <div className='flex items-center py-1'>
              <div>
                <Link to="/posts" className='hover:underline font-semibold'>Posts</Link>
              </div>
              <Link to='/makepay' className='flex justify-center items-center ml-5 mr-2 bg-black hover:bg-slate-600 font-semibold text-white text-xs px-3 py-1 rounded-sm border-none'>
                <FaDollarSign />
                <span>Pay</span>
              </Link>
              <Link to={`/user/profile/${user._id}`} className='md:mr-2 hover:bg-fuchsia-300 px-2 py-2 rounded-full'>
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

      {/* Full-height Right Drawer */}
      <div 
        className={`fixed top-0 right-0 h-screen z-50 w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 text-3xl"
        >
          <FaTimes />
        </button>

        {/* Menu Content */}
        <div className="flex flex-col p-6 mt-10">
          {user ? (
            <>
              <Link to="/posts" className="py-2 hover:bg-gray-200 text-lg font-semibold">Posts</Link>
              <Link to='/makepay' className='flex items-center justify-center bg-black hover:bg-slate-600 font-semibold text-white text-lg py-2 rounded-md my-2'>
                <FaDollarSign />
                <span className="ml-2">Pay</span>
              </Link>
              <Link to={`/user/profile/${user._id}`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md'>
                <FaUserLarge className='text-fuchsia-700 text-xl' />
                <span className="ml-2">Profile</span>
              </Link>
              <button onClick={onLogout} className='w-full text-lg hover:bg-fuchsia-300 py-2 rounded-md mt-2'>
                <FaPowerOff className='text-fuchsia-700 inline-block mr-2' />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-center bg-fuchsia-900 text-white font-semibold py-2 rounded-md my-2">
                Log in
              </Link>
              <Link to="/register" className="block text-center text-fuchsia-900 font-semibold border-slate-100 border-2 py-2 rounded-md">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay (click to close) */}
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

    </nav>
  )
}

export default Navbar