// FIXED: Use type-only imports
import type { Car, CarFilters, CarSearchResult } from '../types/car/car';
import type { AutoScout24SyncStatus, SyncOperation } from '../types/api/api';

class AutoScout24Service {
  private apiUrl: string;
  private apiKey: string;
  private dealerId: string;

  constructor() {
    this.apiUrl = import.meta.env.VITE_AUTOSCOUT24_API_URL || 'https://api.autoscout24.com';
    this.apiKey = import.meta.env.VITE_AUTOSCOUT24_API_KEY || '';
    this.dealerId = import.meta.env.VITE_AUTOSCOUT24_DEALER_ID || '';
  }

  /**
   * Sincronizza i veicoli da Autoscout24
   */
  async syncVehicles(): Promise<SyncOperation> {
    try {
      // Simulazione della sincronizzazione per ora
      console.log('Avvio sincronizzazione veicoli...');
      
      // Simula un delay
      await new Promise(resolve => setTimeout(resolve, 2000));

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

    } catch (error) {
      console.error('Errore durante la sincronizzazione:', error);
      throw error;
    }
  }

  /**
   * Ottiene lo stato della sincronizzazione
   */
  async getSyncStatus(): Promise<AutoScout24SyncStatus> {
    // Dati mock per ora
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
   * Cerca veicoli (mock per ora)
   */
  async searchVehicles(filters: CarFilters, page = 1, limit = 20): Promise<CarSearchResult> {
    // Simula un delay per l'API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dati mock per ora - simuliamo alcuni risultati
    const mockCars: Car[] = Array.from({ length: Math.min(limit, 6) }, (_, index) => ({
      id: `car-${page}-${index + 1}`,
      autoscout24Id: `as24-${index + 1}`,
      make: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Ford'][index % 5],
      model: ['X3', 'A4', 'C-Class', 'Golf', 'Focus'][index % 5],
      variant: 'Comfort',
      year: 2018 + index,
      mileage: 45000 + (index * 5000),
      price: 15000 + (index * 3000),
      currency: 'EUR',
      fuelType: 'diesel' as any,
      transmission: 'automatic' as any,
      bodyType: 'suv' as any,
      doors: 5,
      seats: 5,
      color: ['Nero', 'Bianco', 'Grigio', 'Blu', 'Rosso'][index % 5],
      previousOwners: 1,
      engineSize: 2000,
      power: 140,
      horsepower: 190,
      images: [{
        id: `img-${index}`,
        url: '/placeholder-car.jpg',
        altText: 'Auto usata',
        isPrimary: true,
        order: 0
      }],
      description: `Auto in ottime condizioni, mantenuta perfettamente.`,
      features: ['Climatizzatore', 'ABS', 'Airbag', 'Radio CD'],
      location: {
        address: 'Via Roma 123',
        city: 'Pistoia',
        region: 'Toscana',
        postalCode: '51100',
        country: 'Italia'
      },
      dealer: {
        id: 'dealer-1',
        name: 'RD Group',
        phone: '+39 057 318 7467',
        email: 'info@rdgroup.it',
        location: {
          address: 'Via Bottaia, 2',
          city: 'Pistoia',
          region: 'Toscana',
          postalCode: '51100',
          country: 'Italia'
        }
      },
      isLuxury: index < 2,
      condition: 'used' as any,
      availability: 'available' as any,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return {
      cars: mockCars,
      total: 25, // Simula un totale maggiore
      page,
      limit,
      hasMore: page * limit < 25,
      filters,
      sorting: { field: 'createdAt', direction: 'desc' }
    };
  }

  /**
   * Ottiene un singolo veicolo
   */
  async getVehicle(id: string): Promise<Car | null> {
    // Simula un delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock - restituisce null per ora, ma potresti restituire un'auto mock
    console.log(`Richiesta dettaglio auto: ${id}`);
    return null;
  }

  /**
   * Testa la connessione all'API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simula un test di connessione
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch {
      return false;
    }
  }
}

export const autoscout24Service = new AutoScout24Service();
export default autoscout24Service;