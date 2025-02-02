import React from 'react'
import { FaArrowRight } from "react-icons/fa";

function BidInput({ quillRef, handleSubmit }) {
  return (
    <div>
        <form>
            <div className='flex flex-col items-center mb-12'>
            <div className='' style={{ width: 600, height: 300, }}>
                <div ref={quillRef} name="bidText" id='bidText' />
            </div>
            </div>

            <div id='search-button' className='flex justify-center'>
                <button onClick={handleSubmit} type='submit' className='flex bg-fuchsia-800 text-white w-1/2 md:w-2/5 py-2 rounded-md items-center justify-center hover:opacity-80'>Submit Request <span className='ml-2'><FaArrowRight /></span></button>
            </div>
        </form>
    </div>
  )
}

export default BidInput