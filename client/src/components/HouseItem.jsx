import React from 'react'
import { FaCalendar } from 'react-icons/fa6'
import { Link } from 'react-router-dom'


function HouseItem({ house }) {
    
  return (
    <li className='flex justify-between items-center mb-3 md:mb-8'> 
        <Link 
            to={`/houses/${house._id}`}
            className='contents'
        >
            <img
                src={house.imgs[0].url}
                alt={house.title}
                className='w-2/5 h-24 lg:w-1/2 lg:h-32 rounded-md md:rounded-lg'
            />

            <div className="w-1/2 lg:ml-3">
                <p className="font-medium text-sm md:text-base">
                    {house.title.length > 60 
                        ? `${house.title.substr(0, 60)}...` 
                        : house.title}
                </p>

                <p className="mt-1 mb-1">
                    <span className="text-fuchsia-500 font-semibold lg:text-lg">
                        Ksh. {house.price.toLocaleString()}
                    </span>
                </p>
            </div>
        </Link>
    </li>
  )

}

export default HouseItem