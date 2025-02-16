import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';
import { IoMdSend } from "react-icons/io";

function Home() {

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    description: "",
  })

  const { description } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/posts/createpost`, formData);
      console.log(response)
      if(response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Saved successfully!');
        navigate(`/posts`)
      }
    } catch (error) {
      console.log(error)
    }
  }
 
  return (
    <div className='h-[100dvh] flex flex-col justify-between'>
      <Navbar />
      <div className='flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-full md:w-3/5 flex md:flex-col items-center py-8 px-4 text-center'>
        <TextField
            id="description"
            label="What are you looking for?"
            fullWidth
            multiline
            variant='standard'
            className='' 
            value={description} 
            onChange={onChange}
            autoFocus
        />
        <button className='md:bg-fuchsia-900 border md:border-0 border-fuchsia-800 flex justify-center items-center text-white px-3 md:w-1/4 md:mt-4 md:hover:bg-fuchsia-800 py-1 md:py-2 rounded-md md:rounded-lg md:text-xs ml-1 md:ml-0'>
          <span className='mr-2 hidden md:flex'>Submit</span>
          <span className='text-lg md:text-sm text-fuchsia-800 md:text-white'><IoMdSend /></span>
        </button>

      </form>
      </div>

    </div>
  )
}

export default Home