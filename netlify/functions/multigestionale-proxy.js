exports.handler = async (event, context) => {
	const headers = {
	  'Access-Control-Allow-Origin': '*',
	  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	  'Content-Type': 'application/xml'
	};
  
	if (event.httpMethod === 'OPTIONS') {
	  return {
		statusCode: 200,
		headers,
		body: ''
	  };
	}
  
	if (event.httpMethod !== 'GET') {
	  return {
		statusCode: 405,
		headers,
		body: JSON.stringify({ error: 'Method not allowed' })
	  };
	}
  
	try {
	  // Estrai i parametri dalla query string
	  const params = new URLSearchParams(event.queryStringParameters || {});
	  
	  // URL base di Multigestionale
	  const baseUrl = 'https://motori.multigestionale.com/api/xml/';
	  const targetUrl = `${baseUrl}?${params.toString()}`;
  
	  console.log('Proxy request to:', targetUrl);
  
	  // Effettua la richiesta a Multigestionale
	  const response = await fetch(targetUrl, {
		method: 'GET',
		headers: {
		  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
		  'Accept': 'application/xml, text/xml, */*',
		  'Cache-Control': 'no-cache'
		}
	  });
  
	  if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	  }
  
	  const xmlData = await response.text();
	  
	  // Verifica che la risposta non sia vuota
	  if (!xmlData || xmlData.trim() === '') {
		throw new Error('Risposta XML vuota da Multigestionale');
	  }
  
	  return {
		statusCode: 200,
		headers: {
		  ...headers,
		  'Content-Type': 'application/xml',
		  'Cache-Control': 'public, max-age=300' // Cache per 5 minuti
		},
		body: xmlData
	  };
  
	} catch (error) {
	  console.error('Errore proxy Multigestionale:', error);
	  
	  return {
		statusCode: 500,
		headers: {
		  ...headers,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		  error: 'Errore interno del server',
		  message: error.message,
		  timestamp: new Date().toISOString()
		})
	  };
	}
  };