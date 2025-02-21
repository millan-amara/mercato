import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import MyTransactions from '../components/MyTransactions';

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [items, setItems] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [transactionStatuses, setTransactionStatuses] = useState({});
    const [loadingStatuses, setLoadingStatuses] = useState({});
    const [issueSubmitted, setIssueSubmitted] = useState(false);
    const [disputed, setDisputed] = useState(null);

    const [formData, setFormData] = useState({
        issue: '',
    });
    const {issue} = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const transactionsResponse = await axios.post(`${API_URL}/payments/transactions/search/page`, { page: 1 });
                setTransactions(transactionsResponse.data.transactions);
                const rows = Array.from({ length: transactionsResponse.data.pages}, (_, i) => i + 1);
                setItems(rows)
                setLoadingTransactions(false)
            } catch (err) {
                console.log(err)
            }

        }

        fetchTransactions();
    }, [])

    const onPagination = async(e) => {
        e.preventDefault()
        setLoadingTransactions(true)
        const pageNumber = e.target.value;
        await axios.post(`${API_URL}/payments/transactions/search/page`, { page: pageNumber })
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
            const response = await axios.get(`${API_URL}/payments/status/${invoiceId}`)

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

    const disputeTransaction = async (txId) => {
        try {
            const response = await axios.put(`${API_URL}/payments/transactions/${txId}/disputeTransaction`, formData)

            console.log("Transaction Status:", response.data);
            setIssueSubmitted(true)
            setDisputed(txId)
            toast.success("We'll follow up and update you promptly. Thanks.")
        } catch (error) {
            console.error("Error updating, try again later:", error);
        }
    }

  return (
    <div>
        <Navbar />
        <div className='mx-4 md:mx-8'>
            <MyTransactions
                transactions={transactions}
                onPagination={onPagination}
                activePage={activePage}
                items={items}
                loadingTransactions={loadingTransactions}
                transactionStatuses={transactionStatuses}
                checkTransactionStatus={checkTransactionStatus}
                disputeTransaction={disputeTransaction}
                loadingStatuses={loadingStatuses}
                issue={issue}
                onChange={onChange}
                issueSubmitted={issueSubmitted}
                setIssueSubmitted={setIssueSubmitted}
                disputed={disputed}
            />
        </div>
    </div>
  )
}

export default Transactions