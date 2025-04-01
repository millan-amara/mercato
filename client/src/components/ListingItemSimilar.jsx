import React from 'react'
import { FaCalendar } from 'react-icons/fa6'
import { Link } from 'react-router-dom'


function ListingItemSimilar({ listing }) {
    
  return (
    <li className='flex flex-col relative mb-8 items-center'> 
        <Link 
            to={`/listings/${listing._id}`}
            className='contents'
        >
            <img
                src={listing.imgs[0].url}
                alt={listing.title}
                className='w-full h-20 md:h-28 mb-4 lg:w-52 lg:h-32'
            />

            <div className="w-full lg:ml-2">
                <p className="font-medium text-sm md:text-lg">
                    {listing.title.substring(0,50)}...
                </p>
                <p className='text-xs font-medium text-green-600 mt-1'>
                    Same day delivery
                </p>
                <p className="mt-1 mb-1">
                    <span className="text-fuchsia-500 font-semibold lg:text-lg">
                        Ksh. {listing.offerPrice.toLocaleString()}
                    </span>
                    {listing.actualPrice !== listing.offerPrice &&
                    <span className="text-gray-500 line-through text-sm ml-2">
                        Ksh. {listing.actualPrice.toLocaleString()}
                    </span>}
                </p>
            </div>
        </Link>
    </li>
  )

}

export default ListingItemSimilar