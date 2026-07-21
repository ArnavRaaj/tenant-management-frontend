import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

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
  message: "",
};

// Params: status = 'past' | undefined (defaults to active), rentDue = true | undefined
export const fetchTenants = createAsyncThunk(
  "tenants/fetchAll",
  async (
    params: { status?: "past"; rentDue?: boolean } | void,
    thunkAPI: any,
  ) => {
    try {
      const qs = new URLSearchParams();
      if (params?.status === "past") qs.set("status", "past");
      if (params?.rentDue === true) qs.set("rentDue", "true");
      const query = qs.toString() ? `?${qs.toString()}` : "";
      const response = await api.get(`/tenants${query}`);
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

export const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchTenants.pending, (state: any) => {
        state.isLoading = true;
        state.isError = false;
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
