import axios from "axios";
import { API_URL as ENV_API_URL } from "@env";
import { getToken } from "./storage";

const API_URL = ENV_API_URL || "https://areca-nut-grade-apps.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// MENAMBAHKAN TOKEN OTOMATIS
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if(token && config.headers){
      config.headers.Authorization =`Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error)
);

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// OLAH ERROR GLOBAL
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export { api };