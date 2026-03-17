import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

interface TenantState {
  tenants: any[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: TenantState = {
  tenants: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchTenants = createAsyncThunk(
  'tenants/fetchAll',
  async (_: void, thunkAPI: any) => {
    try {
      const response = await api.get('/tenants');
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

export const tenantSlice = createSlice({
  name: 'tenants',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchTenants.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchTenants.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = false;
        state.tenants = action.payload;
      })
      .addCase(fetchTenants.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export default tenantSlice.reducer;
