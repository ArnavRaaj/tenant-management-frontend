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
  reducers: {
    markRentPaidLocally: (
      state: any,
      action: {
        payload: {
          tenantId: string;
          amountPaid?: number;
          rentMonth?: string;
          rentYear?: number;
          remainingBalance?: number;
        };
      },
    ) => {
      const { tenantId, amountPaid, rentMonth, rentYear, remainingBalance } =
        action.payload;
      const index = state.tenants.findIndex(
        (t: any) => (t._id || t.id) === tenantId,
      );
      if (index !== -1) {
        const tenant = state.tenants[index];
        tenant.isCurrentMonthPaid = true;
        if (rentMonth) tenant.lastPaidMonth = rentMonth;
        if (rentYear) tenant.lastPaidYear = rentYear;
        if (typeof remainingBalance === "number") {
          tenant.pendingBalance = remainingBalance;
        } else if (typeof amountPaid === "number" && tenant.pendingBalance > 0) {
          tenant.pendingBalance = Math.max(0, tenant.pendingBalance - amountPaid);
        }
      }
    },
  },
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

export const { markRentPaidLocally } = tenantSlice.actions;

export default tenantSlice.reducer;
