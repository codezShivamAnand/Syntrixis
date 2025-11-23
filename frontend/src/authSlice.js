import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {axiosClient} from "./utils/axiosClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      console.log(response.data);
      return response.data.user;
    } catch (error) {
      console.log(error);
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.response?.status || null,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.response?.status || null,
      });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.response?.status || null,
      });
    }
  }
);

// checks if the user already has visited the site , allows to implement the direct naviagation to homepage if true
export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      console.log("checkAuthData", data);
      return data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        code: error.code,
        status: error.response?.status || null,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // for Register User -> API call
      // loading
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled     (!null = true , !!null = false)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      // error / rejected
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // for login Case
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {   
        state.loading = false;
        state.isAuthenticated = !!action.payload;          
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {     
        state.loading = false;                             
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;                    
        state.user = null;
      })

      // for check Auth case
      .addCase(checkAuth.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state,action)=>{
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.message || "something went wrong";
        state.user = null ; // required to make it null 
    })

      // logout 
      .addCase(logout.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(logout.rejected, (state,action)=>{
        state.loading = false;
        state.user = null ; // required to make it null 
        state.isAuthenticated = false;
        state.error = action.payload.message || "something went wrong";
      })
  },
});
export default authSlice.reducer;
