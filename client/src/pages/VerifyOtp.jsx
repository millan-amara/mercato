import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = ({ userPhone, onSuccess }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds cooldown
  const { user } = useSelector((state) => state.auth);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // useEffect(() => {
  //   const sendOtp = async () => {
  //     if (user && !user.isVerified) {
  //       try {
  //         await axios.post(`${API_URL}/resend-otp`, { phone: user.phone });
  //         console.log('OTP sent automatically');
  //       } catch (err) {
  //         console.error('Failed to resend OTP', err);
  //         navigate('/'); // or show a message instead
  //       }
  //     } else {
  //       navigate('/'); // if user is verified or not logged in
  //     }
  //   };

  //   sendOtp();
  // }, [user, navigate]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);



  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        phone: userPhone,
        code,
      });

      setMessage(response.data.message);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setMessage('');
      setLoading(true);

      await axios.post(`${API_URL}/resend-otp`, {
        phone: userPhone,
      });

      setMessage('OTP has been resent.');
      setResendTimer(60); // restart timer
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Phone</h2>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded"
          >
            {loading ? "Processing..." : "Verify"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {resendTimer > 0 ? (
            <p className="text-gray-500">Resend code in {resendTimer}s</p>
          ) : (
            <button
              onClick={handleResend}
              className="text-pink-600 hover:underline font-semibold"
              disabled={loading}
            >
              Resend OTP
            </button>
          )}
        </div>

        {message && (
          <div className="mt-4 text-center text-sm text-gray-700">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
