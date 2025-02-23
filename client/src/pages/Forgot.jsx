import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

function Forgot() {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    axios.post('/users/forgot', {email: email})
    setLoading(false)
    navigate('/forgot-password/success')

  }

  return (
    <div className='flex flex-col h-screen'>
      <div className="flex justify-center pb-16 h-1/6 items-center pt-12">
        <span className='text-xl md:text-3xl'>PES<span className='text-fuchsia-700 font-bold text-3xl md:text-6xl'>K</span>AYA</span>
      </div>
      
      <div className='flex flex-col items-center h-1/2 justify-center bg-white px-4'>
        <div className='flex justify-center w-full mb-8'>
          
          <Link to="/login" className='text-fuchsia-500 text-sm flex items-center'>
            <FaArrowLeft className='pr-1' />
            Back to login
          </Link>
        </div>
        <div className='flex flex-col items-center justify-center'>
        <p className='text-2xl mb-8 font-semibold'>Forgot Your Password?</p>
        <p className='mb-8'>No worries! Enter the email address that you signed up with to reset the password.</p>
        <form onSubmit={onSubmit} className='flex flex-col w-full'>
        <input 
          type="email"
          value={email}
          id='email'
          onChange={onChange}
          placeholder='Email'
          className='rounded-md focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 py-2 pl-2 ring-1 ring-slate-200 shadow-sm'
          required
        />
        <button className='w-full border-2 border-slate-400 bg-slate-100 hover:bg-slate-200 text-bold rounded-md py-3 mt-6'>Send reset instructions</button>
        </form>
        </div>
      </div>
      
      <div className="flex justify-center items-end h-1/4">
        <p>&copy; Peskaya 2025. All rights reserved</p>
      </div>
      
    </div>
  )
}

export default Forgot