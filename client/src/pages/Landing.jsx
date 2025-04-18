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
