import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



function ProfileCoins({ loggedInUser }) {

    const { userId } = useParams();

    const [selectedOption, setSelectedOption] = useState("");

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
    }


  return (
    <div className='flex justify-center'>
    <form className='w-full mx-2 md:w-2/5 xl:w-1/3 my-8 flex flex-col items-center'>
        <div className='flex flex-col mb-5 text-sm'>
            <h3>Choose an option:</h3>

            <label className='mb-2'>
                <input
                type="radio"
                value="1000"
                checked={selectedOption === "1000"}
                onChange={handleChange}
                />
                <span className='ml-1'>200 coins for KES1000</span>
            </label>

            <label className='mb-2'>
                <input
                type="radio"
                value="10000"
                checked={selectedOption === "10000"}
                onChange={handleChange}
                />
                <span className='ml-1'>2,500 coins for KES10,000</span>
            </label>

            <label className='mb-2'>
                <input
                type="radio"
                value="20000"
                checked={selectedOption === "20000"}
                onChange={handleChange}
                />
                <span className='ml-1'>6,000 coins for KES 20,000</span>
            </label>

            
        </div>

        <button onClick={handleSubmit} className='bg-slate-500 hover:bg-slate-800 text-white text-sm font-semibold rounded-md w-full py-3'>
            Add Coins
        </button>

    </form>
    </div>
  )
}

export default ProfileCoins