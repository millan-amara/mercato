import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'
import RechargeTransactions from './RechargeTransactions';


function ProfileCoins({ loggedInUser }) {

    const [selectedOption, setSelectedOption] = useState("");
    const [activePage, setActivePage] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [transactionStatuses, setTransactionStatuses] = useState({});
    const [loadingStatuses, setLoadingStatuses] = useState({});
    const [items, setItems] = useState([]);

    const API_URL = import.meta.env.VITE_API_URL;


    const onFetchTransactions = async () => {
        try {
            const transactionsResponse = await axios.post(`${API_URL}/payments/recharge/search/page`, { page: 1 });
            setTransactions(transactionsResponse.data.transactions);
            const rows = Array.from({ length: transactionsResponse.data.pages}, (_, i) => i + 1);
            setItems(rows)
            setLoadingTransactions(false)
            console.log(transactionsResponse.data.transactions);
        } catch (err) {
            console.log(err)
        }
    }

    const onPagination = async(e) => {
        e.preventDefault()
        setLoadingTransactions(true)
        const pageNumber = e.target.value;
        await axios.post(`${API_URL}/payments/recharge/search/page`, { page: pageNumber })
        .then((response) => {
          setTransactions(response.data.transactions)
          setActivePage(pageNumber)
          setLoadingTransactions(false)
        })
    }

    const checkTransactionStatus = async (invoiceId) => {
        try {
            setLoadingStatuses(prevState => ({
                ...prevState,
                [invoiceId]: true
            }));
            const response = await axios.get(`${API_URL}/payments/recharge/status/${invoiceId}`)

            console.log("Payment Status Response:", response.data);
            setTransactionStatuses(prevState => ({
                ...prevState,
                [invoiceId]: response.data.invoice.state
            }));

        } catch (error) {
            console.error("Error checking payment status:", error);

        } finally {
            // Set loading to false only for this transaction
            setLoadingStatuses(prevState => ({
                ...prevState,
                [invoiceId]: false
            }));
        }
    };

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!selectedOption) {
            toast.error("Please select an option")
        } else {

            try {
               const response = await axios.post(`${API_URL}/payments/recharge`, {amount: selectedOption});
               setTransactions((prevState) => [response.data, ...prevState]);

            } catch (error) {
                console.error("Payment error:", error);
            }
    
        }
    }


  return (
    <div className='flex justify-center flex-col'>
    <form className='w-full mx-2 md:w-2/5 xl:w-1/3 my-8 flex flex-col items-center'>
        <div className='flex flex-col mb-5 text-sm'>
            <h3>Choose an option:</h3>

            <label className='mb-2'>
                <input
                type="radio"
                value="1"
                checked={selectedOption === "1"}
                onChange={handleChange}
                />
                <span className='ml-1'>200 coins for KES1</span>
            </label>

            <label className='mb-2'>
                <input
                type="radio"
                value="2"
                checked={selectedOption === "2"}
                onChange={handleChange}
                />
                <span className='ml-1'>2,500 coins for KES2</span>
            </label>

            <label className='mb-2'>
                <input
                type="radio"
                value="3"
                checked={selectedOption === "3"}
                onChange={handleChange}
                />
                <span className='ml-1'>6,000 coins for KES 3</span>
            </label>

            
        </div>

        <button onClick={handleSubmit} className='bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold rounded-md w-full py-3'>
            Add Coins
        </button>

    </form>

    <div>
        <button onClick={onFetchTransactions} className='bg-green-700 py-2 px-2 rounded-md text-white'>View Recharge History</button>
    </div>
    <div>
        <RechargeTransactions
            transactions={transactions}
            onPagination={onPagination}
            activePage={activePage}
            items={items}
            loadingTransactions={loadingTransactions}
            transactionStatuses={transactionStatuses}
            checkTransactionStatus={checkTransactionStatus}
            loadingStatuses={loadingStatuses}
        />
    </div>
    </div>
  )
}

export default ProfileCoins