import React from 'react'
import { Link } from 'react-router-dom';
import { FaUserLarge } from 'react-icons/fa6';
import Rating from '@mui/material/Rating';

function TopProfile({ handleTabChange,activeTab,loggedInUser,onLogout }) {
  return (
    <>
        <div className='relative flex flex-col items-center'>
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                <FaUserLarge className='text-3xl' />
            </div>

            <p className='mt-2 font-medium text-xl'>{loggedInUser.fname}</p>
            <a href={`${loggedInUser.website}`} className='mb-1 text-lime-600'>{loggedInUser.website}</a>
            <div className='flex'>
                <Rating name="read-only" value={3} size='small' readOnly />
                <span className='ml-2 text-sm'>500 Orders</span>
            </div>
        </div> 
        <div></div>
        <div className='mt-6 mb-2 flex md:flex-col justify-center items-center py-2'>
            <button 
            onClick={() => handleTabChange('posts')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'posts' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >POSTS</button>
            <button 
            onClick={() => handleTabChange('bids')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'bids' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >BIDS</button>
            <button 
            onClick={() => handleTabChange('reviews')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'reviews' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >REVIEWS</button>
            <button 
            onClick={() => handleTabChange('editProfile')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'editProfile' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >EDIT PROFILE</button>
      
            <Link 
                to={`/user/profile/${loggedInUser._id}/earnings`}
                className={`mr-4 px-2 py-1`}
                >EARNINGS
            </Link>
            </div>
        
        <div className='flex justify-center mt-8'>
            <button onClick={onLogout} className='bg-red-600 text-sm w-1/2 text-white rounded-sm py-1 md:w-1/2'>
                Log out!
            </button>
        </div>

    </>
  )
}

export default TopProfile