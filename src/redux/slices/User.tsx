import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axios';
import instance from '../../axios';
import { RootState } from '../store';

interface LoginData {
    email: string;
    password: string;
}

interface RegistrationData {
    username: string;
    email: string;
    password: string;
}

export interface User {
    Id: number;
    username: string;
    email: string;
    postsCount: number; 
    subscriptions: number;   
    subscribers: number;  
}

export interface AuthState {
    currentUser: User | null;
    isAuthenticated: boolean;
    token: string | null;
    status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
    currentUser: null,
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    status: 'idle',
};

interface AuthResponse {
    user: User;
    token: string; 
    isAuthenticated: boolean;
}

export const loginUser = createAsyncThunk<AuthResponse,LoginData,{ rejectValue: string }  >(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=login', data);
            return response.data as AuthResponse;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegistrationData, { rejectWithValue }) => {
        try {
            // Используйте 'instance' вместо 'axios'
            const response = await instance.post('/server.php?action=register', data);
            return response.data as AuthResponse;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
); 

export const fetchUserData = createAsyncThunk(
    'auth/fetchUserData',
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get('/server.php?action=getUserData');
            return response.data as AuthResponse;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
            state.token = null;
            localStorage.removeItem('token'); 
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.status = 'idle';
                localStorage.setItem('token', action.payload.token); 
            })
            .addCase(loginUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.isAuthenticated = true;
                state.status = 'idle';
                localStorage.setItem('token', action.payload.token); 
            })
            .addCase(registerUser.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(fetchUserData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.currentUser = action.payload.user;
                state.status = 'idle';
                state.isAuthenticated = action.payload.isAuthenticated;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { logout } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.status === 'loading';

export const authReducer = authSlice.reducer;
