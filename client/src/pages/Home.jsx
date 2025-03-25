
import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import { IoMdSend } from "react-icons/io";
import ImageOne from '../assets/images/airpods.jpg';
import ImageTwo from '../assets/images/camera.jpg';
import ImageThree from '../assets/images/controller.jpg';
import ImageFour from '../assets/images/gamer.jpg';
import ImageFive from '../assets/images/casings.jpg';
import ImageSix from '../assets/images/earbuds.jpg';
import ImageSeven from '../assets/images/iphone.jpg';
import ImageEight from '../assets/images/playstation.jpg';
import ImageNine from '../assets/images/nintendo.jpg';
import ImageTen from '../assets/images/ps4.jpg';
import { motion } from 'framer-motion';


const images = [
  [ImageThree, ImageTwo, ImageTen, ImageFour],
  [ImageFive, ImageSix, ImageSeven, ImageEight]
];

function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [postCount, setPostcount] = useState(0);
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ description: "" });
  const { description } = formData;
  const [currentSet, setCurrentSet] = useState(0);

  const el = React.useRef(null);
  const textareaRef = useRef(null);

  // React.useEffect(() => {
  //   const typed = new Typed(el.current, {
  //     strings: ['Latest Tech', 'Best Deals', 'New Arrivals', 'Top Brands'],
  //     typeSpeed: 100,
  //     backSpeed: 100,
  //     loop: true,
  //   });

  //   return () => typed.destroy();
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px";
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/posts/createpost`, formData, { withCredentials: true });
      if(response.data.error) {
        toast.error(response.data.error);
      } else {
        setPostcount(response.data.postCount)
        toast.success(`Saved successfully!`);
        navigate(`/user/profile/${user._id}`);
      }
    } catch (error) {
        if (error.response && error.response.status === 403) {
        toast.error("You have reached your daily post limit.");
      } else {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className='h-[100dvh] flex flex-col justify-between'>
      <Navbar />
      <div className='flex flex-col md:flex-row md:w-full justify-between h-5/6 pt-2 px-4 text-center'>
        <div className='md:w-1/3 min-h-[3em]'>
          

          <div className='grid grid-cols-2 gap-2 md:mt-6 w-full max-w-sm h-56'>
            {images[currentSet].map((image, index) => (
              <motion.img
                key={index}
                src={image}
                alt={`Tech ${index + 1}`}
                className='w-full h-24 object-cover rounded-lg'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <div className='grid grid-cols-2 gap-2 md:mt-6 w-full max-w-sm'>
            <img src={ImageOne} alt='Tech 1' className='w-full h-24 object-cover rounded-lg' />
            <img src={ImageTwo} alt='Tech 2' className='w-full h-24 object-cover rounded-lg' />

          </div>
        </div>
        
        <form onSubmit={handleSubmit} className='w-full md:w-2/3 md:px-12 pb-24 flex flex-col items-center justify-center'>
        {/* <div><span ref={el} className='auto-type text-blue-500 min-h-[3em]'></span></div> */}
          <textarea
            id="description"
            ref={textareaRef}
            placeholder="White wireless Buletooth headphones"
            className='w-full p-2 focus:ring-2 focus:outline-none appearance-none text-sm leading-6 text-slate-900 ring-1 ring-slate-200 shadow-sm rounded-lg resize-none overflow-auto'
            value={description} 
            onChange={onChange}
            rows={3}
            style={{ minHeight: '40px', maxHeight: '500px' }}
            required
          />

          <button className='bg-fuchsia-800 text-white px-4 py-2 mt-4 rounded-lg flex items-center'>
            <span className='mr-2'>Submit</span>
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;

