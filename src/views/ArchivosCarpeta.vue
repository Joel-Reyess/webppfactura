<template>
  <div>
    <AdminNavbar @toggle-sidebar="toggleSidebar" @search="handleSearch"></AdminNavbar>
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <AdminSidebar :is-sidebar-open="isSidebarOpen"></AdminSidebar>
        <div class="col main-content" :class="{ 'expanded': !isSidebarOpen }">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0 titulo-carpeta">
              <i class="fas fa-folder"></i> Archivos de la carpeta
            </h2>
            <button class="btn btn-primary" @click="triggerFileInput">
              <i class="fas fa-upload"></i> Subir archivo
            </button>
            <input
                type="file"
                ref="fileInput"
                style="display: none;"
                @change="handleFileUpload"
            />
          </div>
          <div v-if="!isSearchActive">
          <div class="row">
            <div class="col-md-4 mb-4" v-for="documento in documentos" :key="documento.iddocumento">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ documento.nombredocumento }}</h5>
                  <h6 class="card-subtitle mb-2 text-muted">
                    {{ documento.tipodocumento }} - {{ documento.tamanodocumento }} bytes
                  </h6>
                  <p class="card-text">
                    Subido el: {{ new Date(documento.fechasubida).toLocaleDateString() }}
                  </p>
                  <a href="#" class="card-link" @click.prevent="openModal(documento.rutadocumento)">Ver archivo</a>
                  <div class="dropdown">
                      <a href="#" class="card-link dropdown-toggle" data-bs-toggle="dropdown">Opciones</a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item text-danger" href="#" @click.prevent="abrirModalConfirmacion(documento)">Eliminar</a></li>
                      </ul>
                  </div>    
                </div>
              </div>
            </div>
          </div>
          </div>
          <div v-else>
                  <div class="row">
                    <div class="col-md-4 mb-4" v-for="documento in filteredDocumentos" :key="documento.iddocumento">
                      <div class="card">
                        <div class="card-body">
                          <h5 class="card-title">{{ documento.nombredocumento }}</h5>
                          <h6 class="card-subtitle mb-2 text-muted">
                            {{ documento.tipodocumento }} - {{ documento.tamanodocumento }} bytes
                          </h6>
                          <p class="card-text">
                            Subido el: {{ new Date(documento.fechasubida).toLocaleDateString() }}
                          </p>
                          <a href="#" class="card-link" @click.prevent="openModal(documento.rutadocumento)">Ver archivo</a>
                          <div class="dropdown">
                            <a href="#" class="card-link dropdown-toggle" data-bs-toggle="dropdown">Opciones</a>
                            <ul class="dropdown-menu">
                              <li><a class="dropdown-item" href="#" @click.prevent="abrirModalAsignarCarpeta(documento)">Asignar a carpeta</a></li>
                              <li><a class="dropdown-item text-danger" href="#" @click.prevent="abrirModalConfirmacion(documento)">Eliminar</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
        </div>
      </div>
    </div>
    <ModalDoc :isOpen="isModalOpen" :fileUrl="selectedFileUrl" @close-modal="closeModal" />
    <ConfirmationModal
      :isOpen="isConfirmationModalOpen"
      title="Desasignar documento"
      message="¿Estás seguro de que deseas desasignar este documento de la carpeta?"
      @close-modal="cerrarModalConfirmacion"
      @confirm-action="eliminarDocumento"
    />
    <ConfirmationModal
      :isOpen="isSuccessModalOpen"
      title="Documento desasignado"
      message="El documento se ha desasignado de la carpeta correctamente."
      :showConfirmButton="false"
      @close-modal="cerrarModalExito"
    />
    <ConfirmationModal
      :isOpen="isUploadSuccessModalOpen"
      title="Archivo subido"
      message="El archivo se ha subido correctamente."
      :showConfirmButton="false"
      @close-modal="isUploadSuccessModalOpen = false"
    />
  </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';
//import SearchResults from '../components/SearchResults.vue';
import axios from '../utils/axios.js';
import ModalDoc from '../components/ModalDoc.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import { useDocumentStore } from '../stores/documentStore';

export default {
  name: 'ArchivosCarpeta',
  components: {
    AdminNavbar,
    AdminSidebar,
    ModalDoc,
    ConfirmationModal,
    //SearchResults
  },
  data() {
    return {
      //documentos: [],
      filteredDocumentos: [],
      searchTerm: "",
      isSearchActive: false,
      isModalOpen: false,
      selectedFileUrl: '',
      selectedFile: null,
      isSidebarOpen: true,
      isConfirmationModalOpen: false,
      isSuccessModalOpen: false,
      documentoAEliminar: null,
      isUploadSuccessModalOpen: false,
    };
  },
  setup() {
    const documentStore = useDocumentStore();
    return { documentStore };
  },
  computed: {
    documentos() {
      // Usamos el store para obtener los documentos de la carpeta actual
      return this.documentStore.documentosPorCarpeta[this.$route.params.id] || [];
    }
  },
  methods: {

    toggleSidebar(){
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async obtenerDocumentosDeCarpeta() {
      try {
        await this.documentStore.fetchDocumentsByFolder(this.$route.params.id);
      } catch (error) {
        console.error('Error al obtener los documentos de la carpeta:', error);
        if (!navigator.onLine) {
          alert('Modo offline: mostrando datos cacheados');
        }
      }
    },
    openModal(fileName) {
      if (!navigator.onLine) {
        // Intentar obtener del cache
        caches.match(`http://localhost:3000/uploads/${fileName}`)
          .then(response => {
            if (response) {
              this.selectedFileUrl = URL.createObjectURL(response.blob());
              this.isModalOpen = true;
            } else {
              alert('El archivo no está disponible offline');
            }
          });
      } else {
        this.selectedFileUrl = `http://localhost:3000/uploads/${fileName}`;
        this.isModalOpen = true;
      }
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedFileUrl = '';
    },
    triggerFileInput() {
      this.$refs.fileInput.click(); // Simula el clic en el input de archivo
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0]; // Almacena el archivo seleccionado
      this.subirArchivo(); // Llama a la función para subir el archivo
    },
    async subirArchivo() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append('archivo', this.selectedFile);
      formData.append('nombredocumento', this.selectedFile.name);
      formData.append('tipodocumento', this.selectedFile.type);
      formData.append('tamanodocumento', this.selectedFile.size);
      formData.append('idcarpeta', this.$route.params.id);

      try {
        const response = await axios.post('/api/documentos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Cambia el Content-Type para subida de archivos
          },
        });
        console.log('Archivo subido con éxito:', response.data);
        this.obtenerDocumentosDeCarpeta(); 
        this.isUploadSuccessModalOpen = true;
        //alert('Archivo subido con éxito');
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Error al subir el archivo');
      }
    },
    abrirModalConfirmacion(documento) {
      this.documentoAEliminar = documento;
      this.isConfirmationModalOpen = true;
    },

    cerrarModalConfirmacion() {
      this.isConfirmationModalOpen = false;
      this.documentoAEliminar = null;
    },
    async eliminarDocumento() {
      try {
        // Llama al endpoint para desasignar el documento de la carpeta
        await axios.put(`/api/documentos/desasignar/${this.documentoAEliminar.iddocumento}`);
        this.isConfirmationModalOpen = false;
        this.isSuccessModalOpen = true;
        this.obtenerDocumentosDeCarpeta();
      } catch (error) {
        console.error("Error al desasignar el documento de la carpeta:", error);
        alert("Error al desasignar el documento de la carpeta");
      }
    },
    cerrarModalExito() {
      this.isSuccessModalOpen = false;
    },
    handleSearch(searchTerm) {
      if (typeof searchTerm !== "string") {
        console.error("El término de búsqueda no es una cadena válida:", searchTerm);
        return;
      }

      this.searchTerm = searchTerm.toLowerCase();

      if (this.searchTerm === "") {
        // Si el término de búsqueda está vacío, muestra todos los documentos
        this.isSearchActive = false;
        this.filteredDocumentos = this.documentos;
      } else {
        // Filtra los documentos basados en el término de búsqueda
        this.isSearchActive = true;
        this.filteredDocumentos = this.documentos.filter((documento) =>
          documento.nombredocumento.toLowerCase().includes(this.searchTerm)
        );
      }
    },
  },
  mounted() {
    this.obtenerDocumentosDeCarpeta();
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

@media (max-width: 767.98px) {
  .main-content {
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

.card-text {
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