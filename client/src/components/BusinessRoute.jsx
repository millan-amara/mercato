import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BusinessRoute = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    toast.error('You need to log in to access this page.');
    return <Navigate to="/login" />;
  }

  if (!user.business) {
    toast.error('You do not have access to this page.');
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default BusinessRoute;
