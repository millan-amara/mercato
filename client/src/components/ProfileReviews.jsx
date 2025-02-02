import React from 'react'
import { Rating, Typography } from '@mui/material';

function ProfileReviews({ canReview,handleCanReview,infoText,reviews,value,setValue,description,onReviewChange,onSubmitReview,submitReviewLoading }) {


  return (
    <>
    <div className='flex justify-center flex-col items-center text-sm'>
      <button className='underline' onClick={handleCanReview}>Leave a review?</button>
      <span className='mt-1 text-rose-500'>{infoText}</span>
    </div>
    {canReview &&
    <form className='flex flex-col py-2 items-center'>
      
      <Typography component="legend">Leave a Review</Typography>
      <div className='flex flex-col items-center w-full md:w-3/4 lg:w-1/2'>
        <div className='flex items-center justify-center mb-2'>
          <Rating 
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>

        <textarea
          type="text" 
          id='description'
          value={description}
          className="mt-1 mb-2 focus:ring-2 focus:outline-none w-5/6 md:w-3/4 appearance-none text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
          onChange={onReviewChange}
          name="description"
        ></textarea>
        <button className='flex bg-fuchsia-800 text-white px-4 py-1 rounded-sm' onClick={onSubmitReview}>
            <span>Post Review</span>
            {submitReviewLoading &&
                <div className='ml-2 w-6 h-6 md:w-8 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
            }
        </button>
      </div>
    </form>}

    <ul className='mt-4 mx-2 flex flex-col items-center'>
      {reviews.length !== 0 && reviews.map((review) => (
        
        <li key={review._id} className='border-b border-slate-200 px-2 py-2 mb-2 w-full md:w-2/3 xl:w-1/2'>
          <Rating name="read-only" value={review.value} size='small' readOnly />
          <p>{review.description}</p>
        </li>
        
      ))}
    </ul>

    </>
  )
}

export default ProfileReviews