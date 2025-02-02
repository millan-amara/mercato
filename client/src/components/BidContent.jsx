import React from 'react'
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { MdMail, MdVerified } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa6';


function BidContent({ bid, onBookmarkBid }) {
  
  return (
    <div className=''>
      {!bid ? (
        <p>No bids yet</p>
      ) : (
        <div>
          <div className='border-b-2 mb-8 pb-4 flex justify-between items-center'>
            <div className=''>
              <div className='flex items-center mb-2'>
                <Link to={`/user/profile/${bid.author._id}`} className='mr-2 font-semibold text-lg underline'>{bid.author.fname}</Link>
                <MdVerified />
              </div>

              <p className='text-sm'>{bid.author.reviews.length} orders</p>
              <Rating name="read-only" value={3} size='small' readOnly />
              
            </div>
            <div className='flex font-semibold'>
              <button onClick={onBookmarkBid} className='mr-2 border-2 py-2 px-2 rounded-md hover:text-xl'>
                <FaRegBookmark className='' />
              </button>
              <Link to='/success' type='button' className='bg-fuchsia-900 text-white hover:bg-fuchsia-800 flex items-center px-2 rounded-md py-1 text-sm'>
                <MdMail />
                <span className='pl-1'>
                  Message
                </span>
              </Link>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: bid && bid.text }}
            className=''
        ></div>

        </div>
      )}
    </div>
  )
}

export default BidContent