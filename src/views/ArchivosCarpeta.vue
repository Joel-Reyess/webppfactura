<template>
  <div>
    <AdminNavbar @toggle-sidebar="toggleSidebar"></AdminNavbar>
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
                        <li><a class="dropdown-item text-danger" href="#" @click.prevent="confirmarEliminacion(documento)">Eliminar</a></li>
                      </ul>
                  </div>    
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalDoc :isOpen="isModalOpen" :fileUrl="selectedFileUrl" @close-modal="closeModal" />
  </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';
import axios from '../utils/axios.js';
import ModalDoc from '../components/ModalDoc.vue';

export default {
  name: 'ArchivosCarpeta',
  components: {
    AdminNavbar,
    AdminSidebar,
    ModalDoc,
  },
  data() {
    return {
      documentos: [],
      isModalOpen: false,
      selectedFileUrl: '',
      selectedFile: null,
      isSidebarOpen: true,
    };
  },
  methods: {

    toggleSidebar(){
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async obtenerDocumentosDeCarpeta() {
      try {
        const response = await axios.get(`/api/documentos/carpeta/${this.$route.params.id}`);
        this.documentos = response.data;
        this.obtenerDocumentos();
      } catch (error) {
        console.error('Error al obtener los documentos de la carpeta:', error);
      }
    },
    openModal(fileName) {
      this.selectedFileUrl = `http://localhost:3000/uploads/${fileName}`;
      this.isModalOpen = true;
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
      formData.append('archivo', this.selectedFile); // Agrega el archivo al FormData
      formData.append('nombredocumento', this.selectedFile.name); // Nombre del archivo
      formData.append('tipodocumento', this.selectedFile.type); // Tipo del archivo
      formData.append('tamanodocumento', this.selectedFile.size); // Tamaño del archivo
      formData.append('idcarpeta', this.$route.params.id); // Asigna el archivo a la carpeta actual

      try {
        const response = await axios.post('/api/documentos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Cambia el Content-Type para subida de archivos
          },
        });
        console.log('Archivo subido con éxito:', response.data);
        this.obtenerDocumentosDeCarpeta(); // Actualiza la lista de documentos
        alert('Archivo subido con éxito');
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        alert('Error al subir el archivo');
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