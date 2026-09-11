import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_API_URL || "https://blog-app-sclm.onrender.com";

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
	const token = localStorage.getItem("jwt");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});