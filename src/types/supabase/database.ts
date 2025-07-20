// Tipi per le tabelle Supabase

export interface Database {
	public: {
	  Tables: {
		RD_GROUP: {
		  Row: RDGroupRow;
		  Insert: RDGroupInsert;
		  Update: RDGroupUpdate;
		};
		RD_GROUP_LUXURY: {
		  Row: RDGroupLuxuryRow;
		  Insert: RDGroupLuxuryInsert;
		  Update: RDGroupLuxuryUpdate;
		};
	  };
	  Views: {
		vista_tutte_auto: {
		  Row: VistaAutoCombinateRow;
		};
	  };
	  Functions: {
		cerca_auto: {
		  Args: {
			p_marca?: string;
			p_prezzo_min?: number;
			p_prezzo_max?: number;
			p_anno_min?: string;
			p_categoria?: string;
		  };
		  Returns: CercaAutoResult[];
		};
	  };
	};
  }
  
  // Tabella RD_GROUP (auto standard)
  export interface RDGroupRow {
	id: number;
	autoscout_id: string | null;
	marca: string;
	modello: string;
	prezzo: number;
	chilometri: number;
	anno: string;
	potenza_kw: number | null;
	potenza_cv: number | null;
	alimentazione: string | null;
	cambio: string | null;
	luogo: string | null;
	colore: string | null;
	carrozzeria: string | null;
	posti: number | null;
	porte: number | null;
	cilindrata: number | null;
	marce: number | null;
	peso: number | null;
	cilidri: number | null;
	immagine_principale: string | null;
	immagini: any | null; // JSONB
	ultima_sincronizzazione: string | null;
	stato_annuncio: string | null;
	slug: string | null;
	descrizione: string | null;
	created_at: string | null;
	updated_at: string | null;
  }
  
  export type RDGroupInsert = Omit<RDGroupRow, 'id' | 'created_at' | 'updated_at'>;
  export type RDGroupUpdate = Partial<RDGroupInsert>;
  
  // Tabella RD_GROUP_LUXURY (auto di lusso) - stessa struttura
  export interface RDGroupLuxuryRow extends RDGroupRow {}
  export type RDGroupLuxuryInsert = Omit<RDGroupLuxuryRow, 'id' | 'created_at' | 'updated_at'>;
  export type RDGroupLuxuryUpdate = Partial<RDGroupLuxuryInsert>;
  
  // Vista combinata
  export interface VistaAutoCombinateRow {
	id: number;
	categoria: 'luxury' | 'standard';
	marca: string;
	modello: string;
	prezzo: number;
	chilometri: number;
	anno: string;
	potenza_cv: number | null;
	alimentazione: string | null;
	cambio: string | null;
	colore: string | null;
	carrozzeria: string | null;
	slug: string | null;
	stato_annuncio: string | null;
	created_at: string | null;
  }
  
  // Risultato della funzione cerca_auto
  export interface CercaAutoResult {
	id: number;
	categoria: 'luxury' | 'standard';
	marca: string;
	modello: string;
	prezzo: number;
	chilometri: number;
	anno: string;
	potenza_cv: number | null;
	alimentazione: string | null;
	slug: string | null;
  }
  
  // Mapping dei valori del database verso i tipi dell'app
  export type DBAlimentazione = 'Benzina' | 'Diesel' | 'Elettrica/Diesel' | 'GPL' | 'Metano' | 'Elettrico';
  export type DBCambio = 'Manuale' | 'Automatico' | 'Semi-automatico';
  export type DBCarrozzeria = 'Berlina' | 'Station Wagon' | 'SUV' | 'Cabrio' | 'Coupé' | 'Monovolume' | 'Fuoristrada' | 'Pick-up' | 'Furgoni' | 'Citycar';
  
  // Interfaccia per i filtri di ricerca dal database
  export interface DBCarFilters {
	marca?: string;
	modello?: string;
	prezzo_min?: number;
	prezzo_max?: number;
	anno_min?: string;
	anno_max?: string;
	alimentazione?: DBAlimentazione;
	cambio?: DBCambio;
	carrozzeria?: DBCarrozzeria;
	categoria?: 'luxury' | 'standard';
	limite?: number;
	offset?: number;
  }