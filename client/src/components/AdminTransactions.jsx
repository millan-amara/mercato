import React, { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';
import { format } from "date-fns";

function AdminTransactions({ isLoading,data,currentPage,setCurrentPage,transactionStatuses,checkTransactionStatus,loadingTransactionStatuses,approveTransaction,approved}) {

    const [disputedTransactionId, setDisputedTransactionId] = useState(null);
    const [approvedTransactionId, setApprovedTransactionId] = useState(null);


  return (
    <div className='ml-64'>
        <div className='flex justify-center mb-6 mt-5'>
            <button className='shadow-sm shadow-gray-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md mr-4'>
                <p className='text-md mb-4'>All Payments</p>
                <p className='text-xl'>KES. 3,000,000,000</p> 
            </button>
            <button className='shadow-sm shadow-green-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md mr-4'>
                <p className='text-md mb-4'>Approved for this period</p>
                <p className='text-xl'>KES. 500,000</p>
            </button>
            <button className='shadow-sm shadow-gray-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md mr-4'>
                <p className='text-md mb-4'>Pending Approval</p>
                <p className='text-xl'>KES. 200,000</p>
            </button>
            <button className='shadow-sm shadow-gray-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md'>
                <p className='text-md mb-4'>Disputed Payments</p>
                <p className='text-xl'>KES. 200,000</p>
            </button>
        </div>

        {/* Details */}
        <div className='mt-6 bg-slate-100'>
            {!isLoading && data.transactions.length !== 0 && data.transactions.map((pay) => (
                <div key={pay._id} className='border-b-2 py-4 px-2 hover:bg-slate-200'>
                    <div className='flex justify-between text-sm'>
                        <div className='flex justify-between w-3/5'>
                            <div className=''>
                                <p className='text-xs'>tx ID: {pay.invoiceId}</p>
                                <p className='font-semibold'>KES. {pay.amount}</p>
                                <p>{format(new Date(pay.createdAt), "dd/MM/yyyy 'at' hh:mm a")}</p>
                            </div>
                        </div>

                        <div>
                        {pay.status === "COMPLETE" || transactionStatuses[pay.invoiceId] === "COMPLETE" ? (
                            <div className='flex'>

                                {pay.disputed ? (
                                    <button onClick={() => setDisputedTransactionId(pay._id)} className='bg-slate-300 text-white text-xs px-1 py-1 rounded-sm flex justify-center items-center '>
                                        <span className='mr-1'>Disputed</span>
                                        <MdKeyboardArrowDown className='text-base' />
                                    </button>
                                ) : (
                                    <>
                                    <button disabled className={`bg-lime-600 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                        payment succesful
                                    </button>
                                    {pay.approved || approved === pay._id ? (
                                        <div className='ml-4'>
                                            <button disabled className={`bg-lime-400 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                                Approved
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='ml-4'>
                                            <button type='submit' onClick={() => approveTransaction(pay._id)} className={`bg-lime-500 hover:bg-lime-600 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                                Approve
                                            </button>
                                        </div>
                                    )}

                                    </>
                                )}

                                

                            </div>
                        ) : (
                            pay.status === "RETRY" || transactionStatuses[pay.invoiceId] === "RETRY" ? (
                                <button disabled className='bg-slate-400 text-center text-white text-xs px-1 py-1 rounded-sm'>payment failed</button>
                            ) : (
                                <button onClick={() => checkTransactionStatus(pay.invoiceId)} className="text-center text-white text-xs px-1 py-1 rounded-sm bg-slate-400">
                                    {loadingTransactionStatuses[pay.invoiceId] ? (
                                        <div className='mx-auto w-4 h-4 md:w-6 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
                                    ) : "pending, click to refresh"}
                                </button>
                            )
                        )}

                        </div>
                    </div>
                    <AnimatePresence>
                        {disputedTransactionId === pay._id && (
                            <motion.div
                                className='mb-2'
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div 
                                    className="bg-slate-50 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200" 
                                >{pay.disputeReason}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            ))}
        </div>
            {!isLoading && data.transactions.length !== 0 && (
                <div className='flex justify-center mt-8 mb-20 md:mb-0 md:pb-8' >
                    <ul id='pagination' className='flex justify-between px-2 rounded-3xl bg-white'>
                        {Array.from({ length: data.pages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-1 rounded-full cursor-pointer mx-1 ${
                            page === currentPage ? 'bg-green-700 text-white' : 'hover:bg-green-300'
                            }`}
                        >
                            {page}
                        </li>
                        ))}
                    </ul>
                </div>
            )}

    </div>
  )
}

export default AdminTransactions