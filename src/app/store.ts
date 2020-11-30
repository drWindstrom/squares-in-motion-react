import { configureStore } from '@reduxjs/toolkit';
import squareReducer from '../features/square/squareSlice';

export const store = configureStore({
  reducer: {
    square: squareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;