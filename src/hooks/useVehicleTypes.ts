import { useQuery } from '@tanstack/react-query';
import { vehicleTypeApi } from '@/src/lib/api';
import { VehicleType } from '@/types';

/**
 * Hook para buscar tipos de veículo disponíveis da API
 */
export function useVehicleTypes() {
  return useQuery<VehicleType[]>({
    queryKey: ['vehicle-types'],
    queryFn: vehicleTypeApi.getAll,
    staleTime: 1000 * 60 * 60, // Cache de 1 hora (dados raramente mudam)
  });
}
