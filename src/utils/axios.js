import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // URL base del backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;