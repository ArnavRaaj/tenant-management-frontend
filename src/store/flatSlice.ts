import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

interface Flat {
  _id: string;
  flatNumber: string;
  floor: number;
  buildingName: string;
  currentTenant: any | null;
}

interface FlatState {
  flats: Flat[];
  buildingTags: string[];
  tagsLoading: boolean;
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: FlatState = {
  flats: [],
  buildingTags: [],
  tagsLoading: false,
  isLoading: false,
  isError: false,
  message: "",
};

interface FetchFlatsOptions {
  status?: "vacant" | "occupied";
  tag?: string;
}

// Fetch flats — optional status and/or building tag filter
export const fetchFlats = createAsyncThunk(
  "flats/fetchAll",
  async (
    options?: FetchFlatsOptions | "vacant" | "occupied",
    thunkAPI?: any,
  ) => {
    try {
      const params: any = {};
      if (typeof options === "string") {
        params.status = options;
      } else if (options) {
        if (options.status) params.status = options.status;
        if (options.tag) params.tag = options.tag;
      }
      const response = await api.get("/flats", { params });
      return response.data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Fetch distinct building/apartment name tags
export const fetchBuildingTags = createAsyncThunk(
  "flats/fetchBuildingTags",
  async (_, thunkAPI: any) => {
    try {
      const response = await api.get("/flats/meta/tags");
      return response.data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const createFlatThunk = createAsyncThunk(
  "flats/create",
  async (
    payload: {
      flatNumber: string;
      floor: number;
      buildingName: string;
      address?: string;
    },
    thunkAPI: any,
  ) => {
    try {
      const response = await api.post("/flats", payload);
      return response.data;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteFlatThunk = createAsyncThunk(
  "flats/delete",
  async (id: string, thunkAPI: any) => {
    try {
      await api.delete(`/flats/${id}`);
      return id;
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const flatSlice = createSlice({
  name: "flats",
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

    // fetchBuildingTags
    builder
      .addCase(fetchBuildingTags.pending, (state: any) => {
        state.tagsLoading = true;
      })
      .addCase(fetchBuildingTags.fulfilled, (state: any, action: any) => {
        state.tagsLoading = false;
        state.buildingTags = action.payload;
      })
      .addCase(fetchBuildingTags.rejected, (state: any) => {
        state.tagsLoading = false;
      });

    // createFlatThunk
    builder.addCase(createFlatThunk.fulfilled, (state: any, action: any) => {
      state.flats.push(action.payload);
    });

    // deleteFlatThunk
    builder.addCase(deleteFlatThunk.fulfilled, (state: any, action: any) => {
      state.flats = state.flats.filter((f: Flat) => f._id !== action.payload);
    });
  },
});

export default flatSlice.reducer;
