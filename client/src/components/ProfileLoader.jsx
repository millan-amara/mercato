import React from 'react'
import { FaUserLarge } from 'react-icons/fa6';

function ProfileLoader() {
  return (
    <>
        <div className='relative flex flex-col items-center'>
            <div className="w-20 h-20 animate-pulse rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                <FaUserLarge className='text-3xl' />
            </div>

            <p className='mt-2 font-medium text-xl animate-pulse rounded-md bg-slate-300 text-slate-300'>peskaya</p>
            <p className='mb-1 animate-pulse rounded-md bg-slate-300 text-slate-300 mt-3'>www.peskaya.com</p>
            <div className='flex animate-pulse mt-4'>
                <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
                <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
                <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
                <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
                <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>

            </div>
        </div> 
        <div></div>
        <div className='mt-6 mb-2 flex justify-center items-center py-2 animate-pulse'>
            
            <button className="mr-4 px-2 py-1">POSTS</button>
            <button className="mr-4 px-2 py-1">BIDS</button>
            <button className="mr-4 px-2 py-1">REVIEWS</button>
            <button className="mr-4 px-2 py-1">EDIT PROFILE</button>   
        </div>
        
    </>
  )
}

export default ProfileLoader;