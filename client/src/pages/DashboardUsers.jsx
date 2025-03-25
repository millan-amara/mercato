import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const fetchUsers = async ({ queryKey }) => {
    const [_, category, page, search] = queryKey;
    const response = await axios.get(`/api/users`, {
        params: { category, page, search, limit: 20 },
    });
    return response.data;
};

function DashboardUsers() {
    const [category, setCategory] = useState('all');
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['users', category, page, search],
        queryFn: fetchUsers,
        keepPreviousData: true,
    });

    return (
        <div>
            <AdminSidebar />
            <div className='ml-64 pt-4'>
                <button 
                    className='border border-slate-300 rounded-md px-4 py-2 hover:bg-slate-300' 
                    onClick={() => { setCategory('all'); setPage(1); }}>
                    All Users
                </button>
                <button 
                    className='border border-slate-300 rounded-md px-4 py-2 mx-4 hover:bg-slate-300' 
                    onClick={() => { setCategory('business'); setPage(1); }}>
                    Businesses
                </button>
                <button 
                    className='border border-slate-300 rounded-md px-4 py-2 hover:bg-slate-300' 
                    onClick={() => { setCategory('buyer'); setPage(1); }}>
                    Buyers
                </button>
                
                <div className='mt-4'>
                    <input 
                        type='text' 
                        placeholder='Search users...' 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)} 
                        className='border border-slate-300 px-4 py-2 rounded-md mr-2'
                    />
                    <button 
                        className='border border-slate-300 rounded-md px-4 py-2 hover:bg-slate-300' 
                        onClick={() => { setSearch(searchInput); setPage(1); }}>
                        Search
                    </button>
                </div>
            </div>
            
            <div className='ml-64 mt-4'>
                {isLoading ? <p>Loading users...</p> : error ? <p>Error loading users.</p> : (
                    <ul>
                        {data?.users.map(user => (
                            <li key={user.id} className='border-b p-2'>{user.name} - {user.email}</li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className='ml-64 mt-4'>
                <button 
                    className='border border-slate-300 rounded-md px-4 py-2 mr-2' 
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                    disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button 
                    className='border border-slate-300 rounded-md px-4 py-2 ml-2' 
                    onClick={() => setPage((prev) => prev + 1)} 
                    disabled={data?.users.length < 20}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default DashboardUsers;
