import React, { useState, useEffect } from 'react'
import { BsBank } from 'react-icons/bs'
import { FaMobile } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'

function PaymentInfoComponent() { 
    const [user, setUser] = useState({})
    const [showMpesaForm, setShowMpesaForm] = useState(false)
    const [showBankForm, setShowBankForm] = useState(false)
    const [mpesaFormData, setMpesaFormData] = useState({
        mpesaName: '',
        mpesaPhone: '',
        mpesaMethod: ''
    })
    const [bankFormData, setBankFormData] = useState({
        beneficiaryName: '',
        beneficiaryCountry: '',
        beneficiaryPhone: '',
        bankName: '',
        bankCountry: '',
        accountNumber: '',
    })
    const [width, setWidth] = useState('52');

    const API_URL = import.meta.env.VITE_API_URL;

    const {mpesaName, mpesaPhone, mpesaMethod} = mpesaFormData;
    const {beneficiaryName,beneficiaryCountry,beneficiaryPhone,bankName,bankCountry,accountNumber} = bankFormData;

    const [showMpesaSubmit, setShowMpesaSubmit] = useState(true);
    const [showBankSubmit, setShowBankSubmit] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/logged-in`)
        .then((response) => {
            setUser(response.data.user)
            if(response.data.user.bank){
                setBankFormData(response.data.user.bank)
                setShowBankSubmit(false)
            }
            if(response.data.user.mpesa){
                setMpesaFormData(response.data.user.mpesa)
                setShowMpesaSubmit(false)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const handleShowMpesaForm = () => {
        if(showMpesaForm === true) {
            setShowMpesaForm(false)
        } else {
            setShowMpesaForm(true)
        }
        setShowBankForm(false)
    }
    const handleShowBankForm = () => {
        if(showBankForm === true) {
            setShowBankForm(false)
        } else {
            setShowBankForm(true)
        }
        setShowMpesaForm(false)
    }

    const onMpesaChange = (e) => {
        setMpesaFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onBankChange = (e) => {
        setBankFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onMpesaSubmit = async (e) => {
        try{
            e.preventDefault();
            if(mpesaName && mpesaPhone && mpesaMethod){
                await axios.put(`${API_URL}/users/${user._id}/update-mpesa`, mpesaFormData);
                setShowMpesaForm(false);
                toast.success('Successfully added Mpesa account')
            } else {
                toast.error('Please fill up all fields')
            }
        }catch(e) {
            toast.error('Failed, please try again')
        }
        
    }

    const onBankSubmit = async (e) => {
        e.preventDefault();
        try{
            if(beneficiaryName && beneficiaryCountry && beneficiaryPhone && bankName && bankCountry && accountNumber) {
                await axios.put(`${API_URL}/users/${user._id}/update-bank`, bankFormData);
                setShowBankForm(false);
                toast.success('Successfully added Bank account')
            } else {
                toast.error('Please fill up all fields')
            }
        } catch(e) {
            toast.error('Failed, please try again')
        }
        
    }

  return (
    <>
        <div className='container flex'>

        <div id='main' className={`w-full pt-10 ml-36`}>
          <div className=''>
            <p>Please addd either an Mpesa or Bank Account</p>
          </div>

          <div className='flex w-1/2 justify-between mt-5 font-bold'>
            
            {user.mpesa ?
            <div onClick={handleShowMpesaForm} className='flex cursor-pointer bg-gradient-to-r from-green-800 to-green-600 hover:bg-gradient-to-l text-white px-2 w-1/3 py-2 rounded-md items-center justify-center'>
                <FaMobile />
                <p className='pl-1'>Edit M-Pesa</p>
            </div> :
            <>
                <div onClick={handleShowMpesaForm} className='flex cursor-pointer bg-gradient-to-r from-green-800 to-green-600 hover:bg-gradient-to-l text-white px-2 w-1/3 py-2 rounded-md items-center justify-center'>
                <FaMobile />
                <p className='pl-1'>Add M-Pesa</p>
                </div>
            </>
            }
            {user.bank ? 
            <div onClick={handleShowBankForm} className='flex cursor-pointer bg-gradient-to-r from-orange-800 to-orange-600 hover:bg-gradient-to-l text-white px-2 w-1/3 py-2 rounded-md items-center justify-center'>
                <BsBank />
                <p className='pl-1'>Edit Bank</p>
            </div> :
            <>
                <div onClick={handleShowBankForm} className='flex cursor-pointer bg-gradient-to-r from-orange-800 to-orange-600 hover:bg-gradient-to-l text-white px-2 w-1/3 py-2 rounded-md items-center justify-center'>
                <BsBank />
                <p className='pl-1'>Add Bank</p>
            </div>
            </>
            }
          </div>

        {showMpesaForm &&
          <div className='w-1/2 mt-10 text-sm'>
           <form onSubmit={onMpesaSubmit}>
            <div className='mb-5'>
                <label htmlFor="mpesaName">Full Name</label>
                <input 
                    type="text" 
                    id='mpesaName'
                    value={mpesaName}
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onMpesaChange}
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="mpesaPhone">M-Pesa Phone Number</label>
                <input 
                    type="text" 
                    id='mpesaPhone'
                    value={mpesaPhone}
                    placeholder='07...'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onMpesaChange}
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="mpesaMethod" className='mt-5'>Accepted Method</label>
                <input 
                    type="text" 
                    id='mpesaMethod'
                    value={mpesaMethod}
                    placeholder='Pochi / Send Money'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onMpesaChange}
                />
            </div>
            {showMpesaSubmit &&
            <div >
                <button className='flex bg-gradient-to-r from-slate-600 to-slate-800 text-white w-full py-2 rounded-md items-center justify-center'>Save M-Pesa Details</button>
            </div>}
           </form>
          </div>
        }

        {showBankForm &&
          <div className='w-3/4 mt-10 text-sm'>
            <form>
            <div className='lg:columns-3 md:columns-2'>
            <div className='mb-5'>
                <label htmlFor="beneficiaryName">Beneficiary Name</label>
                <input 
                    type="text" 
                    value={beneficiaryName}
                    id='beneficiaryName'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onBankChange}
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="beneficiaryCountry">Beneficiary Country</label>
                <input 
                    type="text" 
                    value="Kenya"
                    id='beneficiaryCountry'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    disabled
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="beneficiaryPhone">Beneficiary Phone Number</label>
                <input 
                    type="text" 
                    value={beneficiaryPhone}
                    id='beneficiaryPhone'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onBankChange}
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="bankName">Bank Name</label>
                <input 
                    type="text" 
                    value={bankName}
                    id='bankName'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onBankChange}
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="bankCountry">Bank Country</label>
                <input 
                    type="text" 
                    value="Kenya"
                    id='bankCountry'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    disabled
                />
            </div>
            <div className='mb-5'>
                <label htmlFor="accountNumber">Bank Account Number</label>
                <input 
                    type="text" 
                    value={accountNumber}
                    id='accountNumber'
                    className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                    onChange={onBankChange}
                />
            </div>
            </div>
            {showBankSubmit &&
            <div >
                <button onClick={onBankSubmit} className='flex bg-gradient-to-r from-slate-600 to-slate-800 text-white w-full py-2 rounded-md items-center justify-center'>Save Bank Details</button>
            </div>}
            </form>
          </div>
        }

        </div>
        </div>    
    </>
  )
}

export default PaymentInfoComponent