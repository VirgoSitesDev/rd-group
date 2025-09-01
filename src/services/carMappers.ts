import type { Car, CarFilters } from '../types/car/car';
import { FuelType, TransmissionType, BodyType, CarCondition, AvailabilityStatus } from '../types/car/car';
import type { RDGroupRow, RDGroupLuxuryRow, DBCarFilters, DBAlimentazione, DBCambio, DBCarrozzeria } from '../types/supabase/database';

export const mapDBToAppTypes = {
  fuelType: (dbFuel: string | null): FuelType => {
    const mapping: Record<string, FuelType> = {
      'Benzina': FuelType.PETROL,
      'Diesel': FuelType.DIESEL,
      'Elettrica/Diesel': FuelType.HYBRID,
      'Elettrico': FuelType.ELECTRIC,
      'GPL': FuelType.LPG,
      'Metano': FuelType.CNG,
    };
    return mapping[dbFuel || ''] || FuelType.PETROL;
  },

  transmission: (dbTransmission: string | null): TransmissionType => {
    const mapping: Record<string, TransmissionType> = {
      'Manuale': TransmissionType.MANUAL,
      'Automatico': TransmissionType.AUTOMATIC,
      'Semi-automatico': TransmissionType.SEMI_AUTOMATIC,
    };
    return mapping[dbTransmission || ''] || TransmissionType.MANUAL;
  },

  bodyType: (dbBodyType: string | null): BodyType => {
    const mapping: Record<string, BodyType> = {
      'Berlina': BodyType.SEDAN,
      'Station Wagon': BodyType.ESTATE,
      'SUV': BodyType.SUV,
      'Cabrio': BodyType.CONVERTIBLE,
      'Coupé': BodyType.COUPE,
      'Monovolume': BodyType.MINIVAN,
      'Fuoristrada': BodyType.SUV,
      'Pick-up': BodyType.PICKUP,
      'Furgoni': BodyType.VAN,
      'Citycar': BodyType.HATCHBACK,
    };
    return mapping[dbBodyType || ''] || BodyType.SEDAN;
  },
};

export const mapAppToDBTypes = {
  fuelType: (appFuel: FuelType): DBAlimentazione => {
    const mapping: Record<FuelType, DBAlimentazione> = {
      'petrol': 'Benzina',
      'diesel': 'Diesel',
      'electric': 'Elettrico',
      'hybrid': 'Elettrica/Diesel',
      'plugin_hybrid': 'Elettrica/Diesel',
      'lpg': 'GPL',
      'cng': 'Metano',
      'hydrogen': 'Elettrico',
      'other': 'Benzina',
    };
    return mapping[appFuel];
  },

  transmission: (appTransmission: TransmissionType): DBCambio => {
    const mapping: Record<TransmissionType, DBCambio> = {
      'manual': 'Manuale',
      'automatic': 'Automatico',
      'semi_automatic': 'Semi-automatico',
      'cvt': 'Automatico',
    };
    return mapping[appTransmission];
  },

  bodyType: (appBodyType: BodyType): DBCarrozzeria => {
    const mapping: Record<BodyType, DBCarrozzeria> = {
      'sedan': 'Berlina',
      'hatchback': 'Berlina',
      'estate': 'Station Wagon',
      'suv': 'SUV',
      'coupe': 'Coupé',
      'convertible': 'Cabrio',
      'pickup': 'Pick-up',
      'van': 'Furgoni',
      'minivan': 'Monovolume',
      'other': 'Berlina',
    };
    return mapping[appBodyType];
  },
};

function generateSlug(marca: string, modello: string, id: number): string {
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

function getDealerInfo(isLuxury: boolean) {
  if (isLuxury) {
    return {
      id: 'rd-luxury-1',
      name: 'RD Luxury',
      phone: '+39 0573 1941223',
      email: 'rdluxurysrl@gmail.com',
      location: {
        address: 'Via Luigi Galvani, 2',
        city: 'Pistoia',
        region: 'Toscana',
        postalCode: '51100',
        country: 'Italia',
      },
    };
  } else {
    return {
      id: 'rd-group-1',
      name: 'RD Group',
      phone: '+39 057 318 74672',
      email: 'rdautosrlpistoia@gmail.com',
      location: {
        address: 'Via Bottaia di San Sebastiano, 2L',
        city: 'Pistoia',
        region: 'Toscana',
        postalCode: '51100',
        country: 'Italia',
      },
    };
  }
}

function getMainLocation(isLuxury: boolean) {
  if (isLuxury) {
    return {
      address: 'Via Luigi Galvani, 2',
      city: 'Pistoia',
      region: 'Toscana',
      postalCode: '51100',
      country: 'Italia',
    };
  } else {
    return {
      address: 'Via Bottaia di San Sebastiano, 2L',
      city: 'Bottegone',
      region: 'Toscana',
      postalCode: '51100',
      country: 'Italia',
    };
  }
}

export function transformDBCarToAppCar(dbCar: RDGroupRow | RDGroupLuxuryRow, isLuxury: boolean): Car {
  const imagesJson = dbCar.immagini as any;
  const images = Array.isArray(imagesJson?.urls) 
    ? imagesJson.urls.map((url: string, index: number) => ({
        id: `${dbCar.id}-${index}`,
        url,
        altText: `${dbCar.marca} ${dbCar.modello}`,
        isPrimary: index === 0,
        order: index,
      }))
    : dbCar.immagine_principale 
      ? [{
          id: `${dbCar.id}-0`,
          url: dbCar.immagine_principale,
          altText: `${dbCar.marca} ${dbCar.modello}`,
          isPrimary: true,
          order: 0,
        }]
      : [];

  const yearMatch = dbCar.anno.match(/(\d{4})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
  const carId = dbCar.slug || generateSlug(dbCar.marca, dbCar.modello, dbCar.id);

  // 🔄 Usa i contatti appropriati in base al tipo di auto
  const dealerInfo = getDealerInfo(isLuxury);
  const mainLocation = getMainLocation(isLuxury);

  return {
    id: carId,
    autoscout24Id: dbCar.autoscout_id || undefined,
    make: dbCar.marca,
    model: dbCar.modello,
    variant: undefined,
    year,
    mileage: dbCar.chilometri,
    price: dbCar.prezzo,
    currency: 'EUR',
    fuelType: mapDBToAppTypes.fuelType(dbCar.alimentazione),
    transmission: mapDBToAppTypes.transmission(dbCar.cambio),
    bodyType: mapDBToAppTypes.bodyType(dbCar.carrozzeria),
    doors: dbCar.porte || 4,
    seats: dbCar.posti || 5,
    color: dbCar.colore || 'Non specificato',
    previousOwners: 1,
    engineSize: dbCar.cilindrata || 0,
    power: dbCar.potenza_kw || 0,
    horsepower: dbCar.potenza_cv || 0,
    images,
    description: dbCar.descrizione || `${dbCar.marca} ${dbCar.modello} in ottime condizioni.`,
    features: [],
    // 🔄 Usa l'indirizzo principale appropriato
    location: mainLocation,
    // 🔄 Usa le informazioni del dealer appropriate
    dealer: dealerInfo,
    isLuxury,
    condition: CarCondition.USED,
    availability: dbCar.stato_annuncio === 'attivo' ? AvailabilityStatus.AVAILABLE : AvailabilityStatus.PENDING,
    createdAt: new Date(dbCar.created_at || ''),
    updatedAt: new Date(dbCar.updated_at || ''),
    lastSyncAt: dbCar.ultima_sincronizzazione ? new Date(dbCar.ultima_sincronizzazione) : undefined,
  };
}

export function transformAppFiltersToDBFilters(filters: CarFilters): DBCarFilters {
  const dbFilters: DBCarFilters = {};

  if (filters.make?.length) {
    dbFilters.marca = filters.make[0];
  }

  if (filters.model?.length) {
    dbFilters.modello = filters.model[0];
  }

  if (filters.priceMin) {
    dbFilters.prezzo_min = filters.priceMin;
  }

  if (filters.priceMax) {
    dbFilters.prezzo_max = filters.priceMax;
  }

  if (filters.yearMin) {
    dbFilters.anno_min = `01/${filters.yearMin}`;
  }

  if (filters.yearMax) {
    dbFilters.anno_max = `12/${filters.yearMax}`;
  }

  if (filters.horsepowerMin) {
    dbFilters.potenza_cv_min = filters.horsepowerMin;
  }

  if (filters.powerMin) {
    dbFilters.potenza_kw_min = filters.powerMin;
  }

  if (filters.color?.length) {
    dbFilters.colore = filters.color[0];
  }

  if (filters.fuelType?.length) {
    dbFilters.alimentazione = mapAppToDBTypes.fuelType(filters.fuelType[0]);
  }

  if (filters.transmission?.length) {
    dbFilters.cambio = mapAppToDBTypes.transmission(filters.transmission[0]);
  }

  if (filters.bodyType?.length) {
    dbFilters.carrozzeria = mapAppToDBTypes.bodyType(filters.bodyType[0]);
  }

  if (filters.isLuxury !== undefined) {
    dbFilters.categoria = filters.isLuxury ? 'luxury' : 'standard';
  }

  return dbFilters;
}

export const getTranslatedValues = {
  fuelType: (fuelType: string): string => {
    const translations: Record<string, string> = {
      'petrol': 'Benzina',
      'diesel': 'Diesel',
      'electric': 'Elettrico',
      'hybrid': 'Ibrido',
      'plugin_hybrid': 'Ibrido Plugin',
      'lpg': 'GPL',
      'cng': 'Metano'
    };
    return translations[fuelType] || fuelType;
  },

  transmission: (transmission: string): string => {
    const translations: Record<string, string> = {
      'manual': 'Manuale',
      'automatic': 'Automatico',
      'semi_automatic': 'Semiautomatico',
      'cvt': 'CVT'
    };
    return translations[transmission] || transmission;
  },

  bodyType: (bodyType: string): string => {
    const translations: Record<string, string> = {
      'sedan': 'Berlina',
      'hatchback': 'Utilitaria',
      'estate': 'Station Wagon',
      'suv': 'SUV',
      'coupe': 'Coupé',
      'convertible': 'Cabrio',
      'pickup': 'Pick-up',
      'van': 'Furgone',
      'minivan': 'Monovolume'
    };
    return translations[bodyType] || bodyType;
  },
};

// 🆕 Export delle funzioni utility per ottenere le informazioni dei dealer
export { getDealerInfo, getMainLocation };