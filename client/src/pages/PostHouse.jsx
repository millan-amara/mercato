import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import MapPicker from '../components/MapPicker';
import InputField from '../components/InputField';
import Compressor from 'compressorjs';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 

function PostHouse() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    bedrooms: '',
    price: '',
    location: '',
    url: '',
    caretaker: '',
    images: [],
  })
  // const [pin, setPin] = useState({ lat: null, lng: null });

  const {title,bedrooms,price,location,url,caretaker} = formData;
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

  // Auto-detect location
  useEffect(() => {
    if (useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Location access denied:", err);
          setUseCurrentLocation(false); // fallback to manual
        }
      );
    }
  }, [useCurrentLocation]);

  const handleLocationChange = (lat, lng) => {
    setCoords({ latitude: lat, longitude: lng });
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
    requestBody.append("latitude", coords.latitude);
    requestBody.append("longitude", coords.longitude);

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

      const response = await axios.post(`${API_URL}/houses`, requestBody, { withCredentials: true });
      
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

  const sendVerification = async (e) => {
    try {
      setVerifyLoading(true);
      await axios.post(`${API_URL}/resend-otp`, {
        phone: user?.phone,
      });
      setVerifyLoading(false);
      navigate('/verifyotp');
    } catch (error) {
      setVerifyLoading(false);
      console.error(error);
      toast.error("Couldn't send verification. Try again in a few minutes");
    } 
  }

  if(loading) {
    return <h1>Just a moment...</h1> 
  }

  return (
    <div>
      <Navbar />

    <div className="flex flex-col items-center mt-12 px-4 pb-32 relative z-0">
      {user && !user.isVerified && (
        <p className='font-semibold flex items-center gap-2 flex-wrap'>
          Please{' '}
          <button
            type="button"
            onClick={verifyLoading ? null : sendVerification}
            disabled={verifyLoading}
            className={`text-orange-500 underline underline-offset-2 text-sm flex items-center gap-2
              ${verifyLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {verifyLoading && (
              <span className="w-3 h-3 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></span>
            )}
            {verifyLoading ? 'Sending...' : 'verify your phone'}
          </button>{' '}
          number first.
        </p>
      )}

        <form onSubmit={onSubmit} className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800">Create House</h1>
          {/* <p className="text-sm text-gray-500 mt-2">
            Post a house and earn!{' '}
            <Link className="underline text-fuchsia-600 font-medium" to="/guidelines/postingguides">
              Tap to learn how
            </Link>{' '}
            and see the rules.
          </p> */}

          {/* UNCOMMENT AFTER AT VERIFICATION............................................................................................. */}
        </div>

    {/* Basic Info Section */}
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h2>
      <div className="space-y-4">
        <InputField
          label="House Title"
          id="title"
          placeholder="30,000 2 bedroom master ensuite in Ngong"
          value={title}
          onChange={onChange}
        />
        <InputField
          label="Number of Bedrooms"
          id="bedrooms"
          type="number"
          value={bedrooms}
          onChange={onChange}
        />
        <div className="relative">
          <InputField
            label="Rent Price (KES)"
            id="price"
            type="number"
            placeholder="Rent per month"
            value={price}
            onChange={onChange}
          />
          
        </div>
      </div>
    </div>

    {/* Caretaker Section */}
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Caretaker Contact</h2>
      <InputField
        label="Caretaker's Phone Number"
        id="caretaker"
        type="tel"
        placeholder="07__ ___ ___"
        value={caretaker}
        onChange={onChange}
      />
    </div>

    {/* Location Section */}
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Location</h2>
      <InputField
        label="Location"
        id="location"
        value={location}
        onChange={onChange}
      />
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={useCurrentLocation}
          onChange={() => setUseCurrentLocation(prev => !prev)}
          className="h-5 w-5 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
        />
        <label className="ml-2 text-sm text-gray-600">Use my current location</label>
      </div>
      {!useCurrentLocation && coords.latitude && coords.longitude && (
        <div className="mt-6">
          <MapPicker
            defaultLocation={{ lat: coords.latitude, lng: coords.longitude }}
            onChangeLocation={handleLocationChange}
          />
        </div>
      )}
    </div>

    {/* Media Section */}
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Media</h2>
      <InputField
        label="Video URL"
        id="url"
        placeholder="TikTok link"
        value={url}
        onChange={onChange}
      />
      <div className="mt-4">
        <ImageUpload
          onSelectFile={onSelectFile}
          selectedImages={selectedImages}
          deleteHandler={deleteHandler}
        />
      </div>
    </div>

    {/* Description Section */}
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-700 mb-4">House Description</h2>
      <div className="w-full h-80 md:h-72 max-w-screen-md">
        <ReactQuill
          theme="snow"
          value={description}
          placeholder="Describe any additional house features here...(optional)"
          className="h-72 mb-12"
          onChange={setDescription}
        />
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="mt-4 w-full bg-fuchsia-700 hover:bg-fuchsia-800 text-white font-semibold py-3 rounded-md text-lg transition duration-300"
    >
      Create House
    </button>
  </form>
</div>

    </div>
  )
}

export default PostHouse