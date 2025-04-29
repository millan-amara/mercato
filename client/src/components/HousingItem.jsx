import React from 'react';
import { Link } from 'react-router-dom';

function HousingItem({ house }) {
  return (
    <Link
      to={`/houses/${house._id}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between h-full"
    >
      <div className="w-full aspect-[4/3] mb-2">
        <img
          src={house.imgs[0]?.url}
          alt={house.title}
          className="w-full max-h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <h3 className="font-semibold text-base text-gray-800 mb-1">
          {house.title?.length > 70 ? house.title?.substring(0, 70) + '...' : house.title}
        </h3>
        {/* <p className="text-sm text-green-600 mb-2">Same day delivery</p> */}
        <p className="text-sm text-green-600 mb-2">{house.location}</p>

        <div className="flex items-center">
          <span className="text-fuchsia-600 font-bold text-lg">
            Ksh. {house.price?.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default HousingItem;
