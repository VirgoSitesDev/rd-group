/// <reference types="vite/client" />

// FIXED: Definizioni di tipo per Vite
interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string
	readonly VITE_AUTOSCOUT24_API_URL: string
	readonly VITE_AUTOSCOUT24_API_KEY: string
	readonly VITE_AUTOSCOUT24_DEALER_ID: string
	readonly VITE_APP_NAME: string
	readonly VITE_APP_DESCRIPTION: string
	readonly VITE_COMPANY_NAME: string
	readonly VITE_COMPANY_PHONE: string
	readonly VITE_COMPANY_EMAIL: string
	readonly VITE_COMPANY_ADDRESS: string
	readonly VITE_ENABLE_AUTOSCOUT24_SYNC: string
	readonly VITE_ENABLE_CONTACT_FORM: string
	readonly VITE_ENABLE_FINANCING_CALCULATOR: string
	readonly VITE_DEBUG_MODE: string
  }
  
  interface ImportMeta {
	readonly env: ImportMetaEnv
  }