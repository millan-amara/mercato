import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Pay() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initiated, setInitiated] = useState('false');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [invoiceId, setInvoiceId] = useState(null);
    const [formData, setFormData] = useState({
        seller: '',
        item: '',
        amount: '',
    });

    const API_URL = import.meta.env.VITE_API_URL;

    const {seller,item,amount} = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    // const handleInitiate = () => {
    //     if(!seller) {
    //         toast.error("Please include seller's email")
    //     } else if (!item) {
    //         toast.error("Please type what you're buying, e.g. shoes")
    //     } else if(!amount) {
    //         toast.error("Please include the amount")
    //     } else {
    //         setInitiated('true')
    //     }
    // }

    // const onSubmit = async (e) => {
    //     e.preventDefault()
    //     setLoading(true)
    
    //     await axios.post(`${API_URL}/payments/makepay`, formData)

    //     navigate('/success-pay')

    //     setLoading(false);
    // }

    const initiatePayment = async (e) => {
        e.preventDefault();
        if(!seller) {
            toast.error("Please include seller's email")
        } else if (!item) {
            toast.error("Please type what you're buying, e.g. shoes")
        } else if(!amount) {
            toast.error("Please include the amount")
        } else {
            setLoading(true);

            try {
                const response = await axios.post(`${API_URL}/payments/makepay`, formData)
    
                console.log("STK Push Response:", response.data);
                setInvoiceId(data.response.invoice_id);
                checkPaymentStatus(data.response.invoice_id);
            } catch (error) {
                console.error("Payment error:", error);
                setPaymentStatus("Error initiating payment.");
            }
    
            setLoading(false);
        }

    };

    const checkPaymentStatus = async (invoiceId) => {
        let attempts = 0;
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${API_URL}/payments/payment-status/${invoiceId}`)

                console.log("Payment Status Response:", response.data);

                if (response.data.invoice.state === "COMPLETE") {
                    setPaymentStatus("Payment Successful 🎉");
                    clearInterval(interval);
                } else if (response.data.invoice.state === "FAILED") {
                    setPaymentStatus("Payment Failed ❌");
                    clearInterval(interval);
                } else if (attempts >= 10) {
                    setPaymentStatus("Payment Pending... Check again later.");
                    clearInterval(interval);
                }

                attempts++;
            } catch (error) {
                console.error("Error checking payment status:", error);
                clearInterval(interval);
            }
        }, 5000); // Check status every 5 seconds
    };

    // if(loading) {
    //     return (
    //         <>
    //             <Navbar />
    //             <div className='flex h-screen justify-center items-center'>
    //             <p className='text-xl font-semibold'>Just a moment...</p>
    //         </div>
    //         </>
    //     )
    // }


  return (
    <div>
        <Navbar />
        <div className='flex justify-center mt-10'>
        <form className='w-full mx-2 md:w-1/3 mb-8'>
          <h1 className='text-2xl mb-8 text-center'>Make Payment</h1>
      
          <div className='mb-5 mt-20'>     
            <label htmlFor="seller">Seller's Email</label> 
            <input 
                type="email" 
                id='seller'
                value={seller}
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
                required
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="item">What are you paying for?</label> 
            <input 
                type="text" 
                id='item'
                value={item}
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
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
                {loading ? "Processing..." : "Pay Now"}
            </button>
            {paymentStatus && <p>{paymentStatus}</p>}



        </form>
      </div>

    </div>
  )
}

export default Pay