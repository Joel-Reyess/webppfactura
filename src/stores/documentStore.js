import { defineStore } from 'pinia';
import axios from '../utils/axios';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documentos: [],
    documentosPorCarpeta: {},
    lastFetch: null
  }),
  actions: {
    async fetchDocuments() {
      // Verificar si hay datos en cache
      if (navigator.onLine === false) {
        const cached = localStorage.getItem('documentosCache');
        if (cached) {
          this.documentos = JSON.parse(cached);
          return;
        }
      }

      try {
        const response = await axios.get('/api/documentos');
        this.documentos = response.data;
        // Guardar en cache
        localStorage.setItem('documentosCache', JSON.stringify(response.data));
        localStorage.setItem('documentosLastFetch', new Date().toISOString());
      } catch (error) {
        if (navigator.onLine === false) {
          const cached = localStorage.getItem('documentosCache');
          if (cached) this.documentos = JSON.parse(cached);
        }
        console.error("Error fetching documents:", error);
      }
    },
    async fetchDocumentsByFolder(folderId) {
      const cacheKey = `documentosCarpeta_${folderId}`;
      
      // Verificar cache primero si estamos offline
      if (!navigator.onLine) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          this.documentosPorCarpeta[folderId] = JSON.parse(cached);
          // Precargar el chunk necesario si estamos offline
          if ('serviceWorker' in navigator) {
            try {
              await navigator.serviceWorker.ready.then(registration => {
                registration.active.postMessage({
                  action: 'precache',
                  urls: ['/js/src_views_ArchivosCarpeta_vue.js']
                });
              });
            } catch (error) {
              console.error('Error al precachear chunks:', error);
            }
          }
          return this.documentosPorCarpeta[folderId];
        }
        throw new Error('No hay conexión y no hay datos en caché');
      }
    
      try {
        const response = await axios.get(`/api/documentos/carpeta/${folderId}`);
        this.documentosPorCarpeta[folderId] = response.data;
        
        // Guardar en cache
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        localStorage.setItem(`${cacheKey}_lastFetch`, new Date().toISOString());
        
        return response.data;
      } catch (error) {
        console.error(`Error fetching documents for folder ${folderId}:`, error);
        
        // Intentar devolver datos cacheados si hay error
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          this.documentosPorCarpeta[folderId] = JSON.parse(cached);
          return this.documentosPorCarpeta[folderId];
        }
        
        throw error;
      }
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'documentos',
        storage: localStorage,
        paths: ['documentos', 'lastFetch', 'documentosPorCarpeta']
      },
    ],
  },
});