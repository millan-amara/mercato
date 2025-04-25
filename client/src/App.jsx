import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Explore from './pages/Explore.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import ShowPost from './pages/ShowPost';
import ShowHouse from './pages/ShowHouse';
import ShowListing from './pages/ShowListing';
import PrivateRoute from './components/PrivateRoute';
import BusinessPrivateRoute from './components/BusinessPrivateRoute.jsx';
import Profile from './pages/Profile';
import Success from './pages/Success';
import SuccessPay from './pages/SuccessPay';
import Earnings from './pages/Earnings';
import Landing from './pages/Landing';
import BottomNavbar from './components/BottomNavbar.jsx';
import Transactions from './pages/Transactions.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Forgot from './pages/Forgot';
import ResetPassword from './pages/ResetPassword';
import ResetFail from './pages/ResetFail';
import ResetSuccess from './pages/ResetSuccess.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PaymentInfo from './pages/PaymentInfo.jsx';
import DashboardUsers from './pages/DashboardUsers.jsx';
import PostAd from './pages/PostAd.jsx';
import PostHouse from './pages/PostHouse.jsx';
import EditHouse from './pages/EditHouse.jsx';
import EditListing from './pages/EditListing.jsx';
import MyAds from './pages/MyAds.jsx';
import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';
import ScrollToTop from './components/Scroll.jsx';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
    <Router>
      <ScrollToTop />
    <Routes>
      <Route path='/landing' element={<Landing />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot' element={<Forgot />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/explore" element={<Explore />} />
      <Route path='/houses/:houseId' element={<ShowHouse />} />
      <Route path='/listings/:listingId' element={<ShowListing />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/forgot-password/success' element={<ResetSuccess />} />
      <Route path='/reset-password/failed' element={<ResetFail />} />

      <Route path='/' element={<PrivateRoute />} >
        <Route path='/' element={<Home />} />
      </Route>
      <Route path="/posts" element={<BusinessPrivateRoute />}>
        <Route path="/posts" element={<Posts />} />
      </Route>

      <Route path="/postad" element={<PrivateRoute />}>
        <Route path="/postad" element={<PostAd />} />
      </Route>
      <Route path="/posthouse" element={<PrivateRoute />}>
        <Route path="/posthouse" element={<PostHouse />} />
      </Route>

      <Route path='/user/profile/:userId/earnings' element={<BusinessPrivateRoute />} >
        <Route path='/user/profile/:userId/earnings' element={<Earnings />} />
      </Route>
      <Route path='/user/profile/:userId/ads' element={<BusinessPrivateRoute />} >
        <Route path='/user/profile/:userId/ads' element={<MyAds />} />
      </Route>
      <Route path='/user/profile/:userId/transactions' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/transactions' element={<Transactions />} />
      </Route>
      <Route path='/user/profile/:userId/payment-info' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/payment-info' element={<PaymentInfo />} />
      </Route>
      <Route path='/houses/:houseId/edit' element={<PrivateRoute />} >
        <Route path='/houses/:houseId/edit' element={<EditHouse />} />
      </Route>
      <Route path='/listings/:listingId/edit' element={<PrivateRoute />} >
        <Route path='/listings/:listingId/edit' element={<EditListing />} />
      </Route>

      <Route path='/posts/post/:postId' element={<PrivateRoute />} >
        <Route path='/posts/post/:postId' element={<ShowPost />} />
      </Route>
      <Route path='/user/profile/:userId' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId' element={<Profile />} />
      </Route>

      <Route path='/success' element={<PrivateRoute />} >
        <Route path='/success' element={<Success />} />
      </Route>
      {/* <Route path='/makepay' element={<PrivateRoute />} >
        <Route path='/makepay' element={<Pay />} />
      </Route> */}
      <Route path='/dashboard' element={<PrivateRoute />} >
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
      <Route path='/products/cart/checkout' element={<PrivateRoute />} >
        <Route path='/products/cart/checkout' element={<Cart />} />
      </Route>
      <Route path='/dashboard/users' element={<PrivateRoute />} >
        <Route path='/dashboard/users' element={<DashboardUsers />} />
      </Route>
      <Route path='/success-pay' element={<PrivateRoute />} >
        <Route path='/success-pay' element={<SuccessPay />} />
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
    
    {/* Show BottomNavbar only if user is logged in */}
    {user && <BottomNavbar user={user} />}
    </Router>
      
    <ToastContainer />
    </>
  )
}

export default App
