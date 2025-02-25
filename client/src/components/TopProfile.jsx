import React from 'react'
import { Link } from 'react-router-dom';
import { FaUserLarge } from 'react-icons/fa6';
import Rating from '@mui/material/Rating';

function TopProfile({ handleTabChange,isOwner,activeTab,profileData,loggedInUser,onLogout }) {
  return (
    <div className='h-screen'>
        <div className='relative flex flex-col items-center'>
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                <FaUserLarge className='text-3xl' /> 
            </div>

            <p className='mt-3 font-medium text-xl'>{profileData.fname}</p>
            <a href={`${profileData.website}`} className='my-2 text-lime-600'>{profileData.website}</a>
            <div className='flex'>
                <Rating name="read-only" value={profileData.rating} size='small' readOnly />
                <span className='ml-2 text-sm'>{profileData.reviews} Review{profileData.reviews === 1 ? '' : 's'}</span>
            </div>
        </div> 
    
        <div className='mt-6 mb-2 flex justify-center py-2'>
        <div className='flex md:flex-col items-center md:items-start'>
            {isOwner &&
            <button 
            onClick={() => handleTabChange('posts')} 
            className={`mr-4 px-2 py-1 flex align-self-start ${activeTab === 'posts' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >POSTS</button>}
            {isOwner &&
            <button 
            onClick={() => handleTabChange('bids')} 
            className={`mr-4 px-2 py-1 flex justify-self-start ${activeTab === 'bids' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >BIDS</button>}
            <button 
            onClick={() => handleTabChange('reviews')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'reviews' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >REVIEWS</button>
            {isOwner &&
            <button 
            onClick={() => handleTabChange('editProfile')} 
            className={`mr-4 px-2 py-1 ${activeTab === 'editProfile' ? 'border-b-4 border-b-lime-600 text-lime-600 font-semibold' : ''}`}
            >EDIT PROFILE</button>}
            {isOwner &&
            <div className='hidden md:flex flex-col'>
                <Link 
                    to={`/user/profile/${loggedInUser._id}/earnings`}
                    className={`mr-4 px-2 py-1`}
                    >MY MONEY
                </Link>
                <Link to={`/user/profile/${loggedInUser._id}/coins`} className='bg-yellow-300 px-2 py-1 rounded-md flex justify-center'>
                    <span className='text-center'>Coins: {loggedInUser.coins}</span>
                </Link>
            </div>
            }
        </div>
        </div>

    </div>
  )
}

export default TopProfile