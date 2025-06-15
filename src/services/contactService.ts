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
	private emailJSConfig: {
	  serviceId: string;
	  templateId: string;
	  publicKey: string;
	};
  
	constructor() {
	  this.apiUrl = import.meta.env.VITE_API_BASE_URL || '';
	  this.emailJSConfig = {
		serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
		templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
		publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
	  };
	}
  
	/**
	 * OPZIONE 2: Netlify Forms (Se usi Netlify)
	 */
	async sendViaNetlifyForms(formData: ContactFormData): Promise<EmailResponse> {
	  try {
		const response = await fetch('/', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		  body: new URLSearchParams({
			'form-name': 'contact',
			'nome': formData.firstName,
			'cognome': formData.lastName,
			'email': formData.email,
			'telefono': formData.phone,
			'messaggio': formData.message,
			'auto': formData.carModel || ''
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
	  const contactData: ContactFormData = {
		firstName: formData.nome,
		lastName: formData.cognome,
		email: formData.mail,
		phone: formData.telefono,
		message: `Richiesta acquisizione auto:
		
		Marca: ${formData.marca}
		Anno: ${formData.anno}
		Chilometraggio: ${formData.km}
		Note: ${formData.note}`,
		subject: 'Richiesta Acquisizione Auto',
		source: 'acquisition'
	  };
  
	  return this.sendContactForm(contactData);
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

  import { useMutation } from '@tanstack/react-query';
  
  export const useContactForm = () => {
	const contactService = new ContactService();
  
	return useMutation({
	  mutationFn: (formData: ContactFormData) => contactService.sendContactForm(formData),
	  onSuccess: (result) => {
		if (result.success) {
		  console.log('✅ Contatto inviato:', result.message);
		} else {
		  console.warn('⚠️ Contatto salvato localmente:', result.message);
		}
	  },
	  onError: (error) => {
		console.error('❌ Errore invio contatto:', error);
	  }
	});
  };
  
  export const useAcquisitionForm = () => {
	const contactService = new ContactService();
  
	return useMutation({
	  mutationFn: (formData: AcquisitionFormData) => contactService.sendAcquisitionForm(formData),
	  onSuccess: (result) => {
		if (result.success) {
		  console.log('✅ Richiesta acquisizione inviata:', result.message);
		} else {
		  console.warn('⚠️ Richiesta salvata localmente:', result.message);
		}
	  },
	  onError: (error) => {
		console.error('❌ Errore invio acquisizione:', error);
	  }
	});
  };
  
  export default ContactService;