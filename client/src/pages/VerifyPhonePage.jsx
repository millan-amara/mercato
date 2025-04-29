
import VerifyOtp from "./VerifyOtp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../features/auth/authSlice';

const VerifyPhonePage = () => {
    const { user } = useSelector((state) => state.auth);
    const userPhone = user?.phone;
    const dispatch = useDispatch();

    const navigate = useNavigate(); // if using React Router

    const handleSuccess = () => {
      toast.success('Phone verified successfully');
      dispatch(fetchUser());
      navigate('/'); //
    };

  return (
    <VerifyOtp userPhone={userPhone} onSuccess={handleSuccess} />
  );
};

export default VerifyPhonePage;


