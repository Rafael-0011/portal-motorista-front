import { TipoVeiculo, Role, Status } from './enums';

export interface Motorista {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  perfil: Role;
  status: Status;
  tiposVeiculo: TipoVeiculo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMotoristaDto {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  cidade: string;
  uf: string;
  role: Role;
  status: Status;
  tiposVeiculo: TipoVeiculo[];
}

export interface UpdateMotoristaDto {
  nome?: string;
  email?: string;
  senha?: string;
  telefone?: string;
  cidade?: string;
  uf?: string;
  role?: Role;
  status?: Status;
  tiposVeiculo?: TipoVeiculo[];
}

export interface MotoristaFilters {
  texto?: string;
  uf?: string;
  cidade?: string;
  tiposVeiculo?: TipoVeiculo[];
}

// Resposta paginada da API
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
