import { Link } from 'react-router-dom';
import { MdSecurity, MdPayment, MdSchool } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";
import { useState } from 'react';


function AdminSidebar() {

  const [active, setActive] = useState("");

  const menus = [
    { title: "Payments", path:"dashboard/payments", icon: <BiSolidDashboard /> },
    { title: "User Profiles", path:"dashboard/users", icon: <BiSolidDashboard /> },
    { title: "Languages", path:"languages", icon: <BiSolidDashboard /> },
    { title: "Reviews", path: "dashboard/reviews", icon: <MdSchool />, spacing: true },
    { title: "Identity Verification", path:"dashboard/verification", icon: <BiSolidDashboard /> },
    { title: "Payment Info", path: "payment", icon: <MdPayment /> },
    { title: "Security", path: "security", icon: <MdSecurity /> },
    { title: "Invite Friends", path: "invite-friends", icon: <MdSecurity /> },
  ]

  const handleClick = (e) => {
    setActive(e.target.getAttribute('name'))
  }
  
  return (
    <>
        <div id="sidebar" className='bg-slate-700 h-screen w-60 text-white font-serif fixed'>
          <div className='flex flex-col items-center pt-5 mb-4'>
  
            <Link to='/' className='text-xl'>PES<span className='text-fuchsia-700 font-semibold'>K</span>AYA</Link>
            <hr className='text-xl' />
          </div>
          <div className='pt-3'>
            <ul>
              {menus.map((menu) => (
                <Link to={`/${menu.path}`} key={menu.path} className={`text-gray-300 ${active === menu.path && 'bg-green-700'} text-sm no-underline flex items-center cursor-pointer p-2 hover:bg-green-700 rounded-md ${menu.spacing ? "mt-9" : "mt-2"}`}>
                  <span className='text-2xl block float-left mr-3'>
                    {menu.icon}
                  </span>
                  <span name={menu.path} onClick={handleClick} className='text-base font-medium flex-1'>
                    {menu.title}
                  </span>
                </Link>
              ))}
              
            </ul>
          </div>
          
        </div>
    </>
  )
}

export default AdminSidebar;