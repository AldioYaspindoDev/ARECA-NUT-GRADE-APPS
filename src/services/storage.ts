import * as SecureStorage from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

// LOGIKA MENYIMPAN TOKEN
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStorage.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error("Gagal Menyimpan Token", error)
  }
}

// LOGIKA MENGAMBIL TOKEN
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStorage.getItemAsync(TOKEN_KEY)
  } catch (error) {
    console.error("Token Tidak Ditemukan", error)
    return null;
  }
}

// LOGIKA MENGHAPUS TOKEN
export const removeToken = async (): Promise<void> => {
  try {
    await SecureStorage.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Gagal Menghapus Token");
  }
}