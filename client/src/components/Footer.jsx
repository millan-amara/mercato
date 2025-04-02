import React from 'react';
import { Link } from 'react-router-dom';
import { FaTiktok } from "react-icons/fa";
import { FaMeta } from "react-icons/fa6";
import { useSelector } from 'react-redux';

function Footer() {
    const { user } = useSelector((state) => state.auth);

  return (
    <div id="footer" className="text-white px-5 md:px-0 pt-14 pb-24 text-sm bg-slate-800">
        <div className="flex flex-col md:flex-row justify-around mb-5">
            <div className="w-full md:w-1/4 md:flex md:flex-col md:justify-center md:items-center">
                <p className="text-lg mb-3">ABOUT</p>
                <p className="mb-5 text-base">Get the best deals on electronics, today!</p>
                {user ? (
                    <Link to="/explore" className="bg-fuchsia-600 hover:bg-fuchsia-700 py-2 px-4 rounded-md font-bold">Go to Search<i className="fa-solid fa-arrow-right ml-3"></i></Link>
                ) : (
                    <Link to="/register" className="bg-fuchsia-600 hover:bg-fuchsia-700 py-2 px-4 rounded-md font-bold">Sign Up<i className="fa-solid fa-arrow-right ml-3"></i></Link>
                )}
                
            </div>
            <div className="border-2 border-white hidden md:block">
                <p className=""></p>
            </div>
            <div className="mt-10">
                <p className="text-lg mb-3">Have Any Issues?</p>
                <p className="mb-1">Email: contact@peskaya.com</p>
                <p className="mb-1">Phone: +254700487751</p>
                <p className="mb-1 flex items-center"><FaTiktok /> <span className='ml-2'>peskaya</span></p>
                <p className="mb-1 flex items-center"><FaMeta /> <span className='ml-2'>peskaya</span></p>
            </div>
        </div>
        <div className="flex flex-col items-center text-xs">
            <div className='mb-2'>
                <a href="/privacy.html" className='underline'>Privacy Policy</a>
                <a href="/terms.html" className='mx-4 underline'>Terms of Use Policy</a>
                <a href="/about.html" className='underline'>About Peskaya</a>
            </div>
            <div>&copy; Peskaya 2025. All rights reserved</div>
        </div>
    </div>
  )
}

export default Footer