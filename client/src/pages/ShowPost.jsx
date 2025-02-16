import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useEffect, useState } from 'react';
import { showPost, reset } from '../features/posts/postSlice';
import { getBids, reset as bidsReset } from '../features/bids/bidSlice';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import BidSidebarAll from '../components/BidSidebarAll';
import BidContent from '../components/BidContent';
import BidInput from '../components/BidInput';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


function ShowPost() {
    const {post, isLoading, isSuccess, isError, message} = useSelector((state) => state.posts);
    const {bids, isLoading: bidsIsLoading} = useSelector((state) => state.bids);
    const {user} = useSelector((state) => state.auth);

    const API_URL = import.meta.env.VITE_API_URL;

    const [activeBidId, setActiveBidId] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { postId } = useParams();

    useEffect(() => {
        if(isError) {
            toast.error(message)
        }

        dispatch(showPost(postId))
        dispatch(getBids(postId))
        console.log(user)
    }, [isError, message, postId, dispatch])

    useEffect(() => {
        if (bids.length > 0 && activeBidId === null) {
            setActiveBidId(bids[0]._id);
        }
    }, [bids, activeBidId]);

    useEffect(() => {
    return () => {
        if(isSuccess) {
            dispatch(reset())
            dispatch(bidsReset())
        }
    }
    }, [dispatch, isSuccess])


    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   try {
    //     if (quill) {
    //       const bidText = quill.root.innerHTML; // Extract HTML content
    //       console.log(`show post ${bidText}`)
  
    //       dispatch(createBid({bidText, postId}))
    //       toast.success('Saved successfully!');
    //       navigate('/posts')
        
    //     }

    //   } catch (error) {
    //     console.log(error)
    //   }
    // }


    const onDelete = async(postId) => {
        if(window.confirm('Are you sure you want to delete?')) {
            try {
                await axios.delete(`${API_URL}/posts/${post._id}`, { withCredentials: true })
                toast.success('Successfully deleted listing')
                navigate('/posts')
            } catch (error) {
                console.error('Error deleting the post:', error);
                toast.error('Failed to delete listing');
            }    
        }
    }

    const onBookmarkBid = async (e) => {
      e.preventDefault()
      const response = await axios.put(`${API_URL}/posts/${post._id}/bids/${activeBidId}`, { withCredentials: true })
    }

  return (
    <div>
      <Navbar />

      {isLoading || bidsIsLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Just a moment...</p>
        </div>
      ) : (
        <div>
          {user._id === post.author ? (
            <>
            <div>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography component="span">Post Details</Typography>
        </AccordionSummary>
        <AccordionDetails className='text-sm'>
            {post.description}
        </AccordionDetails>
        <AccordionActions>
          <Button>Edit</Button>
          <Button onClick={onDelete}>Delete</Button>
        </AccordionActions>
      </Accordion>
            </div>
            <div className="bg-slate-50 pb-8 px-8 pt-8 flex h-screen overflow-hidden">
              <div className="w-1/3 overflow-y-auto bg-gray-100">
                <BidSidebarAll
                  bids={bids}
                  bookmarkedBids={bids.filter((bid) => bid.bookmarked === true)}
                  bidsIsLoading={bidsIsLoading}
                  activeBidId={activeBidId}
                  onBidClick={setActiveBidId}
                />
              </div>
              <div className="w-3/4 ml-8 px-4 py-4 overflow-y-auto bg-white">
                <BidContent post={post} bid={bids.find((bid) => bid._id === activeBidId)} onBookmarkBid={onBookmarkBid} />
              </div>
            </div>
            </>
          ) : (
            
              <div className="flex flex-col items-center mt-4 pt-4">
                <p className="w-3/4 mb-16">{post.description}</p>
                {user.business &&
                  <BidInput postId={postId} />
                }
                
              </div>
          )}
        </div>
      )}
    </div>

  )
}

export default ShowPost