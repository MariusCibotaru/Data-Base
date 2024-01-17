import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axios';
import { RootState } from '../store';

interface UploadResponse {
    status: string;
    message?: string;
}

interface UploadState {
    uploadStatus: 'idle' | 'loading' | 'success' | 'failed';
    message?: string;
}

const initialState: UploadState = {
    uploadStatus: 'idle',
};

export const uploadPhoto = createAsyncThunk<UploadResponse, FormData, { rejectValue: string }>(
    'photo/upload',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post('/server.php?action=uploadPhoto', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data as UploadResponse;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || 'Failed to upload photo');
        }
    }
);

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(uploadPhoto.pending, (state) => {
                state.uploadStatus = 'loading';
            })
            .addCase(uploadPhoto.fulfilled, (state, action: PayloadAction<UploadResponse>) => {
                state.uploadStatus = 'success';
                state.message = action.payload.message;
            })
            .addCase(uploadPhoto.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.uploadStatus = 'failed';
                state.message = action.payload ?? 'Unknown error';
            });
    },
});

export const selectUploadStatus = (state: RootState) => state.upload.uploadStatus;
export const selectUploadMessage = (state: RootState) => state.upload.message;

export const uploadReducer = uploadSlice.reducer;
