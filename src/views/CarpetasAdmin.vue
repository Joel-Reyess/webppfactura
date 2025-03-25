<template>
  <div>
    <AdminNavbar @toggle-sidebar="toggleSidebar" @search="handleSearch"></AdminNavbar>
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <AdminSidebar :is-sidebar-open="isSidebarOpen"></AdminSidebar>
        <div class="col main-content" :class="{ 'expanded': !isSidebarOpen }">
          <h2>Carpetas</h2>
          <div v-if="!isSearchActive">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="carpeta in carpetas" :key="carpeta.idcarpeta">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ carpeta.nombrecarpeta }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    {{ carpeta.descripcioncarpeta }}
                  </h6>
                  <router-link
                    :to="{ name: 'ArchivosCarpeta', params: { id: carpeta.idcarpeta } }"
                    class="card-link"
                  >
                    Abrir carpeta
                  </router-link>
                  <a href="#" class="card-link">Opciones</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="row">
            <div class="col-md-4 mb-4" v-for="carpeta in filteredCarpetas" :key="carpeta.idcarpeta">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ carpeta.nombrecarpeta }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    {{ carpeta.descripcioncarpeta }}
                  </h6>
                  <router-link
                    :to="{ name: 'ArchivosCarpeta', params: { id: carpeta.idcarpeta } }"
                    class="card-link"
                  >
                    Abrir carpeta
                  </router-link>
                  <a href="#" class="card-link">Opciones</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';
import axios from '../utils/axios.js';
import { useFolderStore } from '../stores/folderStore';

export default {
  name: 'CarpetasAdmin',
  components: {
    AdminNavbar,
    AdminSidebar,
  },
  setup() {
    const folderStore = useFolderStore();
    return { folderStore };
  },
  computed: {
    carpetas() {
      return this.folderStore.carpetas || [];
    }
  },
  data() {
    return {
      filteredCarpetas: [],
      searchTerm: "",
      isSearchActive: false,
      isSidebarOpen: true,
      isOnline: navigator.onLine,
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async obtenerCarpetas() {
  try {
    if (!this.isOnline) {
      const cached = localStorage.getItem('carpetasCache');
      if (cached) {
        this.folderStore.carpetas = JSON.parse(cached);
        this.filteredCarpetas = JSON.parse(cached);
        
        // Precargar el chunk necesario para la vista ArchivosCarpeta
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
        return;
      }
      throw new Error('No hay conexión y no hay datos en caché');
    }

    const response = await axios.get('/api/folders');
    this.folderStore.carpetas = response.data;
    this.filteredCarpetas = response.data;
    localStorage.setItem('carpetasCache', JSON.stringify(response.data));
  } catch (error) {
    console.error('Error al obtener carpetas:', error);
    if (!this.isOnline) {
      alert('Modo offline: mostrando datos cacheados');
    }
  }
},
    handleSearch(searchTerm) {
      if (typeof searchTerm !== "string") return;
      
      this.searchTerm = searchTerm.toLowerCase();
      this.isSearchActive = this.searchTerm !== "";
      
      this.filteredCarpetas = this.isSearchActive
        ? this.carpetas.filter(c => 
            c.nombrecarpeta.toLowerCase().includes(this.searchTerm))
        : [...this.carpetas];
    },
    updateOnlineStatus() {
      this.isOnline = navigator.onLine;
      if (this.isOnline) {
        this.obtenerCarpetas(); // Actualizar datos cuando vuelve la conexión
      }
    }
  },
  mounted() {
    this.obtenerCarpetas();
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  beforeUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }
};
</script>

<style scoped>
.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 20px;
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-top: 80px;
}

.main-content.expanded {
  margin-left: 0;
  width: 100%;
}

@media (max-width: 767.98px) {
  .main-content {
    margin-left: 0;
    width: 100%;
    margin-top: 80px;
  }

  .main-content.expanded {
    margin-left: 0;
    width: 100%;
  }
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-body {
  flex: 1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #6c757d;
}

.card-link {
  font-size: 0.875rem;
  color: #007bff;
  text-decoration: none;
}

.card-link:hover {
  text-decoration: underline;
}
</style>