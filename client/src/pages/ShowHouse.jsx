import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
// import HouseItemSimilar from '../components/HouseItemSimilar';
// import HouseItemMore from '../components/HouseItemMore';
import Footer from '../components/Footer';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import { FaLocationPin, FaShare, FaWhatsapp } from 'react-icons/fa6';
import { FaShareAlt } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

// const fetchHouses = async () => {
//   const { data } = await axios.get(`${API_URL}/houses/fetchhouses`, {
//     params: { limit: 9 || '' },
//     withCredentials: true
//   });

//   return data.houses || [];
// };


function ShowHouse() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { houseId } = useParams();
    const {user} = useSelector((state) => state.auth);
    const [sharedLinkCopied, setSharedLinkCopied] = useState(false);

    //Fetch house data
    const { data: house, isLoading: houseLoading, error: houseError } = useQuery({
      queryKey: ['house', houseId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/houses/${houseId}`, { withCredentials: true });
        return data; 
      }
    })

    // React Query Fetch Hook for other houses
    // const { data: houses = [], isLoading, isError, error } = useQuery({
    //   queryKey: ['houses'],
    //   queryFn: fetchHouses,
    //   keepPreviousData: true, // Preserve previous data during pagination
    // });

    const handleDelete = async (e) => {
      e.preventDefault();
      await axios.delete(`${API_URL}/houses/${houseId}`, { withCredentials: true });
      toast.success('successfully deleted product')
      navigate('/')
    }
 


  if (houseLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Just a moment...</p>
        </div>
    );
  }

  if (houseError) {
      return <p>Error loading house. Please try again.</p>;
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
            {house.imgs.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                      className="relative flex justify-center" 
                    >
                      <img src={url.url} className="max-h-80" alt={house.title} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        {user && user._id === house.author &&
        <div className='flex justify-center'>
          <Link to={`/houses/${house._id}/edit`} className='bg-green-300 mr-2 rounded-md w-1/3 md:w-1/5 py-2 text-center'>Edit</Link>
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
                {house.title}
            </div>
            <p className="mt-2 mb-1">
              <span className="text-fuchsia-500 font-semibold text-lg lg:text-xl">
                  Ksh. {house.price.toLocaleString()}
              </span>
            </p>
          </div>

          <div className='mt-4 flex items-center'>
            <FaLocationPin />
            <span className='ml-2'>{house.location}</span>
          </div>
          <div className='mt-4'>
            <a href={`https://wa.me/+${house.author.phone}`} className='rounded-md font-semibold flex items-center justify-center bg-black hover:bg-slate-800 text-white w-full mt-2 py-2 lg:py-4'>
              <FaWhatsapp />
              <span className='ml-2'>Talk to CareTaker</span>
            </a>
          </div>
        </div>

        {/* <div id="similar" className='mt-16 lg:mt-20'>
          {houses.length > 0 && (
            <>
            <p className='text-xl lg:text-3xl font-medium mb-8 text-center'>You Might Also Like</p>
              <Swiper
                slidesPerView={3}
                spaceBetween={10}
                className="mySwiper"
              >
                {houses.slice(3, 7).map((house) => (
                  <SwiperSlide key={house._id}>
                    <HouseItemSimilar house={house} />
                  </SwiperSlide>
                ))}
              </Swiper>
    
    
            </>
          )}
        </div> */}
        <div id="specs" className='mt-8'>
          <h1 className='text-xl lg:text-3xl font-medium mb-8 text-center'>More Details</h1>
          <div
            className='' 
            dangerouslySetInnerHTML={{ __html: house && house.description }}
          >
          </div>

        </div>
        {/* <div id="more" className='mt-12 lg:mt-20'>

          {houses.length > 0 && (
            <>
            <p className='text-xl lg:text-3xl font-medium mb-8 text-center'>More Products to Explore</p>
            <div className='px-2 grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 mt-6'>
            
              {houses.slice(2, 8).map((house) => (
                <HouseItemMore 
                  key={house._id} 
                  house={house}
                />
              ))}
    
            </div>
            </>
          )}
        </div> */}

    </main>
    <Footer />
  </>

  )
}

export default ShowHouse