import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackImage from '../assets/images/earbuds.jpg';
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
import ImageEleven from '../assets/images/printer.jpg';
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
                <div className='relative z-10 w-full text-center text-4xl py-2'>
                    PES<span className='text-fuchsia-700 font-bold text-7xl'>K</span>AYA
                </div>

                <div className='relative z-50 w-full h-3/4 flex flex-col justify-between py-4'>
                    <div className='h-1/2 py-4'>
                        <div>
                            <h1 className='text-3xl'>Get The Best Deals on Electronics</h1>
                        </div>
                    </div>


                    <div className='flex flex-col items-center h-1/2'>
                        <h1 className='text-xl mb-5'>Start Shopping Today!</h1>
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
                <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 w-full h-56'>
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
                <div className='hidden md:grid grid-cols-2 gap-4 mt-6 w-full max-w-sm'>
                    <img src={ImageOne} alt='Tech 1' className='w-full h-24 object-cover rounded-lg' />
                    <img src={ImageTwo} alt='Tech 2' className='w-full h-24 object-cover rounded-lg' />
                </div>
                <div className='hidden md:grid grid-cols-2 gap-4 mt-6 w-full max-w-sm'>
                    <img src={ImageNine} alt='Tech 1' className='w-full h-24 object-cover rounded-lg' />
                    <img src={ImageEleven} alt='Tech 2' className='w-full h-24 object-cover rounded-lg' />
                </div>

            </div>
        </div>


    </div>
  )
}

export default Landing

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import BackImage from '../assets/images/backiphone.png';

// function Landing() {
//   return (
//     <div className="relative h-[100dvh] flex flex-col justify-center items-center px-4 bg-gray-100 overflow-hidden">
//       {/* Background with overlay */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
//         style={{ backgroundImage: `url(${BackImage})` }}
//       ></div>
//       <div className="absolute inset-0"></div>
      
//       {/* Content */}
//       <motion.div 
//         initial={{ opacity: 0, y: -30 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8 }}
//         className="relative z-10 text-center max-w-2xl w-full p-6"
//       >
//         <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900">
//           PES<span className="text-fuchsia-700 text-7xl">K</span>AYA
//         </h1>
//         <h2 className="text-2xl md:text-3xl font-semibold mt-4 text-gray-800">
//           The Best Deals on Electronics
//         </h2>
//         <p className="mt-2 text-lg md:text-xl text-gray-600">
//           Describe what you need, compare offers, and get the best deal on tech!
//         </p>
//       </motion.div>

//       {/* Call to Action */}
//       <motion.div 
//         initial={{ opacity: 0, y: 30 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8, delay: 0.3 }}
//         className="relative z-10 w-full max-w-md flex flex-col items-center space-y-4 mt-6"
//       >
//         <h3 className="text-xl font-medium text-gray-700">Get Started - Post a Request or Browse Offers!</h3>
//         <Link 
//           to='/login' 
//           className="w-full md:w-3/4 text-center border-2 border-gray-600 text-lg px-5 py-3 font-semibold rounded-lg transition-all duration-300 hover:bg-gray-300 shadow-md"
//         >
//           Log In
//         </Link>
//         <Link 
//           to='/register' 
//           className="w-full md:w-3/4 text-center bg-black text-white text-lg font-semibold px-5 py-3 rounded-lg shadow-lg transition-all duration-300 hover:bg-gray-900"
//         >
//           Create Account
//         </Link>
//       </motion.div>
//     </div>
//   );
// }

// export default Landing;
