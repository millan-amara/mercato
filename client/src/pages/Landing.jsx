import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackImage from '../assets/house/apartment.jpg';
import ImageOne from '../assets/house/apartment.jpg';
import ImageTwo from '../assets/house/apartment.jpg';
import ImageThree from '../assets/house/balcony.jpg';
import ImageFour from '../assets/house/bed.jpg';
import ImageFive from '../assets/house/mattress.jpg';
import ImageSix from '../assets/house/outdoor.jpg';
import ImageSeven from '../assets/house/bedroom.jpg';
import ImageEight from '../assets/images/playstation.jpg';
import ImageNine from '../assets/house/chairs.jpg';
import ImageTen from '../assets/house/bathtub.jpg';
import ImageEleven from '../assets/house/living.jpg';
import { CiLogin } from "react-icons/ci";
import { SiGnuprivacyguard } from "react-icons/si";


const images = [
  [ImageThree, ImageTwo, ImageTen, ImageFour, ImageNine, ImageEleven],
  [ImageFive, ImageSix, ImageSeven, ImageEight, ImageNine, ImageEleven]
];

function Landing() {
    const [currentSet, setCurrentSet] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
         setCurrentSet((prev) => (prev === 0 ? 1 : 0));
        }, 3000);
    
        return () => clearInterval(interval);
    }, []);
    
  return (
    <div className="relative h-[100dvh] flex items-center px-1">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${BackImage})` }}
        ></div>
        <div className='flex flex-col md:flex-row w-full'>
            <motion.div 
                initial={{ opacity: 0, y: -30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center w-full md:w-1/2 p-6"
            >
                <div className='relative z-10 w-full text-center text-3xl md:text-4xl py-2'>
                    PES<span className='text-fuchsia-700 font-bold text-5xl md:text-7xl'>K</span>AYA
                </div>

                <div className='relative z-50 w-full h-3/4 flex flex-col justify-between py-4'>
                    <div className='h-1/2 py-4'>
                        <div>
                            <h1 className='text-2xl'>Looking For A House to Rent?</h1>
                            <p className='text-lg'>Or maybe some decor for your home?</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-center h-1/2'>
                        <h1 className='text-lg mb-5'>Get Started Today!</h1>
                        <Link to='/login' className='flex items-center justify-center border-2 border-slate-500 text-lg px-3 py-3 w-full md:w-1/2 mb-2 font-semibold rounded-md hover:bg-slate-200'>
                            <span className='text-xl'>
                                <CiLogin />
                            </span>
                            <span className='ml-2'>Log In</span>
                        </Link>
                        <Link to='/register' className='flex items-center justify-center bg-black text-white text-lg font-semibold px-3 py-3 rounded-md w-full md:w-1/2 hover:bg-slate-800'>
                            <SiGnuprivacyguard />
                            <span className='ml-2'>Create Account</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
            <div className='w-full md:w-1/2 px-4 py-2'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-2 w-full h-56'>
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
                <div className='hidden md:grid grid-cols-2 gap-2 mt-4 w-full'>
                    <img src={ImageOne} alt='Tech 1' className='w-full h-24 object-cover rounded-lg' />
                    <img src={ImageTwo} alt='Tech 2' className='w-full h-24 object-cover rounded-lg' />
                </div>
                <div className='hidden md:grid grid-cols-2 gap-2 mt-4 w-full mx-auto max-w-sm'>
                    <img src={ImageNine} alt='Tech 1' className='w-full h-24 object-cover rounded-lg' />
                    <img src={ImageEleven} alt='Tech 2' className='w-full h-24 object-cover rounded-lg' />
                </div>

            </div>
        </div>

    </div>
  )
}

export default Landing