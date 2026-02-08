import React from 'react';
import { Motorista, TipoVeiculoLabels } from '@/types';
import { formatPhone } from '@/utils/helpers';

interface MotoristaDetailsProps {
  motorista: Motorista;
}

/**
 * Componente que exibe detalhes completos de um motorista
 * Usado dentro do Modal
 */
export function MotoristaDetails({ motorista }: MotoristaDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
          Informações Pessoais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Nome Completo</label>
            <p className="mt-1 text-gray-900 font-medium">{motorista.nome}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-gray-900">{motorista.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Telefone</label>
            <p className="mt-1 text-gray-900">{formatPhone(motorista.telefone)}</p>
          </div>
        </div>
      </div>

      {/* Localização */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
          Localização
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Cidade</label>
            <p className="mt-1 text-gray-900">{motorista.cidade}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Estado (UF)</label>
            <p className="mt-1 text-gray-900">{motorista.uf}</p>
          </div>
        </div>
      </div>

      {/* Tipos de Veículo */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
          Tipos de Veículo
        </h3>
        <div className="flex flex-wrap gap-2">
          {motorista.tiposVeiculo && motorista.tiposVeiculo.length > 0 ? (
            motorista.tiposVeiculo.map((tipo) => (
              <span
                key={tipo}
                className="px-3 py-2 bg-[#FDB913] text-gray-900 text-sm font-medium rounded-lg"
              >
                {TipoVeiculoLabels[tipo]}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Nenhum tipo de veículo cadastrado</span>
          )}
        </div>
      </div>

      {/* Status e Perfil */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
          Status e Perfil
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Perfil</label>
            <p className="mt-1">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                motorista.perfil === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                motorista.perfil === 'MOTORISTA' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {motorista.perfil}
              </span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                motorista.status === 'ATIVO' ? 'bg-green-100 text-green-800' :
                motorista.status === 'BLOQUEADO' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {motorista.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Datas */}
      {(motorista.createdAt || motorista.updatedAt) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            Informações do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motorista.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Cadastrado em</label>
                <p className="mt-1 text-gray-900">
                  {new Date(motorista.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
            {motorista.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Última atualização</label>
                <p className="mt-1 text-gray-900">
                  {new Date(motorista.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
