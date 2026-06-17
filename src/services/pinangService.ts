import { api } from "./api";

export interface PinangScanResult {
  pinang_id: string;
  grade: string;
  jenis_pinang: string;
  tingkat_kekeringan: string;
  deskripsi?: string;
  persentase?: string;
  gambar?: string;
  harga_per_kg: string;
  keterangan_harga?: string;
  history_id: string;
  created_at: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  pinang_id: string;
  grade: string;
  harga_per_kg: string;
  keterangan_harga?: string;
  lokasi?: string;
  perangkat?: string;
  catatan?: string;
  created_at: string;
  pinang?: {
    id: string;
    gambar?: string;
    jenis_pinang: string;
    kualitas_pinang: string;
    tingkat_kekeringan: string;
    deskripsi?: string;
    persentase?: string;
  };
}

export const scanPinang = async (formData: FormData): Promise<PinangScanResult> => {
  try {
    const response = await api.post("/api/pinang", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response as unknown as PinangScanResult;
  } catch (error) {
    console.error("Error scanning pinang:", error);
    throw error;
  }
};

export const getScanHistory = async (skip = 0, limit = 10): Promise<HistoryItem[]> => {
  try {
    const response = await api.get("/api/history/", {
      params: { skip, limit },
    });
    return response as unknown as HistoryItem[];
  } catch (error) {
    console.error("Error fetching scan history:", error);
    throw error;
  }
};

export interface HargaItem {
  id: string;
  grade: string;
  harga: string;
  keterangan?: string;
}

export const getPrices = async (): Promise<HargaItem[]> => {
  try {
    const response = await api.get("/api/harga/");
    return response as unknown as HargaItem[];
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
};

export const getScanHistoryDetail = async (id: string): Promise<HistoryItem> => {
  try {
    const response = await api.get(`/api/history/${id}`);
    return response as unknown as HistoryItem;
  } catch (error) {
    console.error(`Error fetching history detail ${id}:`, error);
    throw error;
  }
};
