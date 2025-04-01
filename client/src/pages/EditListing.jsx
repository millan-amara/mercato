import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ImageEdit from '../components/ImageEdit';
import Compressor from 'compressorjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditListing() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    actualPrice: '',
    offerPrice: '',
    images: [],
    deleteImages: [],
  });
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/listings/${listingId}`, { withCredentials: true });
        console.log(data.imgs)
        setFormData({
          title: data.title,
          actualPrice: data.actualPrice,
          offerPrice: data.offerPrice,
          images: data.imgs || [],
          deleteImages: [],
        });
        setDescription(data.description);
        setSelectedImages(data.imgs || []);
      } catch (error) {
        toast.error('Failed to fetch listing');
      }
    };
    fetchListing();
  }, [listingId, API_URL]);


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (selectedImages.length > 6) {
      setLoading(false);
      toast.error('Max 6 images allowed');
      return;
    }

    const requestBody = new FormData();
    requestBody.append('description', description);

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'images') {
        requestBody.append(key, String(value));
      }
    });

    selectedImages.forEach((image) => {
        requestBody.append('files', image);
    })
    if (formData.deleteImages && formData.deleteImages.length > 0) {
        formData.deleteImages.forEach((image) => {
          requestBody.append('deleted', `${image.filename}`);
        });
    }
      

    try {
      const response = await axios.put(`${API_URL}/listings/${listingId}`, requestBody, { withCredentials: true });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Listing updated successfully');
        navigate(`/listings/${listingId}`);
      }
    } catch (error) {
      toast.error('Failed to update listing');
    } finally {
      setLoading(false);
    }
  };


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };


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

  function removeHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image));
    setFormData((prevState) => ({
      ...prevState,
      deleteImages: [...(prevState.deleteImages || []), image]
    }))
  }

  if (loading) {
    return <div className='flex h-[100dvh] items-center justify-center'>
        <h1>Just a moment. Updating...</h1>
    </div>
  }

  return (
    <div>
      <Navbar />
      <div className='flex justify-center mt-10 pb-24'>
        <form onSubmit={onSubmit} className='w-full mx-2 md:w-1/3 mb-8'>
          <h1 className='text-2xl mb-4 text-center'>Edit Listing</h1>
          <div className='mb-5 mt-8'>
            <label htmlFor='title'>Product Title</label>
            <input type='text' id='title' value={formData.title} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5'>
            <label htmlFor='actualPrice'>Actual Price</label>
            <input type='number' id='actualPrice' value={formData.actualPrice} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5'>
            <label htmlFor='offerPrice'>Offer Price</label>
            <input type='number' id='offerPrice' value={formData.offerPrice} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='w-full h-80 max-w-screen-md mb-8'>
            <ReactQuill theme='snow' value={description} onChange={setDescription} className='h-72 mb-12' />
          </div>
          <ImageEdit onSelectFile={onSelectFile} selectedImages={selectedImages} deleteHandler={deleteHandler} removeHandler={removeHandler} />
          <button type='submit' className='bg-fuchsia-700 hover:bg-fuchsia-800 w-full text-white text-bold rounded-md py-3'>
            Update Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditListing;
