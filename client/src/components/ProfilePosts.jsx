import React from 'react'
import { Skeleton } from '@mui/material'
import { Link } from 'react-router-dom'

function ProfilePosts({ postsLoading, posts }) {
  return (
    <>
    {postsLoading ? (
        <Skeleton 
          variant="rounded"
          className='' width={300} height={192} 
        />
    ) : (
      <div className='px-2 grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3'>
      {posts.length !== 0 && posts.map((post) => (
        <Link 
          to={`/posts/post/${post._id}`}
          key={post._id}
          className='bg-slate-100 hover:bg-slate-200 px-2 py-4 rounded-xl md:h-48'
        >
          {post.description.substr(0, 174)}...
          <p 
            className='mt-2 text-center w-fit px-2 rounded-sm bg-fuchsia-800 text-white text-xs'
          >{post.bids.length} {post.bids.length === 1 ? ('Bid') : ('Bids')}</p>
        </Link>
      ))} 
      </div>
    )}
    </>
  )
}

export default ProfilePosts