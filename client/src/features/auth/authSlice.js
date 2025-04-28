import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'


//Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//Register new user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = error.response?.data?.error?.message || "Registration failed. Please try again.";

        return thunkAPI.rejectWithValue(message)
    }
})

//Log in user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = error.response?.data?.error?.message || "Login failed. Please try again.";

        return thunkAPI.rejectWithValue(message)
    }
})

// Fetch latest user data
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, thunkAPI) => {
    try {
        return await authService.getUser();
    } catch (error) {
        const message = error.response?.data?.error?.message || "Failed to fetch user.";
        return thunkAPI.rejectWithValue(message);
    }
});


//Update user
export const updateUser = createAsyncThunk('auth/update', async ({userData, userId}, thunkAPI) => {
    try {
        return await authService.updateUser(userData, userId)
    } catch (error) {
        const message = error.response?.data?.error?.message || "Update failed. Please try again.";

        return thunkAPI.rejectWithValue(message)
    }
})


//Log out
export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

// Handle payment update (after payment is complete)
export const updateUserCoins = createAsyncThunk('auth/updateUserCoins', async ({ userId, coins }, thunkAPI) => {
    try {
        const updatedUser = await authService.updateUserCoins(userId, coins);
        return updatedUser; // This should return the user data with the updated coins
    } catch (error) {
        const message = error.response?.data?.error?.message || "Failed to update user coins.";
        return thunkAPI.rejectWithValue(message);
    }
});


const userSliceOptions = {
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isError = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isError = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = null;
                state.message = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.user = action.payload;
                state.isError = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.user = user;
                state.message = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isError = false;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // After payment is complete and user coins are updated
            .addCase(updateUserCoins.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isError = false;
            })
            
    }
}

export const authSlice = createSlice(userSliceOptions)
export const { reset } = authSlice.actions;
export default authSlice.reducer