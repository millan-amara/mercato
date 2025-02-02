import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import axios from 'axios';
import ProfileEdit from '../components/ProfileEdit';
import ProfilePosts from '../components/ProfilePosts';
import ProfileBids from '../components/ProfileBids';
import ProfileReviews from '../components/ProfileReviews';
import ProfileEarnings from '../components/ProfileEarnings';
import TopProfile from '../components/TopProfile';


function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('posts');
    const [posts, setPosts] = useState([]);
    const [bids, setBids] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [value, setValue] = useState(5);
    const [description, setDescription] = useState('');
    const { userId } = useParams();
    const [canReview, setCanReview] = useState(false);
    const [infoText, setInfoText] = useState('')
    const [submitReviewLoading, setSubmitReviewLoading] = useState(false)

    const { user: loggedInUser } = useSelector((state) => state.auth); // Logged-in user
    const [profileUser, setProfileUser] = useState(null);
  
    const isOwner = loggedInUser?._id === userId;


    useEffect(() => {
      const fetchOwnPosts = async() => {
        const postsResponse = await axios.get('/api/users/getownposts');
        const bidsResponse = await axios.get('/api/users/getownbids');
        const reviewsResponse = await axios.get(`/api/users/${userId}/reviews`);
        setPostsLoading(false)
        setPosts(postsResponse.data)
        setBids(bidsResponse.data)
        setReviews(reviewsResponse.data);
      }

      fetchOwnPosts()

    }, [])

    const onReviewChange = (e) => {
      setDescription(e.target.value)
    }

    const onSubmitReview = async (e) => {
      e.preventDefault();
      try {
        setSubmitReviewLoading(true)
        const response = await axios.post(`/api/users/${userId}/reviews`, {value: value, description: description})
        setReviews((prevState) => [...prevState, response.data]);
        setSubmitReviewLoading(false);
  
        // Refetch the latest reviews to ensure consistency
        const { data: updatedReviews } = await axios.get(`/api/users/${userId}/reviews`);
        setReviews(updatedReviews);
        setCanReview(false)
      } catch (error) {
        console.log(error)
      }

    }

    const handleTabChange = (tab) => {
      setActiveTab(tab)
    }

    const handleCanReview = async () => {
      const currentUser = await axios.get(`/api/users/currentuser`)
      const response = await axios.get(`/api/users/${userId}`)
      if(currentUser.data.includes(response.data)) {
        setCanReview(true)
      } else {
        setInfoText('Sorry, you need to interact with them first!')
      }
    }

    const onLogout = () => {
      dispatch(logout())
      dispatch(reset())
      navigate('/')
    }



  return (
    <div> 
        <Navbar />
        <div className='flex justify-center flex-col md:flex-row mt-4 md:h-screen md:overflow-hidden'>
          <div className='md:w-1/5 md:mr-5 md:mt-8'>
            <TopProfile
              handleTabChange={handleTabChange}
              activeTab={activeTab}
              loggedInUser={loggedInUser}
              onLogout={onLogout}
            />
          </div> 

          <div className='md:w-4/5 md:overflow-y-auto'>
            {activeTab === 'posts' && (
              <ProfilePosts 
                postsLoading={postsLoading}
                posts={posts} 
              />
            )}

            {activeTab === 'bids' && (
              <ProfileBids
                bids={bids}
              />
            )}

            {activeTab === 'reviews' && (
              <ProfileReviews
                canReview={canReview}
                handleCanReview={handleCanReview}
                infoText={infoText}
                value={value}
                setValue={setValue}
                description={description}
                reviews={reviews}
                onReviewChange={onReviewChange}
                onSubmitReview={onSubmitReview}
                submitReviewLoading={submitReviewLoading}
              />
            )}

            {activeTab === 'editProfile' && (
              <ProfileEdit loggedInUser={loggedInUser} />
            )}

          </div>


        </div>

    </div>
  )
}

export default Profile