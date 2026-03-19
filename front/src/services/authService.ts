import axios from "axios"
import type { LoginRequest, LoginResponse } from "../types/auth"

const API_URL = "http://localhost:8000/api"

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
}