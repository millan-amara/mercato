import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemove = (listingId) => {
    const updatedCart = cartItems.filter(item => item.listingId !== listingId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
        cartItems,
        amount: totalAmount,
        address,
    };

    try {
        const { data } = await axios.post(`${API_URL}/payments/makepay`, payload, {
            withCredentials: true
        });
        if (data.success) {
            localStorage.removeItem('cart');
            setCartItems([]);
            navigate('/success-pay');
        }
    } catch (error) {
        console.error("Payment error:", error);
    }

    setLoading(false);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="px-4 py-8 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.listingId} className="flex items-center justify-between border p-4 rounded-md shadow-sm">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                      <h2 className="font-medium">{item.title}</h2>
                      <p>Ksh. {item.price.toLocaleString()} × {item.quantity}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemove(item.listingId)} className="text-red-500 hover:text-red-700">
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            <textarea
              id='address'
              placeholder="(Phone number, Name, Location) e.g. 0712345678, James Jane, Makueni Town."
              className='w-full mt-5 p-2 focus:ring-2 focus:outline-none appearance-none text-sm leading-6 text-slate-900 ring-1 ring-slate-200 shadow-sm rounded-lg resize-none overflow-auto'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              style={{ minHeight: '40px', maxHeight: '500px' }}
              required
            />

            <div className="mt-8 border-t pt-4">
              <h2 className="text-xl font-semibold">Total: Ksh. {totalAmount.toLocaleString()}</h2>
              <button
                onClick={handleCheckout}
                className="mt-4 bg-black hover:bg-gray-800 text-white w-full py-3 rounded-md font-medium"
              >
                Check Out
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Cart;
