import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { RootState } from '../store';

export interface Subscription {
    id: number;
    subscriberId: number;
    subscribedToId: number;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    status: 'idle' | 'loading' | 'failed';
    error: any;
}

const initialSubscriptionState: SubscriptionState = {
    subscriptions: [],
    status: 'idle',
    error: null
};

// Действие для создания подписки
export const createSubscription = createAsyncThunk(
    'subscriptions/createSubscription',
    async (subscriptionData: { subscriberId: number; subscribedToId: number }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=createSubscription', subscriptionData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для удаления подписки
export const deleteSubscription = createAsyncThunk(
    'subscriptions/deleteSubscription',
    async (subscriptionId: number, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/server.php?action=deleteSubscription&subscriptionId=${subscriptionId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Действие для получения всех подписок пользователя
export const fetchSubscriptionsByUserId = createAsyncThunk(
    'subscriptions/fetchSubscriptionsByUserId',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server.php?action=getSubscriptionsByUserId&userId=${userId}`);
            return response.data.subscriptions;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState: initialSubscriptionState,
    reducers: {
        // синхронные редьюсеры при необходимости
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSubscription.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createSubscription.fulfilled, (state, action) => {
                state.subscriptions.push(action.payload.subscription);
                state.status = 'idle';
            })
            .addCase(createSubscription.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteSubscription.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteSubscription.fulfilled, (state, action) => {
                const subscriptionIdToDelete = parseInt(action.payload.id);
                state.subscriptions = state.subscriptions.filter(subscription => subscription.id !== subscriptionIdToDelete);
                state.status = 'idle';
            })            
            .addCase(deleteSubscription.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(fetchSubscriptionsByUserId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSubscriptionsByUserId.fulfilled, (state, action) => {
                state.subscriptions = action.payload;
                state.status = 'idle';
            })
            .addCase(fetchSubscriptionsByUserId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const selectSubscriptions = (state: RootState) => state.subscriptions.subscriptions;
export const subscriptionReducer = subscriptionSlice.reducer;
