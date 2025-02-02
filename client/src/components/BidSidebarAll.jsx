import React, { useEffect, useState } from 'react'
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import { MdKeyboardArrowRight } from "react-icons/md";


import { FaCircleUser } from 'react-icons/fa6'

function BidSidebarAll({ bids, bookmarkedBids, bidsIsLoading, activeBidId, onBidClick }) {

    const [activeTab, setActiveTab] = useState('all');

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

  return (
        <ul className=''>
            <div className='flex justify-between mb-2'>
                <button 
                    onClick={() => handleTabChange('all')}  
                    className={`py-2 border-r-2 w-1/2 ${activeTab === 'all' ? 'bg-fuchsia-700 text-white' : 'bg-fuchsia-50'}`}>
                        All Bids
                </button>
                <button 
                    onClick={() => handleTabChange('bookmarked')}  
                    className={`py-2 w-1/2 ${activeTab === 'bookmarked' ? 'bg-fuchsia-700 text-white' : 'bg-fuchsia-50'}`}>
                        Saved Bids
                </button>
            </div>
            {activeTab === 'all' && (
                <>
            {bids.map((bid) => (
                <li 
                    className={`mb-4 py-4 px-4 cursor-pointer ${
                        activeBidId === bid._id && 'bg-slate-200'
                    }`}
                    key={bid._id}
                    onClick={() => onBidClick(bid._id)}
                >
                    {bidsIsLoading === true ? (
                        <Skeleton variant="rectangular" width={210} height={118} />
                    ) : (
                        <div className='flex justify-between'>
                            <div>
                                <div className='flex items-center mb-2'>
                                    <FaCircleUser />
                                    <p className='ml-2'>{bid.author.fname}</p>
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: bid && bid.text.substring(0, 100) }}
                                    className='text-sm mb-1'
                                ></div>
                                <div>
                                    <Rating name="read-only" value={3} readOnly size='small' />
                                </div>
                            </div>
                            <div className='flex items-center pl-2'>
                                <MdKeyboardArrowRight />
                            </div>
                        </div>
                    )}
                </li>
            ))}
            </>
            )}

            {activeTab === 'bookmarked' && (
            <>
            {bookmarkedBids.map((bid) => (
                <li 
                    className={`mb-4 py-4 px-4 cursor-pointer ${
                        activeBidId === bid._id && 'bg-slate-200'
                    }`}
                    key={bid._id}
                    onClick={() => onBidClick(bid._id)}
                >
                    {bidsIsLoading === true ? (
                        <Skeleton variant="rectangular" width={210} height={118} />
                    ) : (
                        <div className='flex justify-between'>
                            <div>
                                <div className='flex items-center mb-2'>
                                    <FaCircleUser />
                                    <p className='ml-2'>{bid.author.fname}</p>
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: bid && bid.text.substring(0, 100) }}
                                    className='text-sm mb-1'
                                ></div>
                                <div>
                                    <Rating name="read-only" value={3} readOnly size='small' />
                                </div>
                            </div>
                            <div className='flex items-center pl-2'>
                                <MdKeyboardArrowRight />
                            </div>
                        </div>
                    )}
                </li>
            ))}
            </>
            )}
        </ul>
  )
}

export default BidSidebarAll