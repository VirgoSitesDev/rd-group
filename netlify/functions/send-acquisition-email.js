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
      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
          body { 
            font-family: 'Manrope', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background: #f8f9fa;
          }
          .email-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: #000000; 
            color: white; 
            padding: 40px 20px; 
            text-align: center; 
          }
          .header img {
            max-width: 120px;
            height: auto;
            margin-bottom: 20px;
            filter: brightness(0) invert(1);
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 600;
            color: white;
          }
          .header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 400;
            color: #ccc;
          }
          .content { 
            padding: 40px 30px; 
            background: white;
          }
          .section { 
            margin-bottom: 40px; 
            border-bottom: 1px solid #e9ecef; 
            padding-bottom: 30px; 
          }
          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .section h2 {
            color: #000000;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #000000;
            display: inline-block;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 20px 0; 
          }
          .info-item { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px;
            border-left: 4px solid #000000;
          }
          .label { 
            font-weight: 600; 
            color: #000000; 
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            font-size: 16px;
            color: #333;
            font-weight: 400;
          }
          .images-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 25px 0; 
          }
          .image-container { 
            text-align: center;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
          }
          .image-container img { 
            max-width: 100%; 
            height: 150px; 
            object-fit: cover; 
            border-radius: 6px; 
            border: 2px solid #e9ecef;
            transition: transform 0.2s ease;
          }
          .image-container img:hover {
            transform: scale(1.02);
          }
          .image-title {
            margin: 12px 0 0 0;
            font-weight: 600;
            color: #000000;
            font-size: 14px;
          }
          .image-link {
            font-size: 12px;
            color: #6c757d;
            text-decoration: none;
            margin-top: 5px;
            display: inline-block;
          }
          .image-link:hover {
            color: #000000;
          }
          .cta-button { 
            background: #000000; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 8px 8px 8px 0; 
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
          }
          .cta-button:hover {
            background: #333333;
            transform: translateY(-1px);
          }
          .footer { 
            background: #f8f9fa; 
            padding: 30px 20px; 
            text-align: center; 
            border-top: 1px solid #e9ecef;
          }
          .footer h3 {
            color: #000000;
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: 600;
          }
          .footer p {
            margin: 8px 0;
            color: #6c757d;
            font-size: 14px;
          }
          .contact-info { 
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px; 
            border-radius: 8px; 
            margin: 25px 0;
            border: 1px solid #e9ecef;
          }
          .contact-info h2 {
            margin-top: 0;
            color: #000000;
            font-size: 18px;
            font-weight: 600;
          }
          .contact-info div a {
            color: white !important;
          }
          .urgent { 
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 50%);
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 0 0 30px 0;
            border-left: 4px solid #f0ad4e;
          }
          .urgent h2 {
            margin-top: 0; 
            color: #856404;
            font-size: 18px;
            font-weight: 600;
          }
          .notes-section {
            background: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #f0ad4e;
          }
          .notes-section .label {
            color: #856404;
          }
          .notes-content {
            margin-top: 12px;
            white-space: pre-wrap;
            color: #856404;
            font-weight: 400;
          }
          
          @media (max-width: 600px) {
              .content { padding: 20px 15px; }
              .info-grid { grid-template-columns: 1fr; }
              .images-grid { grid-template-columns: 1fr; }
              .cta-button { 
                display: block; 
                text-align: center; 
                margin: 10px 0; 
                width: 100%;
                box-sizing: border-box;
              }
              .header { padding: 30px 15px; }
              .header h1 { font-size: 24px; }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <img src="https://rd-group.netlify.app/logo_white.png" alt="RD Group Logo" />
              <h1>NUOVA RICHIESTA ACQUISIZIONE AUTO</h1>
              <h2>RD Group - ${currentDate}</h2>
          </div>
          
          <div class="content">
              <div class="urgent">
                  <h2>AZIONE RICHIESTA</h2>
                  <p><strong>Contattare il cliente per fissare un appuntamento di valutazione</strong></p>
              </div>

              <div class="section">
                  <h2>Dati Cliente</h2>
                  <div class="info-grid">
                      <div class="info-item">
                          <div class="label">Nome Completo</div>
                          <div class="value">${data.customerData.nome} ${data.customerData.cognome}</div>
                      </div>
                      <div class="info-item">
                          <div class="label">Email</div>
                          <div class="value"><a href="mailto:${data.customerData.mail}" style="color: #000000; text-decoration: none;">${data.customerData.mail}</a></div>
                      </div>
                      <div class="info-item">
                          <div class="label">Telefono</div>
                          <div class="value"><a href="tel:${data.customerData.telefono}" style="color: #000000; text-decoration: none;">${data.customerData.telefono}</a></div>
                      </div>
                      <div class="info-item">
                          <div class="label">Data Richiesta</div>
                          <div class="value">${currentDate}</div>
                      </div>
                  </div>
              </div>

              <div class="section">
                  <h2>Dati Veicolo</h2>
                  <div class="info-grid">
                      <div class="info-item">
                          <div class="label">Marca</div>
                          <div class="value">${data.vehicleData.marca || 'Non specificata'}</div>
                      </div>
                      <div class="info-item">
                          <div class="label">Anno</div>
                          <div class="value">${data.vehicleData.anno || 'Non specificato'}</div>
                      </div>
                      <div class="info-item">
                          <div class="label">Chilometraggio</div>
                          <div class="value">${data.vehicleData.km ? parseInt(data.vehicleData.km).toLocaleString('it-IT') + ' km' : 'Non specificato'}</div>
                      </div>
                  </div>
                  ${data.vehicleData.note ? `
                  <div class="notes-section">
                      <div class="label">Note Aggiuntive</div>
                      <div class="notes-content">${data.vehicleData.note}</div>
                  </div>
                  ` : ''}
              </div>

              <div class="section">
                  <h2>Foto del Veicolo (${data.images ? data.images.length : 0} immagini)</h2>
                  ${data.images && data.images.length > 0 ? `
                  <div class="images-grid">
                      ${data.images.map((url, index) => `
                      <div class="image-container">
                          <img src="${url}" alt="Foto ${index + 1} del veicolo" loading="lazy" />
                          <div class="image-title">Foto ${index + 1}${index === 0 ? ' (Principale)' : ''}</div>
                          <a href="${url}" target="_blank" class="image-link">Visualizza in grande</a>
                      </div>
                      `).join('')}
                  </div>
                  ` : '<p style="color: #6c757d; font-style: italic;">Nessuna immagine allegata</p>'}
              </div>

              <div class="contact-info">
                  <h2>Contatta Subito il Cliente</h2>
                  <p style="margin-bottom: 20px; color: #333;"><strong>Usa uno di questi metodi per contattare il cliente:</strong></p>
                  <div style="text-align: center;">
                      <a href="tel:${data.customerData.telefono}" class="cta-button">Chiama ${data.customerData.telefono}</a>
                      <a href="mailto:${data.customerData.mail}?subject=Valutazione auto ${data.vehicleData.marca || 'veicolo'}" class="cta-button">Invia Email</a>
                      ${data.summaryUrl ? `<a href="${data.summaryUrl}" target="_blank" class="cta-button">Riepilogo Completo</a>` : ''}
                  </div>
              </div>
          </div>

          <div class="footer">
              <h3>RD Group - Concessionario Auto Pistoia</h3>
              <p>Via Bottaia di San Sebastiano 2L - Pistoia 51100</p>
              <p>+39 057 318 74672 | rdautosrlpistoia@gmail.com</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e9ecef;">
              <p style="font-size: 12px;">
                  Email generata automaticamente dal sistema di acquisizione<br>
                  ID Richiesta: #${Date.now().toString().slice(-6)}
              </p>
          </div>
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
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY non configurata');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'SENDGRID_API_KEY non configurata nelle environment variables' 
        })
      };
    }

    // Verifica FROM_EMAIL
    if (!process.env.FROM_EMAIL) {
      console.error('FROM_EMAIL non configurata');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'FROM_EMAIL non configurata nelle environment variables' 
        })
      };
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    let data;
    try {
      data = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('Errore parsing JSON:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Formato JSON non valido' 
        })
      };
    }

    // Validazione base con dettagli
    if (!data.customerData) {
      console.error('customerData mancante');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'customerData mancante' 
        })
      };
    }

    if (!data.customerData.mail || !data.customerData.nome) {
      console.error('Dati cliente incompleti:', data.customerData);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Email e nome del cliente sono obbligatori' 
        })
      };
    }

    const msg = {
      to: 'rdluxurysrl@gmail.com',
      from: {
        email: process.env.FROM_EMAIL,
        name: 'RD Group - Sistema Acquisizioni'
      },
      subject: `Richiesta Acquisizione ${data.vehicleData?.marca || 'Auto'} - ${data.customerData.nome} ${data.customerData.cognome}`,
      html: createEmailHtml(data),
      replyTo: data.customerData.mail,
    };

    await sgMail.send(msg);

    const confirmationMsg = {
      to: data.customerData.mail,
      from: {
        email: process.env.FROM_EMAIL,
        name: 'RD Group'
      },
      subject: 'Richiesta ricevuta - Ti contatteremo presto!',
      html: `
      <div style="font-family: 'Manrope', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
        <div style="background: #000000; color: white; padding: 40px 20px; text-align: center;">
          <img src="https://rd-group.netlify.app/logo_white.png" alt="RD Group Logo" style="max-width: 120px; height: auto; margin-bottom: 20px; filter: brightness(0) invert(1);">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600;">Richiesta Ricevuta!</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Ciao <strong>${data.customerData.nome}</strong>,</p>
          <p style="font-size: 16px; color: #333; margin-bottom: 25px;">Abbiamo ricevuto la tua richiesta di valutazione per la tua <strong>${data.vehicleData?.marca || 'auto'}</strong>.</p>
          
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #000000;">
            <h3 style="color: #000000; margin-top: 0; font-size: 18px; font-weight: 600;">Cosa succede ora:</h3>
            <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
              <li>Un nostro esperto valuterà le foto e informazioni che ci hai inviato</li>
              <li><strong>Ti contatteremo nei prossimi giorni</strong> per fissare un appuntamento</li>
              <li>Valuteremo la tua auto di persona per offrirti il miglior prezzo</li>
            </ul>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center; border: 1px solid #e9ecef;">
            <h3 style="color: #000000; margin-top: 0; font-size: 18px; font-weight: 600;">Hai fretta?</h3>
            <p style="margin-bottom: 15px; color: #333;">Chiamaci subito:</p>
            <p style="margin: 8px 0;"><strong style="font-size: 18px; color: #000000;">RD Group: +39 057 318 74672</strong></p>
            <p style="margin: 8px 0;"><strong style="font-size: 18px; color: #000000;">RD Luxury: +39 0573 1941223</strong></p>
            <p style="margin-top: 15px; color: #6c757d; font-size: 14px;"><strong>Orari:</strong> Lunedì-Sabato 08:30-13:00 / 14:30-19:30</p>
          </div>
          
          <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Grazie per aver scelto RD Group per la vendita della tua auto!</p>
          <p style="font-size: 16px; color: #333; margin-bottom: 0;"><strong>Il Team RD Group</strong><br>
          <em style="color: #6c757d;">Il tuo concessionario di fiducia a Pistoia</em></p>
        </div>
        <div style="background: #f8f9fa; padding: 25px; text-align: center; font-size: 14px; color: #6c757d; border-top: 1px solid #e9ecef;">
          <strong style="color: #000000;">RD Group</strong><br>
          Via Bottaia di San Sebastiano 2L - Pistoia 51100<br>
          RD Group: +39 057 318 74672 | RD Luxury: +39 0573 1941223<br>
          rdautosrlpistoia@gmail.com | rdluxurysrl@gmail.com
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
        message: 'Email inviate con successo' 
      })
    };

  } catch (error) {
    console.error('Errore completo:', error);
    
    let errorMessage = 'Errore interno del server';
    let statusCode = 500;

    if (error && typeof error === 'object') {
      if (error.response && error.response.body) {
        console.error('Errore SendGrid:', error.response.body);
        if (error.response.body.errors && error.response.body.errors.length > 0) {
          errorMessage = error.response.body.errors[0].message;
        }
        statusCode = error.code || error.response.status || 500;
      } else if (error.message) {
        errorMessage = error.message;
      }
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: `Errore SendGrid: ${errorMessage}`,
        debug: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      })
    };
  }
};