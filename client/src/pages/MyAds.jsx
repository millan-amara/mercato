import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ListingItem from '../components/ListingItem.jsx';
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FaEdit } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const fetchUserListings = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const { data } = await axios.get(
      `${API_URL}/listings/fetchuserlistings?page=${page}&limit=9`
    );
    return data;
};

function MyAds() {

    const [currentPage, setCurrentPage] = useState(1);
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ["userAds", currentPage],
        queryFn: fetchUserListings,
        keepPreviousData: true, 
    });
    
    if (isError) return <p>Failed to load your ads.</p>;

  return (
    <div className=''>
        <Navbar />

        { isLoading ? (
        <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 mt-6'>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          
        </div>
        ) : (
          data.listings.length > 0 ? (
            <>
            <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2 mt-6'>
            
              {data.listings.map((listing) => (
                <ListingItem 
                  key={listing._id} 
                  listing={listing}
                />
              ))}
    
            </div>

            {/* // Pagination */}
            <div className='flex justify-center items-center mt-8 mb-20 md:mb-0 md:pb-8' >
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`border border-slate-800 rounded-md py-2 px-2 w-1/4 md:w-1/5 flex justify-center items-center ${currentPage === 1 ? 'bg-slate-100 cursor-not-allowed text-gray-400' : 'hover:text-sm'}`}
                >
                    <GrFormPrevious />
                    <span className='ml-1'>Previous</span>
                </button>
                <span className='mx-4 font-semibold text-lg'> Page {currentPage} </span>
                <button 
                    disabled={!data?.listings.length || !data?.hasMore} 
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`border border-slate-800 rounded-md py-2 px-2 w-1/4 md:w-1/5 flex justify-center items-center ${!data?.listings.length || !data?.hasMore ? 'bg-slate-100 cursor-not-allowed text-gray-400' : 'hover:text-sm'}`}
                >
                    <span className='mr-1'>Next</span>
                    <GrFormNext />
                </button>

            </div>
            </>
          ) : (
            <div className='h-[80dvh] flex flex-col justify-center items-center'>
                <h1>You have no ads</h1>
                <Link className='bg-black hover:bg-slate-800 text-white py-2 px-2 w-1/3 md:w-1/5 mt-4 rounded-md text-center flex items-center justify-center'>
                    <span className='mr-2'>Post Ad</span>
                    <FaEdit />
                </Link>
            </div>
          ))}
    </div>
  )
}

export default MyAds