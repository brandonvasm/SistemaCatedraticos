import api from "../api/axios";
import type { LoginRequest, LoginResponse } from "../types/auth";



export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  try {

    const response = await api.post<LoginResponse>("/api/users/login/", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("Error de conexión con el servidor");
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/api/users/logout/");
    localStorage.removeItem("user_id");
  } catch (error) {
    console.error("Error al cerrar sesión", error);
  }

  localStorage.removeItem("user_id");
    
  localStorage.clear();
};