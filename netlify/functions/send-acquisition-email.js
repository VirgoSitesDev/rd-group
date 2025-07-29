// netlify/functions/send-acquisition-email.js
const sgMail = require('@sendgrid/mail');

const createEmailHtml = (data) => {
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .header { background: #cb1618; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; max-width: 800px; margin: 0 auto; }
          .section { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .info-item { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          .label { font-weight: bold; color: #cb1618; margin-bottom: 5px; }
          .images-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .image-container { text-align: center; }
          .image-container img { max-width: 100%; height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd; }
          .cta-button { background: #cb1618; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px; font-weight: bold; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; margin-top: 30px; }
          .contact-info { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 15px 0; }
          .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          
          @media (max-width: 600px) {
              .info-grid { grid-template-columns: 1fr; }
              .images-grid { grid-template-columns: 1fr; }
              .cta-button { display: block; text-align: center; margin: 10px 0; }
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>🚗 NUOVA RICHIESTA ACQUISIZIONE AUTO</h1>
          <h2>RD Group - ${currentDate}</h2>
      </div>
      
      <div class="content">
          <div class="urgent">
              <h2 style="margin-top: 0; color: #856404;">⚡ AZIONE RICHIESTA</h2>
              <p><strong>Contattare il cliente entro 24 ore per fissare un appuntamento di valutazione</strong></p>
          </div>

          <div class="section">
              <h2>👤 Dati Cliente</h2>
              <div class="info-grid">
                  <div class="info-item">
                      <div class="label">Nome Completo</div>
                      <div>${data.customerData.nome} ${data.customerData.cognome}</div>
                  </div>
                  <div class="info-item">
                      <div class="label">Email</div>
                      <div><a href="mailto:${data.customerData.mail}" style="color: #cb1618;">${data.customerData.mail}</a></div>
                  </div>
                  <div class="info-item">
                      <div class="label">Telefono</div>
                      <div><a href="tel:${data.customerData.telefono}" style="color: #cb1618;">${data.customerData.telefono}</a></div>
                  </div>
                  <div class="info-item">
                      <div class="label">Data Richiesta</div>
                      <div>${currentDate}</div>
                  </div>
              </div>
          </div>

          <div class="section">
              <h2>🚙 Dati Veicolo</h2>
              <div class="info-grid">
                  <div class="info-item">
                      <div class="label">Marca</div>
                      <div>${data.vehicleData.marca || 'Non specificata'}</div>
                  </div>
                  <div class="info-item">
                      <div class="label">Anno</div>
                      <div>${data.vehicleData.anno || 'Non specificato'}</div>
                  </div>
                  <div class="info-item">
                      <div class="label">Chilometraggio</div>
                      <div>${data.vehicleData.km ? parseInt(data.vehicleData.km).toLocaleString('it-IT') + ' km' : 'Non specificato'}</div>
                  </div>
              </div>
              ${data.vehicleData.note ? `
              <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 15px;">
                  <div class="label">📝 Note Aggiuntive</div>
                  <div style="margin-top: 8px; white-space: pre-wrap;">${data.vehicleData.note}</div>
              </div>
              ` : ''}
          </div>

          <div class="section">
              <h2>📸 Foto del Veicolo (${data.images.length} immagini)</h2>
              <div class="images-grid">
                  ${data.images.map((url, index) => `
                  <div class="image-container">
                      <img src="${url}" alt="Foto ${index + 1} del veicolo" loading="lazy" />
                      <p style="margin: 10px 0 0 0;"><strong>Foto ${index + 1}${index === 0 ? ' ⭐ (Principale)' : ''}</strong></p>
                      <a href="${url}" target="_blank" style="font-size: 0.9rem; color: #cb1618;">Visualizza in grande</a>
                  </div>
                  `).join('')}
              </div>
          </div>

          <div class="contact-info">
              <h2 style="margin-top: 0;">📞 Contatta Subito il Cliente</h2>
              <p style="margin-bottom: 20px;"><strong>Usa uno di questi metodi per contattare il cliente:</strong></p>
              <div style="text-align: center;">
                  <a href="tel:${data.customerData.telefono}" class="cta-button">📱 Chiama ${data.customerData.telefono}</a>
                  <a href="mailto:${data.customerData.mail}?subject=Valutazione auto ${data.vehicleData.marca || 'veicolo'}" class="cta-button">✉️ Invia Email</a>
                  <a href="${data.summaryUrl}" target="_blank" class="cta-button">📋 Riepilogo Completo</a>
              </div>
          </div>
      </div>

      <div class="footer">
          <h3 style="color: #cb1618;">RD Group - Concessionario Auto Pistoia</h3>
          <p>📍 Via Bottaia, 2 - 51100 Pistoia (PT)</p>
          <p>📞 +39 057 318 7467 | ✉️ rdautosrlpistoia@gmail.com</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 0.9rem; color: #666;">
              Email generata automaticamente dal sistema di acquisizione<br>
              ID Richiesta: #${Date.now().toString().slice(-6)}
          </p>
      </div>
  </body>
  </html>
  `;
};

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gestisci preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Solo POST permesso
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed' 
      })
    };
  }

  try {
    // Verifica API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY non configurata');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Configurazione email non valida' 
        })
      };
    }

    // Inizializza SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Parse del body
    const data = JSON.parse(event.body || '{}');

    // Validazione base
    if (!data.customerData?.mail || !data.customerData?.nome) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Dati cliente mancanti' 
        })
      };
    }

    // Crea e invia email principale
    const msg = {
      to: process.env.TO_EMAIL || 'rdautosrlpistoia@gmail.com',
      from: {
        email: process.env.FROM_EMAIL || 'rdautosrlpistoia@gmail.com',
        name: 'RD Group - Sistema Acquisizioni'
      },
      subject: `🚗 URGENTE: Richiesta Acquisizione ${data.vehicleData.marca || 'Auto'} - ${data.customerData.nome} ${data.customerData.cognome}`,
      html: createEmailHtml(data),
      replyTo: data.customerData.mail,
    };

    await sgMail.send(msg);

    // Invia email di conferma al cliente
    const confirmationMsg = {
      to: data.customerData.mail,
      from: {
        email: process.env.FROM_EMAIL || 'rdautosrlpistoia@gmail.com',
        name: 'RD Group'
      },
      subject: '✅ Richiesta ricevuta - Ti contatteremo presto!',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #cb1618; color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0;">✅ Richiesta Ricevuta!</h1>
        </div>
        <div style="padding: 30px 20px;">
          <p>Ciao <strong>${data.customerData.nome}</strong>,</p>
          <p>Abbiamo ricevuto la tua richiesta di valutazione per la tua <strong>${data.vehicleData.marca || 'auto'}</strong>.</p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #2d5016; margin-top: 0;">🎯 Cosa succede ora:</h3>
            <ul style="color: #2d5016; line-height: 1.6;">
              <li>Un nostro esperto valuterà le foto e informazioni che ci hai inviato</li>
              <li><strong>Ti contatteremo entro 24 ore</strong> per fissare un appuntamento</li>
              <li>Valuteremo la tua auto di persona per offrirti il miglior prezzo</li>
              <li>Pagamento immediato e passaggio di proprietà a carico nostro!</li>
            </ul>
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <h3 style="color: #cb1618; margin-top: 0;">📞 Hai fretta?</h3>
            <p>Chiamaci subito al <strong style="font-size: 1.2em;">+39 057 318 7467</strong></p>
            <p><strong>Orari:</strong> Lunedì-Sabato 08:30-13:00 / 14:30-19:30</p>
          </div>
          
          <p>Grazie per aver scelto RD Group per la vendita della tua auto!</p>
          <p><strong>Il Team RD Group</strong><br>
          <em>Il tuo concessionario di fiducia a Pistoia</em></p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 0.9rem; color: #666;">
          <strong>RD Group</strong><br>
          📍 Via Bottaia, 2 - 51100 Pistoia (PT)<br>
          📞 +39 057 318 7467 | ✉️ rdautosrlpistoia@gmail.com
        </div>
      </div>
      `
    };

    await sgMail.send(confirmationMsg);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email inviata con successo' 
      })
    };

  } catch (error) {
    console.error('Errore SendGrid:', error);
    
    let errorMessage = 'Errore interno del server';
    let statusCode = 500;

    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error;
      if (sgError.response?.body?.errors) {
        errorMessage = sgError.response.body.errors[0]?.message || errorMessage;
        statusCode = sgError.code || 500;
      }
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: errorMessage 
      })
    };
  }
};