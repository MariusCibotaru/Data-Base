import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { Like } from './Like';
import { Comment } from './Comments';


export interface Post {
    Id: number;
    UserId: number;
    username: string;
    Title: string; 
    Text: string;
    ImageUrl?: string;
    LikesCount?: number;
    CommentsCount?: number;
    Likes?: Like[];
    Comments?: Comment[];
}


interface PostState {
    posts: Post[];
    subscribedPosts: Post[];
    userPosts: Post[];
    currentPost: Post | null; 
    status: 'idle' | 'loading' | 'failed';
    error: any;
}

const initialPostState: PostState = {
    posts: [],
    subscribedPosts: [],
    userPosts: [],
    currentPost: null, 
    status: 'idle',
    error: null
};

// Действие для создания поста
export const createPost = createAsyncThunk(
    'posts/createPost',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=createPost', formData, {
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

// Действие для получения всех постов
export const fetchAllPosts = createAsyncThunk(
    'posts/fetchAllPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/server.php?action=getAllPosts');
            return response.data.posts;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения постов от подписанных пользователей
export const fetchSubscribedPosts = createAsyncThunk(
    'posts/fetchSubscribedPosts',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getSubscribedPosts&userId=${userId}`);
            return response.data.posts;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения собственных постов пользователя
export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getUserPosts&userId=${userId}`);
            return response.data.posts;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения поста по ид
export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (postId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getPostById&postId=${postId}`);
            return response.data.post;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

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

const postSlice = createSlice({
    name: 'posts',
    initialState: initialPostState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPost.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload);
                state.status = 'idle';
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchAllPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string; 
            })
            .addCase(fetchSubscribedPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubscribedPosts.fulfilled, (state, action) => {
                state.subscribedPosts = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchSubscribedPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.userPosts = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchPostById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.currentPost = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(createLike.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post.Id === action.payload.PostId);
                if (postIndex !== -1 && state.posts[postIndex]) {
                    state.posts[postIndex].LikesCount = (state.posts[postIndex].LikesCount || 0) + 1;
                    state.posts[postIndex].Likes = [...(state.posts[postIndex].Likes ?? []), action.payload];
                }
            })
            .addCase(deleteLike.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post.Id === action.payload.PostId);
                if (postIndex !== -1 && state.posts[postIndex]) {
                    state.posts[postIndex].LikesCount = (state.posts[postIndex].LikesCount || 0) - 1;
                    const postLikes = state.posts[postIndex].Likes ?? [];
                    state.posts[postIndex].Likes = postLikes.filter(like => like.Id !== action.payload.Id);
                }
            })
            .addCase(createComment.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post.Id === action.payload.comment.PostId);
                if (postIndex !== -1 && state.posts[postIndex]) {
                    state.posts[postIndex].Comments = [...(state.posts[postIndex].Comments ?? []), action.payload.comment];
                }
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post.Id === action.payload.PostId);
                if (postIndex !== -1 && state.posts[postIndex]) {
                    const postComments = state.posts[postIndex].Comments ?? [];
                    state.posts[postIndex].Comments = postComments.filter(comment => comment.Id !== action.payload.commentId);
                }
            })
    },
});

export const selectIsPostLoading = (state: { posts: PostState }) => state.posts.status === 'loading';

export const postReducer = postSlice.reducer;
