import React from 'react'
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { MdMail, MdVerified } from 'react-icons/md';
import { FaRegBookmark } from 'react-icons/fa6';
import { Navigation, Pagination, Scrollbar, A11y, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 


function BidContent({ bid, onBookmarkBid }) {
  
  return (
    <div className='pb-16'>
      {!bid ? (
        <p>No bids yet</p>
      ) : (
        <div>
          {/* <div className='border-b-2 mb-8 pb-4 flex justify-between items-center'>
            <div className=''>
              <div className='flex items-center mb-2'>
                <Link to={`/user/profile/${bid.author._id}`} className='mr-2 font-semibold text-lg underline'>{bid.author.fname}</Link>
                <MdVerified />
              </div>

              <p className='text-sm'>{bid.author.reviews.length} client{bid.author.reviews.length === 1 ? '' : 's'}</p>
              <Rating name="read-only" value={bid.author.rating} size='small' readOnly />
              
            </div>
            <div className='flex font-semibold'>
              <button onClick={onBookmarkBid} className='mr-2 border-2 py-2 px-2 rounded-md hover:text-xl'>
                <FaRegBookmark className='' />
              </button>
              <Link to='/success' state={{ phone: bid.author.phone }} type='button' className='bg-fuchsia-900 text-white hover:bg-fuchsia-800 flex items-center px-2 rounded-md py-1 text-sm'>
                <MdMail />
                <span className='pl-1'>
                  Message
                </span>
              </Link>
            </div>
          </div> */}

          <div className='flex justify-between mb-5'>
            <span className='bg-fuchsia-700 text-white px-2 py-1 text-sm rounded-md'>{bid.bedrooms}-Bedroom</span>
            <span className='text-fuchsia-500 font-bold text-xl'>KES {bid.price.toLocaleString()}</span>
          </div>

        {bid.imgs.length !== 0 &&
   <>
          <Swiper 
            modules={[EffectCoverflow,Navigation, Pagination, Scrollbar, A11y]}
            pagination={true}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className='w-full lg:w-3/4'
          >
            {bid.imgs.map((img, index) => (
              <SwiperSlide key={index}>
                  <div
                    className="py-8 flex justify-center" 
                  >
                    <img src={img.url} className="max-h-80" alt="product" />
                  </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* <div className='grid grid-cols-2'>
            {bid.imgs.map((img, index) => (
              <img src={img.url} className="h-48" alt="product" />
            ))}
          </div> */}

          </>


        }

        <div
            dangerouslySetInnerHTML={{ __html: bid && bid.text }}
            className='mt-10'
        ></div>

        </div>
      )}
    </div>
  )
}

export default BidContent