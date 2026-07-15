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

// Fetch all flats — optional status filter: 'vacant' | 'occupied' | undefined (all)
export const fetchFlats = createAsyncThunk(
  'flats/fetchAll',
  async (status: 'vacant' | 'occupied' | undefined = undefined, thunkAPI: any) => {
    try {
      const query = status ? `?status=${status}` : '';
      const response = await api.get(`/flats${query}`);
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

export const createFlatThunk = createAsyncThunk(
  'flats/create',
  async (payload: { flatNumber: string; floor: number }, thunkAPI: any) => {
    try {
      const response = await api.post('/flats', payload);
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

export const deleteFlatThunk = createAsyncThunk(
  'flats/delete',
  async (id: string, thunkAPI: any) => {
    try {
      await api.delete(`/flats/${id}`);
      return id;
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
    // fetchFlats
    builder
      .addCase(fetchFlats.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
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

    // createFlatThunk
    builder
      .addCase(createFlatThunk.fulfilled, (state: any, action: any) => {
        state.flats.push(action.payload);
      });

    // deleteFlatThunk
    builder
      .addCase(deleteFlatThunk.fulfilled, (state: any, action: any) => {
        state.flats = state.flats.filter((f: Flat) => f._id !== action.payload);
      });
  },
});

export default flatSlice.reducer;
