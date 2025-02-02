import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { FaArrowAltCircleLeft, FaCheckCircle } from "react-icons/fa";
// import Logo from '../assets/images/LOGO.png'


function Success() {

  return (
    <div className='flex flex-col h-screen justify-between'>
        <Navbar />

      <div className='flex flex-col items-center justify-center bg-white px-4'>
        <div className='flex flex-col items-center justify-center'>
            <p className='mb-8 font-semibold'>
                <FaCheckCircle className='text-green-600 h-16 w-16' />
            </p>
            <p className='mb-8'>Success, and thanks.</p>
            <p className='text-xs'>We'll let the buyer know that you paid.</p>
            
        </div>
        <div className='mt-4'>
            <Link to="/" className='flex justify-center items-center text-fuchsia-600 font-bold underline px-3 py-1'>
                <FaArrowAltCircleLeft />
                <span className='ml-1'>Go back home</span>

            </Link>
        </div>

      </div>
      
      <div class="flex justify-center items-end">
        <p>&copy; Marketplace 2025. All rights reserved</p>
      </div>
      
    </div>
  )
}

export default Success