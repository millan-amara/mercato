import React, { useEffect, useState } from 'react';
import ProfileEarnings from '../components/ProfileEarnings';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Earnings() {

    const [payments, setPayments] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paymentsResponse = await axios.post('/api/payments/search/page', { page: 1 });
                setPayments(paymentsResponse.data.payments);
                const rows = Array.from({ length: paymentsResponse.data.pages}, (_, i) => i + 1);
                console.log(`rows ${rows}`)
                console.log(`pages ${paymentsResponse.data.pages}`)
                setItems(rows)
                setLoading(false)
            } catch (err) {
                if(err.response) {
                    console.log('Sorry about that!')
                }    
            }

        }

        fetchPayments();
    }, [])

    const onPagination = async(e) => {
        e.preventDefault()
        setLoading(true)
        const pageNumber = e.target.value;
        await axios.post('/api/payments/search/page', { page: pageNumber })
        .then((response) => {
          setPayments(response.data.payments)
          setActivePage(pageNumber)
          setLoading(false)
        })
    }

  return (
    <div>
        <Navbar />
        <div className='mx-8'>
            <ProfileEarnings
                payments={payments}
                onPagination={onPagination}
                activePage={activePage}
                items={items}
                loading={loading}
            />
        </div>
    </div>
  )
}

export default Earnings