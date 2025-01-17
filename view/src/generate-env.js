// src/generate-env.js
const fs = require('fs');
const apiUrl = process.argv[2] || process.env.API_URL || 'http://localhost:5122/api'; // Toma el valor de la variable de entorno o usa la predeterminada

const envConfig = `window['env'] = { apiUrl: '${apiUrl}' };`;

fs.writeFile('src/env.js', envConfig, (err) => {
  if (err) {
    console.error('Error al generar el archivo env.js:', err);
  } else {
    console.log('Archivo env.js generado correctamente.');
  }
});