import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, UseMutateFunction } from '@tanstack/react-query';
// FIXED: Use type-only imports per verbatimModuleSyntax
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';
import autoscout24Service from '../services/autoscout24';

// Query keys
export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: CarFilters) => [...carQueryKeys.lists(), filters] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...carQueryKeys.details(), id] as const,
  sync: () => [...carQueryKeys.all, 'sync'] as const,
  syncStatus: () => [...carQueryKeys.sync(), 'status'] as const,
};

/**
 * Hook per cercare auto con filtri
 */
export function useCars(
  filters: CarFilters, 
  page = 1, 
  limit = 20
): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: carQueryKeys.list({ ...filters, page, limit } as CarFilters & { page: number; limit: number }),
    queryFn: () => autoscout24Service.searchVehicles(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 10 * 60 * 1000, // 10 minuti
  });
}

/**
 * Hook per ottenere i dettagli di una singola auto
 */
export function useCar(id: string): UseQueryResult<Car | null, Error> {
  return useQuery({
    queryKey: carQueryKeys.detail(id),
    queryFn: () => autoscout24Service.getVehicle(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minuti
  });
}

/**
 * Hook per ottenere lo stato della sincronizzazione
 */
export function useSyncStatus(): UseQueryResult<AutoScout24SyncStatus, Error> {
  return useQuery({
    queryKey: carQueryKeys.syncStatus(),
    queryFn: () => autoscout24Service.getSyncStatus(),
    refetchInterval: 30 * 1000, // Aggiorna ogni 30 secondi
    staleTime: 10 * 1000, // 10 secondi
  });
}

/**
 * Hook per avviare la sincronizzazione manuale
 */
export function useSync(): UseMutationResult<SyncOperation, Error, void, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => autoscout24Service.syncVehicles(),
    onSuccess: () => {
      // Invalida tutte le query delle auto dopo la sincronizzazione
      queryClient.invalidateQueries({ queryKey: carQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: carQueryKeys.syncStatus() });
    },
    onError: (error) => {
      console.error('Errore durante la sincronizzazione:', error);
    },
  });
}

/**
 * Hook per testare la connessione all'API
 */
export function useTestConnection(): UseMutationResult<boolean, Error, void, unknown> {
  return useMutation({
    mutationFn: () => autoscout24Service.testConnection(),
  });
}

/**
 * Hook combinato per la gestione delle auto
 */
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

/**
 * Hook per auto di lusso
 */
export function useLuxuryCars(
  filters: Omit<CarFilters, 'isLuxury'> = {}, 
  page = 1, 
  limit = 20
): UseQueryResult<CarSearchResult, Error> {
  return useCars({ ...filters, isLuxury: true }, page, limit);
}

/**
 * Hook per auto recenti (aggiunte negli ultimi 7 giorni)
 */
export function useRecentCars(limit = 10): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'recent', limit],
    queryFn: () => autoscout24Service.searchVehicles({}, 1, limit),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook per auto in evidenza (più visualizzate o più economiche)
 */
export function useFeaturedCars(limit = 6): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'featured', limit],
    queryFn: () => autoscout24Service.searchVehicles({}, 1, limit),
    staleTime: 30 * 60 * 1000, // 30 minuti
  });
}

/**
 * Hook per statistiche rapide delle auto
 */
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
    staleTime: 60 * 60 * 1000, // 1 ora
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