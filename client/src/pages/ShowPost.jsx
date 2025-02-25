import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import BidSidebarAll from '../components/BidSidebarAll';
import BidContent from '../components/BidContent';
import BidInput from '../components/BidInput';
import { Fab, Modal, Box } from '@mui/material';
import { FaList } from 'react-icons/fa';


import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


function ShowPost() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { postId } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;
    const {user} = useSelector((state) => state.auth);
    const [activeBidId, setActiveBidId] = useState(null); 
    const [isModalOpen, setModalOpen] = useState(false);

    //Fetch post data
    const { data: post, isLoading: postLoading, error: postError } = useQuery({
      queryKey: ['post', postId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/posts/${postId}`, { withCredentials: true });
        return data; 
      }
    })


    //Fetch bids only if the user is the author
    const { data: bids = [], isLoading: bidsLoading } = useQuery({
      queryKey: ['bids', postId],
      queryFn: async () => {
        const { data } = await axios.get(`${API_URL}/posts/${postId}/bids`, { withCredentials: true });
         return data;
      },
      enabled: !!post && user?._id === post.author, // Fetch bids only if the user is the author
    });


    // Mutation for deleting a post
    const deletePostMutation = useMutation({
      mutationFn: async () => {
          await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });
      },
      onSuccess: () => {
          toast.success('Successfully deleted post');
          queryClient.invalidateQueries(['posts']); // Invalidate posts cache
          navigate('/posts');
      },
      onError: () => {
          toast.error('Failed to delete');
      },
    });


    // Mutation for bookmarking a bid
    const bookmarkBidMutation = useMutation({
      mutationFn: async () => {
          await axios.put(`${API_URL}/posts/${post._id}/bids/${activeBidId}`, { withCredentials: true });
      },
      onSuccess: () => {
          queryClient.invalidateQueries(['bids', postId]); // Refresh bids
      },
    });


    // Automatically set active bid when bids are loaded
    useEffect(() => {
      if (bids.length > 0 && activeBidId === null) {
          setActiveBidId(bids[0]._id);
      }
    }, [bids, activeBidId]);


  if (postLoading || bidsLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Just a moment...</p>
        </div>
    );
  }

  if (postError) {
      return <p>Error loading post. Please try again.</p>;
  }


  return (
    <div>
      <Navbar />
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
                    <Button onClick={() => deletePostMutation.mutate()}>Delete</Button>
                  </AccordionActions>
                </Accordion>
            </div>
            <div className="bg-slate-50 md:px-8 flex flex-col md:flex-row h-screen pt-5">
              {/* Sidebar (Hidden on Small Screens) */}
              <div className="hidden md:block w-1/3 overflow-y-auto bg-gray-100">
                <BidSidebarAll
                  bids={bids}
                  bookmarkedBids={bids.filter((bid) => bid.bookmarked === true)}
                  bidsIsLoading={bidsLoading}
                  activeBidId={activeBidId}
                  onBidClick={setActiveBidId}
                />
              </div>

              {/* Main Content */}
              <div className="w-full min-h-[100dvh] md:w-3/4 p-4 overflow-y-auto bg-white">
                <BidContent
                  post={post}
                  bid={bids.find(bid => bid._id === activeBidId)}
                  onBookmarkBid={() => bookmarkBidMutation.mutate()}
                />
              </div>

              {/* Floating Action Button for Small Screens */}
              <div className="fixed bottom-20 right-4 md:hidden z-10">
                <Fab color="primary" onClick={() => setModalOpen(true)}>
                  <FaList />
                </Fab>
              </div>

              {/* Modal for Small Screens */}
              <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
                <Box className="absolute bottom-0 left-0 right-0 bg-white p-4 max-h-96 overflow-y-auto">
                    <BidSidebarAll
                      bids={bids}
                      bookmarkedBids={bids.filter(b => b.bookmarked)}
                      activeBidId={activeBidId}
                      onBidClick={(id) => {
                          setActiveBidId(id);
                          setModalOpen(false);
                      }}
                    />
                </Box>
              </Modal>
            </div>
          </>
          ) : (
            
            <div className="flex flex-col items-center mt-2 pt-4">
              <p className="w-11/12 md:w-3/4 mb-12">{post.description}</p>
              {!post.cantBid.includes(user._id) &&
              <div className="w-11/12">
                {user.business &&
                  <BidInput postId={postId} />
                }
              </div>}
            </div>
          )}
    </div>

  )
}

export default ShowPost