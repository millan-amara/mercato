import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUserLarge, FaDollarSign, FaPowerOff, FaMoneyBill, FaMoneyCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';


function Navbar({ fixedNav }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  if (!user) return null;


  return (
    <nav className={`${
            fixedNav ? "fixed top-0 left-0 w-full" : ""
          } flex justify-between items-center px-2 md:px-6 py-4`}>
        <Link to='/' className='text-xl md:text-3xl'>
            <span>PES<span className='text-fuchsia-700 font-bold text-3xl md:text-6xl'>K</span>AYA</span>
        </Link>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>


        
        <div className='hidden md:flex items-center'>
          <div className='flex items-center py-1'>
            {user.business && (
              <div className='mr-4'>
                <Link to="/posts" className='hover:underline font-semibold'>Posts</Link>
              </div>
            )}
            <div>
              <Link to={`/user/profile/${user._id}/transactions`} className='hover:underline font-semibold'>Transactions</Link>
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
        </div>


      <div 
        className={`fixed top-0 right-0 h-screen z-50 w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >

        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-4 text-3xl"
        >
          <FaTimes />
        </button>


        <div className="flex flex-col mx-auto p-6 mt-10 text-sm">
          <Link to={`/user/profile/${user._id}/transactions`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md border'>
            <FaMoneyCheck className='text-fuchsia-700 inline-block mr-2' />
            <span>Transactions</span>
          </Link>
          {user.business && (
            <>
              <Link to={`/user/profile/${user._id}/earnings`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
                <FaDollarSign className='text-fuchsia-700 inline-block mr-2' />
                My Money
              </Link>
              <Link to={`/user/profile/${user._id}/coins`} className='bg-yellow-300 px-2 py-2 rounded-md text-center'>
                Coins: {user.coins}
              </Link>
              <Link to={`/user/profile/${user._id}/payment-info`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
                <FaDollarSign className='text-fuchsia-700 inline-block mr-2' />
                  Payment Info
              </Link>
            </>
          )}

          <button onClick={onLogout} className='hover:bg-fuchsia-300 py-2 rounded-md mt-2 border'>
            <FaPowerOff className='text-fuchsia-700 inline-block mr-2' />
            Logout
          </button>
        </div>
      </div>


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