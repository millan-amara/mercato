import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ImageEdit from '../components/ImageEdit';
import MapPicker from '../components/MapPicker';
import Compressor from 'compressorjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditHouse() {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bedrooms: '',
    price: '',
    url: '',
    location: '', 
    caretaker: '',
    images: [],
    deleteImages: [],
  });
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [pin, setPin] = useState({ lat: null, lng: null });
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoError, setVideoError] = useState("");

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/houses/${houseId}`, { withCredentials: true });
        console.log(data.imgs)
        setFormData({
          title: data.title,
          bedrooms: data.bedrooms,
          price: data.price,
          url: data.url,
          location: data.location,
          caretaker: data.caretaker,
          images: data.imgs || [],
          deleteImages: [],
        });
        setDescription(data.description);
        setUploadedVideo(data.video);
        setSelectedImages(data.imgs || []);
        setPin({ lat: data.coordinates?.lat || null, lng: data.coordinates?.lng || null });
      } catch (error) {
        toast.error('Failed to fetch house');
      }
    };
    fetchHouse();
  }, [houseId, API_URL]);


  const onSubmit = async (e) => {
    e.preventDefault();
    if (videoError) {
      toast.error("Please fix the video upload error before submitting.");
      return;
    }
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

    if (videoFile) {
      requestBody.append("video", videoFile); // 'video' should match backend field name
    }

    requestBody.append('latitude', pin.lat);
    requestBody.append('longitude', pin.lng);
      

    try {
      const response = await axios.put(`${API_URL}/houses/${houseId}`, requestBody, { withCredentials: true });
      console.log(response.data)
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('House updated successfully');
        navigate(`/houses/${houseId}`);
      }
    } catch (error) {
      toast.error('Failed to update house');
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
        <h1 className='animate-pulse text-lg'>Don't close the page. Updating...</h1>
    </div>
  }

  return (
    <div>
      <Navbar />
      <div className='flex justify-center mt-10 pb-24'>
        <form onSubmit={onSubmit} className='w-full mx-2 md:w-1/3 mb-8'>
          <h1 className='text-2xl mb-4 text-center'>Edit House</h1>
          <div className='mb-5 mt-8'>
            <label htmlFor='title'>House Title</label>
            <input type='text' id='title' value={formData.title} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5'>
            <label htmlFor='bedrooms'>Number of Bedrooms</label>
            <input type='text' id='bedrooms' value={formData.bedrooms} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5'>
            <label htmlFor='location'>Location</label>
            <input type='text' id='location' value={formData.location} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5'>
            <label htmlFor='price'>Rent Price</label>
            <input type='number' id='price' value={formData.price} onChange={onChange} className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' />
          </div>
          <div className='mb-5 flex flex-col text-sm'>
            <label htmlFor="caretaker">Caretaker's Phone Number</label>
              <input 
                className='mt-1 focus:ring-2 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 rounded-md py-2 pl-2 ring-1 ring-slate-200 shadow-sm' 
                type="number" name="caretaker" id="caretaker" value={formData.caretaker} onChange={onChange} placeholder='07...' />
          </div>
          <div className="mb-5">
            <label>Pick Location on Map</label>
            {pin?.lat && pin?.lng && (
              <>
              <MapPicker pin={pin} setLatLng={setPin} />
              {pin.lat && <p className="text-sm mt-2">Lat: {pin.lat}, Lng: {pin.lng}</p>}
              </>
            )}
          </div>
          <div className='w-full h-80 max-w-screen-md mb-8'>
            <ReactQuill theme='snow' value={description} onChange={setDescription} className='h-72 mb-12' />
          </div>
          <div className="pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload a Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 100 * 1024 * 1024) {
                    setVideoError("Video must be under 100MB.");
                    setVideoFile(null);
                  } else {
                    setVideoError("");
                    setVideoFile(file);
                  }
                }
              }}
              className="block w-full text-sm text-gray-700"
            />

            {videoFile && !videoError && (
              <p className="text-sm text-gray-500 mt-2">
                Selected video size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}

            {videoError && (
              <p className="text-red-500 text-sm mt-2">{videoError}</p>
            )}


            {videoFile && (
              <video
                controls
                src={URL.createObjectURL(videoFile) || videoFile}
                className="mt-4 w-full max-w-md rounded"
              />
            )}
          </div>
          <ImageEdit onSelectFile={onSelectFile} selectedImages={selectedImages} deleteHandler={deleteHandler} removeHandler={removeHandler} />
          <button type='submit' className='bg-fuchsia-700 hover:bg-fuchsia-800 w-full text-white text-bold rounded-md py-3'>
            Update House
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditHouse;
