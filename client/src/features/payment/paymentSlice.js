import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService"; // Service for API calls

const initialState = {
    paymentStatus: "PENDING", // Default state
    invoiceId: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Async thunk to fetch payment status from API
export const checkPaymentStatus = createAsyncThunk(
    "payment/checkStatus",
    async (invoiceId, thunkAPI) => {
        try {
            return await paymentService.getPaymentStatus(invoiceId);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        updatePaymentStatus: (state, action) => {
            state.paymentStatus = action.payload.status;
            state.invoiceId = action.payload.invoiceId;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkPaymentStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkPaymentStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.paymentStatus = action.payload.status;
                state.invoiceId = action.payload.invoiceId;
            })
            .addCase(checkPaymentStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { updatePaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;
