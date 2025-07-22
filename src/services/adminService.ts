import { supabase } from './supabase';
import { deleteVehicleImages } from './uploadService';
import { mapAppToDBTypes } from './carMappers';
import type { Car } from '../types/car/car';
import type { RDGroupRow, RDGroupLuxuryRow } from '../types/supabase/database';
import type { ExportOptions } from '../components/admin/ExportControls';

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

class AdminService {
  
  /**
   * Genera uno slug unico per il veicolo
   */
  private generateSlug(marca: string, modello: string, id: number): string {
    const cleanText = (text: string) => 
      text.toLowerCase()
          .replace(/[àáâãäå]/g, 'a')
          .replace(/[èéêë]/g, 'e')
          .replace(/[ìíîï]/g, 'i')
          .replace(/[òóôõö]/g, 'o')
          .replace(/[ùúûü]/g, 'u')
          .replace(/[ç]/g, 'c')
          .replace(/[ñ]/g, 'n')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .trim();

    const marcaClean = cleanText(marca);
    const modelloClean = cleanText(modello);
    
    return `${marcaClean}-${modelloClean}-${id}`;
  }

  /**
   * Converte i dati del veicolo nel formato del database
   */
  private mapVehicleToDBFormat(vehicleData: CreateVehicleData) {
    return {
      marca: vehicleData.make,
      modello: vehicleData.model,
      prezzo: vehicleData.price,
      chilometri: vehicleData.mileage,
      anno: `${vehicleData.year}`, // Format come stringa
      potenza_kw: vehicleData.power,
      potenza_cv: vehicleData.horsepower,
      alimentazione: mapAppToDBTypes.fuelType(vehicleData.fuelType as any),
      cambio: mapAppToDBTypes.transmission(vehicleData.transmission as any),
      luogo: vehicleData.location.address,
      colore: vehicleData.color,
      carrozzeria: mapAppToDBTypes.bodyType(vehicleData.bodyType as any),
      posti: vehicleData.seats,
      porte: vehicleData.doors,
      cilindrata: vehicleData.engineSize,
      peso: null,
      cilidri: null,
      marce: null,
      immagine_principale: vehicleData.images.find(img => img.isPrimary)?.url || vehicleData.images[0]?.url || null,
      immagini: {
        urls: vehicleData.images.map(img => img.url),
        metadata: vehicleData.images.map(img => ({
          id: img.id,
          altText: img.altText,
          isPrimary: img.isPrimary,
          order: img.order
        }))
      },
      descrizione: vehicleData.description,
      stato_annuncio: 'attivo',
      autoscout_id: null,
      ultima_sincronizzazione: null
    };
  }

  /**
   * Crea un nuovo veicolo
   */
  async createVehicle(vehicleData: CreateVehicleData): Promise<string> {
    try {
      const tableName = vehicleData.isLuxury ? 'rd_group_luxury' : 'rd_group';
      const dbData = this.mapVehicleToDBFormat(vehicleData);

      const { data, error } = await supabase
        .from(tableName)
        .insert([dbData])
        .select('id')
        .single();

      if (error) {
        throw new Error(`Errore database: ${error.message}`);
      }

      if (!data?.id) {
        throw new Error('ID veicolo non restituito dal database');
      }

      // Aggiorna con il slug generato
      const slug = this.generateSlug(vehicleData.make, vehicleData.model, data.id);
      await supabase
        .from(tableName)
        .update({ slug })
        .eq('id', data.id);

      return slug;

    } catch (error) {
      console.error('Errore creazione veicolo:', error);
      throw error;
    }
  }

  /**
   * Aggiorna un veicolo esistente
   */
  async updateVehicle(vehicleData: UpdateVehicleData): Promise<void> {
    try {
      // Prima determina in quale tabella si trova il veicolo
      const numericId = this.extractNumericId(vehicleData.id);
      if (!numericId) {
        throw new Error('ID veicolo non valido');
      }

      // Controlla luxury prima
      const { data: luxuryVehicle } = await supabase
        .from('rd_group_luxury')
        .select('id, isLuxury')
        .eq('id', numericId)
        .single();

      // Controlla standard se non trovato in luxury
      let currentTable: 'rd_group' | 'rd_group_luxury' = 'rd_group';
      if (luxuryVehicle) {
        currentTable = 'rd_group_luxury';
      } else {
        const { data: standardVehicle } = await supabase
          .from('rd_group')
          .select('id')
          .eq('id', numericId)
          .single();

        if (!standardVehicle) {
          throw new Error('Veicolo non trovato');
        }
      }

      const targetTable = vehicleData.isLuxury ? 'rd_group_luxury' : 'rd_group';
      const dbData = this.mapVehicleToDBFormat(vehicleData);

      // Se la categoria è cambiata, sposta tra tabelle
      if (currentTable !== targetTable) {
        // Elimina dalla tabella attuale
        await supabase
          .from(currentTable)
          .delete()
          .eq('id', numericId);

        // Inserisci nella nuova tabella con stesso ID
        await supabase
          .from(targetTable)
          .insert([{ ...dbData, id: numericId, slug: vehicleData.id }]);
      } else {
        // Semplice aggiornamento nella stessa tabella
        const { error } = await supabase
          .from(targetTable)
          .update({
            ...dbData,
            updated_at: new Date().toISOString()
          })
          .eq('id', numericId);

        if (error) {
          throw new Error(`Errore aggiornamento: ${error.message}`);
        }
      }

    } catch (error) {
      console.error('Errore aggiornamento veicolo:', error);
      throw error;
    }
  }

  /**
   * Elimina un veicolo
   */
  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const numericId = this.extractNumericId(vehicleId);
      if (!numericId) {
        throw new Error('ID veicolo non valido');
      }

      // Trova il veicolo e le sue immagini prima dell'eliminazione
      let vehicle: any = null;
      let tableName: 'rd_group' | 'rd_group_luxury' = 'rd_group';

      // Controlla luxury prima
      const { data: luxuryVehicle } = await supabase
        .from('rd_group_luxury')
        .select('*')
        .eq('id', numericId)
        .single();

      if (luxuryVehicle) {
        vehicle = luxuryVehicle;
        tableName = 'rd_group_luxury';
      } else {
        const { data: standardVehicle } = await supabase
          .from('rd_group')
          .select('*')
          .eq('id', numericId)
          .single();

        if (standardVehicle) {
          vehicle = standardVehicle;
          tableName = 'rd_group';
        }
      }

      if (!vehicle) {
        throw new Error('Veicolo non trovato');
      }

      // Raccogli URLs delle immagini per eliminarle
      const imageUrls: string[] = [];
      
      if (vehicle.immagine_principale) {
        imageUrls.push(vehicle.immagine_principale);
      }

      if (vehicle.immagini?.urls && Array.isArray(vehicle.immagini.urls)) {
        imageUrls.push(...vehicle.immagini.urls);
      }

      // Elimina il veicolo dal database
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', numericId);

      if (error) {
        throw new Error(`Errore eliminazione database: ${error.message}`);
      }

      // Elimina le immagini dallo storage (in background)
      if (imageUrls.length > 0) {
        deleteVehicleImages([...new Set(imageUrls)]) // Rimuovi duplicati
          .then(result => {
            console.log(`Eliminate ${result.deleted} immagini, fallite: ${result.failed}`);
          })
          .catch(error => {
            console.error('Errore eliminazione immagini:', error);
          });
      }

    } catch (error) {
      console.error('Errore eliminazione veicolo:', error);
      throw error;
    }
  }

  /**
   * Esporta il catalogo in formato Excel/CSV
   */
  async exportCatalog(options: ExportOptions): Promise<Blob> {
    try {
      // Costruisci la query base
      let luxuryQuery = supabase.from('rd_group_luxury').select('*');
      let standardQuery = supabase.from('rd_group').select('*');

      // Applica filtri temporali se necessario
      if (options.type === 'recent' && options.recentCount) {
        luxuryQuery = luxuryQuery
          .order('created_at', { ascending: false })
          .limit(Math.floor(options.recentCount / 2));
        
        standardQuery = standardQuery
          .order('created_at', { ascending: false })
          .limit(Math.ceil(options.recentCount / 2));
      }

      // Esegui le query
      const promises = [];
      if (options.includeLuxury) {
        promises.push(luxuryQuery);
      }
      if (options.includeStandard) {
        promises.push(standardQuery);
      }

      const results = await Promise.all(promises);
      
      // Combina i risultati
      let allData: any[] = [];
      results.forEach((result, index) => {
        if (result.data) {
          const isLuxury = index === 0 && options.includeLuxury;
          allData.push(...result.data.map(item => ({ ...item, categoria: isLuxury ? 'Luxury' : 'Standard' })));
        }
      });

      // Ordina per data se necessario
      allData.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      // Limita i risultati se richiesto
      if (options.type === 'recent' && options.recentCount) {
        allData = allData.slice(0, options.recentCount);
      }

      // Mappa i dati per l'export
      const exportData = allData.map(vehicle => {
        const mapped: any = {};
        
        options.columns.forEach(column => {
          switch (column) {
            case 'make':
              mapped['Marca'] = vehicle.marca;
              break;
            case 'model':
              mapped['Modello'] = vehicle.modello;
              break;
            case 'variant':
              mapped['Versione'] = vehicle.versione || '';
              break;
            case 'year':
              mapped['Anno'] = vehicle.anno;
              break;
            case 'price':
              mapped['Prezzo'] = vehicle.prezzo;
              break;
            case 'mileage':
              mapped['Chilometri'] = vehicle.chilometri;
              break;
            case 'fuelType':
              mapped['Alimentazione'] = vehicle.alimentazione;
              break;
            case 'transmission':
              mapped['Cambio'] = vehicle.cambio;
              break;
            case 'bodyType':
              mapped['Carrozzeria'] = vehicle.carrozzeria;
              break;
            case 'color':
              mapped['Colore'] = vehicle.colore;
              break;
            case 'doors':
              mapped['Porte'] = vehicle.porte;
              break;
            case 'seats':
              mapped['Posti'] = vehicle.posti;
              break;
            case 'power':
              mapped['Potenza (kW)'] = vehicle.potenza_kw;
              break;
            case 'horsepower':
              mapped['Cavalli (CV)'] = vehicle.potenza_cv;
              break;
            case 'engineSize':
              mapped['Cilindrata'] = vehicle.cilindrata;
              break;
            case 'previousOwners':
              mapped['Proprietari precedenti'] = 1; // Default
              break;
            case 'location':
              mapped['Sede'] = vehicle.luogo;
              break;
            case 'condition':
              mapped['Condizione'] = 'Usato';
              break;
            case 'isLuxury':
              mapped['Categoria'] = vehicle.categoria;
              break;
            case 'createdAt':
              mapped['Data inserimento'] = vehicle.created_at ? 
                new Date(vehicle.created_at).toLocaleDateString('it-IT') : '';
              break;
          }
        });

        return mapped;
      });

      // Genera il file
      if (options.format === 'csv') {
        return this.generateCSV(exportData);
      } else {
        return this.generateExcel(exportData);
      }

    } catch (error) {
      console.error('Errore export catalogo:', error);
      throw error;
    }
  }

  /**
   * Genera un file CSV
   */
  private generateCSV(data: any[]): Blob {
    if (data.length === 0) {
      throw new Error('Nessun dato da esportare');
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]?.toString() || '';
          // Escape virgole e virgolette
          if (value.includes(',') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  /**
   * Genera un file Excel utilizzando una libreria client-side
   */
  private generateExcel(data: any[]): Blob {
    if (data.length === 0) {
      throw new Error('Nessun dato da esportare');
    }

    // Per ora generiamo un CSV che Excel può aprire
    // In futuro si potrebbe integrare una libreria come xlsx
    const csvBlob = this.generateCSV(data);
    
    // Restituiamo il CSV con mimetype Excel
    return new Blob([csvBlob], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  /**
   * Estrai ID numerico da slug
   */
  private extractNumericId(slug: string): number | null {
    if (/^\d+$/.test(slug)) {
      return parseInt(slug);
    }

    const slugMatch = slug.match(/-(\d+)$/);
    if (slugMatch) {
      return parseInt(slugMatch[1]);
    }

    return null;
  }

  /**
   * Ottieni statistiche generali
   */
  async getAdminStats(): Promise<{
    totalVehicles: number;
    luxuryVehicles: number;
    standardVehicles: number;
    recentlyAdded: number;
  }> {
    try {
      const [luxuryResult, standardResult, recentResult] = await Promise.all([
        supabase.from('rd_group_luxury').select('id', { count: 'exact', head: true }),
        supabase.from('rd_group').select('id', { count: 'exact', head: true }),
        supabase
          .from('rd_group')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalVehicles: (luxuryResult.count || 0) + (standardResult.count || 0),
        luxuryVehicles: luxuryResult.count || 0,
        standardVehicles: standardResult.count || 0,
        recentlyAdded: recentResult.count || 0
      };
    } catch (error) {
      console.error('Errore statistiche admin:', error);
      return {
        totalVehicles: 0,
        luxuryVehicles: 0,
        standardVehicles: 0,
        recentlyAdded: 0
      };
    }
  }
}

// Istanza singleton
const adminService = new AdminService();

export default adminService;