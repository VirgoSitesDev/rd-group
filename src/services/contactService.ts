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

	async sendContactForm(formData: ContactFormData): Promise<EmailResponse> {
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
		  return {
			success: true,
			message: 'Richiesta inviata con successo! Ti contatteremo presto.'
		  };
		} else {
		  throw new Error(`HTTP ${response.status}`);
		}
	  } catch (error) {
		console.error('Errore invio form contatti:', error);
		return {
		  success: false,
		  message: 'Errore nell\'invio del modulo. Ti preghiamo di riprovare o contattarci direttamente.'
		};
	  }
	}

	async sendAcquisitionForm(formData: AcquisitionFormData): Promise<EmailResponse> {
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
			message: 'Richiesta acquisizione inviata con successo! Ti contatteremo per la valutazione.'
		  };
		} else {
		  throw new Error(`HTTP ${response.status}`);
		}
	  } catch (error) {
		console.error('Errore invio form acquisizione:', error);
		return {
		  success: false,
		  message: 'Errore nell\'invio. Ti preghiamo di riprovare o contattarci direttamente.'
		};
	  }
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
		alert('❌ Errore di connessione. Riprova più tardi o chiamaci direttamente.');
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
		alert('❌ Errore di connessione. Riprova più tardi o chiamaci direttamente.');
	  }
	});
  };
  
  export default ContactService;