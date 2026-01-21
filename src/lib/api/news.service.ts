import { newsApi } from "./news.client";
import { MacroCategory, MacroCategoryDto, NewsCategory } from "@/src/types/api/types"

export const getAllMacrocategories = async (): Promise<MacroCategoryDto[]> => {
  const res = await newsApi.get('/news-management/macrocategories-with-categories/all');
  return res.data;
}

export const getAllCategories = async (): Promise<NewsCategory[]> => {
  const res = await newsApi.get('/news-management/categories/all');
  return res.data;
}

export const checkNewsServiceHealth = async () => {
    const res = await newsApi.get('/news-management/health');
    return res.data;
}

export const getNewsByUser = async (
    userId: number
): Promise<MacroCategory[]> => {
    const res = await newsApi.get(`/news-management/summaries/user/${userId}`);
    return res.data;
}

