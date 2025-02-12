import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { servePosts, reset } from '../features/posts/postSlice';
import SearchForm from '../components/SearchForm'
import axios from 'axios';

function Posts() {

  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState({
      search: '',
  })
  const [wascas, setWascas] = useState([])
  const [items, setItems] = useState([])
  const [activePage, setActivePage] = useState(1)
  const { posts, isLoading, isSuccess } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
        if(isSuccess) {
            dispatch(reset())
        }
    }
  }, [dispatch, isSuccess])

  useEffect(() => {
      dispatch(servePosts())
  }, [dispatch])


  const { search } = searchTerm;

  const onChange = (e) => {
      setSearchTerm((prevState) => ({
        [e.target.id]: e.target.value,
      }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSearchLoading(true)
    console.log(search)
    
    await axios.post(`${API_URL}/posts/search`, searchTerm)
    .then((response) => {
      setWascas(response.data.posts)
      const rows = Array.from({ length: response.data.pages}, (_, i) => i + 1);
      setItems(rows)
    })
    setSearchLoading(false)
    setTerm(search)
    setSearchTerm('')
    setIsSearch(true)
  }

  const onPagination = async(e) => {
    e.preventDefault()
    setSearchLoading(true)
    const pageNumber = e.target.value;
    await axios.post(`${API_URL}/posts/search/page`, { page: pageNumber, search: term })
    .then((response) => {
      setWascas(response.data.posts)
      setActivePage(pageNumber)
      setSearchLoading(false)
    })
  }

  return (
    <div>
      <Navbar />

      <div>
        <SearchForm 
          onSubmit={onSubmit}
          search={search}
          onChange={onChange}
        />
      </div>

      { isSearch && 
      <>
        {wascas?.length > 0 ? (
          // <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-y-8 mx-2 md:mx-12 lg:mx-32 xl:mx-48 md:mt-8'>
            <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 mt-6'>
            
              {wascas.map((wasca) => (
              <Link 
                to={`/posts/post/${wasca._id}`}
                key={wasca._id}
                className='bg-slate-100 hover:bg-slate-200 mb-1 px-2 py-4 rounded-xl h-48'
              >
                {wasca.description.substr(0, 174)}...
              </Link> 
              ))}
           
          </div>
        ) : 
        <div className='text-white flex flex-col justify-center items-center h-screen'>
          <p>Nothing matches '{term}' right now.</p>
          <p>Check back soon</p>
        </div>}
      </>
    }

    { !isSearch &&
      isLoading ? (
        <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 mt-6'>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          <div className="shadow animate-pulse bg-slate-100 w-full mb-1 px-2 py-4 rounded-xl h-48 mx-auto"></div>
          
        </div>
      ) : (
        <div className='px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-4 mt-6'>
        {posts.length !== 0 && posts.map((post) => (
            <Link 
              to={`/posts/post/${post._id}`}
              key={post._id}
              className='bg-slate-100 hover:bg-slate-200 mb-1 px-2 py-4 rounded-xl h-48'
            >
              {post.description.substr(0, 174)}...
            </Link>
        ))}
        </div>
      ) 
    } 

        <div className='flex justify-center mt-16 md:pb-8' >
          <ul id='pagination' className='flex justify-between px-2 rounded-3xl bottom-24 bg-white'>
            {items.map((page) => (
              page === activePage ? (
                <li onClick={onPagination} key={`active-${page}`} value={page} id={page} className='bg-green-700 px-4 py-1 rounded-full text-white cursor-pointer mx-1'>{page}</li>):
                (<li onClick={onPagination} key={`inactive-${page}`} value={page} id={page} className='px-4 py-1 rounded-full cursor-pointer hover:bg-green-300 mx-1'>{page}</li>)
            ))}
          </ul>
        </div>
    </div>
  )
}

export default Posts