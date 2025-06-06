import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import ImageUpload from './ImageUpload';
import Compressor from 'compressorjs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createBid } from '../features/bids/bidSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function BidInput({ postId }) {

  const { user } = useSelector((state) => state.auth)
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
  });


  const [bidText, setBidText] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submitted')
    setLoading(true)

    if(images.length > 6) {
        setLoading(false)
        toast.error('Max 6 images')
        return;
    }

    const requestBody = new FormData();
    
    requestBody.append('text', bidText);
    requestBody.append('postId', postId);


    const compressedImages = await Promise.all(selectedImages.map(file => compressImage(file)));

    compressedImages.forEach((image) => {
      requestBody.append('files', image); // Assuming 'files' is the key for the backend
    });

    try {
      await dispatch(createBid(requestBody)).unwrap();
      toast.success('Saved successfully!');
      setLoading(false);
      navigate('/posts')
    } catch (error) {
      console.log(error)
      setLoading(false);
      toast.error("couldn't add")
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

  return (
    <div>
        <form className=''>
            <div className='flex flex-col items-center mb-12'>
            
            <div className='w-full h-80 md:h-72 max-w-screen-md'>
              <ReactQuill 
                theme="snow" 
                required
                value={bidText}
                placeholder='Describe what you have here...'
                className='h-72 mb-12'
                onChange={setBidText}
              />

            </div>

            </div>

            <ImageUpload onSelectFile={onSelectFile} deleteHandler={deleteHandler} selectedImages={selectedImages} />
            
            <div id='search-button' className='flex justify-center mb-24 md:mb-8'>
                <button onClick={handleSubmit} type='submit' className='flex bg-black text-white w-1/2 sm:w-2/5 md:w-1/3 py-2 rounded-md items-center justify-center hover:opacity-80'>Submit Bid <span className='ml-2'><FaArrowRight /></span></button>
            </div>
        </form>

    </div>
  )
}

export default BidInput