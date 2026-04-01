import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './slices/jobSlice';
import applicantReducer from './slices/applicantSlice';
import uiReducer from './slices/uiSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    jobs: jobReducer,
    applicants: applicantReducer,
    ui: uiReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
