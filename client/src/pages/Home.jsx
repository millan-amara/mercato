import React, { useState } from 'react';
import Typed from 'typed.js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import { IoMdSend } from "react-icons/io";
import ImageOne from '../assets/images/image1.jpg';
import ImageThree from '../assets/images/image3.jpg';
import ImageFour from '../assets/images/image4.jpg';
import ImageFive from '../assets/images/image5.jpg';
import ImageSix from '../assets/images/image6.jpg';
import ImageSeven from '../assets/images/image7.jpg';
import ImageEight from '../assets/images/image8.jpg';
import { motion, AnimatePresence } from 'framer-motion';


function Home() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [postCount, setPostcount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); 

  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    description: "",
  })

  const { description } = formData;

  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  // Text and Image pairs
  const textOptions = ['Spacious living', 'Modern finishes', 'Natural Lighting', 'Open Kitchen', 'Walk-in closet', 'Master ensuite', '24-hour security'];
  const imageOptions = [
    ImageSeven,
    ImageSix,
    ImageOne,
    ImageEight,
    ImageThree,
    ImageFour,
    ImageFive,
  ];

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: textOptions,
      typeSpeed: 100,
      backSpeed: 100,
      loop: true,
      smartBackspace: true,
      onStringTyped: (index) => setCurrentIndex(index),
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      console.log(postCount)
      const response = await axios.post(`${API_URL}/posts/createpost`, formData, { withCredentials: true });
      setPostcount(response.data.postCount)

      if(response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(`Saved successfully!`);
        navigate(`/user/profile/${user._id}`)
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("You have reached your daily post limit.");
      } else {
        console.log(error);
        toast.error("Something went wrong.");
      }
    }
  }
 
  return (
    <div className='h-[100dvh] flex flex-col'>
      <Navbar />
      <div className='flex flex-col mb-12 mt-12 h-[100dvh] items-center md:mb-0'>
        <div className='w-full h-1/2 flex flex-col md:flex-row justify-center items-center md:items-start text-3xl md:text-5xl'>
          <div className='min-h-[3em]'>
          <span ref={el} className='auto-type text-green-400 inline-flex items-center'></span>
          </div>

            <AnimatePresence mode='wait'>
              <motion.div
                key={currentIndex}
                  className='mb-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <img 
                  src={imageOptions[currentIndex]} 
                  alt={textOptions[currentIndex]} 
                  className="md:w-64 h-56 object-cover mt-4 rounded-xl"
                />
              </motion.div>                    
            </AnimatePresence>
        </div>
        <form onSubmit={handleSubmit} className='pb-safe w-full h-1/2 md:w-3/5 flex md:flex-col items-end md:items-center justify-end pb-20 md:py-8 px-4 text-center'>
          <TextField
              id="description"
              label="What kind of house are you looking for?"
              fullWidth
              multiline
              variant='standard'
              className='' 
              value={description} 
              onChange={onChange}
              required
          />

          <button className='md:bg-fuchsia-900 border md:border-0 border-fuchsia-800 flex justify-center items-center text-white px-3 md:w-1/4 md:mt-4 md:hover:bg-fuchsia-800 py-1 md:py-2 rounded-md md:rounded-lg md:text-xs ml-1 md:ml-0'>
            <span className='mr-2 hidden md:flex'>Submit</span>
            <span className='text-lg md:text-sm text-fuchsia-800 md:text-white'><IoMdSend /></span>
          </button>

        </form>
      </div>

    </div>
  )
}

export default Home