// import React from 'react'
// import { FaCalendar } from 'react-icons/fa6'
// import { Link } from 'react-router-dom'


// function ListingItem({ listing }) {
    
//   return (
//     <li className='flex justify-between items-center relative mb-8'> 
//         <Link 
//             to={`/listings/${listing._id}`}
//             className='contents'
//         >
//             <img
//                 src={listing.imgs[0].url}
//                 alt={listing.title}
//                 className='w-2/5 h-24 lg:w-1/2 lg:h-32'
//             />

//             <div className="w-1/2 lg:ml-2">
//                 <p className="font-medium text-sm md:text-lg">
//                     {listing.title.substring(0,70)}...
//                 </p>
//                 <p className='text-xs font-medium text-green-600 mt-1'>
//                     Same day delivery
//                 </p>
//                 <p className="mt-1 mb-1">
//                     <span className="text-fuchsia-500 font-semibold lg:text-lg">
//                         Ksh. {listing.offerPrice.toLocaleString()}
//                     </span>
//                     {listing.actualPrice !== listing.offerPrice &&
//                     <span className="text-gray-500 line-through text-sm ml-2">
//                         Ksh. {listing.actualPrice.toLocaleString()}
//                     </span>}
//                 </p>
//             </div>
//         </Link>
//     </li>
//   )

// }

// export default ListingItem


import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

function ListingItem({ listing }) {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between h-full"
    >
      <div className="w-full aspect-[4/3] mb-2">
        <img
          src={listing.imgs[0].url}
          alt={listing.title}
          className="w-full max-h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <h3 className="font-semibold text-base text-gray-800 mb-1">
          {listing.title.length > 70 ? listing.title.substring(0, 70) + '...' : listing.title}
        </h3>
        {/* <p className="text-sm text-green-600 mb-2">Same day delivery</p> */}
        <p className="text-sm text-green-600 mb-2">{listing.delivery}</p>

        <div className="flex items-center">
          <span className="text-fuchsia-600 font-bold text-lg">
            Ksh. {listing.offerPrice.toLocaleString()}
          </span>
          {listing.actualPrice !== listing.offerPrice && (
            <span className="text-sm line-through text-gray-400 ml-2">
              Ksh. {listing.actualPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ListingItem;
