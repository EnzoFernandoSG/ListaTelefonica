import axios from 'axios';

const baseURL = 'http://localhost:5264/api';

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;