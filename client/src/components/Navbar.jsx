// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaBars, FaUserLarge, FaDollarSign, FaPowerOff, FaMoneyBill, FaMoneyCheck, FaList, FaWhatsapp, FaHouse } from "react-icons/fa6";
// import { useNavigate } from 'react-router-dom';
// import { logout, reset } from '../features/auth/authSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { FaEdit, FaExternalLinkAlt, FaPiggyBank, FaTimes } from 'react-icons/fa';


// function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const onLogout = () => {
//     dispatch(logout());
//     dispatch(reset());
//     navigate('/landing');
//   };

//   if (!user) return null;

//   return (
//     <nav className="flex justify-between items-center px-2 md:px-6 py-4">
//         <Link to='/' className='text-xl md:text-3xl'>
//             <span>PES<span className='text-fuchsia-700 font-bold text-3xl md:text-6xl'>K</span>AYA</span>
//         </Link>

//         <button 
//           onClick={() => setIsOpen(!isOpen)}
//           className="md:hidden text-3xl focus:outline-none"
//         >
//           {isOpen ? <FaTimes /> : <FaBars />}
//         </button>
//         {user.business &&
//         <div className='hidden md:flex'>
//           <Link to={`/posthouse`} className='hover:underline font-semibold mr-4'>Post House</Link>
//           <Link to={`/postad`} className='hover:underline font-semibold'>Post Product</Link>
//         </div>}
//         <div className='hidden md:flex'>
//           <Link to={`/explore`} className='hover:underline font-semibold mr-4'>Explore</Link>
//           <Link to={`/shop`} className='hover:underline font-semibold'>Shop</Link>
//         </div>
        
//         <div className='hidden md:flex items-center'>
//           <div className='flex items-center py-1'>
//             {user.business && (
//               <>
//                 <div className='mr-4'>
//                   <Link to={`/user/profile/${user._id}/ads`} className='hover:underline font-semibold'>My Ads</Link>
//                 </div>
//                 <div className='mr-4'>
//                   <Link to="/posts" className='hover:underline font-semibold'>Requests</Link>
//                 </div>
//               </>
//             )}
//             <div>
//               <Link to={`/user/profile/${user._id}/transactions`} className='hover:underline font-semibold'>Transactions</Link>
//             </div>
//             {/* <Link to='/makepay' className='flex justify-center items-center ml-5 mr-2 bg-black hover:bg-slate-600 font-semibold text-white text-xs px-3 py-1 rounded-sm border-none'>
//               <FaDollarSign />
//               <span>Pay</span>
//             </Link> */}
//             <Link to={`/user/profile/${user._id}`} className='md:mr-2 md:ml-3 hover:bg-fuchsia-300 px-2 py-2 rounded-full'>
//               <FaUserLarge className='text-fuchsia-700' />
//             </Link>
//             <button onClick={onLogout} className='hover:bg-fuchsia-300 px-2 py-2 rounded-full'>
//               <FaPowerOff className='text-fuchsia-700' />
//             </button>
            
//           </div>
//         </div>


//       <div 
//         className={`fixed top-0 right-0 h-screen z-50 w-3/4 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } md:hidden`}
//       >

//         <button 
//           onClick={() => setIsOpen(false)} 
//           className="absolute top-4 right-4 text-3xl"
//         >
//           <FaTimes />
//         </button>


//         <div className="flex flex-col mx-auto p-6 mt-10 text-sm">
//           <Link to={`/user/profile/${user._id}/transactions`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md border'>
//             <div className='flex w-1/2 items-center'>
//               <FaMoneyCheck className='text-fuchsia-700 inline-block mr-2' />
//               <span>Transactions</span>
//             </div>

//           </Link>
//           {user.business && (
//             <>
//               <Link to={`/user/profile/${user._id}/earnings`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
//                 <div className='flex w-1/2 items-center'>
//                   <FaDollarSign className='text-fuchsia-700 inline-block mr-2' />
//                   My Money
//                 </div>
//               </Link>
//               <Link to={`/postad`} className='flex items-center justify-center bg-black text-white hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2'>
//                 <div className='flex w-1/2 items-center'>
//                   <FaEdit className='inline-block mr-2' />
//                   Post Ad
//                 </div>
//               </Link>
//               <Link to={`/posthouse`} className='flex items-center justify-center bg-black text-white hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2'>
//                 <div className='flex w-1/2 items-center'>
//                   <FaHouse className='inline-block mr-2' />
//                   Post House
//                 </div>
//               </Link>
//               <Link to={`/user/profile/${user._id}/payment-info`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
//                 <div className='flex w-1/2 items-center'>
//                   <FaPiggyBank className='text-fuchsia-700 inline-block mr-2' />
//                   Payment Info
//                 </div>
//               </Link>
//               <Link to={`/user/profile/${user._id}/ads`} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
//                 <div className='flex w-1/2 items-center'>
//                   <FaList className='text-fuchsia-700 inline-block mr-2' />
//                   My Ads
//                 </div>
//               </Link>
//             </>
//           )}

//           <button onClick={onLogout} className='flex items-center justify-center hover:bg-fuchsia-300 py-2 rounded-md mt-2 mb-2 border'>
//             <div className='flex w-1/2 items-center'>
//               <FaPowerOff className='text-fuchsia-700 inline-block mr-2' />
//               Logout
//             </div>
//           </button>
//         </div>

//         {/* Contact Support section */}
//         <div className="absolute bottom-24 left-0 w-full text-center text-sm text-slate-600 px-4">
//           <div className="mb-1 font-semibold text-black">Contact Support</div>
//           <div className="mb-1">
//             <a href={`https://wa.me/+254700487751`} className="font-medium flex justify-center items-center">
//               <span className='text-green-700 mr-1'>Chat on WhatsApp</span>
//               <FaExternalLinkAlt />
//             </a>
//           </div>
//           <div>
//             <span className="font-medium">Email:</span> <span className="">support@peskaya.com</span>
//           </div>
//         </div>

//       </div>



//       {isOpen && (
//         <div 
//           className="fixed top-0 left-0 w-full h-screen bg-black opacity-50 z-40 md:hidden"
//           onClick={() => setIsOpen(false)}
//         ></div>
//       )}
//     </nav>
//   )
// }

// export default Navbar

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import {
  FaBars, FaUserLarge, FaPowerOff, FaHouse,
  FaDollarSign, FaList, FaMoneyCheck, FaWhatsapp
} from 'react-icons/fa6';
import { FaEdit, FaExternalLinkAlt, FaPiggyBank, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/landing');
  };

  if (!user) return null;

  return (
    <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-white shadow-sm border-b">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide" style={{ fontFamily: `'Playfair Display', serif` }}>
        PES<span className="text-fuchsia-700 text-4xl font-extrabold">K</span>AYA
      </Link>

      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-3xl text-fuchsia-700"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-6 items-center text-sm font-medium">
        <Link to="/" className="hover:text-fuchsia-700 transition">Explore</Link>
        {/* <Link to="/shop" className="hover:text-fuchsia-700 transition">Shop</Link> */}
        <Link to={`/${user._id}/coins/recharge`} className="bg-slate-800 text-white hover:text-fuchsia-500 transition px-2 py-1 rounded-md">Coins: {user.coins || 0}</Link>

        {user.business && (
          <>
            <Link to="/posthouse" className="hover:text-fuchsia-700 transition">Post House</Link>
            <Link to="/postad" className="hover:text-fuchsia-700 transition">Post Product</Link>
            <Link to={`/user/profile/${user._id}/ads`} className="hover:text-fuchsia-700 transition">My Ads</Link>
            <Link to="/posts" className="hover:text-fuchsia-700 transition">Requests</Link>
          </>
        )}

        <Link to={`/user/profile/${user._id}/transactions`} className="hover:text-fuchsia-700 transition">Transactions</Link>

        <Link to={`/user/profile/${user._id}`} className="hover:bg-fuchsia-100 p-2 rounded-full transition">
          <FaUserLarge className="text-fuchsia-700" />
        </Link>
        <button onClick={onLogout} className="hover:bg-fuchsia-100 p-2 rounded-full transition">
          <FaPowerOff className="text-fuchsia-700" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-2xl"
        >
          <FaTimes />
        </button>

        <div className="flex flex-col mt-16 px-6 space-y-4 text-sm">
          <LinkItem icon={<FaMoneyCheck />} label="Transactions" to={`/user/profile/${user._id}/transactions`} />
          <LinkItem icon={<FaPiggyBank />} label={`Coins: ${user.coins || 0}`} filled to={`/${user._id}/coins/recharge`} />
    
          {user.business && (
            <>
              <LinkItem icon={<FaDollarSign />} label="My Money" to={`/user/profile/${user._id}/earnings`} />
              <LinkItem icon={<FaEdit />} label="Post Ad" to="/postad" filled />
              <LinkItem icon={<FaHouse />} label="Post House" to="/posthouse" filled />
              <LinkItem icon={<FaPiggyBank />} label="Payment Info" to={`/user/profile/${user._id}/payment-info`} />
              <LinkItem icon={<FaList />} label="My Ads" to={`/user/profile/${user._id}/ads`} />
            </>
          )}
          <button
            onClick={onLogout}
            className="flex items-center justify-start px-4 py-2 border rounded-md hover:bg-fuchsia-100 transition"
          >
            <FaPowerOff className="text-fuchsia-700 mr-3" />
            Logout
          </button>
        </div>

        {/* Contact */}
        <div className="absolute flex flex-col items-center bottom-24 px-6 text-sm text-gray-600">
          <div className="font-semibold text-black mb-1">Contact Support</div>
          <a href="https://wa.me/+254700487751" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:underline">
            <FaWhatsapp className="text-green-600" />
            <span>Chat on WhatsApp</span>
          </a>
          <div>
            <span className="font-medium">Email:</span> support@peskaya.com
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed top-0 left-0 w-full h-full bg-black opacity-40 z-40"
        />
      )}
    </nav>
  );
}

function LinkItem({ icon, label, to, filled }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 rounded-md ${
        filled
          ? 'bg-black text-white hover:bg-fuchsia-700'
          : 'border hover:bg-fuchsia-100'
      } transition`}
    >
      <span className="text-fuchsia-700 mr-3">{icon}</span>
      {label}
    </Link>
  );
}

export default Navbar;
