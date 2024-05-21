import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// configure which keuy we want to persist
const authPersistConfig = {
	key: 'auth',
	storage: storage,
	whitelist: ['authState'],
};

export const rootReducer = combineReducers({
	auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
	reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
