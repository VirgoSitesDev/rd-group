// Tipi semplificati per le auto

export interface Car {
	id: string;
	autoscout24Id?: string;
	make: string;
	model: string;
	variant?: string;
	year: number;
	mileage: number;
	price: number;
	currency: string;
	fuelType: FuelType;
	transmission: TransmissionType;
	bodyType: BodyType;
	doors: number;
	seats: number;
	color: string;
	previousOwners: number;
	engineSize: number; // in cc
	power: number; // in kW
	horsepower: number; // in HP
	images: CarImage[];
	description: string;
	features: string[];
	location: CarLocation;
	dealer: DealerInfo;
	isLuxury: boolean;
	condition: CarCondition;
	availability: AvailabilityStatus;
	createdAt: Date;
	updatedAt: Date;
	lastSyncAt?: Date;
	co2Emissions?: number;
	energyLabel?: EnergyLabel;
	inspection?: InspectionInfo;
	warranty?: WarrantyInfo;
	financing?: FinancingOptions;
  }
  
  export interface CarImage {
	id: string;
	url: string;
	altText: string;
	isPrimary: boolean;
	order: number;
  }
  
  export interface CarLocation {
	address: string;
	city: string;
	region: string;
	postalCode: string;
	country: string;
	coordinates?: {
	  latitude: number;
	  longitude: number;
	};
  }
  
  export interface DealerInfo {
	id: string;
	name: string;
	phone: string;
	email: string;
	website?: string;
	location: CarLocation;
  }
  
  export interface InspectionInfo {
	nextDue: Date;
	isValid: boolean;
	notes?: string;
  }
  
  export interface WarrantyInfo {
	hasWarranty: boolean;
	type?: 'manufacturer' | 'dealer' | 'extended';
	expiryDate?: Date;
	description?: string;
  }
  
  export interface FinancingOptions {
	available: boolean;
	monthlyPayment?: number;
	downPayment?: number;
	termMonths?: number;
	interestRate?: number;
  }
  
  // Enums
  export enum FuelType {
	PETROL = 'petrol',
	DIESEL = 'diesel',
	ELECTRIC = 'electric',
	HYBRID = 'hybrid',
	PLUGIN_HYBRID = 'plugin_hybrid',
	LPG = 'lpg',
	CNG = 'cng',
	HYDROGEN = 'hydrogen',
	OTHER = 'other'
  }
  
  export enum TransmissionType {
	MANUAL = 'manual',
	AUTOMATIC = 'automatic',
	SEMI_AUTOMATIC = 'semi_automatic',
	CVT = 'cvt'
  }
  
  export enum BodyType {
	SEDAN = 'sedan',
	HATCHBACK = 'hatchback',
	ESTATE = 'estate',
	SUV = 'suv',
	COUPE = 'coupe',
	CONVERTIBLE = 'convertible',
	PICKUP = 'pickup',
	VAN = 'van',
	MINIVAN = 'minivan',
	OTHER = 'other'
  }
  
  export enum CarCondition {
	NEW = 'new',
	USED = 'used',
	DEMO = 'demo',
	CLASSIC = 'classic',
	DAMAGED = 'damaged'
  }
  
  export enum AvailabilityStatus {
	AVAILABLE = 'available',
	RESERVED = 'reserved',
	SOLD = 'sold',
	PENDING = 'pending',
	HIDDEN = 'hidden'
  }
  
  export enum EnergyLabel {
	A_PLUS_PLUS_PLUS = 'A+++',
	A_PLUS_PLUS = 'A++',
	A_PLUS = 'A+',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
	E = 'E',
	F = 'F',
	G = 'G'
  }
  
  // Filtri per la ricerca
  export interface CarFilters {
	make?: string[];
	model?: string[];
	priceMin?: number;
	priceMax?: number;
	yearMin?: number;
	yearMax?: number;
	mileageMin?: number;
	mileageMax?: number;
	fuelType?: FuelType[];
	transmission?: TransmissionType[];
	bodyType?: BodyType[];
	isLuxury?: boolean;
	location?: string;
	radius?: number; // km di raggio dalla location
  }
  
  // Ordinamento
  export interface CarSorting {
	field: 'price' | 'year' | 'mileage' | 'createdAt' | 'make' | 'model';
	direction: 'asc' | 'desc';
  }
  
  // Risultati della ricerca
  export interface CarSearchResult {
	cars: Car[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
	filters: CarFilters;
	sorting: CarSorting;
  }
  
  // Statistiche
  export interface CarStats {
	total: number;
	available: number;
	sold: number;
	averagePrice: number;
	averageYear: number;
	averageMileage: number;
	byMake: Record<string, number>;
	byFuelType: Record<FuelType, number>;
	byPriceRange: Record<string, number>;
  }
  
  export default Car;