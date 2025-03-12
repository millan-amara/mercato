import React from 'react'
import { FaWhatsapp } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLocation } from 'react-router-dom'


function Success() {
  const location = useLocation();
  const phoneNumber = location.state?.phone;

  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <div className="flex justify-center pb-16 h-1/6 items-center pt-12">
        {/* <img src={Logo} alt="" className='w-2/3 md:w-1/3 lg:w-1/4 xl:w-1/5' /> */}
      </div>
      
      <div className='flex flex-col items-center h-1/2 justify-center bg-white px-4'>
        <div className='flex flex-col items-center justify-center'>
            <p className='text-2xl mb-8 font-semibold'>Important</p>
            <p className='mb-8'>Once you agree on a price with the seller, come back and pay here on the platform.</p>
            <p className='text-xs'>Don't send money directly to the seller.</p>
            
        </div>
        <div className='mt-4'>
            <a href={`https://wa.me/+${phoneNumber}`} className='flex justify-center items-center text-white font-bold bg-green-600 px-3 py-1 rounded-md'>
                <FaWhatsapp />
                <span className='ml-1'>Continue to chat</span>

            </a>
        </div>

      </div>
      
      <div class="flex justify-center items-end h-1/4">
        <p>&copy; Peskaya 2025. All rights reserved</p>
      </div>
      
    </div>
  )
}

export default Success