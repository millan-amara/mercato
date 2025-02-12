import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import ProfileEdit from '../components/ProfileEdit';
import ProfilePosts from '../components/ProfilePosts';
import ProfileBids from '../components/ProfileBids';
import ProfileReviews from '../components/ProfileReviews';
import TopProfile from '../components/TopProfile';
import axios from 'axios';
import ProfileLoader from '../components/ProfileLoader';


function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('');
    const [profileData, setProfileData] = useState(null);
    const { userId } = useParams();
    const cacheRef = useRef({});
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    const { user: loggedInUser } = useSelector((state) => state.auth); // Logged-in user
    const isOwner = loggedInUser?._id === userId;

    useEffect(() => {
      const fetchProfile = async () => {
        if (userId && userId !== loggedInUser._id) {
          // Fetch the other user's profile data from your API
          setActiveTab('reviews')
        } else {
          setActiveTab('posts')
        }
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setProfileData(response.data);
      };
  
      fetchProfile();
    }, [userId, loggedInUser]);

    const handleTabChange = (tab) => {
      setActiveTab(tab)
    }

    const onLogout = () => {
      dispatch(logout())
      dispatch(reset())
      navigate('/')
    }

  return (
    <div> 
        <Navbar />
        {!profileData ? (
          <ProfileLoader />
        ) : (
          <div className='flex justify-center flex-col md:flex-row mt-4 md:h-screen md:overflow-hidden'>
            <div className='md:w-1/5 md:mr-5 md:mt-8'>
              <TopProfile
                handleTabChange={handleTabChange}
                activeTab={activeTab}
                userId={userId}
                loggedInUser={loggedInUser}
                profileData={profileData}
                onLogout={onLogout}
                isOwner={isOwner}
              />
            </div> 
  
            <div className='md:w-4/5 md:overflow-y-auto'>
              {activeTab === 'posts' && <ProfilePosts userId={userId} cacheRef={cacheRef} isOwner={isOwner} />}
  
              {activeTab === 'bids' && <ProfileBids userId={userId} cacheRef={cacheRef} />}
  
              {activeTab === 'reviews' && <ProfileReviews userId={userId} loggedInUser={loggedInUser} cacheRef={cacheRef} />}
  
              {activeTab === 'editProfile' && <ProfileEdit loggedInUser={loggedInUser} />}
            </div>

          </div>
        )}

    </div>
  )
}

export default Profile