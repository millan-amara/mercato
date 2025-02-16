import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfileBids({ userId, cacheRef, isOwner }) {

  const API_URL = import.meta.env.VITE_API_URL;
  const [bids, setBids] = useState(cacheRef.current.bids || []);

  useEffect(() => {
    const fetchOwnBids = async() => {
      if (!cacheRef.current.bids && isOwner) {
        const bidsResponse = await axios.get(`/${API_URL}/users/getownbids`, { withCredentials: true });
        cacheRef.current.bids = bidsResponse.data;
        setBids(bidsResponse.data)
      }

    }

    fetchOwnBids()
  }, [userId, cacheRef])

  return (
    <div className="px-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {bids.length !== 0 && bids.map((bid) => (
        <div
            dangerouslySetInnerHTML={{ __html: bid && bid.text.substring(0, 174) }}
            className='text-sm mt-4 bg-sky-50 hover:bg-sky-100 mb-4 px-2 py-4 rounded-xl md:h-44'
            key={bid._id}
        ></div>
        ))}
    </div>
  )
}

export default ProfileBids