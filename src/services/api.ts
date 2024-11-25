import axios from 'axios';

const API_KEY = "07cdd79e2a3e3e170ee1fa7dca962783"
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwN2NkZDc5ZTJhM2UzZTE3MGVlMWZhN2RjYTk2Mjc4MyIsIm5iZiI6MTczMTk2MDA4My4yMzMzMjQ4LCJzdWIiOiI2NzNiOWI3Mjc3ZWI1OWYyZjAxYTU2OTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.fKtFAONjD30B1F0AN1KzKD0xTxA8LCzupoBDTUuO-Rs"
const API_URL = 'https://api.themoviedb.org/3';
export const IMG_URL = 'https://image.tmdb.org/t/p/w500'

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  config.headers.Accept = 'application/json';
  return config;
});

export default api;