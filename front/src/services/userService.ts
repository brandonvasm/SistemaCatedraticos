import api from "../api/axios";
import type { UserData } from "../types/user";

export const userService = {
  getUsers: async (search?: string, role?: string): Promise<UserData[]> => {
    const params: any = {};
    if (search) params.search = search;
    if (role && role !== "Todos") params.role = role;


    const response = await api.get<UserData[]>("/users/management/", { params });
    return response.data;
  },

  createUser: async (data: Partial<UserData>): Promise<UserData> => {
    const response = await api.post<UserData>("/users/management/", data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<UserData>): Promise<UserData> => {
    const response = await api.patch<UserData>(`/users/management/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/management/${id}/`);
  }
};