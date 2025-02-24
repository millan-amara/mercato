import React, { useState } from 'react';
import { format } from "date-fns";
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboardArrowDown } from "react-icons/md";


function MyMoney({ payments,onPagination,activePage,items,loadingPayments,paymentStatuses,checkPaymentStatus,loadingPaymentStatuses }) {

    const [disputedPaymentId, setDisputedPaymentId] = useState(null);

  return (
    <>
        <div className='flex justify-center mb-6 mt-5'>
            <button className='shadow-sm shadow-gray-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md mr-4'>
                <p className='text-md mb-4'>Total paid out</p>
                <p className='text-xl'>KES. 3,000,000,000</p> 
            </button>
            <button className='shadow-sm shadow-green-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md mr-4'>
                <p className='text-md mb-4'>Approved for this period</p>
                <p className='text-xl'>KES. 500,000</p>
            </button>
            <button className='shadow-sm shadow-gray-600 hover:bg-gray-100 py-3 px-4 w-1/3 rounded-md'>
                <p className='text-md mb-4'>Pending Approval</p>
                <p className='text-xl'>KES. 200,000</p>
            </button>
        </div>
        {loadingPayments ? (
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
                {payments.length !== 0 && payments.map((pay) => (
                    <div key={pay._id} className='border-b-2 py-4 px-2 hover:bg-slate-200'>
                    <div className={`flex justify-between text-sm ${disputedPaymentId === pay._id && 'mb-3'}`}>
                        <div className='flex justify-between w-3/5'>
                            <div>
                                <p className='font-semibold'>KES. {pay.amount}</p>
                                <p>{format(new Date(pay.createdAt), "dd/MM/yyyy")}</p>
                                <p>{pay.author.phone}</p>
                                <p>{pay.item}</p>
                            </div>
                        </div>
                        <div className='flex flex-col justify-around px-2 w-2/5 md:w-1/6'>
                            <p className='text-xs'>tx ID: {pay.invoiceId}</p>
                            {pay.status === "COMPLETE" || paymentStatuses[pay.invoiceId] === "COMPLETE" ? (
                                <>
                                    <button disabled className={`bg-lime-600 text-center text-white text-xs px-1 py-1 mb-1 rounded-sm`}>
                                        payment succesful
                                    </button>
                                    {pay.disputed && (
                                        <button onClick={() => setDisputedPaymentId(pay._id)} className='bg-slate-300 text-white text-xs px-1 py-1 rounded-sm flex justify-center items-center '>
                                            <span className='mr-1'>Disputed</span>
                                            <MdKeyboardArrowDown className='text-base' />
                                        </button>
                                    )}
                                </>
                            ) : (
                                pay.status === "RETRY" || paymentStatuses[pay.invoiceId] === "RETRY" ? (
                                    <button disabled className='bg-slate-400 text-center text-white text-xs px-1 py-1 rounded-sm'>payment failed</button>
                                ) : (
                                    <button onClick={() => checkPaymentStatus(pay.invoiceId)} className="text-center text-white text-xs px-1 py-1 rounded-sm bg-slate-400">
                                        {loadingPaymentStatuses[pay.invoiceId] ? (
                                            <div className='mx-auto w-4 h-4 md:w-6 md:h-6 border-4 border-slate-300 border-t-transparent rounded-full animate-spin'></div>
                                        ) : "pending, click to refresh"}
                                    </button>
                                )
                            )}

                        </div>
                    </div>
                    <AnimatePresence>
                        {disputedPaymentId === pay._id && (
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
        )}


        <div className='flex justify-center mt-8 md:pb-8 mb-20 md:mb-0' >
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

export default MyMoney