// src/services/emailService.ts
import sgMail from '@sendgrid/mail';

interface AcquisitionEmailData {
  customerData: {
    nome: string;
    cognome: string;
    mail: string;
    telefono: string;
  };
  vehicleData: {
    marca: string;
    anno: string;
    km: string;
    note: string;
  };
  images: string[];
  summaryUrl: string;
}

class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private toEmail: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL;
    this.toEmail = import.meta.env.VITE_TO_EMAIL;
    
    if (!this.apiKey) {
      throw new Error('SendGrid API key non configurata');
    }
    
    sgMail.setApiKey(this.apiKey);
  }

  private createAcquisitionEmailHtml(data: AcquisitionEmailData): string {
    const currentDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric', 
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: #cb1618; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .section { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .info-item { background: #f9f9f9; padding: 10px; border-radius: 5px; }
            .label { font-weight: bold; color: #cb1618; }
            .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .image-container { text-align: center; }
            .image-container img { max-width: 100%; height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; }
            .cta-button { background: #cb1618; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; margin-top: 30px; }
            .contact-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚗 NUOVA RICHIESTA ACQUISIZIONE AUTO</h1>
            <h2>RD Group - ${currentDate}</h2>
        </div>
        
        <div class="content">
            <div class="section">
                <h2>👤 Dati Cliente</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Nome Completo:</div>
                        ${data.customerData.nome} ${data.customerData.cognome}
                    </div>
                    <div class="info-item">
                        <div class="label">Email:</div>
                        <a href="mailto:${data.customerData.mail}">${data.customerData.mail}</a>
                    </div>
                    <div class="info-item">
                        <div class="label">Telefono:</div>
                        <a href="tel:${data.customerData.telefono}">${data.customerData.telefono}</a>
                    </div>
                    <div class="info-item">
                        <div class="label">Data Richiesta:</div>
                        ${currentDate}
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>🚙 Dati Veicolo</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="label">Marca:</div>
                        ${data.vehicleData.marca || 'Non specificata'}
                    </div>
                    <div class="info-item">
                        <div class="label">Anno:</div>
                        ${data.vehicleData.anno || 'Non specificato'}
                    </div>
                    <div class="info-item">
                        <div class="label">Chilometraggio:</div>
                        ${data.vehicleData.km ? parseInt(data.vehicleData.km).toLocaleString('it-IT') + ' km' : 'Non specificato'}
                    </div>
                </div>
                ${data.vehicleData.note ? `
                <div class="contact-info">
                    <div class="label">📝 Note Aggiuntive:</div>
                    <p>${data.vehicleData.note}</p>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2>📸 Foto del Veicolo (${data.images.length} immagini)</h2>
                <div class="images-grid">
                    ${data.images.map((url, index) => `
                    <div class="image-container">
                        <img src="${url}" alt="Foto ${index + 1} del veicolo" />
                        <p><strong>Foto ${index + 1}${index === 0 ? ' ⭐ (Principale)' : ''}</strong></p>
                    </div>
                    `).join('')}
                </div>
            </div>

            <div class="contact-info">
                <h2>📞 Azioni Immediate</h2>
                <p><strong>Contatta il cliente entro 24 ore:</strong></p>
                <a href="tel:${data.customerData.telefono}" class="cta-button">📱 Chiama ${data.customerData.telefono}</a>
                <a href="mailto:${data.customerData.mail}?subject=Valutazione auto ${data.vehicleData.marca || 'veicolo'}" class="cta-button">✉️ Invia Email</a>
                <a href="${data.summaryUrl}" class="cta-button">📋 Vedi Riepilogo Completo</a>
            </div>
        </div>

        <div class="footer">
            <h3>RD Group - Concessionario Auto Pistoia</h3>
            <p>📍 Via Bottaia, 2 - 51100 Pistoia (PT)</p>
            <p>📞 +39 057 318 7467 | ✉️ rdautosrlpistoia@gmail.com</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 0.9rem; color: #666;">
                Email generata automaticamente dal sistema di acquisizione<br>
                ID Sessione: ${Date.now()}
            </p>
        </div>
    </body>
    </html>
    `;
  }

  private createAcquisitionEmailText(data: AcquisitionEmailData): string {
    const currentDate = new Date().toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
🚗 NUOVA RICHIESTA ACQUISIZIONE AUTO - RD GROUP
══════════════════════════════════════════════

⏰ DATA: ${currentDate}
🆔 ID RICHIESTA: #${Date.now().toString().slice(-6)}

══════════════════════════════════════════════
👤 DATI CLIENTE
══════════════════════════════════════════════

Nome Completo: ${data.customerData.nome} ${data.customerData.cognome}
Email: ${data.customerData.mail}
Telefono: ${data.customerData.telefono}

══════════════════════════════════════════════
🚙 DATI VEICOLO
══════════════════════════════════════════════

Marca: ${data.vehicleData.marca || 'Non specificata'}
Anno: ${data.vehicleData.anno || 'Non specificato'}
Chilometraggio: ${data.vehicleData.km ? parseInt(data.vehicleData.km).toLocaleString('it-IT') + ' km' : 'Non specificati'}

${data.vehicleData.note ? `
══════════════════════════════════════════════
📝 NOTE AGGIUNTIVE
══════════════════════════════════════════════

${data.vehicleData.note}
` : ''}

══════════════════════════════════════════════
📸 FOTO DEL VEICOLO (${data.images.length} immagini)
══════════════════════════════════════════════

${data.images.map((url, index) => `
🖼️ FOTO ${index + 1}${index === 0 ? ' ⭐ (PRINCIPALE)' : ''}:
   ${url}
`).join('')}

══════════════════════════════════════════════
🌟 RIEPILOGO COMPLETO
══════════════════════════════════════════════

📋 LINK RIEPILOGO DETTAGLIATO:
${data.summaryUrl}

══════════════════════════════════════════════
📞 CONTATTO DIRETTO CLIENTE
══════════════════════════════════════════════

📧 EMAIL: ${data.customerData.mail}
📱 TELEFONO: ${data.customerData.telefono}

══════════════════════════════════════════════
🏢 RD GROUP - CONCESSIONARIO AUTO PISTOIA
══════════════════════════════════════════════

📍 Indirizzo: Via Bottaia, 2 - 51100 Pistoia (PT)
📞 Telefono: +39 057 318 7467
✉️ Email: rdautosrlpistoia@gmail.com

⚡ AZIONE RICHIESTA:
   - Contattare il cliente entro 24 ore
   - Fissare appuntamento per valutazione

──────────────────────────────────────────────
Email generata automaticamente dal sistema di acquisizione
ID Sessione: ${Date.now()}
──────────────────────────────────────────────`;
  }

  async sendAcquisitionEmail(data: AcquisitionEmailData): Promise<{ success: boolean; message: string }> {
    try {
      const msg = {
        to: this.toEmail,
        from: {
          email: this.fromEmail,
          name: 'RD Group - Sistema Acquisizioni'
        },
        subject: `🚗 Nuova Richiesta Acquisizione: ${data.vehicleData.marca} - ${data.customerData.nome} ${data.customerData.cognome}`,
        text: this.createAcquisitionEmailText(data),
        html: this.createAcquisitionEmailHtml(data),
        replyTo: data.customerData.mail,
        // Aggiungi metadati per tracking
        customArgs: {
          customer_email: data.customerData.mail,
          vehicle_make: data.vehicleData.marca || 'non_specificata',
          submission_type: 'acquisition_request'
        }
      };

      await sgMail.send(msg);

      return {
        success: true,
        message: 'Email inviata con successo'
      };

    } catch (error) {
      console.error('Errore SendGrid:', error);
      
      let errorMessage = 'Errore sconosciuto';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: `Errore invio email: ${errorMessage}`
      };
    }
  }

  async sendConfirmationEmail(customerEmail: string, customerName: string): Promise<void> {
    const msg = {
      to: customerEmail,
      from: {
        email: this.fromEmail,
        name: 'RD Group'
      },
      subject: 'Richiesta ricevuta - Ti contatteremo presto!',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000000; color: white; padding: 30px 20px; text-align: center;">
          <img src="https://your-domain.com/Logo_black.png" alt="RD Group Logo" style="max-width: 80px; height: auto; margin-bottom: 20px; filter: brightness(0) invert(1);">
          <h1 style="margin: 0; color: white;">Richiesta Ricevuta!</h1>
        </div>
        <div style="padding: 30px 20px;">
          <p>Ciao <strong>${customerName}</strong>,</p>
          <p>Abbiamo ricevuto la tua richiesta di valutazione auto.</p>
          <ul>
            <li>Un nostro esperto valuterà le informazioni e le foto che ci hai inviato</li>
            <li>Ti contatteremo nei prossimi giorni per fissare un appuntamento</li>
            <li>Valuteremo la tua auto di persona per offrirti il miglior prezzo</li>
          </ul>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #cb1618; margin-top: 0;">📞 Hai fretta?</h3>
            <p>Chiamaci direttamente:</p>
            <p><strong>RD Group: +39 057 318 7467</strong></p>
            <p><strong>RD Luxury: +39 057 318 74672</strong></p>
            <p>Siamo aperti Lunedì-Sabato: 08:30-13:00 / 14:30-19:30</p>
          </div>
          
          <p>Grazie per aver scelto RD Group!</p>
          <p><strong>Il Team RD Group</strong></p>
        </div>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; font-size: 0.9rem; color: #666;">
          RD Group - Via Bottaia, 2 - 51100 Pistoia (PT)<br>
          📞 RD Group: +39 057 318 7467 | RD Luxury: +39 057 318 74672<br>
          ✉️ rdautosrlpistoia@gmail.com | rdluxurysrl@gmail.com
        </div>
      </div>
      `,
      text: `
  Ciao ${customerName},

  Abbiamo ricevuto la tua richiesta di valutazione auto.

  🎯 Cosa succede ora:
  - Un nostro esperto valuterà le informazioni e le foto che ci hai inviato
  - Ti contatteremo entro 24 ore per fissare un appuntamento  
  - Valuteremo la tua auto di persona per offrirti il miglior prezzo

  📞 Hai fretta? Chiamaci direttamente:
  RD Group: +39 057 318 7467
  RD Luxury: +39 057 318 74672

  Siamo aperti Lunedì-Sabato: 08:30-13:00 / 14:30-19:30

  Grazie per aver scelto RD Group!
  Il Team RD Group

  RD Group - Via Bottaia, 2 - 51100 Pistoia (PT)
  📞 RD Group: +39 057 318 7467 | RD Luxury: +39 057 318 74672
  ✉️ rdautosrlpistoia@gmail.com | rdluxurysrl@gmail.com
      `
    };

    await sgMail.send(msg);
  }
}

export const emailService = new EmailService();
export default emailService;