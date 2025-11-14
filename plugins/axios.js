import axios from "axios";
import Router from 'next/router';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/`,
    withCredentials: true,
    timeout: 30000, // 30 segundos
});

// Interceptor de requisição para marcar o início
axiosInstance.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date().getTime() };
    return config;
});

// Interceptor de resposta
axiosInstance.interceptors.response.use(
    (response) => {
        const elapsed = new Date().getTime() - response.config.metadata.startTime;
        if (elapsed > 10000) {
            toast.warn('⚠️ O servidor está demorando para responder. Por favor, aguarde.');
        }
        return response;
    },
    (error) => {
        const startTime = error.config?.metadata?.startTime;
        if (startTime) {
            const elapsed = new Date().getTime() - startTime;
            if (elapsed > 10000) {
                toast.warn('⚠️ O servidor está demorando para responder. Por favor, aguarde.');
            }
        }

        if (error.response && error.response.status === 401) {
            Router.push('/login');
        }
        return Promise.reject(error);
    }
);

export { axiosInstance as default, axios };
