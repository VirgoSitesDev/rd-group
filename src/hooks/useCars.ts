import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import multigestionaleService from '../services/multigestionaleService';

export const carQueryKeys = {
  all: ['cars'] as const,
  lists: () => [...carQueryKeys.all, 'list'] as const,
  list: (filters: CarFilters) => [...carQueryKeys.lists(), filters] as const,
  details: () => [...carQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...carQueryKeys.details(), slug] as const,
  makes: () => [...carQueryKeys.all, 'makes'] as const,
  models: (makeId: string) => [...carQueryKeys.all, 'models', makeId] as const,
};

export function useCars(
  filters: CarFilters, 
  page = 1, 
  limit = 21
): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: carQueryKeys.list({ ...filters, page, limit } as CarFilters & { page: number; limit: number }),
    queryFn: () => multigestionaleService.searchVehicles(filters, page, limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCar(slug: string): UseQueryResult<Car | null, Error> {
  return useQuery({
    queryKey: carQueryKeys.detail(slug),
    queryFn: () => multigestionaleService.getVehicle(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
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
    queryFn: () => multigestionaleService.searchVehicles({}, 1, limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedCars(limit = 6): UseQueryResult<CarSearchResult, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.lists(), 'featured', limit],
    queryFn: () => multigestionaleService.getFeaturedCars(limit),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCarMakes(): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: carQueryKeys.makes(),
    queryFn: () => multigestionaleService.getMakes(),
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}

export function useCarModels(makeId: string): UseQueryResult<string[], Error> {
  return useQuery({
    queryKey: carQueryKeys.models(makeId),
    queryFn: () => multigestionaleService.getModels(makeId),
    enabled: !!makeId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useTestConnection(): UseMutationResult<boolean, Error, void, unknown> {
  return useMutation({
    mutationFn: () => multigestionaleService.testConnection(),
  });
}

export function useCarStats(): UseQueryResult<{
  total: number;
  available: number;
  sold: number;
  averagePrice: number;
  averageYear: number;
  averageMileage: number;
  byMake: Record<string, number>;
  byFuelType: Record<string, number>;
  byPriceRange: Record<string, number>;
}, Error> {
  return useQuery({
    queryKey: [...carQueryKeys.all, 'stats'],
    queryFn: async () => {
      try {
        const result = await multigestionaleService.searchVehicles({}, 1, 1000);
        const cars = result.cars;

        if (cars.length === 0) {
          return {
            total: 0,
            available: 0,
            sold: 0,
            averagePrice: 0,
            averageYear: 0,
            averageMileage: 0,
            byMake: {},
            byFuelType: {},
            byPriceRange: {},
          };
        }

        const total = cars.length;
        const available = cars.filter(c => c.availability === 'available').length;
        const sold = cars.filter(c => c.availability === 'sold').length;
        
        const totalPrice = cars.reduce((sum, car) => sum + car.price, 0);
        const averagePrice = Math.round(totalPrice / cars.length);
        
        const totalYear = cars.reduce((sum, car) => sum + car.year, 0);
        const averageYear = Math.round(totalYear / cars.length);
        
        const totalMileage = cars.reduce((sum, car) => sum + car.mileage, 0);
        const averageMileage = Math.round(totalMileage / cars.length);

        const byMake = cars.reduce((acc, car) => {
          acc[car.make] = (acc[car.make] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byFuelType = cars.reduce((acc, car) => {
          acc[car.fuelType] = (acc[car.fuelType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const byPriceRange = cars.reduce((acc, car) => {
          const price = car.price;
          let range: string;
          
          if (price < 10000) range = '0-10000';
          else if (price < 20000) range = '10000-20000';
          else if (price < 30000) range = '20000-30000';
          else if (price < 50000) range = '30000-50000';
          else range = '50000+';
          
          acc[range] = (acc[range] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return {
          total,
          available,
          sold,
          averagePrice,
          averageYear,
          averageMileage,
          byMake,
          byFuelType,
          byPriceRange,
        };
      } catch (error) {
        console.error('Errore calcolo statistiche:', error);
        return {
          total: 0,
          available: 0,
          sold: 0,
          averagePrice: 0,
          averageYear: 0,
          averageMileage: 0,
          byMake: {},
          byFuelType: {},
          byPriceRange: {},
        };
      }
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  });
}

export function useCarManagement(): { 
  testConnection: () => void; 
  isTestingConnection: boolean; 
  connectionTestResult: any; 
  connectionTestError: any; 
  stats: any; 
  isStatsLoading: boolean; 
  statsError: any; 
} {
  const testConnection = useTestConnection();
  const stats = useCarStats();

  return {
    testConnection: testConnection.mutate,
    isTestingConnection: testConnection.isPending,
    connectionTestResult: testConnection.data,
    connectionTestError: testConnection.error,

    stats: stats.data,
    isStatsLoading: stats.isLoading,
    statsError: stats.error,
  };
}

export default {
  useCars,
  useCar,
  useLuxuryCars,
  useRecentCars,
  useFeaturedCars,
  useCarMakes,
  useCarModels,
  useTestConnection,
  useCarStats,
  useCarManagement,
};