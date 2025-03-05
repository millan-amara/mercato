import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Login from './pages/Login';
import Register from './pages/Register';
import ShowPost from './pages/ShowPost';
import PrivateRoute from './components/PrivateRoute';
import BusinessPrivateRoute from './components/BusinessPrivateRoute.jsx';
import Profile from './pages/Profile';
import Success from './pages/Success';
import Pay from './pages/Pay';
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
import Coins from './pages/Coins.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PaymentInfo from './pages/PaymentInfo.jsx';


function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
    <Router>
    <Routes>
      <Route path='/landing' element={<Landing />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/forgot' element={<Forgot />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />
      <Route path='/forgot-password/success' element={<ResetSuccess />} />
      <Route path='/reset-password/failed' element={<ResetFail />} />

      <Route path='/' element={<PrivateRoute />} >
        <Route path='/' element={<Home />} />
      </Route>
      <Route path="/posts" element={<BusinessPrivateRoute />}>
        <Route path="/posts" element={<Posts />} />
      </Route>

      <Route path='/user/profile/:userId/earnings' element={<BusinessPrivateRoute />} >
        <Route path='/user/profile/:userId/earnings' element={<Earnings />} />
      </Route>
      <Route path='/user/profile/:userId/transactions' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/transactions' element={<Transactions />} />
      </Route>
      <Route path='/user/profile/:userId/payment-info' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/payment-info' element={<PaymentInfo />} />
      </Route>
      <Route path='/user/profile/:userId/coins' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/coins' element={<Coins />} />
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
      <Route path='/makepay' element={<PrivateRoute />} >
        <Route path='/makepay' element={<Pay />} />
      </Route>
      <Route path='/dashboard' element={<PrivateRoute />} >
        <Route path='/dashboard' element={<Dashboard />} />
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
