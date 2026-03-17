import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

interface Flat {
  _id: string;
  flatNumber: string;
  floor: number;
  currentTenant: any | null;
}

interface FlatState {
  flats: Flat[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: FlatState = {
  flats: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const fetchFlats = createAsyncThunk(
  'flats/fetchAll',
  async (_: void, thunkAPI: any) => {
    try {
      const response = await api.get('/flats');
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

export const flatSlice = createSlice({
  name: 'flats',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchFlats.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(fetchFlats.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = false;
        state.flats = action.payload;
      })
      .addCase(fetchFlats.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export default flatSlice.reducer;
