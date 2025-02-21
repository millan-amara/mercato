import React from 'react'

function SearchForm({ onSubmit, search, onChange }) {

  return (
    <>
    <form className="search-bar w-full flex justify-around mx-auto py-5 px-2 md:w-3/4 lg:w-1/2 xl:w-1/3" onSubmit={onSubmit}>
        <input 
          type="search" 
          name="search" 
          id='search'
          value={search}
          onChange={onChange}
          placeholder='Search anything...'
          pattern=".*\S.*" 
          className='w-3/4 focus:ring-2 focus:outline-none appearance-none text-sm leading-6 text-slate-900 rounded-md rounded-r-none py-2 pl-2 ring-1 ring-slate-200 shadow-sm'
        />
        <button className="search-btn w-1/4 py-2 px-4 text-white bg-gradient-to-r from-fuchsia-500 via-slate-800 to-gray-950 font-semibold rounded-md rounded-l-none">
          <span>Search</span>
        </button>
        
      </form>
      </>
  )
}

export default SearchForm