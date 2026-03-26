export type UserRole = "admin" | "coordinator";

export interface UserData {
  id: number;
  username: string; 
  email: string;
  role: UserRole;
  faculty: string;  
  evaluation_count: number;
  is_active: boolean;
  password?: string; 
}