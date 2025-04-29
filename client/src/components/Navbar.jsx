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
            <Link to={`/user/profile/${user._id}/houses`} className="hover:text-fuchsia-700 transition">My Houses</Link>
            <Link to="/posts" className="hover:text-fuchsia-700 transition">Requests</Link>
          </>
        )}

        {/* <Link to={`/user/profile/${user._id}/houses`} className="hover:text-fuchsia-700 transition">My Houses</Link> UNCOMMENT AFTER AT VERIFICATION........................ */}
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
          {/* <LinkItem icon={<FaList />} label="My Houses" to={`/user/profile/${user._id}/houses`} /> UNCOMMENT AFTER AT VERIFICATION........................ */}
    
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
