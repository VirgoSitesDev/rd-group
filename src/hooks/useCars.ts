import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult, UseMutateFunction } from '@tanstack/react-query';
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';
import type { ExportOptions } from '../components/admin/ExportControls';
import databaseService from '../services/databaseService';
import adminService from '../services/adminService';

// Query keys per caching
export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: CarFilters) => [...carQueryKeys.lists(), filters] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...carQueryKeys.details(), id] as const,
  sync: () => [...carQueryKeys.all, 'sync'] as const,
  syncStatus: () => [...carQueryKeys.sync(), 'status'] as const,
};

// Query keys per admin
export const adminQueryKeys = {
  stats: () => [...carQueryKeys.all, 'admin', 'stats'] as const,
};

// Tipi per le operazioni admin
interface CreateVehicleData {
  make: string;
  model: string;
  variant?: string;
  year: number;
  mileage: number;
  price: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  doors: number;
  seats: number;
  color: string;
  previousOwners: number;
  engineSize: number;
  power: number;
  horsepower: number;
  description: string;
  features: string[];
  isLuxury: boolean;
  images: Array<{
    id: string;
    url: string;
    altText: string;
    isPrimary: boolean;
    order: number;
  }>;
  location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  dealer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
}

interface UpdateVehicleData extends CreateVehicleData {
  id: string;
}

// =====================================
// HOOKS PRINCIPALI (ESISTENTI)
// =====================================

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

// =====================================
// HOOKS ADMIN (NUOVI)
// =====================================

/**
 * Hook per creare un nuovo veicolo
 */
export function useCreateVehicle(): UseMutationResult<string, Error, CreateVehicleData, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData: CreateVehicleData) => adminService.createVehicle(vehicleData),
    onSuccess: (vehicleId) => {
      // Invalida tutte le query dei veicoli per refreshare i dati
      queryClient.invalidateQueries({ queryKey: carQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
      console.log('✅ Veicolo creato con successo:', vehicleId);
    },
    onError: (error) => {
      console.error('❌ Errore creazione veicolo:', error);
    },
  });
}

/**
 * Hook per aggiornare un veicolo esistente
 */
export function useUpdateVehicle(): UseMutationResult<void, Error, UpdateVehicleData, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleData: UpdateVehicleData) => adminService.updateVehicle(vehicleData),
    onSuccess: (_, variables) => {
      // Invalida le query specifiche del veicolo e tutte le liste
      queryClient.invalidateQueries({ queryKey: carQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: carQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
      console.log('✅ Veicolo aggiornato con successo:', variables.id);
    },
    onError: (error) => {
      console.error('❌ Errore aggiornamento veicolo:', error);
    },
  });
}

/**
 * Hook per eliminare un veicolo
 */
export function useDeleteVehicle(): UseMutationResult<void, Error, string, unknown> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => adminService.deleteVehicle(vehicleId),
    onSuccess: (_, vehicleId) => {
      // Rimuovi il veicolo specifico dalla cache
      queryClient.removeQueries({ queryKey: carQueryKeys.detail(vehicleId) });
      // Invalida tutte le liste per aggiornare i contatori
      queryClient.invalidateQueries({ queryKey: carQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
      console.log('✅ Veicolo eliminato con successo:', vehicleId);
    },
    onError: (error) => {
      console.error('❌ Errore eliminazione veicolo:', error);
    },
  });
}

/**
 * Hook per esportare il catalogo
 */
export function useExportCatalog(): UseMutationResult<Blob, Error, ExportOptions, unknown> {
  return useMutation({
    mutationFn: (options: ExportOptions) => adminService.exportCatalog(options),
    onSuccess: (blob, variables) => {
      // Crea un link di download automatico
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `catalogo_auto_${timestamp}.${variables.format}`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Pulisci l'URL creato
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Catalogo esportato con successo:', filename);
    },
    onError: (error) => {
      console.error('❌ Errore esportazione catalogo:', error);
    },
  });
}

/**
 * Hook per ottenere statistiche admin
 */
export function useAdminStats() {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: () => adminService.getAdminStats(),
    staleTime: 5 * 60 * 1000, // 5 minuti
    gcTime: 10 * 60 * 1000, // 10 minuti
  });
}

/**
 * Hook composito per tutte le operazioni admin
 */
export function useAdminOperations() {
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const exportCatalog = useExportCatalog();
  const stats = useAdminStats();

  return {
    // Operazioni CRUD
    createVehicle: createVehicle.mutate,
    updateVehicle: updateVehicle.mutate,
    deleteVehicle: deleteVehicle.mutate,
    exportCatalog: exportCatalog.mutate,
    
    // Stati di caricamento
    isCreating: createVehicle.isPending,
    isUpdating: updateVehicle.isPending,
    isDeleting: deleteVehicle.isPending,
    isExporting: exportCatalog.isPending,
    
    // Errori
    createError: createVehicle.error,
    updateError: updateVehicle.error,
    deleteError: deleteVehicle.error,
    exportError: exportCatalog.error,
    
    // Statistiche
    stats: stats.data,
    isStatsLoading: stats.isLoading,
    statsError: stats.error,
  };
}

// =====================================
// EXPORT DEFAULT
// =====================================

export default {
  // Hook principali (esistenti)
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
  
  // Hook admin (nuovi)
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useExportCatalog,
  useAdminStats,
  useAdminOperations,
};