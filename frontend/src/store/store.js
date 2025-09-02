import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../authSlice';

export const stores = configureStore({
    reducer:{
        auth: authReducer
    }
})