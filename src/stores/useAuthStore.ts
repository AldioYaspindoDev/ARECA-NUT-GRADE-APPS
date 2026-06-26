import { create } from "zustand";
import { api, setOnUnauthorized } from "@/services/api";
import { saveToken, getToken, removeToken } from "@/services/storage";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  photoProfile: string,
  role: string;
  created_at: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthLoading: boolean;  // untuk cek token saat startup (Navigator)
  isLoginLoading: boolean; // untuk proses login/register (tombol)
  login: (credentials: { email: string, password: string}) => Promise<void>;
  register: (userData: { username: string, email: string, password: string}) => Promise<void>;
  logout: () => Promise<void>;
  loadStorageToken: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthLoading: true,  // true saat startup, karena belum cek token
    isLoginLoading: false, // false saat startup, tombol siap dipakai

    // AMBIL TOKEN DAN PERIKSA
    loadStorageToken: async () => {
      const token = await getToken();
      set({ token, isAuthLoading: false });
    },

    // LOGIKA LOGIN
    login: async (credentials) => {
      set({ isLoginLoading: true });
      try {
        const response: any = await api.post('/api/user/login', credentials);
        console.log("Login Response Data:", response);
        
        // Cek beberapa kemungkinan letak token di response
        const token = response?.access_token || response?.data?.access_token || response?.token;
        
        if (!token || typeof token !== "string") {
          throw new Error(`Token tidak valid atau tidak ditemukan dalam response API: ${JSON.stringify(response)}`);
        }
        
        await saveToken(token);
        set({ token, isLoginLoading: false });
      } catch (error) {
        set({ isLoginLoading: false });
        throw error;
      }
    },

    // LOGIKA REGISTER
    register: async (userData) => {
      set({ isLoginLoading: true });
      try {
        const response: any = await api.post('/api/user/register', userData);
        console.log("Register Response Data:", response);
        
        const token = response?.access_token || response?.data?.access_token || response?.token;
        if (token && typeof token === "string") {
          await saveToken(token);
          set({ token, isLoginLoading: false });
        } else {
          set({ isLoginLoading: false });
        }
      } catch (error) {
        set({ isLoginLoading: false });
        throw error;
      }
    },
  
    // AMBIL PROFIL USER
    fetchProfile: async () => {
      try {
        const response: any = await api.get('/api/user/me');
        console.log("Fetch Profile Response:", response);
        // Response format is UserResponse
        set({ user: response });
      } catch (error) {
        console.error("Gagal fetch profile:", error);
        throw error;
      }
    },
  
    // LOGIKA HAPUS TOKEN(LOGOUT)
    logout: async () => {
      await removeToken();
      set({ token: null, user: null });
    }
  })
);

// Daftarkan callback unauthorized untuk menghindari circular dependency
setOnUnauthorized(() => {
  useAuthStore.getState().logout();
});