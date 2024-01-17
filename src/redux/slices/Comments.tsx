import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

// Интерфейс для комментария
export interface Comment {
    Id: number;
    UserId: number;
    PostId: number;
    Text: string;
    IsAnswer: number;
    AnswerId: number | null;
    username: string;
}

// Начальное состояние
interface CommentState {
    comments: Comment[];
    status: 'idle' | 'loading' | 'failed';
    error: any;
}

const initialCommentState: CommentState = {
    comments: [],
    status: 'idle',
    error: null
};

// AsyncThunk для создания комментария
export const createComment = createAsyncThunk(
    'comments/createComment',
    async (commentData: { UserId: number; PostId: number; Text: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=createComment', commentData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// AsyncThunk для удаления комментария
export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async (commentId: number, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/server.php?action=deleteComment&commentId=${commentId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// AsyncThunk для получения всех комментариев
export const fetchAllComments = createAsyncThunk(
    'comments/fetchAllComments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/server.php?action=getAllComments');
            return response.data.comments; 
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// AsyncThunk для получения комментариев по ID поста
export const fetchCommentsByPostId = createAsyncThunk(
    'comments/fetchCommentsByPostId',
    async (postId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getCommentsByPostId&postId=${postId}`);
            return response.data.comments; 
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);


const commentSlice = createSlice({
    name: 'comments',
    initialState: initialCommentState,
    reducers: {
        // Опционально: синхронные редьюсеры
    },
    extraReducers: (builder) => {
        builder
            .addCase(createComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
                state.status = 'idle';
            })
            .addCase(createComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteComment.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.comments = state.comments.filter(comment => comment.Id !== action.payload.Id);
                state.status = 'idle';
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAllComments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchAllComments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchCommentsByPostId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchCommentsByPostId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const commentReducer = commentSlice.reducer;
