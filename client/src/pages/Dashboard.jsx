import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '../components/AdminSidebar'
import AdminTransactions from '../components/AdminTransactions';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

// Fetch Posts Function
const fetchTransactions = async ({ queryKey }) => {
    const [, page] = queryKey;
    const { data } = await axios.get(`${API_URL}/payments/transactions/admin/search/page`, {
      params: { page, limit: 9 },
      withCredentials: true
    });
    console.log(data)
    return data;
};

function Dashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionStatuses, setTransactionStatuses] = useState({});
    const [loadingTransactionStatuses, setLoadingTransactionStatuses] = useState({});
    const [approved, setApproved] = useState(null);

    // React Query Fetch Hook
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['transactions', currentPage],
        queryFn: fetchTransactions,
        keepPreviousData: true, // Preserve previous data during pagination
    });

    const checkTransactionStatus = async (invoiceId) => {
        try {
            setLoadingTransactionStatuses(prevState => ({
                ...prevState,
                [invoiceId]: true
            }));
            const response = await axios.get(`${API_URL}/payments/status/${invoiceId}`, { withCredentials: true })

            console.log("Payment Status Response:", response.data);
            setTransactionStatuses(prevState => ({
                ...prevState,
                [invoiceId]: response.data.invoice.state
            }));

        } catch (error) {
            console.error("Error checking payment status:", error);

        } finally {
            // Set loading to false only for this check
            setLoadingTransactionStatuses(prevState => ({
                ...prevState,
                [invoiceId]: false
            }));
        }
    };

    const approveTransaction = async (txId) => {
        try {
            const response = await axios.put(`${API_URL}/payments/transactions/${txId}/approveTransaction`, { withCredentials: true })

            setApproved(txId)
            toast.success("Success")
        } catch (error) {
            console.error("Error updating, try again later:", error);
        }
    }


  return (
    <div className='flex'>
        <AdminSidebar />

        <AdminTransactions
            isLoading={isLoading}
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            transactionStatuses={transactionStatuses}
            checkTransactionStatus={checkTransactionStatus}
            loadingTransactionStatuses={loadingTransactionStatuses}
            approveTransaction={approveTransaction}
            approved={approved}
        />




    </div>
  )
}

export default Dashboard