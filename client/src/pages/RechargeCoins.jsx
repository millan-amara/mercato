import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RechargeCoins = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const options = [
    { coins: 100, amount: 1 },
    { coins: 500, amount: 5 },
    { coins: 1000, amount: 1000 },
  ];

  const handleSubmit = async () => {
    if (!selectedOption) {
      toast.error('Please select a recharge option');
      return;
    }

    try {
      toast.loading('Initiating payment...');

      const response = await axios.post(`${API_URL}/payments/recharge`, {
        coins: selectedOption.coins,
        amount: selectedOption.amount,
      }, { withCredentials: true });

      toast.success('Payment initiated! Please complete it on your phone.');
      navigate('/success-pay')

    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate payment. Try again.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center bg-gray-100 p-4 pb-24">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Recharge Your Coins</h2>
        <div className="space-y-4">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedOption(option)}
              className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center 
              ${selectedOption?.coins === option.coins ? 'border-fuchsia-600 bg-fuchsia-50' : 'border-gray-300'} 
              hover:border-fuchsia-400 transition`}
            >
              <div>
                <p className="font-semibold text-gray-700">{option.coins} Coins</p>
                <p className="text-sm text-gray-500">{option.amount} KES</p>
              </div>
              {selectedOption?.coins === option.coins && (
                <span className="text-fuchsia-600 font-bold">Selected</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedOption ? `Pay ${selectedOption.amount} KES` : 'Select an option'}
        </button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default RechargeCoins;
