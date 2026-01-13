import { UserPreferences } from "@/src/types/api/types";
import { api } from "./user.client";

export const getUserPreferences = async (
    userId: number
): Promise<UserPreferences> => {
    const res = await api.get(`/user/${userId}/preferences`);
    return res.data;
}

export const upsertPreferences = async (
    userId: number,
    categoryIds: number[]
): Promise<UserPreferences> => {
    const res = await api.post('/user/preferences/upsert', {
        userId,
        categoryIds,
    })
    return res.data;
}