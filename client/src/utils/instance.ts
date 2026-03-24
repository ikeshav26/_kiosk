import axios from 'axios';
import API_URL from '../api/config';

export const instance = axios.create({
  baseURL: API_URL,
});
