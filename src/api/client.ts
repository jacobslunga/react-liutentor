import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.liutentor.se/api",
  timeout: 10000,
});

export default apiClient;
