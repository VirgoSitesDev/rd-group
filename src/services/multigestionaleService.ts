import type { Car, CarFilters, CarSearchResult } from '../types/car/car';

interface MultigestionaleCar {
  ad_number: string;
  title: string;
  make: string;
  model: string;
  version?: string;
  vehicle_class: string;
  vehicle_category: string;
  first_registration_date: string;
  mileage: string;
  power_kw: string;
  power_cv: string;
  transmission_type?: string;
  gearbox?: string;
  fuel_type: string;
  color: string;
  color_type: string;
  price: string;
  description?: string;
  images?: any;
  images_number: string;
  company_logo: string;
  last_update: string;
  cubic_capacity?: string;
  doors_count?: string;
  num_seats?: string;
}

interface MultigestionalConfig {
  customerCode: string;
  isLuxury: boolean;
  dealerName: string;
  dealerPhone: string;
  dealerEmail: string;
  location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
}

class MultigestionalService {
  private readonly baseURL: string;
  private readonly rdGroupConfig: MultigestionalConfig;
  private readonly rdLuxuryConfig: MultigestionalConfig;

  constructor() {
    this.rdGroupConfig = {
      customerCode: import.meta.env.VITE_MULTIGESTIONALE_CC_GROUP || '',
      isLuxury: false,
      dealerName: 'RD Group',
      dealerPhone: '+39 057 318 74672',
      dealerEmail: 'rdautosrlpistoia@gmail.com',
      location: {
        address: 'Via Bottaia di San Sebastiano, 2L',
        city: 'Bottegone',
        region: 'Toscana',
        postalCode: '51100',
        country: 'Italia',
      }
    };

    this.rdLuxuryConfig = {
      customerCode: import.meta.env.VITE_MULTIGESTIONALE_CC_LUXURY || '',
      isLuxury: true,
      dealerName: 'RD Luxury',
      dealerPhone: '+39 0573 1941223',
      dealerEmail: 'rdluxurysrl@gmail.com',
      location: {
        address: 'Via Luigi Galvani, 2',
        city: 'Pistoia',
        region: 'Toscana',
        postalCode: '51100',
        country: 'Italia',
      }
    };

    if (import.meta.env.DEV) {
      this.baseURL = '/api/multigestionale';
    } else {
      this.baseURL = '/.netlify/functions/multigestionale-proxy';
    }
    
    if (!this.rdGroupConfig.customerCode) {
      console.error('⚠️ Codice cliente RD Group non configurato (VITE_MULTIGESTIONALE_CC_GROUP)');
    }
    
    if (!this.rdLuxuryConfig.customerCode) {
      console.error('⚠️ Codice cliente RD Luxury non configurato (VITE_MULTIGESTIONALE_CC_LUXURY)');
    }
  }

  private parseXML(xmlText: string): any {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`Errore parsing XML: ${parserError.textContent}`);
      }

      return this.xmlToJson(xmlDoc.documentElement);
    } catch (error) {
      console.error('Errore parsing XML:', error);
      throw error;
    }
  }

  private xmlToJson(xml: Element): any {
    const obj: any = {};

    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes[i];
        const nodeName = item.nodeName;

        if (nodeName === '#text') {
          const text = item.nodeValue?.trim();
          if (text) {
            return text;
          }
        } else if (nodeName === '#cdata-section') {
          return item.nodeValue;
        } else {
          if (typeof obj[nodeName] === 'undefined') {
            obj[nodeName] = this.xmlToJson(item as Element);
          } else {
            if (!Array.isArray(obj[nodeName])) {
              obj[nodeName] = [obj[nodeName]];
            }
            obj[nodeName].push(this.xmlToJson(item as Element));
          }
        }
      }
    }

    return obj;
  }

  private async makeRequest(config: MultigestionalConfig, params: Record<string, any> = {}): Promise<any> {
    const finalParams = {
      cc: config.customerCode,
      engine: 'car',
      show: 'all',
      showads: '1',
      ...params
    };
  
    try {
      let url: string;
      
      if (import.meta.env.DEV) {
        const urlObj = new URL(this.baseURL, window.location.origin);
        Object.entries(finalParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            urlObj.searchParams.set(key, String(value));
          }
        });
        url = urlObj.toString();
      } else {
        const stringParams: Record<string, string> = {};
        Object.entries(finalParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            stringParams[key] = String(value);
          }
        });
        
        url = `${this.baseURL}?${new URLSearchParams(stringParams).toString()}`;
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml, text/xml, application/json, */*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const jsonData = await response.json();
        if (jsonData.error) {
          throw new Error(jsonData.error);
        }
        return jsonData.data;
      } else {
        const xmlText = await response.text();
        if (!xmlText || xmlText.trim() === '') {
          throw new Error('Risposta XML vuota');
        }
        return this.parseXML(xmlText);
      }
  
    } catch (error) {
      console.error(`Errore chiamata ${config.dealerName}:`, error);
      throw error;
    }
  }

  private convertToCarFormat(mgCar: MultigestionaleCar, config: MultigestionalConfig): Car | null {
    const blacklistedIds = ['14704913', '14666380'];
  
    if (blacklistedIds.includes(mgCar.ad_number)) {
      return null;
    }

    if (!mgCar.ad_number || !mgCar.title || !mgCar.make || !mgCar.model) {
      return null;
    }

    if (!mgCar.ad_number || !mgCar.title || !mgCar.make || !mgCar.model) {
      return null;
    }

    const rawPrice = mgCar.price?.replace(/[^\d.,]/g, '').replace(',', '.') || '0';
    const price = parseFloat(rawPrice);
    if (price <= 0) {
      return null;
    }

    const parseLastUpdate = (dateStr: string | any): Date => {
      if (!dateStr) return new Date('2020-01-01');
  
      if (typeof dateStr === 'object') {
        return new Date();
      }
  
      const dateString = String(dateStr);
      
      try {
        const [datePart, timePart] = dateString.split(' ');
        if (!datePart) return new Date();
        
        const [day, month, year] = datePart.split('-');
        const [hours = '00', minutes = '00'] = (timePart || '00:00').split(':');
        
        return new Date(
          parseInt(year), 
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
      } catch (error) {
        return new Date('2020-01-01');
      }
    };
  
    const lastUpdateDate = parseLastUpdate(mgCar.last_update);

    const daysSinceUpdate = (Date.now() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate > 60) {
    }
  
    const parseYear = (dateStr: string): number => {
      if (!dateStr) return new Date().getFullYear();
      const match = dateStr.match(/(\d{4})/);
      return match ? parseInt(match[1]) : new Date().getFullYear();
    };
  
    const mapFuelType = (fuel: string): string => {
      const fuelMap: Record<string, string> = {
        'Benzina': 'petrol',
        'Diesel': 'diesel',
        'GPL': 'lpg',
        'Metano': 'cng',
        'Elettrico': 'electric',
        'Ibrido': 'hybrid',
      };
      return fuelMap[fuel] || 'petrol';
    };
  
    const mapTransmission = (transmission: string | undefined): string => {
      if (!transmission || transmission.trim() === '') {
        console.warn(`⚠️ Transmission type missing for car ${mgCar.ad_number}`);
        return 'manual'; // fallback only when truly missing
      }
      const transmissionMap: Record<string, string> = {
        'Manuale': 'manual',
        'Automatico': 'automatic',
        'Semiautomatico': 'semi_automatic',
        'Semi-automatico': 'semi_automatic',
      };
      const mapped = transmissionMap[transmission];
      if (!mapped) {
        console.warn(`⚠️ Unknown transmission type: "${transmission}" for car ${mgCar.ad_number}`);
        return 'manual';
      }
      return mapped;
    };
  
    const mapBodyType = (category: string | undefined): string => {
      if (!category || category.trim() === '') {
        console.warn(`⚠️ Body type missing for car ${mgCar.ad_number}`);
        return 'sedan';
      }
      const bodyMap: Record<string, string> = {
        'Berlina': 'sedan',
        'Station Wagon': 'estate',
        'SUV': 'suv',
        'Coupé': 'coupe',
        'Coupe': 'coupe',
        'Coupè': 'coupe',
        'Cabriolet': 'convertible',
        'Cabrio': 'convertible',
        'Monovolume': 'minivan',
        'Minivan': 'minivan',
        'Hatchback': 'hatchback',
        'Fuoristrada': 'suv',
        'Fuoristrada SUV': 'suv',
        'Pick-up': 'pickup',
        'Pickup': 'pickup',
        'Van': 'van',
        'Furgone': 'van',
        'Sportiva': 'coupe',
        'Crossover': 'suv',
      };
      const mapped = bodyMap[category];
      if (!mapped) {
        console.warn(`⚠️ Unknown body type: "${category}" for car ${mgCar.ad_number} - defaulting to sedan`);
        return 'sedan';
      }
      return mapped;
    };
  
    const processImages = (images: any, companyLogo: string): any[] => {
      const imageList: string[] = [];
      
      if (images?.element) {
        if (Array.isArray(images.element)) {
          imageList.push(...images.element);
        } else {
          imageList.push(images.element);
        }
      }
      
      if (imageList.length === 0 && companyLogo) {
        imageList.push(companyLogo);
      }
  
      return imageList.map((url, index) => ({
        id: `img-${mgCar.ad_number}-${index}`,
        url: url,
        altText: `${mgCar.make} ${mgCar.model}`,
        isPrimary: index === 0,
        order: index,
      }));
    };
  
    const year = parseYear(mgCar.first_registration_date);
    const slug = `${mgCar.make.toLowerCase()}-${mgCar.model.toLowerCase()}-${mgCar.ad_number}`
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

    console.log(`✅ Auto ${mgCar.ad_number} processata correttamente (aggiornata ${Math.round(daysSinceUpdate)} giorni fa)`);
  
    return {
      id: mgCar.ad_number,
      slug: slug,
      autoscout24Id: mgCar.ad_number,
      make: mgCar.make,
      model: mgCar.model,
      variant: mgCar.version || '',
      year: year,
      mileage: parseInt(mgCar.mileage?.replace(/\D/g, '') || '0'),
      price: price,
      currency: 'EUR',
      fuelType: mapFuelType(mgCar.fuel_type) as any,
      transmission: mapTransmission(mgCar.transmission_type || mgCar.gearbox) as any,
      bodyType: mapBodyType(mgCar.vehicle_category) as any,
      doors: parseInt(mgCar.doors_count || '5'),
      seats: parseInt(mgCar.num_seats || '5'),
      color: mgCar.color || 'Non specificato',
      previousOwners: 1,
      engineSize: parseInt(mgCar.cubic_capacity || '0'),
      power: parseInt(mgCar.power_kw || '0'),
      horsepower: parseInt(mgCar.power_cv || '0'),
      images: processImages(mgCar.images, mgCar.company_logo),
      description: mgCar.description || mgCar.title || '',
      features: [],
      location: config.location,
      dealer: {
        id: config.isLuxury ? 'rd-luxury-1' : 'rd-group-1',
        name: config.dealerName,
        phone: config.dealerPhone,
        email: config.dealerEmail,
        location: config.location,
      },
      isLuxury: config.isLuxury,
      condition: 'used' as any,
      availability: 'available' as any,
      
      createdAt: new Date(),
      updatedAt: lastUpdateDate,
      lastSyncAt: lastUpdateDate,
    } as Car;
  }

  async searchVehicles(filters: CarFilters = {}, page = 1, limit = 21): Promise<CarSearchResult> {
    try {
      const allCars: Car[] = [];
      const configs = [];

      if (filters.isLuxury === true) {
        if (this.rdLuxuryConfig.customerCode) {
          configs.push(this.rdLuxuryConfig);
        }
      } else if (filters.isLuxury === false) {
        if (this.rdGroupConfig.customerCode) {
          configs.push(this.rdGroupConfig);
        }
      } else {
        if (this.rdGroupConfig.customerCode) {
          configs.push(this.rdGroupConfig);
        }
        if (this.rdLuxuryConfig.customerCode) {
          configs.push(this.rdLuxuryConfig);
        }
      }

      for (const config of configs) {
        try {
          const params: any = {
            sort: 'insertion_date',
            invert: 1,
          };
  
          const data = await this.makeRequest(config, params);
          
          let vehicles: MultigestionaleCar[] = [];
          
          if (data?.element) {
            const elements = Array.isArray(data.element) ? data.element : [data.element];

            // Debug: Log first vehicle to see what API returns
            if (elements.length > 0 && elements[0]) {
              console.log('🔍 DEBUG - First vehicle RAW data from API:', elements[0]);
              console.log('🔍 DEBUG - ALL fields from API element:',
                Object.keys(elements[0]).filter(key =>
                  key.toLowerCase().includes('trans') ||
                  key.toLowerCase().includes('gear') ||
                  key.toLowerCase().includes('traz') ||
                  key.toLowerCase().includes('cambio')
                )
              );
            }

            vehicles = elements.filter((el: any) => el && el.ad_number).map((el: any) => ({
              ad_number: el.ad_number || '',
              title: el.title || '',
              make: el.make || '',
              model: el.model || '',
              version: el.version || '',
              vehicle_class: el.vehicle_class || '',
              vehicle_category: el.vehicle_category || '',
              first_registration_date: el.first_registration_date || '',
              mileage: el.mileage || '0',
              power_kw: el.power_kw || '0',
              power_cv: el.power_cv || '0',
              transmission_type: el.transmission_type || '',
              gearbox: el.gearbox || '',
              fuel_type: el.fuel_type || '',
              color: el.color || '',
              color_type: el.color_type || '',
              price: el.price || '0',
              description: el.description || '',
              images: el.images || null,
              images_number: el.images_number || '0',
              company_logo: el.company_logo || '',
              last_update: el.last_update || '',
              cubic_capacity: el.cubic_capacity || '',
              doors_count: el.doors_count || '',
              num_seats: el.num_seats || '',
            }));
          }

          const convertedCars = vehicles
          .map(v => this.convertToCarFormat(v, config))
          .filter((car): car is Car => car !== null);
          allCars.push(...convertedCars);
  
        } catch (error) {
          console.error(`Errore recupero auto ${config.dealerName}:`, error);
        }
      }

      let filteredVehicles = allCars;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredVehicles = filteredVehicles.filter(v => 
          v.make.toLowerCase().includes(searchTerm) ||
          v.model.toLowerCase().includes(searchTerm) ||
          (v.description?.toLowerCase().includes(searchTerm))
        );
      }
  
      if (filters.make?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.make!.includes(v.make)
        );
      }
  
      if (filters.model?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.model!.includes(v.model)
        );
      }
  
      if (filters.fuelType?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.fuelType!.includes(v.fuelType as any)
        );
      }
  
      if (filters.transmission?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.transmission!.includes(v.transmission as any)
        );
      }
  
      if (filters.bodyType?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.bodyType!.includes(v.bodyType as any)
        );
      }
  
      if (filters.color?.length) {
        filteredVehicles = filteredVehicles.filter(v => 
          filters.color!.some(color => 
            v.color.toLowerCase().includes(color.toLowerCase())
          )
        );
      }
  
      if (filters.priceMin) {
        filteredVehicles = filteredVehicles.filter(v => v.price >= filters.priceMin!);
      }
  
      if (filters.priceMax) {
        filteredVehicles = filteredVehicles.filter(v => v.price <= filters.priceMax!);
      }
  
      if (filters.yearMin) {
        filteredVehicles = filteredVehicles.filter(v => v.year >= filters.yearMin!);
      }
  
      if (filters.yearMax) {
        filteredVehicles = filteredVehicles.filter(v => v.year <= filters.yearMax!);
      }
  
      if (filters.mileageMin) {
        filteredVehicles = filteredVehicles.filter(v => v.mileage >= filters.mileageMin!);
      }
  
      if (filters.mileageMax) {
        filteredVehicles = filteredVehicles.filter(v => v.mileage <= filters.mileageMax!);
      }
  
      if (filters.horsepowerMin) {
        filteredVehicles = filteredVehicles.filter(v => v.horsepower >= filters.horsepowerMin!);
      }
  
      if (filters.powerMin) {
        filteredVehicles = filteredVehicles.filter(v => v.power >= filters.powerMin!);
      }

      filteredVehicles.sort((a, b) => {
        if (!filters.isLuxury) {
          if (a.isLuxury !== b.isLuxury) {
            return a.isLuxury ? 1 : -1;
          }
        }

        const aUpdate = new Date(a.updatedAt || a.createdAt).getTime();
        const bUpdate = new Date(b.updatedAt || b.createdAt).getTime();
        
        if (aUpdate !== bUpdate) {
          return bUpdate - aUpdate;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  
      const totalCount = filteredVehicles.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
  
      return {
        cars: paginatedVehicles,
        total: totalCount,
        page,
        limit,
        hasMore: endIndex < totalCount,
        filters,
        sorting: {
          field: 'updatedAt',
          direction: 'desc',
        },
      };
  
    } catch (error) {
      console.error('Errore ricerca veicoli:', error);
      return {
        cars: [],
        total: 0,
        page,
        limit,
        hasMore: false,
        filters,
        sorting: {
          field: 'updatedAt',
          direction: 'desc',
        },
      };
    }
  }

  async getVehicle(slug: string): Promise<Car | null> {
    try {
      const result = await this.searchVehicles({}, 1, 1000);
      return result.cars.find(c => c.slug === slug || c.id === slug) || null;
    } catch (error) {
      console.error('Errore caricamento veicolo:', error);
      return null;
    }
  }

  async getFeaturedCars(limit = 6): Promise<CarSearchResult> {
    return this.searchVehicles({}, 1, limit);
  }

  async getMakes(): Promise<string[]> {
    try {
      const allMakes: Set<string> = new Set();
      const configs = [this.rdGroupConfig, this.rdLuxuryConfig].filter(c => c.customerCode);
      
      for (const config of configs) {
        try {
          const data = await this.makeRequest(config, {
            obj: 'makes',
            engine: 'car'
          });
          
          if (data?.element) {
            const elements = Array.isArray(data.element) ? data.element : [data.element];
            elements.forEach((el: any) => {
              if (el?.value) {
                allMakes.add(el.value);
              }
            });
          }
        } catch (error) {
          console.error(`Errore caricamento marche ${config.dealerName}:`, error);
        }
      }
      
      return Array.from(allMakes).sort();
    } catch (error) {
      console.error('Errore caricamento marche:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      let rdGroupOk = false;
      let rdLuxuryOk = false;

      if (this.rdGroupConfig.customerCode) {
        try {
          await this.makeRequest(this.rdGroupConfig, { limit: 1 });
          rdGroupOk = true;
        } catch (error) {
          console.error('RD Group: Connessione fallita', error);
        }
      }

      if (this.rdLuxuryConfig.customerCode) {
        try {
          await this.makeRequest(this.rdLuxuryConfig, { limit: 1 });
          rdLuxuryOk = true;
        } catch (error) {
          console.error('RD Luxury: Connessione fallita', error);
        }
      }

      return rdGroupOk || rdLuxuryOk;
    } catch (error) {
      console.error('Test connessione fallito:', error);
      return false;
    }
  }

  async getModels(makeId: string): Promise<string[]> {
    try {
      const result = await this.searchVehicles({ make: [makeId] }, 1, 1000);
      const models = [...new Set(result.cars.map(car => car.model))];
      return models.sort();
    } catch (error) {
      return [];
    }
  }
}

export default new MultigestionalService();