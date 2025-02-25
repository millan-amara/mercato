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
  const [coins, setCoins] = useState(2);
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
    setLoading(true)

    if(images.length > 6) {
        setLoading(false)
        toast.error('Max 6 images')
        return;
    }

    const requestBody = new FormData();
    
    requestBody.append('text', bidText)
    requestBody.append('postId', postId);
    requestBody.append('coins', coins)

    const compressedImages = await Promise.all(selectedImages.map(file => compressImage(file)));

    compressedImages.forEach((image) => {
      requestBody.append('files', image); // Assuming 'files' is the key for the backend
    });

    for (const pair of requestBody.entries()) {
      console.log(pair[0], pair[1]);
    }

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
                placeholder='Type your offer here...'
                className='h-72 mb-12'
                onChange={setBidText}
              />

            </div>

            </div>

            <ImageUpload onSelectFile={onSelectFile} deleteHandler={deleteHandler} selectedImages={selectedImages} />

            <div className='flex flex-col items-center justify-center'>
              <label htmlFor="seller" className='text-sm mb-2'>Do you wish to boost this bid? (Optional)</label>
              <div className='mb-5 flex w-full md:w-1/3 bg-yellow-300 py-1 px-1 rounded-md'>
                  <input 
                      type="number" 
                      name='coins'
                      id='coins'
                      min={2}
                      value={coins}
                      onChange={(e) => setCoins(Number(e.target.value))}
                      required
                      className="mt-1 focus:ring-2 focus:outline-none appearance-none w-3/4 md:w-3/5 xl:w-4/5 text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm" 
                  />
                  <p className='px-2 py-1 rounded-md flex items-center text-sm w-1/4 md:w-2/5 xl:w-1/5'>Coins: <span className='font-semibold'>{user.coins - coins}</span></p>
              </div>
            </div>

            <div id='search-button' className='flex justify-center mb-24 md:mb-8'>
                <button onClick={handleSubmit} type='submit' className='flex bg-black text-white w-1/2 sm:w-2/5 md:w-1/3 py-2 rounded-md items-center justify-center hover:opacity-80'>Submit Bid <span className='ml-2'><FaArrowRight /></span></button>
            </div>
        </form>

    </div>
  )
}

export default BidInput