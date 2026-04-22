import api from "../api/axios";
import type { LoginRequest, LoginResponse, User } from "../types/auth";

export const loginUser = async (data: LoginRequest): Promise<User> => {
  try {
    const response = await api.post<LoginResponse>("/users/login/", data);
    const resData = response.data;
    const rawUser = resData.user || resData;

    const userObject: User = {
      id: resData.user_id || rawUser.id,
      username: rawUser.username || "",
      email: rawUser.email || "",
      role: resData.role || rawUser.role || "ADMIN",
      faculty: rawUser.faculty || (resData as any).faculty || "",
      faculty_id : rawUser.faculty_id,
      evaluation_count: rawUser.evaluation_count || 0,
      pensum_loaded : rawUser.pensum_loaded
    };

    localStorage.setItem("user_id", String(userObject.id));
    localStorage.setItem("user_data", JSON.stringify(userObject));
    localStorage.setItem("user_role", userObject.role);

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
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_role");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    window.location.href = "/";
  }
};