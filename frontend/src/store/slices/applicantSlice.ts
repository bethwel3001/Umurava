import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applicants';

export const fetchApplicants = createAsyncThunk('applicants/fetchApplicants', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const fetchApplicantById = createAsyncThunk('applicants/fetchById', async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
});

export const screenApplicants = createAsyncThunk('applicants/screen', async (data: { jobId: string, applicantIds: string[] }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/screen`, data);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'AI screening failed');
  }
});

export const fetchScreeningResults = createAsyncThunk('applicants/fetchResults', async (jobId: string) => {
  const response = await axios.get(`${API_URL}/results/${jobId}`);
  return response.data;
});

export const parseResume = createAsyncThunk('applicants/parse', async (resumeText: string) => {
  const response = await axios.post(`${API_URL}/parse`, { resumeText });
  const parsedData = response.data;
  
  // Also create the applicant in the database immediately
  const createResponse = await axios.post(API_URL, {
    name: parsedData.Name || 'Unknown Applicant',
    email: parsedData.Email || `talent-${Date.now()}@umurava.ai`,
    phone: parsedData.Phone,
    parsedData: parsedData
  });
  
  return createResponse.data;
});

export const uploadResume = createAsyncThunk('applicants/upload', async (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await axios.post(`${API_URL}/upload`, formData);
  const { parsedData } = response.data;
  
  const createResponse = await axios.post(API_URL, {
    name: parsedData.Name || 'Unknown Applicant',
    email: parsedData.Email || `talent-${Date.now()}@umurava.ai`,
    phone: parsedData.Phone,
    parsedData: parsedData
  });
  
  return createResponse.data;
});

const applicantSlice = createSlice({
  name: 'applicants',
  initialState: {
    applicants: [],
    selectedApplicant: null,
    results: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedApplicant: (state) => {
      state.selectedApplicant = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.applicants = action.payload;
      })
      .addCase(fetchApplicantById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicantById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedApplicant = action.payload;
      })
      .addCase(screenApplicants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(screenApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(screenApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || 'AI screening failed';
      })
      .addCase(fetchScreeningResults.fulfilled, (state, action) => {
        state.results = action.payload;
      });
  },
});

export const { clearSelectedApplicant } = applicantSlice.actions;
export default applicantSlice.reducer;
