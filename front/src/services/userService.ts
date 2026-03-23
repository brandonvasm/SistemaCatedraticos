import type { UserData } from "../types/user";

// DATOS ESTÁTICOS DE PRUEBA
let mockUsers: UserData[] = [
  {
    id: 1,
    username: "admin_ingenieria",
    email: "admin@url.edu.gt",
    role: "admin",
    faculty: "Ingeniería",
    evaluation_count: 15,
    is_active: true
  },
  {
    id: 2,
    username: "coord_sistemas",
    email: "sistemas@url.edu.gt",
    role: "coordinator",
    faculty: "Ingeniería",
    evaluation_count: 8,
    is_active: true
  },
  {
    id: 3,
    username: "coord_industrial",
    email: "industrial@url.edu.gt",
    role: "coordinator",
    faculty: "Ingeniería",
    evaluation_count: 0,
    is_active: false
  }
];

export const userService = {
  getUsers: async (search?: string, role?: string): Promise<UserData[]> => {
    let filtered = [...mockUsers];
    if (search) {
      filtered = filtered.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));
    }
    if (role && role !== "Todos") {
      filtered = filtered.filter(u => u.role === role.toLowerCase());
    }
    return new Promise((resolve) => {
      setTimeout(() => resolve(filtered), 500); // Simula retraso de red
    });
  },

  createUser: async (userData: any): Promise<UserData> => {
    const newUser = { 
      ...userData, 
      id: Math.floor(Math.random() * 1000), 
      evaluation_count: 0,
      faculty: "Ingeniería",
      is_active: true 
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: number, userData: any): Promise<UserData> => {
    mockUsers = mockUsers.map(u => u.id === id ? { ...u, ...userData } : u);
    return mockUsers.find(u => u.id === id)!;
  },

  deleteUser: async (id: number): Promise<void> => {
    mockUsers = mockUsers.filter(u => u.id !== id);
  }
};