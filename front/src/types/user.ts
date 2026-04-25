export type UserRole = "admin" | "coordinator";

export interface UserData {
  id: number;
  first_name: string
  username: string; 
  email: string;
  role: UserRole;
  faculty_name: string;  
  faculty_id: number;
  evaluation_count: number;
  is_active: boolean;
  password?: string; 
}