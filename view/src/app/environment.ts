export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && window.env && window.env.apiUrl) 
             ? window.env.apiUrl 
             : 'http://localhost:5122/api' // Valor por defecto
};