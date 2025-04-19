import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import Compressor from 'compressorjs';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function PostHouse() {

  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bedrooms: '',
    price: '',
    location: '',
    caretaker: '',
    images: [],
  })

  const {title,bedrooms,price,location,caretaker} = formData;
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [description, setDescription] = useState("");


  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (selectedImages.length > 6) {  // Fix: Use selectedImages instead of images
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }
  
    const requestBody = new FormData();
    requestBody.append("description", Array.isArray(description) ? description.join("") : description);
  
    // Append all form fields except images
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        requestBody.append(key, String(value));  // Ensure it's a string
      }
    });
  
    // Compress and append images
    const compressedImages = await Promise.all(selectedImages.map(compressImage));
  
    compressedImages.forEach((image) => {
      requestBody.append("files", image); // Assuming backend expects 'files'
    });
  
    // Debugging: Log FormData entries
    for (const pair of requestBody.entries()) {
      console.log(pair[0], pair[1]);
    }

  
    try {

      const response = await axios.post(`${API_URL}/houses`, requestBody);
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("House saved");
        navigate(`/houses/${response.data._id}`);
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    //Text/Booleans/Numbers
    if(!e.target.files) {
      setFormData((prevState) => ({
          ...prevState,
          [e.target.id]: e.target.value
      }))
    }
  }

  const onSelectFile = (event) => {
      
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
  
    const imagesArray = [...selectedFilesArray]

    selectedFilesArray.map((file) => (
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          console.log(result)
          setFormData((prevState) => ({
            ...prevState,
            images: [...prevState.images, result]
          }))
        },
        error(err) {
          console.log(err.message)
        }
      })
    ));

    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    
    // FOR BUG IN CHROME
    event.target.value = "";
  };

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image));
    URL.revokeObjectURL(image);
    setFormData((prevState) => ({
      ...prevState,
      images: [...prevState.images.filter((e) => e !== image)]
    }))
  }

  if(loading) {
    return <h1>Just a moment...</h1>
  }

  return (
    <div>
      <Navbar />
      <div className='flex justify-center mt-10 pb-24'>
        <form onSubmit={onSubmit} className='w-full mx-2 md:w-1/3 mb-8'>
          <h1 className='text-2xl mb-4 text-center'>Create House</h1>

          <div className='mb-5 mt-8'>     
            <label htmlFor="title">House Title</label> 
            <input 
                type="text" 
                id='title'
                value={title}
                placeholder='30,000 2 bedroom master ensuite in Ngong'
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='mb-5 flex flex-col text-sm'>
            <label htmlFor="caretaker">Caretaker's Phone Number</label>
              <input 
                className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' 
                type="number" name="caretaker" id="caretaker" value={caretaker} onChange={onChange} placeholder='07...' />
          </div>
          <div className='mb-5'>     
            <label htmlFor="bedrooms">Number of Bedrooms</label> 
            <input 
                type="number" 
                id='bedrooms'
                value={bedrooms}
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="location">Location</label> 
            <input 
              type="text"
              id='location'
              value={location}
              className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
              onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="price">Rent Price</label> 
            <input 
              type="number"
              id='price'
              value={price}
              placeholder='rent per month'
              className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
              onChange={onChange}
            />
          </div>
          <div className='w-full h-80 md:h-72 max-w-screen-md mb-8'>
            <ReactQuill 
              theme="snow" 
              required
              value={description}
              placeholder='Describe any additional house features here...'
              className='h-72 mb-12'
              onChange={setDescription}
            />
          </div>

          <ImageUpload
            onSelectFile={onSelectFile}
            selectedImages={selectedImages}
            deleteHandler={deleteHandler}
          />

          <button type='submit' className="bg-fuchsia-700 hover:bg-fuchsia-800 w-full text-white text-bold rounded-md py-3">
            Create House 
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostHouse