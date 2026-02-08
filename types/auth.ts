// Interface do usuário autenticado
export interface User {
  id: string;
  email: string;
  nome?: string;
  role?: string; // USUARIO | MOTORISTA | ADMIN
}

// DTO para login
export interface LoginDto {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

// Context de autenticação
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
