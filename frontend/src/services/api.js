import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const api = axios.create({ baseURL: apiBaseUrl })

// Attach token if present
api.interceptors.request.use(cfg => {
	const token = localStorage.getItem('token');
	if (token) cfg.headers = { ...(cfg.headers||{}), Authorization: `Bearer ${token}` };
	return cfg;
})

export default api
