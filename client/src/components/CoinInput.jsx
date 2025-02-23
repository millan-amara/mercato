import React from 'react'

function CoinInput({ handleSubmit, handleChange, selectedOption}) {
  return (
    <div>
        <form className='w-full mx-2 md:w-2/5 xl:w-1/3 my-8 flex flex-col items-center'>
            <div className='flex flex-col mb-5 text-sm'>
                <h3>Choose an option:</h3>

                <label className='mb-2'>
                    <input
                    type="radio"
                    value="1"
                    checked={selectedOption === "1"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>200 coins for KES1</span>
                </label>

                <label className='mb-2'>
                    <input
                    type="radio"
                    value="2"
                    checked={selectedOption === "2"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>2,500 coins for KES2</span>
                </label>

                <label className='mb-2'>
                    <input
                    type="radio"
                    value="3"
                    checked={selectedOption === "3"}
                    onChange={handleChange}
                    />
                    <span className='ml-1'>6,000 coins for KES 3</span>
                </label>

                
            </div>

            <button onClick={handleSubmit} className='bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold rounded-md w-full py-3'>
                Add Coins
            </button>

        </form>
    </div>
  )
}

export default CoinInput