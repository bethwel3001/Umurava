import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/jobs';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const createJob = createAsyncThunk('jobs/createJob', async (jobData: any) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, jobData }: { id: string, jobData: any }) => {
  const response = await axios.put(`${API_URL}/${id}`, jobData);
  return response.data;
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as any;
      })
      .addCase(createJob.fulfilled, (state: any, action) => {
        state.jobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state: any, action) => {
        const index = state.jobs.findIndex((job: any) => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state: any, action) => {
        state.jobs = state.jobs.filter((job: any) => job._id !== action.payload);
      });
  },
});

export default jobSlice.reducer;
