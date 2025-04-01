import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import ListingItemSimilar from '../components/ListingItemSimilar';
import ListingItemMore from '../components/ListingItemMore';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import { FaLocationPin, FaShare } from 'react-icons/fa6';
import { FaShareAlt } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const fetchListings = async () => {
  const { data } = await axios.get(`${API_URL}/listings/fetchlistings`, {
    params: { limit: 9 || '' },
    withCredentials: true
  });

  return data.listings || [];
};


function ShowListing() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { listingId } = useParams();
    const {user} = useSelector((state) => state.auth);
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false);

    //Fetch listing data
    const { data: listing, isLoading: listingLoading, error: listingError } = useQuery({
      queryKey: ['listing', listingId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/listings/${listingId}`, { withCredentials: true });
        return data; 
      }
    })

    // React Query Fetch Hook for other listings
    const { data: listings = [], isLoading, isError, error } = useQuery({
      queryKey: ['listings'],
      queryFn: fetchListings,
      keepPreviousData: true, // Preserve previous data during pagination
    });

    const handleDelete = async (e) => {
      e.preventDefault();
      await axios.delete(`${API_URL}/listings/${listingId}`, { withCredentials: true });
      toast.success('successfully deleted product')
      navigate('/')
    }
 


  if (listingLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Just a moment...</p>
        </div>
    );
  }

  if (listingError) {
      return <p>Error loading listing. Please try again.</p>;
  }


  return (
    <>
    <Navbar />
    <main className='mb-24 px-2'>
      <Swiper 
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            pagination={{clickable: true}}
            className='swiper-container'
        >
            {listing.imgs.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                      className="relative flex justify-center" 
                    >
                      <img src={url.url} className="" alt={listing.title} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        {user && user._id === listing.author._id &&
        <div className='flex justify-center'>
          <Link className='bg-green-300 mr-2 rounded-md w-1/3 md:w-1/5 py-2 text-center'>Edit</Link>
          <button onClick={handleDelete} className='bg-orange-400 ml-2 rounded-md w-1/3 md:w-1/5 py-2 text-white'>Delete</button>
        </div>}

        <div
            className="mt-4 flex justify-center"
            onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                setSharedLinkCopied(true)
                setTimeout(() => {
                    setSharedLinkCopied(false)
                }, 2000)
            }}>
            <span className='rounded-full bg-slate-100 p-4'><FaShareAlt className='' /></span>
            
        </div>

        {sharedLinkCopied && <p className='linkCopied'>Link Copied!</p> }
    
        <div id='details' className='lg:w-1/2 mx-auto'>        
          <div className="mt-8 mb-4 ">
            <div className="font-medium lg:text-lg flex">
                {listing.title}
            </div>
            <p className="mt-2 mb-1">
              <span className="text-fuchsia-500 font-semibold text-lg lg:text-xl">
                  Ksh. {listing.offerPrice.toLocaleString()}
              </span>
              {listing.actualPrice !== listing.offerPrice &&
              <span className="text-gray-500 line-through text-sm ml-2">
                  Ksh. {listing.actualPrice.toLocaleString()}
              </span>}
            </p>
          </div>
          <div>
            <p>Free shipping</p>
            <p>Same day delivery</p>
          </div>
          <div className='mt-4 flex items-center'>
            <FaLocationPin />
            <span className='ml-2'>Deliver to <button className='underline underline-offset-2 text-sm'>Add Location</button> </span>
          </div>
          <div className='mt-4'>
            <p className='text-lg lg:text-2xl text-green-600 font-medium'>In Stock</p>
            <p className='bg-slate-200 w-full mt-1 py-2 rounded-md px-1 flex items-center'>
              <span className='w-1/4 md:w-2/5'>Quantity: </span>
              <select name="" id="" className='w-3/4 md:w-3/5 rounded-md py-2 px-1'>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </p>
            <button className='rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 text-white w-full mt-2 py-2 lg:py-4'>Buy Now</button>
          </div>
        </div>

        <div id="similar" className='mt-16 lg:mt-20'>
          {listings.length > 0 && (
            <>
            <p className='text-xl lg:text-3xl font-medium mb-8 text-center'>You Might Also Like</p>
              <Swiper
                slidesPerView={3}
                spaceBetween={10}
                className="mySwiper"
              >
                {listings.slice(3, 7).map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <ListingItemSimilar listing={listing} />
                  </SwiperSlide>
                ))}
              </Swiper>
    
    
            </>
          )}
        </div>
        <div id="specs" className='mt-8'>
          <h1 className='text-xl lg:text-3xl font-medium mb-8 text-center'>Product Details</h1>
          <div
            className='' 
            dangerouslySetInnerHTML={{ __html: listing && listing.description }}
          >
          </div>

        </div>
        <div id="more" className='mt-12 lg:mt-20'>

          {listings.length > 0 && (
            <>
            <p className='text-xl lg:text-3xl font-medium mb-8 text-center'>More Products to Explore</p>
            <div className='px-2 grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mt-6'>
            
              {listings.slice(2, 8).map((listing) => (
                <ListingItemMore 
                  key={listing._id} 
                  listing={listing}
                />
              ))}
    
            </div>
            </>
          )}
        </div>



      </main>
      </>

  )
}

export default ShowListing