import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/posts/postSlice';
import bidReducer from '../features/bids/bidSlice';
import paymentReducer from '../features/payment/paymentSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        bids: bidReducer,
        payment: paymentReducer
    }
})