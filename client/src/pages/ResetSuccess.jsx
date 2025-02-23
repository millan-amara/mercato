import React from 'react'


function ResetSuccess() {

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex justify-center pb-16 h-1/6 items-center pt-12">
        <span className='text-xl md:text-3xl'>PES<span className='text-fuchsia-700 font-bold text-3xl md:text-6xl'>K</span>AYA</span>
      </div>
      
      <div className='flex flex-col items-center h-1/2 justify-center bg-white px-4'>
        <div className='flex flex-col items-center justify-center'>
            <p className='text-2xl mb-8 font-semibold'>Kindly check your inbox</p>
            <p className='mb-8'>If your email is in our records, you should receive an email shortly.</p>
            <p className='text-xs'>Remember to also check your spam folder in case our email got misplaced.</p>
        </div>
      </div>
      
      <div class="flex justify-center items-end h-1/4">
        <p>&copy; Peskaya 2025. All rights reserved</p>
      </div>
      
    </div>
  )
}

export default ResetSuccess