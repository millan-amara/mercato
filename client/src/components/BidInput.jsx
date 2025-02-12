import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import ImageUpload from './ImageUpload';
import Compressor from 'compressorjs';
import { useQuill } from 'react-quilljs';
import { useDispatch } from 'react-redux';
import {toast} from 'react-toastify';
import { createBid } from '../features/bids/bidSlice';
import 'quill/dist/quill.snow.css'; // Add for 'snow' theme

function BidInput({ postId }) {

  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    images: [],
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],  // Custom toolbar options
      ],
    },
    placeholder: 'Type your offer here...',
  });

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

    if(quill) {
      const bidText = quill.root.innerHTML;
      requestBody.append('text', bidText)
    }
    requestBody.append('postId', postId);

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
        <form>
            <div className='flex flex-col items-center mb-12'>
            <div className='' style={{ width: 600, height: 300, }}>
                <div ref={quillRef} name="bidText" id='bidText' />
            </div>
            </div>

            <ImageUpload onSelectFile={onSelectFile} deleteHandler={deleteHandler} selectedImages={selectedImages} />

            <div id='search-button' className='flex justify-center'>
                <button onClick={handleSubmit} type='submit' className='flex bg-fuchsia-800 text-white w-1/2 md:w-2/5 py-2 rounded-md items-center justify-center hover:opacity-80'>Submit Request <span className='ml-2'><FaArrowRight /></span></button>
            </div>
        </form>

        {/* <form>
          <div className="flex flex-col items-center mb-12">
            <div className="w-full h-72 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] max-w-screen-md">
              <div ref={quillRef} name="bidText" id="bidText" className="w-full h-full border border-gray-300 rounded-md"></div>
            </div>
          </div>

          <div id="search-button" className="flex justify-center">
            <button
              onClick={handleSubmit}
              type="submit"
              className="flex bg-fuchsia-800 text-white w-1/2 md:w-2/5 py-2 rounded-md items-center justify-center hover:opacity-80"
            >
              Submit Request <span className="ml-2"><FaArrowRight /></span>
            </button>
          </div>
        </form> */}

    </div>
  )
}

export default BidInput