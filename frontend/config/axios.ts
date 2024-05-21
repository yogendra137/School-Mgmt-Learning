import axios from 'axios';

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
	timeout: 15000,
	headers: { 'X-Custom-Header': 'foobar' },
});

// Set the AUTH token for any request
instance.interceptors.request.use(function (config) {
	const token = localStorage.getItem('token');
	config.headers.Authorization = token || '';
	return config;
});

export default instance;
