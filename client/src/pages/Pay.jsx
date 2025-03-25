import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Pay() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    seller: '',
    item: '',
    amount: '',
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const { seller, item, amount } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const initiatePayment = async (e) => {
    e.preventDefault();

    if (!seller) {
      toast.error("Please include seller's email");
    } else if (!item) {
      toast.error("Please type what you're buying, e.g. shoes");
    } else if (!amount) {
      toast.error("Please include the amount");
    } else {
      setLoading(true);

      try {
        await axios.post(`${API_URL}/payments/makepay`, formData, { withCredentials: true });
        navigate('/success-pay');
      } catch (error) {
        console.error("Payment error:", error);
      }

      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='flex h-screen justify-center items-center'>
          <p className='text-xl font-semibold'>Just a moment...</p>
        </div>
      </>
    );
  }

  return (
    <div className='h-[100dvh] md:min-h-screen flex flex-col'>
      <Navbar />
      <div className='flex flex-col items-center justify-center flex-grow px-4'>
        <form className='w-full max-w-md bg-white p-6 rounded-lg shadow-lg' onSubmit={initiatePayment}>
          <h1 className='text-2xl font-semibold text-center mb-6'>Make Payment</h1>

          <div className='mb-5'>
            <label htmlFor='seller' className='block text-sm font-medium text-gray-700'>Seller's Email</label>
            <input
              type='email'
              id='seller'
              value={seller}
              className='mt-2 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm'
              onChange={onChange}
              placeholder='one@one.com'
              required
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="item" className='block text-sm font-medium text-gray-700'>What are you paying for?</label> 
            <input 
                type="text" 
                id='item'
                maxLength={25}
                value={item}
                className="mt-2 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
                placeholder="Samsung TV, washing machine"
                required
            />
          </div>

          <div className='mb-5'>
            <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>Amount</label>
            <input
              type='number'
              id='amount'
              placeholder='KES'
              value={amount}
              className='mt-2 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm'
              onChange={onChange}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-fuchsia-800 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition-opacity'
          >
            Pay Now
          </button>
        </form>

        <div className='text-xs text-center mt-6 text-gray-600'>
          <p>Your money is safely held until service is delivered.</p>
          <p>If there are any issues, you can always raise a dispute.</p>
        </div>
      </div>
    </div>
  );
}

export default Pay;
