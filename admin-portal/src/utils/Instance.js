import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  withCredentials: true,
});

let _logoutHandler = null;

export const register401Handler = (fn) => {
  _logoutHandler = fn;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes('/auth/login')
    ) {
      localStorage.removeItem('user');
      toast.error('Session expired. Please login again.');
      if (_logoutHandler) _logoutHandler();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
