import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const {email, password} = formData;
  const [showPassword, setShowPassword] = useState(false)
  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(isError) {
        toast.error(message)
    }

    //Redirect when logged in
    if(isSuccess || user) {
        navigate('/')
    }

    dispatch(reset())
  }, [isError, isSuccess, user, message, navigate, dispatch]) 

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onShowPassword = () => {
    if(showPassword === false) {
      setShowPassword(true)
    } else {
      setShowPassword(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password
    }

    dispatch(login(userData))
  }

  if(isLoading) {
    return (
      <div className='h-[100dvh] flex justify-center items-center'>
        <p className='animate-pulse md:text-xl'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='h-[100dvh] md:h-auto flex flex-col justify-center items-center'>
      <div className="flex justify-center z-10 pb-16 h-1/6 items-center pt-12">
        <span className='text-4xl'>PES<span className='text-fuchsia-700 font-bold text-7xl'>K</span>AYA</span>
      </div> 
      <form onSubmit={onSubmit} className='w-3/4 sm:w-2/5 lg:w-1/3 xl:w-1/4 z-50'>
          <div className='text-center mb-8 text-2xl'>Sign In</div>
          <div className='mb-5 flex flex-col text-sm'>
            <label htmlFor="email" className='font-semibold mb-2'>Email</label>
            <div className='flex items-center border-b-2 px-2 relative'>
              <FaUser className='absolute left-4' />
              <input 
                className='pl-8 border-0 px-2 py-1 focus:outline-none appearance-none w-full rounded-md h-8' 
                type="" name="email" id="email" value={email} onChange={onChange} placeholder='Type your email' required />
            </div>
          </div>

          <div className='pb-4 flex flex-col text-sm'>
            <label htmlFor="password" className='font-semibold mb-2'>Password</label>
            <div className='flex items-center border-b-2 px-2 relative'>
              <FaLock className='absolute left-4' />
              <input 
                className='text-sm pl-8 border-0 px-2 py-1 focus:outline-none appearance-none w-full rounded-md h-8' 
                type={showPassword === true ? "string" : "password"}
                name="password" 
                id="password" value={password} onChange={onChange} placeholder='Password' required />
              {showPassword === true ? 
                <FaEyeSlash className='cursor-pointer absolute right-4' onClick={onShowPassword} /> :
                <FaEye className='cursor-pointer absolute right-4' onClick={onShowPassword} />
              }
            </div>
          </div>
          <div className='text-xs mb-8 flex justify-end font-semibold'>
            <a href="/forgot" className='text-fuchsia-600'>Forgot password?</a>
          </div>
          <button type="submit" className='w-full rounded-md text-lg px-3 py-3 mb-2 font-semibold bg-gradient-to-r from-black to-slate-500 hover:bg-gradient-to-l text-white'>Log In</button>
          <div className='text-xs mb-5 flex justify-center mt-5 font-semibold'>
            <Link to="/register" className='underline-offset-3 underline'>Create Account</Link>
          </div>
      </form>
  
      
    </div>
  )
}

export default Login