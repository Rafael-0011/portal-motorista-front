'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/src/components/ProtectedRoute';
import { useAuth } from '@/src/context/AuthContext';
import { useMotoristas, useDeleteMotorista } from '@/src/hooks/useMotoristas';
import { useVehicleTypes } from '@/src/hooks/useVehicleTypes';
import { Button } from '@/src/components/Button';
import { Card } from '@/src/components/Card';
import { Input } from '@/src/components/Input';
import { Select } from '@/src/components/Select';
import { MultiSelect } from '@/src/components/MultiSelect';
import { Modal } from '@/src/components/Modal';
import { MotoristaDetails } from '@/src/components/MotoristaDetails';
import { Pagination } from '@/src/components/Pagination';
import { MotoristaFilters, TipoVeiculo, TipoVeiculoLabels, Motorista } from '@/types';
import { UFS, formatPhone } from '@/utils/helpers';

/**
 * Página de listagem de motoristas com filtros e paginação
 */
function MotoristasContent() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState<MotoristaFilters>({});
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedMotorista, setSelectedMotorista] = useState<Motorista | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sort, setSort] = useState('nome,asc');

  const { data, isLoading, error } = useMotoristas(filters, page, size, sort);
  const { data: vehicleTypes, isLoading: loadingVehicleTypes } = useVehicleTypes();
  const deleteMotorista = useDeleteMotorista();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newFilters: MotoristaFilters = {
      texto: formData.get('texto') as string || undefined,
      uf: formData.get('uf') as string || undefined,
      cidade: formData.get('cidade') as string || undefined,
    };

    // Usa os tipos de veículo do estado
    if (selectedVehicleTypes.length > 0) {
      newFilters.tiposVeiculo = selectedVehicleTypes as TipoVeiculo[];
    }

    setFilters(newFilters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSelectedVehicleTypes([]);
    setPage(0);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o motorista ${nome}?`)) {
      try {
        await deleteMotorista.mutateAsync(id);
        alert('Motorista excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir motorista');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#FDB913] shadow-sm border-b border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portal Motorista</h1>
            <p className="text-sm text-gray-800">Bem-vindo, {user?.nome || user?.email}</p>
          </div>
          <Button variant="secondary" onClick={logout} className="bg-gray-900 hover:bg-gray-700 text-white">
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Filtros de Busca</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-900">
              <Input
                name="texto"
                label="Buscar"
                placeholder="Nome, email ou telefone"
                defaultValue={filters.texto}
              />
              
              <Select
                name="uf"
                label="Estado (UF)"
                placeholder="Todos"
                defaultValue={filters.uf}
                options={UFS.map((uf) => ({ value: uf, label: uf }))}
              />
              
              <Input
                name="cidade"
                label="Cidade"
                placeholder="Ex: São Paulo"
                defaultValue={filters.cidade}
              />
            </div>

            {/* Ordenação e Tipos de Veículo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Ordenar por"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                options={[
                  { value: 'nome,asc', label: 'Nome Crescente' },
                  { value: 'nome,desc', label: 'Nome Decrescente' },
                ]}
              />

              {/* Tipos de Veículo - MultiSelect */}
              <MultiSelect
                label="Tipos de Veículo"
                placeholder="Selecione os tipos de veículo"
                options={vehicleTypes || []}
                value={selectedVehicleTypes}
                onChange={setSelectedVehicleTypes}
                disabled={loadingVehicleTypes}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className='bg-gray-900'>Aplicar Filtros</Button>
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </form>
        </Card>

        {/* Ações */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Motoristas Cadastrados
          </h2>
          {user?.role !== 'USUARIO' && (
            <Link href="/motoristas/novo">
              <Button className='bg-gray-900'>+ Novo Motorista</Button>
            </Link>
          )}
        </div>

        {/* Listagem */}
        <Card>
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando motoristas...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              Erro ao carregar motoristas. Tente novamente.
            </div>
          )}

          {data && data.content.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              Nenhum motorista encontrado.
            </div>
          )}

          {data && data.content.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Nome</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Telefone</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Cidade/UF</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Veículos</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.content.map((motorista) => (
                      <tr 
                        key={motorista.id} 
                        onClick={() => setSelectedMotorista(motorista)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {motorista.nome}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{motorista.email}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatPhone(motorista.telefone)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {motorista.cidade}/{motorista.uf}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            motorista.status === 'ATIVO' ? 'bg-green-100 text-green-800' :
                            motorista.status === 'BLOQUEADO' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {motorista.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {motorista.tiposVeiculo && motorista.tiposVeiculo.length > 0 ? (
                              motorista.tiposVeiculo.map((tipo) => (
                                <span
                                  key={tipo}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {TipoVeiculoLabels[tipo]}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs">Sem veículos</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMotorista(motorista)}
                          >
                            Ver Detalhes
                          </Button>
                          {user?.role !== 'USUARIO' && (
                            <>
                              <Link href={`/motoristas/${motorista.id}`}>
                                <Button size="sm" variant="outline">
                                  Editar
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(motorista.id, motorista.nome)}
                              >
                                Excluir
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
              />

              <div className="mt-4 text-sm text-gray-600 text-center">
                Mostrando {data.content.length} de {data.totalElements} motorista(s)
              </div>
            </>
          )}
        </Card>

        {/* Modal de Detalhes */}
        {selectedMotorista && (
          <Modal
            isOpen={!!selectedMotorista}
            onClose={() => setSelectedMotorista(null)}
            title={`Detalhes do Motorista: ${selectedMotorista.nome}`}
            size="lg"
          >
            <MotoristaDetails motorista={selectedMotorista} />
          </Modal>
        )}
      </main>
    </div>
  );
}

export default function MotoristasPage() {
  return (
    <ProtectedRoute>
      <MotoristasContent />
    </ProtectedRoute>
  );
}
