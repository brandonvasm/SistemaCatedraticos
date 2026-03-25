import api from "../api/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {

    const response = await api.post<LoginResponse>("/users/login/", data);
    
    if (response.data.user_id) {
      localStorage.setItem("user_id", response.data.user_id.toString());
    }

    if (response.data.role) {
        localStorage.setItem("user_role", response.data.role.toLowerCase().trim());
      }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Error en el login");
  }
};

export const logoutUser = async () => {
  try {

    await api.post("/users/logout/");
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  } finally {
    localStorage.clear();
    window.location.href = "/";
  }
};