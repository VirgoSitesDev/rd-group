interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
	carModel?: string;
	subject?: string;
	source: 'contact' | 'acquisition' | 'inquiry';
  }
  
  interface AcquisitionFormData {
	nome: string;
	cognome: string;
	mail: string;
	telefono: string;
	marca: string;
	anno: string;
	km: string;
	note: string;
	images?: File[];
  }
  
  interface EmailResponse {
	success: boolean;
	message: string;
	id?: string;
  }
  
  class ContactService {
	private apiUrl: string;
  
	constructor() {
	  this.apiUrl = import.meta.env.VITE_API_BASE_URL || '';
	}

	async sendViaNetlifyForms(formData: ContactFormData): Promise<EmailResponse> {
	  try {
		const response = await fetch('/', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		  body: new URLSearchParams({
			'form-name': 'contatti',
			'nome': formData.firstName,
			'cognome': formData.lastName,
			'email': formData.email,
			'telefono': formData.phone,
			'messaggio': formData.message
		  }).toString()
		});
  
		if (response.ok) {
		  this.saveContactToLocalStorage(formData);
		  return {
			success: true,
			message: 'Richiesta inviata con successo!'
		  };
		} else {
		  throw new Error('Errore server');
		}
	  } catch (error) {
		console.error('Errore Netlify Forms:', error);
		this.saveContactToLocalStorage(formData);
		return {
		  success: false,
		  message: 'Errore nell\'invio. I tuoi dati sono stati salvati.'
		};
	  }
	}

	async sendViaNetlifyAcquisition(formData: AcquisitionFormData): Promise<EmailResponse> {
	  try {
		const response = await fetch('/', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		  body: new URLSearchParams({
			'form-name': 'acquisizione',
			'nome': formData.nome,
			'cognome': formData.cognome,
			'mail': formData.mail,
			'telefono': formData.telefono,
			'marca': formData.marca,
			'anno': formData.anno,
			'km': formData.km,
			'note': formData.note
		  }).toString()
		});
  
		if (response.ok) {
		  return {
			success: true,
			message: 'Richiesta acquisizione inviata con successo!'
		  };
		} else {
		  throw new Error('Errore server');
		}
	  } catch (error) {
		console.error('Errore Netlify Forms:', error);
		return {
		  success: false,
		  message: 'Errore nell\'invio. I tuoi dati sono stati salvati.'
		};
	  }
	}
  
	async sendContactForm(formData: ContactFormData): Promise<EmailResponse> {
	  if (this.isNetlifyEnvironment()) {
		return this.sendViaNetlifyForms(formData);
	  }
  
	  this.saveContactToLocalStorage(formData);
	  return {
		success: false,
		message: 'Servizio email temporaneamente non disponibile. I tuoi dati sono stati salvati e ti contatteremo al più presto.'
	  };
	}
  
	async sendAcquisitionForm(formData: AcquisitionFormData): Promise<EmailResponse> {
	  if (this.isNetlifyEnvironment()) {
		return this.sendViaNetlifyAcquisition(formData);
	  }
  
	  return {
		success: false,
		message: 'Servizio temporaneamente non disponibile. Ti contatteremo al più presto.'
	  };
	}
  
	private saveContactToLocalStorage(formData: ContactFormData): void {
	  try {
		const contacts = JSON.parse(localStorage.getItem('rdgroup_contacts') || '[]');
		contacts.push({
		  ...formData,
		  timestamp: new Date().toISOString(),
		  sent: false
		});
		localStorage.setItem('rdgroup_contacts', JSON.stringify(contacts));
	  } catch (error) {
		console.error('Errore salvataggio localStorage:', error);
	  }
	}
  
	getStoredContacts(): ContactFormData[] {
	  try {
		return JSON.parse(localStorage.getItem('rdgroup_contacts') || '[]');
	  } catch {
		return [];
	  }
	}
  
	private isNetlifyEnvironment(): boolean {
	  return window.location.hostname.includes('netlify') || 
			 import.meta.env.VITE_DEPLOY_TARGET === 'netlify';
	}
  
	validateEmail(email: string): boolean {
	  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	  return emailRegex.test(email);
	}
  
	validatePhone(phone: string): boolean {
	  const phoneRegex = /^(\+39)?[\s]?[0-9]{2,4}[\s]?[0-9]{6,7}$/;
	  return phoneRegex.test(phone.replace(/\s/g, ''));
	}
  }
  
  // Hook per React Query
  import { useMutation, UseMutationResult } from '@tanstack/react-query';
  
  export const useContactForm = (): UseMutationResult<EmailResponse, Error, ContactFormData, unknown> => {
	const contactService = new ContactService();
  
	return useMutation({
	  mutationFn: (formData: ContactFormData) => contactService.sendContactForm(formData),
	  onSuccess: (result) => {
		if (result.success) {
		  alert('✅ ' + result.message);
		} else {
		  alert('⚠️ ' + result.message);
		}
	  },
	  onError: (error) => {
		console.error('❌ Errore invio contatto:', error);
		alert('❌ Errore di connessione. Riprova più tardi.');
	  }
	});
  };
  
  export const useAcquisitionForm = (): UseMutationResult<EmailResponse, Error, AcquisitionFormData, unknown> => {
	const contactService = new ContactService();
  
	return useMutation({
	  mutationFn: (formData: AcquisitionFormData) => contactService.sendAcquisitionForm(formData),
	  onSuccess: (result) => {
		if (result.success) {
		  alert('✅ ' + result.message);
		} else {
		  alert('⚠️ ' + result.message);
		}
	  },
	  onError: (error) => {
		console.error('❌ Errore invio acquisizione:', error);
		alert('❌ Errore di connessione. Riprova più tardi.');
	  }
	});
  };
  
  export default ContactService;