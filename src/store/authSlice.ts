import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

// Get user from localStorage safely
const getUserFromStorage = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("auth");
    if (user) {
      return JSON.parse(user);
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData: any, thunkAPI: any) => {
    try {
      const response = await api.post("/auth/login", userData);
      if (response.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth", JSON.stringify(response.data));
        }
      }
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

export const logout = createAsyncThunk("auth/logout", async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth");
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state: any) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(login.pending, (state: any) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state: any) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
