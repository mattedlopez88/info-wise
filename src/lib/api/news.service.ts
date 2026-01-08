import { api } from "./client"
import { MacroCategory, NewsCategory } from "@/src/types/api/types"

export const getAllCategories = async (): Promise<NewsCategory[]> => {
  const res = await api.get('/news-management/categories/all');
  return res.data;
}

export const checkNewsServiceHealth = async () => {
    const res = await api.get('/news-management/health');
    return res.data;
}

export const getNewsByUser = async (
    userId: number
): Promise<MacroCategory[]> => {
    const res = await api.get(`/news-management/summaries/user/${userId}`);
    return res.data;
}

