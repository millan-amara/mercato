import React from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { FaArrowAltCircleLeft, FaCheckCircle } from "react-icons/fa";



function Success() {
  const {user} = useSelector((state) => state.auth);

  return (
    <div className='flex flex-col h-[100dvh] justify-between'>
        <Navbar />

      <div className='flex flex-col items-center justify-center bg-white px-4'>
        <div className='flex flex-col items-center justify-center'>
            <p className='mb-8 font-semibold'>
                <FaCheckCircle className='text-green-600 h-16 w-16' />
            </p>
            <p className='mb-8'>Check the Mpesa prompt sent to your phone.</p>
            <p className='text-xs'>After paying, you can check the payment status under transactions.</p>
            
        </div>
        <div className='mt-4'>
            <Link to={`/user/profile/${user._id}/transactions`} className='flex justify-center items-center text-fuchsia-600 font-bold underline px-3 py-1'>
                <FaArrowAltCircleLeft />
                <span className='ml-1'>Go to Transactions</span>

            </Link>
        </div>

      </div>
      
      <div className="flex justify-center items-end">
        <p>&copy; Peskaya 2025. All rights reserved</p>
      </div>
      
    </div>
  )
}

export default Success