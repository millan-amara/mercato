import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { reset, register } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import BackImage from '../assets/back.png'

function Register() {
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    business: false,
    password: '',
    confirmPassword: '',
  })
  const {email, phone, password, confirmPassword, business} = formData;
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {user, isLoading, isSuccess, isError, message} = useSelector((state) => state.auth)

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
    let boolean = null
    if (e.target.value === 'true') {
        boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    const fieldName = e.target.id.replace('-yes', '').replace('-no', '');

    //Text/Booleans/Numbers
    if(!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: boolean ?? e.target.value,
      }));
    }
  }

  const onShowPassword = () => {
    if(showPassword === false) {
      setShowPassword(true)
    } else {
      setShowPassword(false)
    }
  }

  const onShowConfirmPassword = () => {
    if(showConfirmPassword === false) {
      setShowConfirmPassword(true)
    } else {
      setShowConfirmPassword(false)
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if(email === '') {
        toast.error('Please enter your email')
      } else if (password === '') {
        toast.error('Please enter your password')
      } else if (phone === '') {
        toast.error('Please enter your password')
      } else if(confirmPassword === '') {
        toast.error('Please enter your password')
      } else if(password !== confirmPassword) {
        toast.error('Passwords need to match!')
      } else {

        const userData = {email,business,phone,password}
        dispatch(register(userData))

      }
  }

  if(isLoading) {
    return <h1>Signing you up...!</h1>
  }

  return (
    <div className='h-[100dvh] md:min-h-screen flex flex-col md:flex-row justify-center items-center'>
      <div className="flex justify-center z-10 pb-16 h-1/6 items-center pt-12 md:w-1/2 ">
        <span className='text-4xl'>PES<span className='text-fuchsia-700 font-bold text-7xl'>K</span>AYA</span>
      </div>
      <div className='w-11/12 sm:w-3/5 z-50 md:py-4 px-7 md:w-1/2 '>
      <form onSubmit={handleSubmit} className='md:w-4/5 lg:w-3/5'>
        <div className='text-center mb-8 text-2xl'>Sign Up</div>
        <div className='mb-5 flex flex-col text-sm'>
          <label htmlFor="email" className='font-semibold md:font-normal mb-2'>Email</label>
          <div className='flex items-center border-b-2 px-2 relative'>
            <FaUser className='absolute left-4' />
            <input 
              className='pl-8 border-0 py-1 focus:outline-none appearance-none w-full rounded-md h-8' 
              type="email" name="email" id="email" value={email} onChange={onChange} placeholder='Type your email' />
          </div>
        </div>
        <div className='mb-5 flex flex-col text-sm'>
          <label htmlFor="phone" className='font-semibold md:font-normal mb-2'>Phone Number</label>
          <div className='flex items-center border-b-2 px-2 relative'>
            <FaUser className='absolute left-4' />
            <input 
              className='pl-8 border-0 py-1 focus:outline-none appearance-none w-full rounded-md h-8' 
              type="number" name="phone" id="phone" value={phone} onChange={onChange} placeholder='07...' />
          </div>
        </div>
        <div className='pb-4 flex flex-col text-sm'>
          <label htmlFor="password" className='font-semibold md:font-normal mb-2'>Password</label>
          <div className='flex items-center border-b-2 px-2 relative'>
            <FaLock className='absolute left-4' />
            <input 
              className='text-sm border-0 pl-8 h-8 px-2 py-1 focus:outline-none appearance-none w-full rounded-md' 
              type={showPassword === true ? "string" : "password"} 
              name="password" id="password" value={password} onChange={onChange} placeholder='Password' />
            {showPassword === true ? 
              <FaEyeSlash className='cursor-pointer absolute right-4' onClick={onShowPassword} /> :
              <FaEye className='cursor-pointer absolute right-4' onClick={onShowPassword} />
            }
          </div> 
          
        </div>
        <div className='pb-4 flex flex-col text-sm'>
          <label htmlFor="password" className='font-semibold md:font-normal mb-2'>Confirm Password</label>
          <div className='flex items-center border-b-2 px-2 relative'>
            <FaLock className='absolute left-4' />
            <input 
              className='text-sm border-0 pl-8 h-8 px-2 py-1 focus:outline-none appearance-none w-full rounded-md' 
              type={showConfirmPassword === true ? "string" : "password"}
              name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={onChange} placeholder='Password' />
            {showConfirmPassword === true ? 
              <FaEyeSlash className='cursor-pointer absolute right-4' onClick={onShowConfirmPassword} /> :
              <FaEye className='cursor-pointer absolute right-4' onClick={onShowConfirmPassword} />
            }
          </div>   
        </div>
        <div className='mb-5 flex items-center justify-between text-sm'>
          <label htmlFor="business" className='font-semibold mb-2'>Are you a Business?</label>
          <div className='w-1/3'>
            <button
              type='button'
              className={business === true ? `bg-green-500 px-3 py-1 text-white w-1/2`: `border border-slate-200 px-3 py-1 w-1/2`}
              id='business-yes'
              value={true}
              onClick={onChange}
            >
              Yes
            </button>
            <button
              type='button'
              className={business === false ? `bg-green-500 px-3 py-1 text-white w-1/2` : `border border-slate-200 px-3 py-1 w-1/2`}
              id='business-no'
              value={false}
              onClick={onChange}
            >
              No
            </button>
          </div>
        </div>
        <div className='text-xs mb-5 flex justify-end font-semibold'>
          <Link to="/login" className='text-fuchsia-600'>Have an account?</Link>
        </div>
        <button type="submit" className='w-full rounded-md text-lg px-3 py-3 mb-2 font-semibold bg-gradient-to-r from-black to-slate-500 hover:bg-gradient-to-l text-white'>Sign Up</button>
      </form>
      </div> 

    </div>
  )
}

export default Register
