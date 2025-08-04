import { supabase } from './supabase';
import { uploadVehicleImagesWithId, deleteVehicleImagesById } from './uploadService';
import { mapAppToDBTypes } from './carMappers';
import type { ExportOptions } from '../components/admin/ExportControls';
import * as XLSX from 'xlsx';

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
    file?: File; // Aggiungiamo il file originale per l'upload
  }>;
  imageFiles?: File[]; // File delle immagini da caricare
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

  private mapVehicleToDBFormat(vehicleData: CreateVehicleData, imageUrls?: string[]) {
    const immaginiData = imageUrls && imageUrls.length > 0 ? {
      urls: imageUrls,
      count: imageUrls.length,
      updatedAt: new Date().toISOString()
    } : null;

    return {
      marca: vehicleData.make,
      modello: vehicleData.model,
      prezzo: vehicleData.price,
      chilometri: vehicleData.mileage,
      anno: `${vehicleData.year}`,
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
      immagine_principale: imageUrls && imageUrls.length > 0 ? imageUrls[0] : null,
      immagini: immaginiData,
      descrizione: vehicleData.description,
      stato_annuncio: 'attivo',
      autoscout_id: null,
      ultima_sincronizzazione: null
    };
  }

  async createVehicle(vehicleData: CreateVehicleData): Promise<string> {
    console.log('🚗 Inizio creazione veicolo:', vehicleData.make, vehicleData.model);
    
    try {
      const tableName = vehicleData.isLuxury ? 'rd_group_luxury' : 'rd_group';
      
      // STEP 1: Crea il record del veicolo SENZA immagini
      console.log('📝 Step 1: Creazione record veicolo senza immagini');
      const dbDataWithoutImages = this.mapVehicleToDBFormat(vehicleData);

      const { data: vehicleRecord, error: createError } = await supabase
        .from(tableName)
        .insert([dbDataWithoutImages])
        .select('id')
        .single();

      if (createError) {
        console.error('❌ Errore creazione record veicolo:', createError);
        throw new Error(`Errore database: ${createError.message}`);
      }

      if (!vehicleRecord?.id) {
        throw new Error('ID veicolo non restituito dal database');
      }

      const vehicleId = vehicleRecord.id;
      console.log('✅ Veicolo creato con ID:', vehicleId);
      
      // STEP 2: Genera slug
      const slug = this.generateSlug(vehicleData.make, vehicleData.model, vehicleId);
      console.log('🏷️ Slug generato:', slug);

      // STEP 3: Carica le immagini se presenti
      let imageUrls: string[] = [];
      if (vehicleData.imageFiles && vehicleData.imageFiles.length > 0) {
        console.log(`📸 Step 3: Upload di ${vehicleData.imageFiles.length} immagini`);
        
        try {
          imageUrls = await uploadVehicleImagesWithId(
            vehicleId, 
            vehicleData.imageFiles,
            (completed, total) => {
              console.log(`📤 Upload progresso: ${completed}/${total}`);
              // TODO: Supportare callback di progresso dal form
            }
          );
          console.log('✅ Upload immagini completato:', imageUrls);
        } catch (uploadError) {
          console.error('❌ Errore upload immagini:', uploadError);
          
          // Elimina il record del veicolo se l'upload fallisce
          await supabase.from(tableName).delete().eq('id', vehicleId);
          throw new Error(`Errore upload immagini: ${uploadError instanceof Error ? uploadError.message : uploadError}`);
        }
      }

      // STEP 4: Aggiorna il record con slug e immagini
      console.log('📝 Step 4: Aggiornamento record con slug e immagini');
      const updateData: any = { slug };

      if (imageUrls.length > 0) {
        updateData.immagine_principale = imageUrls[0];
        updateData.immagini = {
          urls: imageUrls,
          count: imageUrls.length,
          updatedAt: new Date().toISOString()
        };
      }

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', vehicleId);

      if (updateError) {
        console.error('❌ Errore aggiornamento veicolo:', updateError);
        
        // Cleanup: elimina immagini e record
        if (imageUrls.length > 0) {
          await deleteVehicleImagesById(vehicleId);
        }
        await supabase.from(tableName).delete().eq('id', vehicleId);
        
        throw new Error(`Errore aggiornamento database: ${updateError.message}`);
      }

      console.log('🎉 Veicolo creato con successo!');
      console.log('- ID:', vehicleId);
      console.log('- Slug:', slug);
      console.log('- Immagini:', imageUrls.length);
      
      return slug;

    } catch (error) {
      console.error('❌ Errore generale creazione veicolo:', error);
      throw error;
    }
  }

  async updateVehicle(vehicleData: UpdateVehicleData): Promise<void> {
    try {
      const numericId = this.extractNumericId(vehicleData.id);
      if (!numericId) {
        throw new Error('ID veicolo non valido');
      }

      const { data: luxuryVehicle } = await supabase
        .from('rd_group_luxury')
        .select('id, isLuxury')
        .eq('id', numericId)
        .single();

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
      
      // Per l'update, per ora manteniamo le immagini esistenti
      // TODO: Implementare logic per gestire upload/update immagini nell'edit
      const dbData = this.mapVehicleToDBFormat(vehicleData);

      if (currentTable !== targetTable) {
        await supabase
          .from(currentTable)
          .delete()
          .eq('id', numericId);

        await supabase
          .from(targetTable)
          .insert([{ ...dbData, id: numericId, slug: vehicleData.id }]);
      } else {
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

  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const numericId = this.extractNumericId(vehicleId);
      if (!numericId) {
        throw new Error('ID veicolo non valido');
      }

      let vehicle: any = null;
      let tableName: 'rd_group' | 'rd_group_luxury' = 'rd_group';

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

      // Elimina il record dal database
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', numericId);

      if (error) {
        throw new Error(`Errore eliminazione database: ${error.message}`);
      }

      // Elimina tutte le immagini del veicolo
      console.log(`🗑️ Eliminazione immagini per veicolo ${numericId}`);
      deleteVehicleImagesById(numericId)
        .then(result => {
          console.log(`✅ Eliminate ${result.deleted} immagini, fallite: ${result.failed}`);
        })
        .catch(error => {
          console.error('⚠️ Errore eliminazione immagini:', error);
        });

    } catch (error) {
      console.error('Errore eliminazione veicolo:', error);
      throw error;
    }
  }

  async exportCatalog(options: ExportOptions): Promise<Blob> {
    try {
      let luxuryQuery = supabase.from('rd_group_luxury').select('*');
      let standardQuery = supabase.from('rd_group').select('*'); 

      if (options.type === 'recent' && options.recentCount) {
        luxuryQuery = luxuryQuery
          .order('created_at', { ascending: false })
          .limit(Math.floor(options.recentCount));
        
        standardQuery = standardQuery
          .order('created_at', { ascending: false })
          .limit(Math.ceil(options.recentCount));
      }

      const promises = [];
      if (options.includeLuxury) {
        promises.push(luxuryQuery);
      }
      if (options.includeStandard) {
        promises.push(standardQuery);
      }

      const results = await Promise.all(promises);

      let allData: any[] = [];
      results.forEach((result, index) => {
        if (result.data) {
          const isLuxury = index === 0 && options.includeLuxury;
          allData.push(...result.data.map(item => ({ ...item, categoria: isLuxury ? 'Luxury' : 'Standard' })));
        }
      });

      allData.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

      if (options.type === 'recent' && options.recentCount) {
        allData = allData.slice(0, options.recentCount);
      }

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
              mapped['Proprietari precedenti'] = 1;
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

  private generateCSV(data: any[]): Blob {
    if (data.length === 0) {
      throw new Error('Nessun dato da esportare');
    }
  
    const headers = Object.keys(data[0]);
    
    // Usa punto e virgola per l'Italia
    const csvContent = [
      headers.join(';'),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]?.toString() || '';
          // Se contiene punto e virgola o virgola, metti tra virgolette
          if (value.includes(';') || value.includes(',') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(';')
      )
    ].join('\n');
  
    // Aggiungi BOM per caratteri speciali italiani
    const BOM = '\uFEFF';
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  }
  
  private generateExcel(data: any[]): Blob {
    if (data.length === 0) {
      throw new Error('Nessun dato da esportare');
    }
  
    // Crea un workbook Excel reale
    const wb = XLSX.utils.book_new();
    
    // Converti i dati in worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Aggiungi il worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Catalogo Auto');
    
    // Genera il file Excel binario
    const excelBuffer = XLSX.write(wb, { 
      type: 'array', 
      bookType: 'xlsx',
      cellStyles: true 
    });
    
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

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

const adminService = new AdminService();

export default adminService;