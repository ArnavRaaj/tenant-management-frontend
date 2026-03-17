import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

interface DashboardState {
  monthlyRentBreakdown: { monthStr: string; totalRent: number }[];
  floorRentBreakdown: { floorStr: string; floorNum: number; totalRent: number }[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: DashboardState = {
  monthlyRentBreakdown: [],
  floorRentBreakdown: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_: void, thunkAPI: any) => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error: any) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchDashboardStats.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = false;
        state.monthlyRentBreakdown = action.payload.monthlyRentBreakdown;
        state.floorRentBreakdown = action.payload.floorRentBreakdown;
      })
      .addCase(fetchDashboardStats.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
