import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/User';
import { postReducer } from './slices/Post';
import { likeReducer } from './slices/Like';
import { commentReducer } from './slices/Comments';
import { subscriptionReducer } from './slices/Subscriptions';
import { uploadReducer } from './slices/Uploads';
import { storyReducer } from './slices/Story';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        likes: likeReducer,
        comments: commentReducer,
        subscriptions: subscriptionReducer,
        upload: uploadReducer,
        stories: storyReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
