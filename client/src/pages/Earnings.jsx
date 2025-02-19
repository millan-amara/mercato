import React, { useEffect, useState } from 'react';
import MyMoney from '../components/MyMoney';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Earnings() {

    const [payments, setPayments] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [items, setItems] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);
    const [paymentStatuses, setPaymentStatuses] = useState({});
    const [loadingPaymentStatuses, setLoadingPaymentStatuses] = useState({});
    // const [issueSubmitted, setIssueSubmitted] = useState(false);
    // const [disputed, setDisputed] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paymentsResponse = await axios.post(`${API_URL}/payments/search/page`, { page: 1 });
                setPayments(paymentsResponse.data.payments);
                const rows = Array.from({ length: paymentsResponse.data.pages}, (_, i) => i + 1);

                setItems(rows)
                setLoadingPayments(false)
            } catch (err) {
                console.log(err)
            }

        }

        fetchPayments();
    }, []) 

    const onPagination = async(e) => {
        e.preventDefault()
        setLoadingPayments(true)
        const pageNumber = e.target.value;
        await axios.post(`${API_URL}/payments/search/page`, { page: pageNumber })
        .then((response) => {
          setPayments(response.data.payments)
          setActivePage(pageNumber)
          setLoadingPayments(false)
        })
    }

    const checkPaymentStatus = async (invoiceId) => {
        try {
            setLoadingPaymentStatuses(prevState => ({
                ...prevState,
                [invoiceId]: true
            }));
            const response = await axios.get(`${API_URL}/payments/status/${invoiceId}`)

            console.log("Payment Status Response:", response.data);
            setPaymentStatuses(prevState => ({
                ...prevState,
                [invoiceId]: response.data.invoice.state
            }));

        } catch (error) {
            console.error("Error checking payment status:", error);

        } finally {
            // Set loading to false only for this check
            setLoadingPaymentStatuses(prevState => ({
                ...prevState,
                [invoiceId]: false
            }));
        }
    };


  return (
    <div>
        <Navbar />
        <div className='mx-4 md:mx-8'>
            <MyMoney
                payments={payments}
                onPagination={onPagination}
                activePage={activePage}
                items={items}
                loadingPayments={loadingPayments}
                paymentStatuses={paymentStatuses}
                checkPaymentStatus={checkPaymentStatus}
                loadingPaymentStatuses={loadingPaymentStatuses}
            />
        </div>
    </div>
  )
}

export default Earnings