import React from 'react'

function Landing() {
  return (
    <div className='h-screen flex flex-col justify-between mx-1'>
        <div className='bg-slate-200'>Navbar</div>
        <div className='w-full text-center text-4xl py-2'>
            PESKAYA
        </div>
        <div className='w-full h-3/4 flex flex-col justify-between py-4'>
            <div>
                <h1>Buy anything reliably</h1>
                <h1></h1>
                <h1>Sell anything</h1>
            </div>
            <div className=''>
                <h1 className='text-center text-3xl mb-5'>Join Today!</h1>
                <button className='border-2 text-xl px-3 py-3 w-full mb-2 font-semibold rounded-md'>Log In</button>
                <button className='bg-black text-white text-xl font-semibold px-3 py-3 rounded-md w-full'>Create Account</button>
            </div>

        </div>

    </div>
  )
}

export default Landing