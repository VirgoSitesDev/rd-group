import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, UseMutateFunction } from '@tanstack/react-query';
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';
import databaseService from '../services/databaseService';

export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: CarFilters) => [...carQueryKeys.lists(), filters] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...carQueryKeys.details(), id] as const,
  sync: () => [...carQueryKeys.all, 'sync'] as const,
  syncStatus: () => [...carQueryKeys.sync(), 'status'] as const,
};

export function useCars(
  filters: CarFilters, 
  page = 1, 
  limit = 20
): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: carQueryKeys.list({ ...filters, page, limit } as CarFilters & { page: number; limit: number }),
    queryFn: () => databaseService.searchVehicles(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 10 * 60 * 1000, // 10 minuti
  });
}

export function useCar(slug: string): UseQueryResult<Car | null, Error> {
  return useQuery({
    queryKey: carQueryKeys.detail(slug),
    queryFn: () => databaseService.getVehicle(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSyncStatus(): UseQueryResult<AutoScout24SyncStatus, Error> {
  return useQuery({
    queryKey: carQueryKeys.syncStatus(),
    queryFn: () => databaseService.getSyncStatus(),
    refetchInterval: 30 * 1000, // Aggiorna ogni 30 secondi
    staleTime: 10 * 1000, // 10 secondi
  });
}

export function useSync(): UseMutationResult<SyncOperation, Error, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => databaseService.syncVehicles(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: carQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: carQueryKeys.syncStatus() });
    },
    onError: (error) => {
      console.error('Errore durante la sincronizzazione:', error);
    },
  });
}

export function useTestConnection(): UseMutationResult<boolean, Error, void, unknown> {
  return useMutation({
    mutationFn: () => databaseService.testConnection(),
  });
}

export function useCarManagement() {
  const syncStatus = useSyncStatus();
  const sync = useSync();
  const testConnection = useTestConnection();

  return {
    syncStatus: syncStatus.data,
    isSyncStatusLoading: syncStatus.isLoading,
    syncStatusError: syncStatus.error,
    
    startSync: sync.mutate,
    isSyncing: sync.isPending,
    syncError: sync.error,
    
    testConnection: testConnection.mutate,
    isTestingConnection: testConnection.isPending,
    connectionTestResult: testConnection.data,
    connectionTestError: testConnection.error,
  };
}

export function useLuxuryCars(
  filters: Omit<CarFilters, 'isLuxury'> = {}, 
  page = 1, 
  limit = 20
): UseQueryResult<CarSearchResult, Error> {
  return useCars({ ...filters, isLuxury: true }, page, limit);
}

export function useRecentCars(limit = 10): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'recent', limit],
    queryFn: () => databaseService.searchVehicles({}, 1, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedCars(limit = 6): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'featured', limit],
    queryFn: () => databaseService.getFeaturedCars(limit),
    staleTime: 30 * 60 * 1000, // 30 minuti
  });
}

export function useCarStats() {
  return useQuery({
    queryKey: [...carQueryKeys.all, 'stats'],
    queryFn: async () => {
      // Dati mock per ora
      return {
        total: 150,
        available: 145,
        sold: 5,
        averagePrice: 18500,
        averageYear: 2019,
        averageMileage: 45000,
        byMake: {
          'Volkswagen': 25,
          'BMW': 20,
          'Audi': 18,
          'Mercedes-Benz': 15,
          'Ford': 12,
        },
        byFuelType: {
          'diesel': 80,
          'petrol': 50,
          'hybrid': 15,
          'electric': 5,
        },
        byPriceRange: {
          '0-10000': 30,
          '10000-20000': 60,
          '20000-30000': 35,
          '30000+': 25,
        },
      };
    },
    staleTime: 60 * 60 * 1000,
  });
}

export default {
  useCars,
  useCar,
  useSyncStatus,
  useSync,
  useTestConnection,
  useCarManagement,
  useLuxuryCars,
  useRecentCars,
  useFeaturedCars,
  useCarStats,
};