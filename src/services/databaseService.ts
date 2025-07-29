import { supabase } from './supabase';
import { transformDBCarToAppCar, transformAppFiltersToDBFilters } from './carMappers';
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';
import type { RDGroupRow, RDGroupLuxuryRow } from '../types/supabase/database';

class DatabaseService {
  private extractNumericId(slug: string): number | null {
    if (/^\d+$/.test(slug)) {
      return parseInt(slug);
    }

    const slugMatch = slug.match(/-(\d+)$/);
    if (slugMatch) {
      return parseInt(slugMatch[1]);
    }

    const carMatch = slug.match(/^car-(\d+)$/);
    if (carMatch) {
      return parseInt(carMatch[1]);
    }

    if (slug === 'featured-luxury' || slug.startsWith('featured-')) {
      return null;
    }
    
    return null;
  }

  async searchVehicles(filters: CarFilters, page = 1, limit = 20): Promise<CarSearchResult> {
    try {
      
      const offset = (page - 1) * limit;
      let cars: Car[] = [];
      let totalCount = 0;

      if (filters.isLuxury === true) {
        const { data, count, error } = await this.queryLuxuryCars(filters, limit, offset);
        if (error) throw error;
        
        cars = (data || []).map(car => transformDBCarToAppCar(car, true));
        totalCount = count || 0;
        
      } else if (filters.isLuxury === false) {
        const { data, count, error } = await this.queryStandardCars(filters, limit, offset);
        if (error) throw error;
        
        cars = (data || []).map(car => transformDBCarToAppCar(car, false));
        totalCount = count || 0;
        
      } else {
        const [luxuryResult, standardResult] = await Promise.all([
          this.getAllCarsFromTable('rd_group_luxury', filters),
          this.getAllCarsFromTable('rd_group', filters)
        ]);

        if (luxuryResult.error) throw luxuryResult.error;
        if (standardResult.error) throw standardResult.error;

        const luxuryCars = (luxuryResult.data || []).map(car => transformDBCarToAppCar(car, true));
        const standardCars = (standardResult.data || []).map(car => transformDBCarToAppCar(car, false));
        const allCars = [...luxuryCars, ...standardCars]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        totalCount = allCars.length;
        cars = allCars.slice(offset, offset + limit);
      }

      return {
        cars,
        total: totalCount,
        page,
        limit,
        hasMore: (page * limit) < totalCount,
        filters,
        sorting: { field: 'createdAt', direction: 'desc' }
      };

    } catch (error) {
      throw error;
    }
  }

  private async getAllCarsFromTable(tableName: 'rd_group' | 'rd_group_luxury', filters: CarFilters) {
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .eq('stato_annuncio', 'attivo')
      .order('created_at', { ascending: false });

    query = this.applyFiltersToQuery(query, filters);
    return await query;
  }

  private async queryLuxuryCars(filters: CarFilters, limit: number, offset: number) {
    let query = supabase
      .from('rd_group_luxury')
      .select('*', { count: 'exact' })
      .eq('stato_annuncio', 'attivo')
      .order('created_at', { ascending: false });

    query = this.applyFiltersToQuery(query, filters);

    return await query.range(offset, offset + limit - 1);
  }

  private async queryStandardCars(filters: CarFilters, limit: number, offset: number) {
    let query = supabase
      .from('rd_group')
      .select('*', { count: 'exact' })
      .eq('stato_annuncio', 'attivo')
      .order('created_at', { ascending: false });

    query = this.applyFiltersToQuery(query, filters);

    return await query.range(offset, offset + limit - 1);
  }

  private applyFiltersToQuery(query: any, filters: CarFilters) {
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();

      query = query.or(
        `marca.ilike.%${searchTerm}%,modello.ilike.%${searchTerm}%`
      );
    }

    if (filters.make?.length) {
      query = query.in('marca', filters.make);
    }

    if (filters.model?.length) {
      query = query.in('modello', filters.model);
    }

    if (filters.priceMin) {
      query = query.gte('prezzo', filters.priceMin);
    }

    if (filters.priceMax) {
      query = query.lte('prezzo', filters.priceMax);
    }

    if (filters.mileageMin) {
      query = query.gte('chilometri', filters.mileageMin);
    }

    if (filters.mileageMax) {
      query = query.lte('chilometri', filters.mileageMax);
    }

    if (filters.horsepowerMin) {
      query = query.gte('potenza_cv', filters.horsepowerMin);
    }

    if (filters.powerMin) {
      query = query.gte('potenza_kw', filters.powerMin);
    }

    if (filters.color?.length) {
      query = query.in('colore', filters.color);
    }

    if (filters.fuelType?.length) {
      const dbFuelTypes = filters.fuelType.map(fuel => {
        const mapping: Record<string, string> = {
          'petrol': 'Benzina',
          'diesel': 'Diesel',
          'electric': 'Elettrico',
          'hybrid': 'Elettrica/Diesel',
        };
        return mapping[fuel] || fuel;
      });
      query = query.in('alimentazione', dbFuelTypes);
    }

    if (filters.transmission?.length) {
      const dbTransmissions = filters.transmission.map(trans => {
        const mapping: Record<string, string> = {
          'manual': 'Manuale',
          'automatic': 'Automatico',
          'semi_automatic': 'Semi-automatico',
        };
        return mapping[trans] || trans;
      });
      query = query.in('cambio', dbTransmissions);
    }

    return query;
  }

  async getVehicle(slug: string): Promise<Car | null> {
    try {
      if (slug === 'featured-luxury') {
        const { data, error } = await supabase
          .from('rd_group_luxury')
          .select('*')
          .eq('stato_annuncio', 'attivo')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (data && data.length > 0 && !error) {
          return transformDBCarToAppCar(data[0], true);
        }
      }

      if (slug.startsWith('featured-')) {
        const { data, error } = await supabase
          .from('rd_group')
          .select('*')
          .eq('stato_annuncio', 'attivo')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (data && data.length > 0 && !error) {
          return transformDBCarToAppCar(data[0], false);
        }
      }

      const numericId = this.extractNumericId(slug);

      const [luxuryBySlug, standardBySlug] = await Promise.all([
        supabase
          .from('rd_group_luxury')
          .select('*')
          .eq('slug', slug)
          .eq('stato_annuncio', 'attivo')
          .maybeSingle(),
        
        supabase
          .from('rd_group')
          .select('*')
          .eq('slug', slug)
          .eq('stato_annuncio', 'attivo')
          .maybeSingle()
      ]);

      if (luxuryBySlug.data && !luxuryBySlug.error) {
        return transformDBCarToAppCar(luxuryBySlug.data, true);
      }

      if (standardBySlug.data && !standardBySlug.error) {
        return transformDBCarToAppCar(standardBySlug.data, false);
      }

      if (numericId !== null) {
        const [luxuryById, standardById] = await Promise.all([
          supabase
            .from('rd_group_luxury')
            .select('*')
            .eq('id', numericId)
            .eq('stato_annuncio', 'attivo')
            .maybeSingle(),
          
          supabase
            .from('rd_group')
            .select('*')
            .eq('id', numericId)
            .eq('stato_annuncio', 'attivo')
            .maybeSingle()
        ]);

        if (luxuryById.data && !luxuryById.error) {
          return transformDBCarToAppCar(luxuryById.data, true);
        }

        if (standardById.data && !standardById.error) {
          return transformDBCarToAppCar(standardById.data, false);
        }
      }

      return null;

    } catch (error) {
      console.error('Errore nel recupero veicolo:', error);
      return null;
    }
  }

  async getFeaturedCars(limit = 6): Promise<CarSearchResult> {
    try {
      const luxuryLimit = Math.ceil(limit / 2);
      const standardLimit = limit - luxuryLimit;

      const [luxuryResult, standardResult] = await Promise.all([
        supabase
          .from('rd_group_luxury')
          .select('*')
          .eq('stato_annuncio', 'attivo')
          .order('created_at', { ascending: false })
          .limit(luxuryLimit),
        
        supabase
          .from('rd_group')
          .select('*')
          .eq('stato_annuncio', 'attivo')
          .order('created_at', { ascending: false })
          .limit(standardLimit)
      ]);

      if (luxuryResult.error) throw luxuryResult.error;
      if (standardResult.error) throw standardResult.error;

      const luxuryCars = (luxuryResult.data || []).map(car => transformDBCarToAppCar(car, true));
      const standardCars = (standardResult.data || []).map(car => transformDBCarToAppCar(car, false));

      const cars = [...luxuryCars, ...standardCars]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return {
        cars,
        total: cars.length,
        page: 1,
        limit,
        hasMore: false,
        filters: {},
        sorting: { field: 'createdAt', direction: 'desc' }
      };

    } catch (error) {
      console.error('❌ Errore nel recupero auto in evidenza:', error);
      throw error;
    }
  }

  async getSyncStatus(): Promise<AutoScout24SyncStatus> {
    return {
      lastSync: new Date(Date.now() - 3600000),
      isRunning: false,
      totalItems: 150,
      syncedItems: 150,
      failedItems: 0,
      errors: [],
      nextSync: new Date(Date.now() + 3600000)
    };
  }

  async syncVehicles(): Promise<SyncOperation> {
    return {
      id: Date.now().toString(),
      type: 'manual',
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      progress: {
        total: 10,
        processed: 10,
        failed: 0
      },
      logs: [{
        timestamp: new Date(),
        level: 'info',
        message: 'Sincronizzazione completata con successo'
      }]
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('rd_group').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
export default databaseService;