import { defineStore } from 'pinia';
import axios from '../utils/axios';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    carpetas: [],
    lastFetch: null
  }),
  actions: {
    async fetchFolders() {
      if (navigator.onLine === false) {
        const cached = localStorage.getItem('carpetasCache');
        if (cached) {
          this.carpetas = JSON.parse(cached);
          return;
        }
      }

      try {
        const response = await axios.get('/api/folders');
        this.carpetas = response.data;
        localStorage.setItem('carpetasCache', JSON.stringify(response.data));
      } catch (error) {
        if (navigator.onLine === false) {
          const cached = localStorage.getItem('carpetasCache');
          if (cached) this.carpetas = JSON.parse(cached);
        }
        console.error('Error fetching folders:', error);
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'carpetas',
        storage: localStorage,
      },
    ],
  },
});