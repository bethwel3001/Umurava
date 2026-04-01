import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stats';

export const fetchDashboardStats = createAsyncThunk('stats/fetchDashboard', async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
});

interface StatsState {
  dashboard: {
    activeJobs: number;
    totalApplicants: number;
    screenedToday: number;
    avgTimeToHire: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  dashboard: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      });
  },
});

export default statsSlice.reducer;
