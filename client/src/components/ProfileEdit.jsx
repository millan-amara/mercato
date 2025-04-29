import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../features/auth/authSlice';
import axios from 'axios';

function ProfileEdit({ loggedInUser, isOwner }) {

    const dispatch = useDispatch();
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [formData, setFormData] = useState({
        fname: '',
        phone: '',
        website: '',
    });
    const { user } = useSelector((state) => state.auth);

    const {fname,phone,website,} = formData;
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        setFormData({
            fname: loggedInUser.fname,
            phone: loggedInUser.phone,
            website: loggedInUser.website,
        })
        console.log(loggedInUser)
    }, [])

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

    const onSubmit = async (e) => {
        e.preventDefault()
        
        setLoading(true)
        const userData = {
            fname,
            phone,
            website,
        }
        try {
            if(loggedInUser._id === userId) {
                await dispatch(updateUser({ userData, userId })).unwrap();
                setLoading(false);
                toast.success('Successfully updated');
            } else {
                setLoading(false);
                toast.error('failed to update user')
            }
        } catch (error) {
            setLoading(false);
            toast.error('Failed to update user');
        }
    }

      const sendVerification = async (e) => {
        
        try {
            setVerifyLoading(true);
          await axios.post(`${API_URL}/resend-otp`, {
            phone: user?.phone,
          });
          setVerifyLoading(false);
            navigate('/verifyotp');
        } catch (error) {
            setVerifyLoading(false);
          console.error(error);
          toast.error("Couldn't send verification. Try again in a few minutes");
        } 
      }


  return (
    <div className='flex justify-center'>
    <form className='w-full mx-2 md:w-2/5 xl:w-1/3 my-8'>

      <div className='mb-5 mt-5'>     
        <label htmlFor="fname">Name</label> 
        <input 
            type="text" 
            id='fname'
            value={fname}
            className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
            onChange={onChange}
        />
      </div>
      <div className='mb-5'>
        <div className='flex items-center justify-between'>
            <label htmlFor="phone">Phone Number</label>
            {!user.isVerified && (
                <button
                    type='button'
                    onClick={verifyLoading ? null : sendVerification}
                    disabled={verifyLoading}
                    className={`text-orange-500 text-sm underline underline-offset-2 cursor-pointer flex items-center gap-2
                        ${verifyLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {verifyLoading && (
                        <span className='w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin'></span>
                    )}
                    <span>{verifyLoading ? 'Sending...' : 'Verify Phone'}</span>
                </button>
            )}
        </div>

        <input 
            type="text" 
            id='phone' 
            value={phone}
            placeholder='0712345678'
            className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
            disabled={loggedInUser.isVerified}
            onChange={onChange}
        />
      </div>
      <div className='mb-5'>     
        <label htmlFor="website">Website</label> 
        <input 
            type="text" 
            id='website'
            value={website}
            placeholder='www.genpay.com'
            className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
            onChange={onChange}
        />
      </div>

        <button onClick={onSubmit} type='submit' className="flex justify-center bg-fuc bg-black hover:bg-slate-800 w-full text-white text-bold rounded-md py-3">
            <span>Edit profile</span>
            {loading &&
                <div className='ml-2 w-6 h-6 md:w-8 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
            }
        </button>
    </form>
    </div>
  )
}

export default ProfileEdit