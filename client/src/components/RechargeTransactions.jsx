import React, { useState } from 'react';
import { format } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';


function RechargeTransactions({ transactions,onPagination,activePage,items,loadingTransactions,loadingStatuses,transactionStatuses,checkTransactionStatus }) {

    const [disputedTransactionId, setDisputedTransactionId] = useState(null);

  return (
    <>
        <div>
            <h1 className='text-center'>My Transactions</h1>
        </div>
        {loadingTransactions ? (
            <>
            <div className='mt-6 bg-slate-200 animate-pulse'>
                <div className='flex justify-between border-b-2 border-slate-300 py-4 px-2'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='bg-slate-300 text-center text-slate-300'>KES. 2050</p>
                            <p className='bg-slate-300 text-center text-slate-300'>12/07/2025</p>
                            <p className='bg-slate-300 text-center text-slate-300'>078907568</p>
                            <p className='bg-slate-300 text-center text-slate-300'>shoe lace</p>
                        </div>
                    </div>
                    <div className='flex flex-col px-2 h-14'>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Received: Yes</button>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Pending</button>
                    </div>
                </div>
                <div className='flex justify-between border-b-2 border-slate-300 py-4 px-2'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='bg-slate-300 text-center text-slate-300'>KES. 2050</p>
                            <p className='bg-slate-300 text-center text-slate-300'>12/07/2025</p>
                            <p className='bg-slate-300 text-center text-slate-300'>078907568</p>
                            <p className='bg-slate-300 text-center text-slate-300'>shoe lace</p>
                        </div>
                    </div>
                    <div className='flex flex-col px-2 h-14'>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Received: Yes</button>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Pending</button>
                    </div>
                </div>
                <div className='flex justify-between border-b-2 border-slate-300 py-4 px-2'>
                    <div className='flex justify-between'>
                        <div>
                            <p className='bg-slate-300 text-center text-slate-300'>KES. 2050</p>
                            <p className='bg-slate-300 text-center text-slate-300'>12/07/2025</p>
                            <p className='bg-slate-300 text-center text-slate-300'>078907568</p>
                            <p className='bg-slate-300 text-center text-slate-300'>shoe lace</p>
                        </div>
                    </div>
                    <div className='flex flex-col px-2 h-14'>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Received: Yes</button>
                        <button className='bg-slate-300 text-center text-slate-300 text-sm px-2 py-1 rounded-sm'>Pending</button>
                    </div>
                </div>
            </div>
            </>
            
        ) : (
            <div className='mt-6 bg-slate-100'>
                {transactions.length !== 0 && transactions.map((pay) => (
                    <div key={pay._id} className='border-b-2 py-4 px-2 hover:bg-slate-200'>
                        <div className='flex justify-between text-sm'>
                            <div className='flex justify-between w-3/5'>
                                <div>
                                    <p className='font-semibold'>KES. {pay.amount}</p>
                                    <p>{format(new Date(pay.createdAt), "dd/MM/yyyy")}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-around px-2 w-2/5 md:w-1/6'>
                                <p className='text-xs'>tx ID: {pay.invoiceId}</p>
                                {pay.status === "COMPLETE" || transactionStatuses[pay.invoiceId] === "COMPLETE" ? (
                                    <>
                                        <button disabled className={`bg-lime-600 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                            succesful
                                        </button>
                                    </>
                                ) : (
                                    pay.status === "RETRY" || transactionStatuses[pay.invoiceId] === "RETRY" ? (
                                        <button disabled className='bg-slate-400 text-center text-white text-xs px-1 py-1 rounded-sm'>failed</button>
                                        // {pay.disputed || disputed === pay._id ? (
                                        //     <button disabled className='bg-slate-300 text-center text-white text-xs px-1 py-1 rounded-sm'>Disputed</button>
                                        // ) : (
                                        //     <button onClick={() => {setDisputedTransactionId(pay._id); setIssueSubmitted(false);}} className='bg-orange-500 text-center text-white text-xs px-1 py-1 rounded-sm'>Dispute</button>
                                        // )}
                                    ) : (
                                        <button onClick={() => checkTransactionStatus(pay.invoiceId)} className="text-center text-white text-xs px-1 py-1 rounded-sm bg-slate-400">
                                            {loadingStatuses[pay.invoiceId] ? (
                                                <div className='mx-auto w-4 h-4 md:w-6 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
                                            ) : "pending, click to refresh"}
                                        </button>
                                    )

                                )}

                            </div>
                        </div>

                    </div>
                ))}
            </div>
        )}


        <div className='flex justify-center mt-16 md:pb-8' >
          <ul id='pagination' className='flex justify-between px-2 rounded-3xl bottom-24 bg-white'>
            {items.map((page) => (
              page === activePage ? (
                <li onClick={onPagination} key={`active-${page}`} value={page} id={page} className='bg-green-700 px-4 py-1 rounded-full text-white cursor-pointer mx-1'>{page}</li>):
                (<li onClick={onPagination} key={`inactive-${page}`} value={page} id={page} className='px-4 py-1 rounded-full cursor-pointer hover:bg-green-300 mx-1'>{page}</li>)
            ))}
          </ul>
        </div>
    </>
  )
}

export default RechargeTransactions