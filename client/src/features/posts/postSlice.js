import { createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import postService from './postService'


const initialState = {
    posts: [],
    post: {}, 
    isError: false,
    isSuccess: false,
    isLoading: true,
    message: ''
}

//Create new post
export const createPost = createAsyncThunk('posts/create', async (postData, thunkAPI) => {
    try {
        return await postService.createPost(postData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

//Get posts
export const servePosts = createAsyncThunk('posts/getAll', async (_, thunkAPI) => {
    try {
        return await postService.servePosts();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

//Get single post/ Show page
export const showPost = createAsyncThunk('posts/show', async (postId, thunkAPI) => {
    try {
        return await postService.showPost(postId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message)
        || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})



//Slice
const postSliceOptions = {
    name: 'posts',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = false,
            state.post = {},
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(servePosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(servePosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.posts = action.payload;
                state.isSuccess = true;
            })
            .addCase(servePosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(showPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(showPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.post = action.payload;
                state.isSuccess = true;
            })
            .addCase(showPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
}


export const postSlice = createSlice(postSliceOptions)
export const {reset} = postSlice.actions
export default postSlice.reducer