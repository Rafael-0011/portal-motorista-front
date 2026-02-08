// Enum de tipos de veículos - correspondente ao backend
export enum TipoVeiculo {
  VAN = 'VAN',
  TOCO = 'TOCO',
  BAU = 'BAU',
  SIDER = 'SIDER',
  TRUCK = 'TRUCK',
  BITRUCK = 'BITRUCK',
  CARRETA = 'CARRETA',
  CAMINHAO_3_4 = 'CAMINHAO_3_4',
}

// Tipo para resposta da API de tipos de veículo
export interface VehicleType {
  value: string;
  label: string;
}

// Labels para exibição no frontend
export const TipoVeiculoLabels: Record<TipoVeiculo, string> = {
  [TipoVeiculo.VAN]: 'Van',
  [TipoVeiculo.TOCO]: 'Toco',
  [TipoVeiculo.BAU]: 'Baú',
  [TipoVeiculo.SIDER]: 'Sider',
  [TipoVeiculo.TRUCK]: 'Truck',
  [TipoVeiculo.BITRUCK]: 'Bitruck',
  [TipoVeiculo.CARRETA]: 'Carreta',
  [TipoVeiculo.CAMINHAO_3_4]: 'Caminhão 3/4',
};

// Enum de roles de usuário - correspondente ao backend
export enum Role {
  USUARIO = 'USUARIO',
  MOTORISTA = 'MOTORISTA',
  ADMIN = 'ADMIN',
}

// Enum de status de usuário - correspondente ao backend
export enum Status {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  BLOQUEADO = 'BLOQUEADO',
}
