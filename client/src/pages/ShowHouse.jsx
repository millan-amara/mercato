import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import StaticMap from '../components/StaticMap';
import Footer from '../components/Footer';

import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'
import 'swiper/css';
import 'swiper/css/navigation'; 
import 'swiper/css/pagination';
import 'swiper/css/scrollbar'; 
import { FaLocationPin, FaShare, FaTiktok, FaWhatsapp } from 'react-icons/fa6';
import { FaShareAlt } from 'react-icons/fa';
import MapPicker from '../components/MapPicker';

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
    <main className='mb-24 px-2 mt-8 relative z-0'>
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
                      <img src={url.url} className="max-h-80 rounded-lg" alt={house.title} />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        {user && user._id === house.author &&
        <div className='flex justify-center mt-4'>
          <Link to={`/houses/${house._id}/edit`} className='bg-green-300 hover:bg-green-400 mr-2 rounded-md w-1/3 md:w-1/6 py-2 text-center'>Edit</Link>
          <button onClick={handleDelete} className='bg-orange-400 hover:bg-orange-500 ml-2 rounded-md w-1/3 md:w-1/6 py-2 text-white'>Delete</button>
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
          <div className='mt-4 flex items-center text-green-600 underline underline-offset-2 hover:text-green-500'>
            <FaTiktok />
            <a href={house.url} target="_blank" rel="noopener noreferrer" className='ml-2 '>Watch House video</a>
          </div>
          <div className='mt-6'>
            {user ? (
              <a href={`https://wa.me/+${house.caretaker}`} target="_blank" rel="noopener noreferrer" className='rounded-md font-semibold flex items-center justify-center bg-black hover:bg-slate-800 text-white w-full mt-2 py-2 lg:py-4'>
                <FaWhatsapp />
                <span className='ml-2'>Talk to CareTaker</span>
              </a>
            ) : (
              <Link to='/login' className='rounded-md font-semibold flex flex-col items-center justify-center bg-black hover:bg-slate-800 text-white w-full mt-2 py-2 lg:py-4'>
                <span className='my-2'>Login to talk to CareTaker</span>
                <span className='text-xs'>It's <span className='text-fuchsia-500'>free</span> to create an account</span>
              </Link>
            )}

          </div>
        </div>

        {user && house.coordinates ? (
          <div className="my-8 lg:w-1/2 mx-auto">
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <StaticMap lat={house.coordinates.lat} lng={house.coordinates.lng} />

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${house.coordinates.lat},${house.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-fuchsia-700 text-white py-2 px-4 rounded-md hover:bg-fuchsia-800 inline-block mt-2"
              // bg-fuchsia-700 text-white py-2 px-4 rounded-md hover:bg-fuchsia-800 inline-block mt-2
            >
              Open in Google Maps
            </a>

          </div>
        ) : (
          <div className='mt-8 md:w-1/2 mx-auto'>
            <MapPicker />
          </div>
          
        )}

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
        <div id="specs" className='mt-8 lg:w-1/2 mx-auto'>
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