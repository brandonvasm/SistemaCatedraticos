export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  faculty: string;         
  faculty_id: number;    
  pensum_loaded: boolean;  
  evaluation_count: number; 
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
  user: User;
  role: string
}