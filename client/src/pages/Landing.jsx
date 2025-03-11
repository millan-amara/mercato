import React from 'react'
import { Link } from 'react-router-dom'
import BackImage from '../assets/images/image5.jpg'

function Landing() {
  return (
    <div className="relative h-[100dvh] flex flex-col justify-between mx-1">
        <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${BackImage})` }}
        ></div>
        <div className=''></div>
        <div className='relative z-10 w-full text-center text-4xl py-2'>
            PES<span className='text-fuchsia-700 font-bold text-7xl'>K</span>AYA
        </div>
        <div className='relative z-50 w-full h-3/4 flex flex-col justify-between py-4'>
            <div className='text-center h-1/2 justify-between flex flex-col py-4'>
                <div>
                    <h1 className='text-3xl'>Looking for a House to Rent or Buy?</h1>
                </div>
                <div>
                    <p className=''>Describe your ideal house and get several options to choose from.</p>
                </div>
            </div>

            <div className='flex flex-col items-center'>
                <h1 className='text-xl mb-5'>Join Today!</h1>
                <Link to='/login' className='text-center border-2 border-slate-500 text-lg px-3 py-3 w-full md:w-1/2 mb-2 font-semibold rounded-md hover:bg-slate-200'>Log In</Link>
                <Link to='/register' className='text-center bg-black text-white text-lg font-semibold px-3 py-3 rounded-md w-full md:w-1/2 hover:bg-slate-800'>Create Account</Link>
            </div>

        </div>

    </div>
  )
}

export default Landing