import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import bidService from './bidService'


//Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    bids: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//Create a bid
export const createBid = createAsyncThunk('bids/create', async (bidData, thunkAPI) => {
    try {
        console.log(bidData)
        return await bidService.createBid(bidData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


//Get All Bids for a post
export const getBids = createAsyncThunk('bids/getAll', async (postId, thunkAPI) => {
    try {
  
        return await bidService.getBids(postId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})


export const bidSlice = createSlice({
    name: 'bid',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBids.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBids.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bids = action.payload;
                state.isSuccess = true;
            })
            .addCase(getBids.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createBid.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createBid.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bids.push(action.payload.bid);
                state.isSuccess = true;

                    // Store updated user data in local storage
                if (action.payload.user) {
                    localStorage.setItem('user', JSON.stringify(action.payload.user));
                }
            })
            .addCase(createBid.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

    }
})

export const { reset } = bidSlice.actions;
export default bidSlice.reducer;
