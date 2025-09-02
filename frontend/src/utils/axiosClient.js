import axios from 'axios';

// created an instance 
export const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
}});