import React from 'react';
import { format } from "date-fns";


function MyTransactions({ payments,onPagination,activePage,items,loading }) {

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
        {loading ? (
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
                    <div key={pay._id} className='hover:bg-slate-200 flex justify-between border-b-2 py-4 px-2 text-sm'>
                        <div className='flex justify-between'>
                            <div>
                                <p className='font-semibold'>KES. {pay.amount}</p>
                                <p>{format(new Date(pay.createdAt), "dd/MM/yyyy")}</p>
                                <p>{pay.author.phone}</p>
                                <p>{pay.item}</p>
                            </div>
                        </div>
                        <div className='flex flex-col justify-around px-2'>
                            <p className='text-xs'>{pay._id}</p>
                            <button disabled className='bg-lime-600 text-center text-white text-sm px-2 py-1 rounded-sm'>{pay.status}</button>
                            <button disabled className='bg-orange-600 text-center text-white text-sm px-2 py-1 rounded-sm'>Approval: Pending</button>
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

export default MyTransactions