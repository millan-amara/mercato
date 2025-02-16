import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Login from './pages/Login';
import Register from './pages/Register';
import ShowPost from './pages/ShowPost';
import PrivateRoute from './components/PrivateRoute';
import BusinessRoute from './components/BusinessRoute';
import Profile from './pages/Profile';
import Success from './pages/Success';
import Pay from './pages/Pay';
import SuccessPay from './pages/SuccessPay';
import Earnings from './pages/Earnings';
import Landing from './pages/Landing';


function App() {
  return (
    <>
    <Router>
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/posts' element={<Posts />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/create' element={<Home />} />
      <Route path='/user/profile/:userId/earnings' element={<PrivateRoute />} >
        <Route path='/user/profile/:userId/earnings' element={<Earnings />} />
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
      <Route path='/success-pay' element={<PrivateRoute />} >
        <Route path='/success-pay' element={<SuccessPay />} />
      </Route>
    </Routes>
    </Router>
      
    <ToastContainer />
    </>
  )
}

export default App
