import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export interface Story {
    Id: number;
    UserId: number;
    Text: string;
    ImageUrl?: string;
    CreatedAt: string;
}

interface StoryState {
    stories: Story[];
    subscribedStories: Story[];
    userStories: Story[];
    currentStory: Story | null; 
    status: 'idle' | 'loading' | 'failed';
    error: any;
}

const initialStoryState: StoryState = {
    stories: [],
    subscribedStories: [],
    userStories: [],
    currentStory: null, 
    status: 'idle',
    error: null
};

export const createStory = createAsyncThunk(
    'stories/createStory',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=createStory', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchAllStories = createAsyncThunk(
    'stories/fetchAllStories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/server.php?action=getAllStories');
            return response.data.stories;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchUserStories = createAsyncThunk(
    'stories/fetchUserStories',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getUserStories&userId=${userId}`);
            return response.data.stories;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchSubscribedStories = createAsyncThunk(
    'stories/fetchSubscribedStories',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getSubscribedStories&userId=${userId}`);
            return response.data.stories;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const storySlice = createSlice({
    name: 'stories',
    initialState: initialStoryState,
    reducers: {
        // Ваши редьюсеры, если они есть
    },
    extraReducers: (builder) => {
        builder
            .addCase(createStory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createStory.fulfilled, (state, action) => {
                state.stories.push(action.payload);
                state.status = 'idle';
            })
            .addCase(createStory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAllStories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllStories.fulfilled, (state, action) => {
                state.stories = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchAllStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchUserStories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserStories.fulfilled, (state, action) => {
                state.userStories = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchUserStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchSubscribedStories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubscribedStories.fulfilled, (state, action) => {
                state.subscribedStories = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchSubscribedStories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const storyReducer = storySlice.reducer;
