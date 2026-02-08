import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motoristaApi } from '@/src/lib/api';
import {
  Motorista,
  MotoristaFilters,
  CreateMotoristaDto,
  UpdateMotoristaDto,
} from '@/types';

export function useMotoristas(filters?: MotoristaFilters, page: number = 0, size: number = 10, sort: string = 'nome,asc') {
  return useQuery({
    queryKey: ['motoristas', filters, page, size, sort],
    queryFn: () => motoristaApi.getAll(filters, page, size, sort),
  });
}

/**
 * Hook para buscar um motorista por ID
 */
export function useMotorista(id: string) {
  return useQuery({
    queryKey: ['motorista', id],
    queryFn: () => motoristaApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook para criar motorista
 */
export function useCreateMotorista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMotoristaDto) => motoristaApi.create(data),
    onSuccess: () => {
      // Invalida a lista de motoristas para refazer a busca
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
    },
  });
}

/**
 * Hook para atualizar motorista
 */
export function useUpdateMotorista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMotoristaDto }) =>
      motoristaApi.update(id, data),
    onSuccess: (data) => {
      // Invalida tanto a lista quanto o motorista específico
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
      queryClient.invalidateQueries({ queryKey: ['motorista', data.id] });
    },
  });
}

/**
 * Hook para deletar motorista
 */
export function useDeleteMotorista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => motoristaApi.delete(id),
    onSuccess: () => {
      // Invalida a lista de motoristas
      queryClient.invalidateQueries({ queryKey: ['motoristas'] });
    },
  });
}
