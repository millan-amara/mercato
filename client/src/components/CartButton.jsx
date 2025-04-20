import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

function CartButton({ cartItems }) {

  return (
    <Link
        to="/products/cart/checkout"
        className="fixed bottom-20 right-5 z-50 bg-black text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center"
    >
        <FaShoppingCart className="w-6 h-6" />
        {cartItems > 0 && (
            <span className="absolute -bottom-1 -right-1 bg-fuchsia-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
            {cartItems}
            </span>
        )}
    </Link>

    
  );
}

export default CartButton;
