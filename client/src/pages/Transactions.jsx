import React, { useEffect, useState } from 'react';
import MyMoney from '../components/MyMoney';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true)

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactionsResponse = await axios.post(`${API_URL}/payments/transactions/search/page`, { page: 1 });
                setTransactions(transactionsResponse.data.transactions);
                const rows = Array.from({ length: transactionsResponse.data.pages}, (_, i) => i + 1);
                console.log(`rows ${rows}`)
                console.log(`pages ${transactionsResponse.data.pages}`)
                setItems(rows)
                setLoading(false)
            } catch (err) {
                if(err.response) {
                    console.log('Sorry about that!')
                }    
            }

        }

        fetchTransactions();
    }, [])

    const onPagination = async(e) => {
        e.preventDefault()
        setLoading(true)
        const pageNumber = e.target.value;
        await axios.post(`${API_URL}/payments/transactions/search/page`, { page: pageNumber })
        .then((response) => {
          setTransactionsPayments(response.data.payments)
          setActivePage(pageNumber)
          setLoading(false)
        })
    }

  return (
    <div>
        <Navbar />
        <div className='mx-8'>
            <MyMoney
                transactions={transactions}
                onPagination={onPagination}
                activePage={activePage}
                items={items}
                loading={loading}
            />
        </div>
    </div>
  )
}

export default Transactions