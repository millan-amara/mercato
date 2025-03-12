import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Pay() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        seller: '',
        amount: '',
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const {seller,amount} = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const initiatePayment = async (e) => {
        e.preventDefault();

        if(!seller) {
            toast.error("Please include seller's email")
        } else if(!amount) {
            toast.error("Please include the amount")
        } else {
            setLoading(true);

            try {
                await axios.post(`${API_URL}/payments/makepay`, formData)
                navigate('/success-pay')

                setLoading(false);
            } catch (error) {
                console.error("Payment error:", error);
            }
    
            setLoading(false);
        }
    };

    if(loading) {
        return (
            <>
                <Navbar />
                <div className='flex h-screen justify-center items-center'>
                <p className='text-xl font-semibold'>Just a moment...</p>
            </div>
            </>
        )
    }


  return (
    <div>
        <Navbar />
        <div className='flex flex-col items-center mt-5 px-2'>
            <form className='w-full mx-2 md:w-1/3 mb-8'>
            <h1 className='text-xl text-center'>Make Payment</h1>
        
            <div className='mb-5 mt-10'>     
                <label htmlFor="seller">Agent's Email</label> 
                <input 
                    type="email" 
                    id='seller'
                    value={seller}
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onChange}
                    placeholder='one@one.com'
                    required
                />
            </div>
            <div className='mb-5'>     
                <label htmlFor="price">Amount</label> 
                <input 
                    type="number" 
                    id='amount'
                    placeholder='KES'
                    value={amount}
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onChange}
                    required
                />
            </div>

                <button type='submit' onClick={initiatePayment} disabled={loading} className="mt-4 bg-gradient-to-r from-green-700 via-slate-800 to-gray-950 hover:bg-gradient-to-l w-full text-white text-bold py-3">
                    Pay Now
                </button>

            </form>
            <div className='text-xs flex flex-col items-center'>
                <p className='mb-2'>Your money is SAFELLY held till service is delivered.</p>
                <p>In case of any issues with the service, you can always raise a dispute.</p>
            </div>
        </div>

    </div>
  )
}

export default Pay