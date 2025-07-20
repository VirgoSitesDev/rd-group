import { supabase } from './supabase';
import { transformDBCarToAppCar, transformAppFiltersToDBFilters } from './carMappers';
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';
import type { RDGroupRow, RDGroupLuxuryRow } from '../types/supabase/database';

class DatabaseService {
  
  /**
   * Cerca veicoli nel database reale
   */
  async searchVehicles(filters: CarFilters, page = 1, limit = 20): Promise<CarSearchResult> {
    try {
      console.log('🔍 Ricerca auto con filtri:', filters);
      
      const offset = (page - 1) * limit;
      let cars: Car[] = [];
      let totalCount = 0;

      // Se isLuxury è specificato, cerca solo in una tabella
      if (filters.isLuxury === true) {
        // Solo auto di lusso
        const { data, count, error } = await this.queryLuxuryCars(filters, limit, offset);
        if (error) throw error;
        
        cars = (data || []).map(car => transformDBCarToAppCar(car, true));
        totalCount = count || 0;
        
      } else if (filters.isLuxury === false) {
        // Solo auto standard
        const { data, count, error } = await this.queryStandardCars(filters, limit, offset);
        if (error) throw error;
        
        cars = (data || []).map(car => transformDBCarToAppCar(car, false));
        totalCount = count || 0;
        
      } else {
        // Cerca in entrambe le tabelle e combina i risultati
        const [luxuryResult, standardResult] = await Promise.all([
          this.queryLuxuryCars(filters, Math.ceil(limit / 2), 0),
          this.queryStandardCars(filters, Math.ceil(limit / 2), 0)
        ]);

        if (luxuryResult.error) throw luxuryResult.error;
        if (standardResult.error) throw standardResult.error;

        const luxuryCars = (luxuryResult.data || []).map(car => transformDBCarToAppCar(car, true));
        const standardCars = (standardResult.data || []).map(car => transformDBCarToAppCar(car, false));

        // Combina e ordina per data di creazione (più recenti prima)
        cars = [...luxuryCars, ...standardCars]
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(offset, offset + limit);

        totalCount = (luxuryResult.count || 0) + (standardResult.count || 0);
      }

      console.log(`✅ Trovate ${cars.length} auto, totale: ${totalCount}`);

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
      console.error('❌ Errore nella ricerca auto:', error);
      throw error;
    }
  }

  /**
   * Query per auto di lusso
   */
  private async queryLuxuryCars(filters: CarFilters, limit: number, offset: number) {
    let query = supabase
      .from('RD_GROUP_LUXURY')
      .select('*', { count: 'exact' })
      .eq('stato_annuncio', 'attivo')
      .order('created_at', { ascending: false });

    // Applica filtri
    query = this.applyFiltersToQuery(query, filters);

    return await query.range(offset, offset + limit - 1);
  }

  /**
   * Query per auto standard
   */
  private async queryStandardCars(filters: CarFilters, limit: number, offset: number) {
    let query = supabase
      .from('RD_GROUP')
      .select('*', { count: 'exact' })
      .eq('stato_annuncio', 'attivo')
      .order('created_at', { ascending: false });

    // Applica filtri
    query = this.applyFiltersToQuery(query, filters);

    return await query.range(offset, offset + limit - 1);
  }

  /**
   * Applica i filtri alla query Supabase
   */
  private applyFiltersToQuery(query: any, filters: CarFilters) {
    // Filtro per marca
    if (filters.make?.length) {
      query = query.in('marca', filters.make);
    }

    // Filtro per modello
    if (filters.model?.length) {
      query = query.in('modello', filters.model);
    }

    // Filtro prezzo minimo
    if (filters.priceMin) {
      query = query.gte('prezzo', filters.priceMin);
    }

    // Filtro prezzo massimo
    if (filters.priceMax) {
      query = query.lte('prezzo', filters.priceMax);
    }

    // Filtro chilometraggio minimo
    if (filters.mileageMin) {
      query = query.gte('chilometri', filters.mileageMin);
    }

    // Filtro chilometraggio massimo
    if (filters.mileageMax) {
      query = query.lte('chilometri', filters.mileageMax);
    }

    // Filtro per alimentazione
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

    // Filtro per cambio
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

  /**
   * Ottiene una singola auto per ID
   */
  async getVehicle(id: string): Promise<Car | null> {
    try {
      console.log('🔍 Ricerca auto con ID:', id);

      // Cerca prima nelle auto di lusso
      const { data: luxuryData, error: luxuryError } = await supabase
        .from('RD_GROUP_LUXURY')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .eq('stato_annuncio', 'attivo')
        .single();

      if (luxuryData && !luxuryError) {
        console.log('✅ Auto di lusso trovata');
        return transformDBCarToAppCar(luxuryData, true);
      }

      // Se non trovata nelle luxury, cerca nelle standard
      const { data: standardData, error: standardError } = await supabase
        .from('RD_GROUP')
        .select('*')
        .or(`id.eq.${id},slug.eq.${id}`)
        .eq('stato_annuncio', 'attivo')
        .single();

      if (standardData && !standardError) {
        console.log('✅ Auto standard trovata');
        return transformDBCarToAppCar(standardData, false);
      }

      console.log('❌ Auto non trovata');
      return null;

    } catch (error) {
      console.error('❌ Errore nel recupero auto:', error);
      return null;
    }
  }

  /**
   * Ottiene auto in evidenza
   */
  async getFeaturedCars(limit = 6): Promise<CarSearchResult> {
    try {
      // Prendi metà dalle luxury e metà dalle standard
      const luxuryLimit = Math.ceil(limit / 2);
      const standardLimit = limit - luxuryLimit;

      const [luxuryResult, standardResult] = await Promise.all([
        supabase
          .from('RD_GROUP_LUXURY')
          .select('*')
          .eq('stato_annuncio', 'attivo')
          .order('created_at', { ascending: false })
          .limit(luxuryLimit),
        
        supabase
          .from('RD_GROUP')
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

  /**
   * Ottiene statistiche auto (mock per ora)
   */
  async getSyncStatus(): Promise<AutoScout24SyncStatus> {
    // Per ora restituiamo dati mock
    return {
      lastSync: new Date(Date.now() - 3600000), // 1 ora fa
      isRunning: false,
      totalItems: 150,
      syncedItems: 150,
      failedItems: 0,
      errors: [],
      nextSync: new Date(Date.now() + 3600000) // tra 1 ora
    };
  }

  /**
   * Sincronizzazione (mock per ora)
   */
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

  /**
   * Test di connessione
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('RD_GROUP').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }
}

export const databaseService = new DatabaseService();
export default databaseService;