import React from 'react'

function CoinInput({ handleSubmit, handleChange, selectedOption, onFetchTransactions}) {
  return (
    <div className='px-2'>
        <form className='md:w-2/5 xl:w-1/3 my-8 flex flex-col items-center'>
            <div className='flex flex-col mb-5 text-sm'>
                <h3>How much do you wish to recharge?</h3>

                <label className='mb-2 mt-3'>
                    <input
                    type="radio"
                    value="1000"
                    checked={selectedOption === "1000"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>100 coins for KES 2,000</span>
                </label>

                <label className='mb-2'>
                    <input
                    type="radio"
                    value="10000"
                    checked={selectedOption === "10000"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>1,000 coins for KES 10,000</span>
                </label>

                <label className='mb-2'>
                    <input
                    type="radio"
                    value="20000"
                    checked={selectedOption === "20000"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>3,000 coins for KES 20,000</span>
                </label>

                
            </div>

            <button onClick={handleSubmit} className='bg-slate-800 hover:bg-slate-600 text-white text-sm font-semibold rounded-md w-full py-3'>
                Add Coins
            </button>

        </form>
        <div className='mb-5 md:w-2/5 xl:w-1/3'>
            <button onClick={onFetchTransactions} className='border border-slate-400 bg-slate-50 shadow-md hover:bg-slate-100 py-3 rounded-md w-full'>View Recharge History</button>
        </div>
    </div>
  )
}

export default CoinInput