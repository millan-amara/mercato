import React, { useState } from 'react';
import { format } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";



function MyTransactions({ transactions,onPagination,activePage,items,loadingTransactions,loadingStatuses,transactionStatuses,checkTransactionStatus,disputeTransaction,onChange,issue,issueSubmitted,setIssueSubmitted,disputed }) {

    const [openTransactionId, setOpenTransactionId] = useState(null);

    const toggleShow = (id) => {
        setOpenTransactionId(prev => (prev === id ? null : id));
    };

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
                                    <p>{format(new Date(pay.createdAt), "dd/MM/yyyy 'at' hh:mm a")}</p>
                                    <p>{pay.author.phone}</p> 
                                </div>
                            </div>
                            <div className='flex flex-col justify-around px-2 w-2/5 md:w-1/6'>
                                <p className='text-xs'>tx ID: {pay.invoiceId}</p>
                                {pay.status === "COMPLETE" || transactionStatuses[pay.invoiceId] === "COMPLETE" ? (
                                    <>
                                    <button disabled className={`bg-lime-600 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                        payment succesful
                                    </button>
                                    {pay.disputed || disputed === pay._id ? (
                                        <button disabled className='bg-slate-300 text-center text-white text-xs px-1 py-1 rounded-sm'>Disputed</button>
                                    ) : (
                                        <button onClick={() => {setDisputedTransactionId(pay._id); setIssueSubmitted(false);}} className='bg-orange-500 text-center text-white text-xs px-1 py-1 rounded-sm'>Dispute</button>
                                    )}
                                    
                                    </>
                                ) : (
                                    pay.status === "RETRY" || transactionStatuses[pay.invoiceId] === "RETRY" ? (
                                        <button disabled className='bg-slate-400 text-center text-white text-xs px-1 py-1 rounded-sm'>payment failed</button>
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

                        <div>
                            <button onClick={() => toggleShow(pay._id)} className='flex items-center font-semibold'>
                                <span className='mr-2'>
                                    {openTransactionId === pay._id ? 'Hide Details' : 'View Details'}
                                </span>
                                {openTransactionId === pay._id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </button>

                        </div>


                        <AnimatePresence>
                            {openTransactionId === pay._id && (
                                <motion.div
                                    className='mb-2'
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="space-y-4 mt-5">
                                      {pay.cartItems.map(item => (
                                        <div key={item.listingId} className="flex items-center justify-between border p-4 rounded-md shadow-sm">
                                          <div className="flex items-center space-x-4">
                                            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                                            <div>
                                              <h2 className="font-medium">{item.title}</h2>
                                              <p>Ksh. {item.price.toLocaleString()} × {item.quantity}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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

export default MyTransactions