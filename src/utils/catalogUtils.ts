import type { CarFilters } from '../types/car/car';

export class CatalogLinkBuilder {
  private filters: CarFilters = {};

  make(make: string | string[]): CatalogLinkBuilder {
    this.filters.make = Array.isArray(make) ? make : [make];
    return this;
  }

  model(model: string | string[]): CatalogLinkBuilder {
    this.filters.model = Array.isArray(model) ? model : [model];
    return this;
  }

  price(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.priceMin = min;
    if (max !== undefined) this.filters.priceMax = max;
    return this;
  }

  year(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.yearMin = min;
    if (max !== undefined) this.filters.yearMax = max;
    return this;
  }

  mileage(min?: number, max?: number): CatalogLinkBuilder {
    if (min !== undefined) this.filters.mileageMin = min;
    if (max !== undefined) this.filters.mileageMax = max;
    return this;
  }

  fuel(fuelType: string | string[]): CatalogLinkBuilder {
    this.filters.fuelType = Array.isArray(fuelType) ? fuelType as any : [fuelType as any];
    return this;
  }

  transmission(transmission: string | string[]): CatalogLinkBuilder {
    this.filters.transmission = Array.isArray(transmission) ? transmission as any : [transmission as any];
    return this;
  }

  body(bodyType: string | string[]): CatalogLinkBuilder {
    this.filters.bodyType = Array.isArray(bodyType) ? bodyType as any : [bodyType as any];
    return this;
  }

  luxury(isLuxury = true): CatalogLinkBuilder {
    this.filters.isLuxury = isLuxury;
    return this;
  }

  location(location: string): CatalogLinkBuilder {
    this.filters.location = location;
    return this;
  }

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

  reset(): CatalogLinkBuilder {
    this.filters = {};
    return this;
  }
}

export const catalogLinks = {

  all: () => '/auto',
  luxury: () => '/auto?luxury=true',
  recent: () => '/auto?recent=true',
  byMake: (make: string) => `/auto?make=${encodeURIComponent(make)}`,
  luxuryByMake: (make: string) => `/auto?make=${encodeURIComponent(make)}&luxury=true`,
  underPrice: (maxPrice: number) => `/auto?priceMax=${maxPrice}`,
  electric: () => '/auto?fuelType=electric',
  hybrid: () => '/auto?fuelType=hybrid',
  automatic: () => '/auto?transmission=automatic',
  suv: () => '/auto?bodyType=suv',
  new: () => `/auto?yearMin=${new Date().getFullYear()}`,
  lowMileage: (maxKm = 50000) => `/auto?mileageMax=${maxKm}`,
  custom: () => new CatalogLinkBuilder()
};

export const useCatalogLinks = () => {
  return catalogLinks;
};

export default catalogLinks;