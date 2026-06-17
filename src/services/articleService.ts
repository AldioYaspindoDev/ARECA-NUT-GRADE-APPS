import { api } from "./api";

export interface Article {
  id: string;
  user_id: string;
  username: string;
  judul: string;
  isi: string;
  gambar?: string;
  tanggal: string;
  updated_at: string;
}

export const getArticles = async (skip = 0, limit = 10): Promise<Article[]> => {
  try {
    const response = await api.get("/api/article/", {
      params: { skip, limit },
    });
    return response as unknown as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

export const getArticleById = async (id: string): Promise<Article> => {
  try {
    const response = await api.get(`/api/article/${id}`);
    return response as unknown as Article;
  } catch (error) {
    console.error(`Error fetching article ${id}:`, error);
    throw error;
  }
};
