// src/utils/catalogUtils.ts

import type { CarFilters } from '../types/car/car';

/**
 * Utility per costruire link al catalogo con filtri
 */
export class CatalogLinkBuilder {
  private filters: CarFilters = {};

  /**
   * Filtra per marca
   */
  make(make: string | string[]): CatalogLinkBuilder {
    this.filters.make = Array.isArray(make) ? make : [make];
    return this;
  }

  /**
   * Filtra per modello
   */
  model(model: string | string[]): CatalogLinkBuilder {
    this.filters.model = Array.isArray(model) ? model : [model];
    return this;
  }

  /**
   * Filtra per prezzo
   */
  price(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.priceMin = min;
    if (max !== undefined) this.filters.priceMax = max;
    return this;
  }

  /**
   * Filtra per anno
   */
  year(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.yearMin = min;
    if (max !== undefined) this.filters.yearMax = max;
    return this;
  }

  /**
   * Filtra per chilometraggio
   */
  mileage(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.mileageMin = min;
    if (max !== undefined) this.filters.mileageMax = max;
    return this;
  }

  /**
   * Filtra per carburante
   */
  fuel(fuelType: string | string[]): CatalogLinkBuilder {
    this.filters.fuelType = Array.isArray(fuelType) ? fuelType as any : [fuelType as any];
    return this;
  }

  /**
   * Filtra per cambio
   */
  transmission(transmission: string | string[]): CatalogLinkBuilder {
    this.filters.transmission = Array.isArray(transmission) ? transmission as any : [transmission as any];
    return this;
  }

  /**
   * Filtra per tipo di carrozzeria
   */
  body(bodyType: string | string[]): CatalogLinkBuilder {
    this.filters.bodyType = Array.isArray(bodyType) ? bodyType as any : [bodyType as any];
    return this;
  }

  /**
   * Filtra per auto di lusso
   */
  luxury(isLuxury = true): CatalogLinkBuilder {
    this.filters.isLuxury = isLuxury;
    return this;
  }

  /**
   * Filtra per località
   */
  location(location: string): CatalogLinkBuilder {
    this.filters.location = location;
    return this;
  }

  /**
   * Costruisce l'URL finale
   */
  build(): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(this.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            searchParams.set(key, value.join(','));
          }
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `/auto?${queryString}` : '/auto';
  }

  /**
   * Reset dei filtri
   */
  reset(): CatalogLinkBuilder {
    this.filters = {};
    return this;
  }
}

/**
 * Funzioni helper veloci per link comuni
 */
export const catalogLinks = {
  /**
   * Link al catalogo completo
   */
  all: () => '/auto',

  /**
   * Link alle auto di lusso
   */
  luxury: () => '/auto?luxury=true',

  /**
   * Link agli ultimi arrivi
   */
  recent: () => '/auto?recent=true',

  /**
   * Link per una marca specifica
   */
  byMake: (make: string) => `/auto?make=${encodeURIComponent(make)}`,

  /**
   * Link per una marca luxury
   */
  luxuryByMake: (make: string) => `/auto?make=${encodeURIComponent(make)}&luxury=true`,

  /**
   * Link per prezzo massimo
   */
  underPrice: (maxPrice: number) => `/auto?priceMax=${maxPrice}`,

  /**
   * Link per auto elettriche
   */
  electric: () => '/auto?fuelType=electric',

  /**
   * Link per auto ibride
   */
  hybrid: () => '/auto?fuelType=hybrid',

  /**
   * Link per auto automatiche
   */
  automatic: () => '/auto?transmission=automatic',

  /**
   * Link per SUV
   */
  suv: () => '/auto?bodyType=suv',

  /**
   * Link per auto nuove (anno corrente)
   */
  new: () => `/auto?yearMin=${new Date().getFullYear()}`,

  /**
   * Link per auto con pochi km
   */
  lowMileage: (maxKm = 50000) => `/auto?mileageMax=${maxKm}`,

  /**
   * Builder personalizzato
   */
  custom: () => new CatalogLinkBuilder()
};

/**
 * Hook per generare link al catalogo
 */
export const useCatalogLinks = () => {
  return catalogLinks;
};

/**
 * Esempi di utilizzo:
 * 
 * // Link semplici
 * catalogLinks.luxury() // '/auto?luxury=true'
 * catalogLinks.byMake('BMW') // '/auto?make=BMW'
 * catalogLinks.underPrice(20000) // '/auto?priceMax=20000'
 * 
 * // Link complessi con builder
 * catalogLinks.custom()
 *   .make('BMW')
 *   .luxury()
 *   .price(undefined, 50000)
 *   .year(2018)
 *   .build() // '/auto?make=BMW&luxury=true&priceMax=50000&yearMin=2018'
 * 
 * // In un componente React
 * const { luxury, byMake, custom } = useCatalogLinks();
 * 
 * <Link to={luxury()}>Auto di Lusso</Link>
 * <Link to={byMake('Ferrari')}>Ferrari</Link>
 * <Link to={custom().make('Audi').fuel('electric').build()}>Audi Elettriche</Link>
 */

export default catalogLinks;