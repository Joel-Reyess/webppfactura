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

export default {
  name: 'CarpetasAdmin',
  components: {
    AdminNavbar,
    AdminSidebar,
  },
  data() {
    return {
      carpetas: [],
      filteredCarpetas: [],
      searchTerm: "",
      isSearchActive: false,
      isSidebarOpen: true,
    };
  },
  methods: {

    toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
    },
    async obtenerCarpetas() {
      try {
        const response = await axios.get('/api/folders');
        this.carpetas = response.data;
        this.filteredCarpetas = response.data;
        //this.obtenerCarpetas();
      } catch (error) {
        console.error('Error al obtener las carpetas:', error);
      }
    },
    handleSearch(searchTerm) {
      if (typeof searchTerm !== "string") {
        console.error("El término de búsqueda no es una cadena válida:", searchTerm);
        return;
      }
    
      this.searchTerm = searchTerm.toLowerCase();
    
      if (this.searchTerm === "") {
        // Si el término de búsqueda está vacío, muestra todas las carpetas
        this.isSearchActive = false;
        this.filteredCarpetas = this.carpetas;
      } else {
        // Filtra las carpetas basadas en el término de búsqueda
        this.isSearchActive = true;
        this.filteredCarpetas = this.carpetas.filter((carpeta) =>
          carpeta.nombrecarpeta.toLowerCase().includes(this.searchTerm)
        );
      }
    },
  },
  mounted() {
    this.obtenerCarpetas();
  },
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