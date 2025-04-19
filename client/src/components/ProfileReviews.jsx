// import React, { useEffect, useState } from 'react'
// import { Rating, Typography } from '@mui/material';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// function ProfileReviews({ userId, cacheRef, loggedInUser }) { 

//   const [reviews, setReviews] = useState(cacheRef.current.reviews || []);
//   const [canReview, setCanReview] = useState(false);
//   const [checking, setChecking] = useState(false);
//   const [infoText, setInfoText] = useState('');
//   const [value, setValue] = useState(5);
//   const [description, setDescription] = useState('');
//   const [submitReviewLoading, setSubmitReviewLoading] = useState(false);

//   const API_URL = import.meta.env.VITE_API_URL;


//   useEffect(() => {
//     const fetchOwnReviews = async() => {
//       if(loggedInUser._id === userId) {
//         if (!cacheRef.current.reviews) {
//           const reviewsResponse = await axios.get(`${API_URL}/users/${userId}/reviews`, { withCredentials: true });
//           cacheRef.current.reviews = reviewsResponse.data
//           setReviews(reviewsResponse.data);
//         }
//       } else {
//         const reviewsResponse = await axios.get(`${API_URL}/users/${userId}/reviews`, { withCredentials: true });
//         setReviews(reviewsResponse.data);
//       }
//     }
  
//     fetchOwnReviews()
  
//   }, [userId, cacheRef])


//   const handleCanReview = async () => {
//     setChecking(true)
//     const currentUser = await axios.get(`${API_URL}/users/currentuser`, { withCredentials: true })
//     const response = await axios.get(`${API_URL}/users/${userId}`, { withCredentials: true }) 
//     setChecking(false)
//     if(currentUser.data.includes(response.data.email)) {
//       setCanReview(true)
//     } else {
//       setInfoText('Sorry, you need to interact with them first!')
//     }
//   }

//   const onReviewChange = (e) => {
//     setDescription(e.target.value)
//   }

//   const onSubmitReview = async (e) => {
//     e.preventDefault();
//     try {
//       setSubmitReviewLoading(true)
//       const response = await axios.post(`${API_URL}/users/${userId}/reviews`, {value: value, description: description}, { withCredentials: true })
//       setReviews((prevState) => [...prevState, response.data]);
//       setSubmitReviewLoading(false);

//       // Refetch the latest reviews to ensure consistency
//       const { data: updatedReviews } = await axios.get(`${API_URL}/users/${userId}/reviews`, { withCredentials: true });
//       setReviews(updatedReviews);
//       setCanReview(false)
//     } catch (error) {
//       console.log(error)
//     }

//   }

//   return (
//     <>
//     <div className='flex justify-center flex-col items-center text-sm'>
//       <button className='underline' onClick={handleCanReview}>Leave a review?</button>
//       {checking ? (
//         <div className='flex animate-pulse mt-8'>
//           <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
//           <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
//           <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
//           <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>
//           <div className='bg-slate-300 rounded-full w-6 h-6 mr-1'></div>

//         </div>
//       ) : (
//         <span className='mt-1 text-rose-500'>{infoText}</span>
//       )}

//     </div>
//     {canReview &&
//     <AnimatePresence>
//       <motion.div
//           className='mb-2'
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           exit={{ opacity: 0, height: 0 }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         <form className='flex flex-col py-2 items-center'>
          
//           <Typography component="legend">What was your interaction like?</Typography>
//           <div className='flex flex-col items-center w-full md:w-3/4 lg:w-1/2'>
//             <div className='flex items-center justify-center mb-2'>
//               <Rating 
//                 name="simple-controlled"
//                 value={value}
//                 onChange={(event, newValue) => {
//                   setValue(newValue);
//                 }}
//               />
//             </div>

//             <textarea
//               type="text" 
//               id='description'
//               value={description}
//               className="mt-1 mb-2 focus:ring-2 focus:outline-none w-5/6 md:w-3/4 appearance-none text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
//               onChange={onReviewChange}
//               name="description"
//             ></textarea>
//             <button className='flex bg-fuchsia-800 text-white px-4 py-1 rounded-sm' onClick={onSubmitReview}>
//                 <span>Post Review</span>
//                 {submitReviewLoading &&
//                     <div className='ml-2 w-6 h-6 md:w-8 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
//                 }
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </AnimatePresence>}

//     <ul className='mt-4 mx-2 flex flex-col items-center'>
//       {reviews.length !== 0 && reviews.map((review) => (
        
//         <li key={review._id} className='border-b border-slate-200 px-2 py-2 mb-2 w-full md:w-2/3 xl:w-1/2'>
//           <Rating name="read-only" value={review.value} size='small' readOnly />
//           <p>{review.description}</p>
//         </li>
        
//       ))}
//     </ul>

//     </>
//   )
// }

// export default ProfileReviews