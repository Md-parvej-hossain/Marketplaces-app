import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  //interceptor
  //Response Interceptor
  axiosSecure.interceptors.response.use(
    res => {
      console.log(
        'Response app e ashar agei ami thamiye dekhechi ki ache er vetor'
      );
      return res;
    },
    async error => {
      console.log('Error from axios Interceptor', error.response);
      if (error.response.status === 401 || error.response.status === 403) {
        await logOut();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
  //Request Interceptor
  // axios.interceptors.request
  return axiosSecure;
};

export default useAxiosSecure;
