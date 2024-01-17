import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';


export interface Like {
    Id: number;
    UserId: number;
    PostId: number;
}

interface LikeState {
    likes: Like[];
    status: 'idle' | 'loading' | 'failed';
    error: any; 
}

const initialLikeState: LikeState = {
    likes: [],
    status: 'idle',
    error: null
};

// Действие для создания лайка
export const createLike = createAsyncThunk(
    'likes/createLike',
    async (likeData: { UserId: number; PostId: number }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=createLike', likeData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для удаления лайка
export const deleteLike = createAsyncThunk(
    'likes/deleteLike',
    async (likeId: number, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/server.php?action=deleteLike&likeId=${likeId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения всех лайков
export const fetchAllLikes = createAsyncThunk(
    'likes/fetchAllLikes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/server.php?action=getAllLikes');
            return response.data.likes; // Предполагается, что сервер возвращает массив лайков
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения лайков по ID
export const fetchLikesById = createAsyncThunk(
    'likes/fetchLikesById',
    async (postId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getLikesByPostId&postId=${postId}`);
            return response.data.likes; // Предполагается, что сервер возвращает лайки для конкретного поста
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


const likeSlice = createSlice({
    name: 'likes',
    initialState: initialLikeState,
    reducers: {
        // здесь можно добавить синхронные редьюсеры при необходимости
    },
    extraReducers: (builder) => {
        builder
            .addCase(createLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createLike.fulfilled, (state, action) => {
                state.likes.push(action.payload);
                state.status = 'idle';
            })
            .addCase(createLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteLike.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteLike.fulfilled, (state, action) => {
                state.likes = state.likes.filter(like => like.Id !== action.payload.Id);
                state.status = 'idle';
            })
            .addCase(deleteLike.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAllLikes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllLikes.fulfilled, (state, action) => {
                state.likes = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchAllLikes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchLikesById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLikesById.fulfilled, (state, action) => {
                state.likes = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchLikesById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const likeReducer = likeSlice.reducer;
