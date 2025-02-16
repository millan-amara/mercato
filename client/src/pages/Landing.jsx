import React from 'react'
import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className='h-[100dvh] flex flex-col justify-between mx-1'>
        <div className=''></div>
        <div className='w-full text-center text-4xl py-2'>
            PES<span className='text-fuchsia-700 font-bold text-7xl'>K</span>AYA
        </div>
        <div className='w-full h-3/4 flex flex-col justify-between py-4'>
            <div className='text-center h-1/2 justify-between flex flex-col py-4'>
                <div>
                    <h1 className='text-3xl'>Buy or sell anything reliably and fast.</h1>
                </div>
                <div>
                    <p className='text-xl'>Make a request for anything and get hundreds of deals to choose from.</p>
                </div>
            </div>


            <div className='flex flex-col items-center'>
                <h1 className='text-xl mb-5'>Join Today!</h1>
                <Link to='/login' className='text-center border-2 text-lg px-3 py-3 w-full mb-2 font-semibold rounded-md'>Log In</Link>
                <Link to='/register' className='text-center bg-black text-white text-lg font-semibold px-3 py-3 rounded-md w-full'>Create Account</Link>
            </div>

        </div>

    </div>
  )
}

export default Landing