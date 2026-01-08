import { JwtResponse } from "@/src/types/api/types";
import { api } from "./client";

export const login = async (
    email: string,
    password: string
): Promise<JwtResponse> => {
    const res = await api.post('/user/login', { email, password });
    return res.data
}

export const register = async (
    email: string,
    password: string
): Promise<JwtResponse> => {
    const res = await api.post('/user/register', { email, password })
    return res.data
}