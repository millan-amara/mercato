import { Link } from 'react-router-dom'
import { FaLanguage } from 'react-icons/fa';
import { FaUserLarge } from 'react-icons/fa6';
import { BsPersonCircle } from 'react-icons/bs'
import { BiSolidDashboard } from 'react-icons/bi';
import { MdContactEmergency, MdPayment, MdSecurity } from 'react-icons/md'
import Rating from '@mui/material/Rating';


function ProfileSidebar({ handleTabChange,isOwner,activeTab,profileData,loggedInUser }) {

  const menus = [
    { key: "1", title: "Requests", path:"posts", icon: <BiSolidDashboard /> },
    { key: "2", title: "Bids", path:"bids", icon: <FaLanguage /> },
    { key: "3", title: "Reviews", path:"reviews", icon: <BsPersonCircle /> },
    { key: "4", title: "Edit Profile", path:"editProfile", icon: <MdContactEmergency /> },
    // { title: "Skills & Education", path: "skills", icon: <MdSchool />, spacing: false },
    { key: "5", title: "Payment Info", path: "paymentInfo", icon: <MdPayment />, spacing: true },
  ]

  const links = [
    { key: "6", title: "My Money", path: "earnings", icon: <MdSecurity /> },  
    // { key: "7", title: `Coins: ${loggedInUser.coins}`, path: "coins", icon: <MdSecurity /> },
  ]
  
  return (
    <>
        <div id="sidebar" className='bg-slate-700 h-screen w-60 text-white font-serif fixed top-0'>
          <div className='flex flex-col items-center pt-5 mb-4'>
  
            <div className='relative flex flex-col items-center'>
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg">
                    <FaUserLarge className='text-2xl' /> 
                </div>

                <p className='mt-3 font-medium text-xl'>{profileData.fname}</p>
                <p className='my-2 text-lime-600'>{profileData.website}</p>
                <div className='flex'>
                    <Rating name="read-only" value={profileData.rating} size='small' readOnly />
                    <span className='ml-2 text-sm'>{profileData.reviews} Review{profileData.reviews === 1 ? '' : 's'}</span>
                </div>
            </div> 
            <hr className='text-xl' />
          </div>
          <div className='pt-3'>
            <ul>
                {isOwner ? (
                    <>
                    {menus.map((menu) => (
                        <button onClick={() => handleTabChange(menu.path)} key={menu.path} className={`text-gray-300 w-full ${activeTab === menu.path && 'bg-green-700'} text-sm no-underline flex items-center cursor-pointer p-2 hover:bg-green-700 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                            <span className='text-2xl block float-left mr-3'>
                            {menu.icon}
                            </span>
                            <span name={menu.path} className='text-base font-medium'>
                            {menu.title}
                            </span>
                        </button>
                    ))}
                    {loggedInUser.business && links.map((menu) => (

                        <Link to={`/user/profile/${loggedInUser._id}/${menu.path}`} key={menu.path} className={`text-gray-300 ${menu.path === 'coins' && 'bg-yellow-300 text-black'} text-sm no-underline flex items-center cursor-pointer p-2 hover:bg-green-700 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                            <span className='text-2xl block float-left mr-3'>
                            {menu.icon}
                            </span>
                            <span name={menu.path} className='text-base font-medium flex-1'>
                            {menu.title}
                            </span>
                        </Link>
                    ))}
                    </>
                ) : (
                    <button onClick={() => handleTabChange('reviews')} key={'reviews'} className={`text-gray-300 w-full ${activeTab === 'reviews' && 'bg-green-700'} text-sm no-underline flex items-center cursor-pointer p-2 hover:bg-green-700 rounded-md`}>
                        <span className='text-2xl block float-left mr-3'>
                        <BsPersonCircle /> 
                        </span>
                        <span name={'reviews'} className='text-base font-medium'>
                        Reviews
                        </span>
                    </button>
                )}
            </ul>
          </div>
          
        </div>
        
    </>
  )
}

export default ProfileSidebar;