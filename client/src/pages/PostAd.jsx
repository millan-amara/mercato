import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import Compressor from 'compressorjs';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function PostAd() {

  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    actualPrice: '',
    offerPrice: '',
    shipping: '',
    delivery: '',
    stock: '',
    images: [],
  })

  const {title,actualPrice,offerPrice,shipping,delivery,stock} = formData;
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
    requestBody.append("description", description);  // Fix: Use description instead of bidText
  
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
      const response = await axios.post(`${API_URL}/listings`, requestBody, { withCredentials: true });
      
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Listing saved");
        navigate("/");
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
    ))

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
          <h1 className='text-2xl mb-4 text-center'>Post A Product</h1>
      

          <div className='mb-5 mt-8'>     
            <label htmlFor="title">Product Title</label> 
            <input 
                type="text" 
                id='title'
                value={title}
                placeholder='Samsung s21 ultra 128GB black'
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="actualPrice">Actual Price</label> 
            <input 
                type="number" 
                id='actualPrice'
                value={actualPrice}
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="offerPrice">Offer Price</label> 
            <input 
              type="number" 
              id='offerPrice'
              value={offerPrice}
              placeholder='Ukikata bei'
              className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
              onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="shipping">Shipping</label> 
            <input 
              type="number" 
              id='shipping'
              value={shipping}
              placeholder='0'
              className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
              onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="delivery">Delivery</label> 
            <input 
                type="text" 
                id='delivery'
                value={delivery}
                placeholder='Same day delivery,'
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='mb-5'>     
            <label htmlFor="title">Stock</label> 
            <input 
                type="text" 
                id='stock'
                value={stock}
                placeholder='In Stock, only 2 left, out of stock'
                className="mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                onChange={onChange}
            />
          </div>
          <div className='w-full h-80 md:h-72 max-w-screen-md mb-8'>
            <ReactQuill 
              theme="snow" 
              required
              value={description}
              placeholder='Describe the product specs here...'
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
            Create Listing 
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostAd