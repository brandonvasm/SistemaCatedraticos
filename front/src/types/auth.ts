export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user_id: number;
  user: {
    id: number
    name: string
    email: string
  }
}