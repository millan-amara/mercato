import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TextField from '@mui/material/TextField';

function Home() {

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
      const response = await axios.post('/api/posts/createpost', formData);
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
    <div className='h-screen flex flex-col justify-between'>
      <Navbar />
      <div className='flex justify-center items-center'>
      <form onSubmit={handleSubmit} className='w-full md:w-3/5 py-8 px-4 text-center'>
        <TextField
            id="description"
            label="What are you looking for?"
            fullWidth
            multiline
            variant='standard'
            className='' 
            value={description} 
            onChange={onChange}
        />
        <button className='bg-fuchsia-950 text-white w-1/4 mt-4 hover:bg-fuchsia-900 py-2 rounded-lg text-xs'>Submit</button>

      </form>
      </div>

    </div>

  )
}

export default Home