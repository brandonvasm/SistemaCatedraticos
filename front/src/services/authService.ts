import api from "../api/axios";
import type { LoginRequest, LoginResponse, User } from "../types/auth";

export const loginUser = async (data: LoginRequest): Promise<User> => {
  try {
    const response = await api.post<LoginResponse>("/users/login/", data);
    const resData = response.data;

    const nameFromEmail = data.email.split('@')[0];

    const userObject: User = {
      id: resData.user_id,
      username: (resData.user?.username || (resData as any).username || nameFromEmail),
      email: (resData.user?.email || (resData as any).email || data.email),
      role: resData.role || "ADMIN",
      faculty: resData.user?.faculty || "",
      evaluation_count: resData.user?.evaluation_count || 0
    };

    localStorage.setItem("user_id", String(resData.user_id));
    localStorage.setItem("user_data", JSON.stringify(userObject));
    
    if (resData.role) {
      localStorage.setItem("user_role", resData.role.trim());
    }

    return userObject;
  } catch (error: any) {
    throw error.response?.data || new Error("ERROR EN EL LOGIN");
  }
};

export const updateProfile = async (userData: Partial<User> & { password?: string }): Promise<User> => {
  try {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      throw new Error("NO SE ENCONTRÓ EL ID DEL USUARIO");
    }

    const response = await api.patch<User>(`/users/management/${userId}/`, userData);
    
    const saved = localStorage.getItem('user_data');
    if (saved) {
      const current = JSON.parse(saved);
      const updatedUser = { ...current, ...response.data };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      
      if (response.data.role) {
        localStorage.setItem("user_role", response.data.role.trim());
      }
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error("ERROR AL ACTUALIZAR EL PERFIL");
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