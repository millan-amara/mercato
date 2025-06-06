import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import SearchForm from '../components/SearchForm'
import axios from 'axios';
import ListingItem from '../components/ListingItem.jsx';
import CartButton from '../components/CartButton.jsx';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch Posts Function
const fetchListings = async ({ queryKey }) => {
  const [, page, searchQuery] = queryKey;
  const { data } = await axios.get(`${API_URL}/listings/fetchlistings`, {
    params: { page, limit: 9, searchQuery: searchQuery || '' },
    withCredentials: true
  });
  console.log(data)
  return data;
};

function Shop() {
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart.length);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  // React Query Fetch Hook
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['listings', currentPage, submittedQuery],
    queryFn: fetchListings,
    keepPreviousData: true, // Preserve previous data during pagination
  });

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    try {
      setCurrentPage(1); // Reset to first page on search
      setSubmittedQuery(searchQuery);
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div>
      <Navbar />

      <div>
        <SearchForm 
          onSubmit={handleSearch}
          search={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


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
            {/* <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-2 mt-6'>
            
              {data.listings.map((listing) => (
                <ListingItem 
                  key={listing._id} 
                  listing={listing}
                />
              ))}
    
            </div> */}
            <div className='px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
              {data.listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>

            {/* // Pagination */}
            <div className='flex justify-center mt-8 mb-20 md:mb-0 md:pb-8' >
              <ul id='pagination' className='flex justify-between px-2 rounded-3xl bg-white'>
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((page) => (
                  <li
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-1 rounded-full cursor-pointer mx-1 ${
                      page === currentPage ? 'bg-green-700 text-white' : 'hover:bg-green-300'
                    }`}
                  >
                    {page}
                  </li>
                ))}
              </ul>
            </div>
            </>
          ) : 
          <div className='text-white flex flex-col justify-center items-center h-screen'>
            <p>Nothing matches '{searchQuery}' right now.</p>
            <p>Check back soon</p>
          </div>
        ) 
      } 

      <CartButton cartItems={cartItems} />


    </div>
  )
}

export default Shop