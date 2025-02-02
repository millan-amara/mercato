import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUser } from '../features/auth/authSlice';

function ProfileEdit({ loggedInUser }) {

    const dispatch = useDispatch();
    const { userId } = useParams();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fname: '',
        phone: '',
        business: '',
        website: '',
    });

    const {fname,business,phone,website} = formData;

    useEffect(() => {
        setFormData({
            fname: loggedInUser.fname,
            phone: loggedInUser.phone,
            website: loggedInUser.website,
            business: loggedInUser.business,
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
            business,
            phone,
            website
        }
    
        try {
            await dispatch(updateUser({ userData, userId })).unwrap();
            setLoading(false);
            toast.success('Successfully updated');
        } catch (error) {
            setLoading(false);
            toast.error('Failed to update user');
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
            required
        />
      </div>
      <div className='mb-5'>     
        <label htmlFor="phone">Phone Number</label> 
        <input 
            type="text" 
            id='phone'
            value={phone}
            placeholder='0712345678'
            className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
            onChange={onChange}
            required
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
            required
        />
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

        <button onClick={onSubmit} type='submit' className="flex justify-center bg-gradient-to-r from-fuchsia-700 via-slate-800 to-gray-950 hover:bg-gradient-to-l w-full text-white text-bold rounded-xl py-3">
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