// Tipi semplificati per l'API

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	error?: ApiError;
	message?: string;
	timestamp: string;
  }
  
  export interface ApiError {
	code: string;
	message: string;
	details?: any;
	field?: string;
  }
  
  export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
  }
  
  // Autoscout24 API Types
  export interface AutoScout24Config {
	apiUrl: string;
	apiKey: string;
	dealerId: string;
	syncInterval: number; // in minutes
	enableWebhooks: boolean;
	webhookUrl?: string;
  }
  
  export interface AutoScout24SyncStatus {
	lastSync: Date;
	isRunning: boolean;
	totalItems: number;
	syncedItems: number;
	failedItems: number;
	errors: AutoScout24SyncError[];
	nextSync?: Date;
  }
  
  export interface AutoScout24SyncError {
	itemId: string;
	error: string;
	timestamp: Date;
	retryCount: number;
  }
  
  export interface AutoScout24Vehicle {
	id: string;
	make: string;
	model: string;
	version?: string;
	firstRegistration: string;
	mileage: number;
	price: {
	  value: number;
	  currency: string;
	  type: 'gross' | 'net';
	};
	fuel: string;
	transmission: string;
	category: string;
	doors: number;
	seats: number;
	color: string;
	previousOwners: number;
	engine: {
	  size: number; // cc
	  power: number; // kW
	};
	images: AutoScout24Image[];
	description: string;
	equipment: string[];
	location: {
	  country: string;
	  zip: string;
	  city: string;
	};
	dealer: {
	  id: string;
	  name: string;
	  phone: string;
	  email: string;
	};
	createdAt: string;
	updatedAt: string;
	status: 'active' | 'inactive' | 'sold';
  }
  
  export interface AutoScout24Image {
	url: string;
	title?: string;
	order: number;
  }
  
  // Sync operations
  export interface SyncOperation {
	id: string;
	type: 'full' | 'incremental' | 'manual';
	status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
	startedAt: Date;
	completedAt?: Date;
	progress: {
	  total: number;
	  processed: number;
	  failed: number;
	};
	logs: SyncLog[];
  }
  
  export interface SyncLog {
	timestamp: Date;
	level: 'info' | 'warning' | 'error';
	message: string;
	details?: any;
  }