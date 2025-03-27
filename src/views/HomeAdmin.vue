<template>
    <div>
        <AdminNavbar @toggle-sidebar="toggleSidebar" @search="handleSearch"></AdminNavbar>
        <div class="container-fluid">
            <div class="row flex-nowrap">
                <AdminSidebar :is-sidebar-open="isSidebarOpen" @file-uploaded="isUploadSuccessModalOpen = true"></AdminSidebar>
                <div class="col main-content" :class="{ 'expanded': !isSidebarOpen }">
                  <div v-if="!isSearchActive">
                    <div class="row">
                        <div class="col-md-4 mb-4" v-for="documento in documentos" :key="documento.iddocumento">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">{{ documento.nombredocumento }}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">
  {{ documento.tipodocumento }} - {{ getNombreCarpeta(documento.idcarpeta) || 'Sin carpeta' }}
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
                                          <!-- Otras opciones pueden ir aquí -->
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
        <ConfirmationModal
          :isOpen="isConfirmationModalOpen"
          title="Eliminar documento"
          message="¿Estás seguro de que deseas eliminar este documento?"
          @close-modal="cerrarModalConfirmacion"
          @confirm-action="eliminarDocumento"
        />

        <ConfirmationModal
          :isOpen="isSuccessModalOpen"
          title="Documento eliminado"
          message="El documento se ha eliminado correctamente."
          :showConfirmButton="false"
          @close-modal="cerrarModalExito"
        />
        <ModalDoc :isOpen="isModalOpen" :fileUrl="selectedFileUrl" @close-modal="closeModal" />
        <SeleccionarCarpetaModal
          :isOpen="isModalCarpetaOpen"
          :carpetas="carpetas"
          @cerrar-modal="cerrarModalCarpeta"
          @seleccionar-carpeta="asignarACarpeta"
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
import SeleccionarCarpetaModal from '../components/SeleccionarCarpetaModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import { useDocumentStore } from '../stores/documentStore';
import { useFolderStore } from '../stores/folderStore';

export default {
    name: 'HomeAdmin',
    components: {
        AdminNavbar,
        AdminSidebar,
        //SearchResults,
        ModalDoc,
        SeleccionarCarpetaModal,
        ConfirmationModal
    },
    setup(){
      const documentStore = useDocumentStore();
      const folderStore = useFolderStore();
      return { documentStore, folderStore };
    },
    computed: {
        documentos() {
            return this.documentStore.documentos;
        },
        carpetas() {
            return this.folderStore.carpetas;
        }
    },
    data() {
        return {
            isSidebarOpen: true,
            ///documentos: [],
            filteredDocumentos: [], // Lista filtrada de documentos
            searchTerm: "",
            isSearchActive: false,
            isModalOpen: false,
            selectedFileUrl: '',
            isModalCarpetaOpen: false,
            //carpetas: [],
            documentoSeleccionado: null,
            isConfirmationModalOpen: false, // Estado para el modal de confirmación
            isSuccessModalOpen: false, // Estado para el modal de éxito
            documentoAEliminar: null,
            isUploadSuccessModalOpen: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        getNombreCarpeta(idcarpeta) {
          if (!idcarpeta) return null;
          const carpeta = this.carpetas.find(c => c.idcarpeta === idcarpeta);
          return carpeta ? carpeta.nombrecarpeta : null;
        },

        async obtenerDocumentos() {
          try {
            await this.documentStore.fetchDocuments();
            // Verifica que los documentos tengan el campo idcarpeta
            this.documentStore.documentos.forEach(doc => {
              if (!Object.prototype.hasOwnProperty.call(doc, 'idcarpeta')) {
                doc.idcarpeta = null; // Asigna null si no existe
              }
            });
          } catch (error) {
            console.log("Error al obtener los documentos", error);
          }
        },
        handleSearch({ term, date }) {
          this.searchTerm = term.toLowerCase();
          this.searchDate = date;

          if (!term && !date) {
            this.isSearchActive = false;
            this.filteredDocumentos = this.documentos;
            return;
          }

          this.isSearchActive = true;
          this.filteredDocumentos = this.documentos.filter((documento) => {
            const matchesText = !term || 
              documento.nombredocumento.toLowerCase().includes(term);

            const matchesDate = !date || 
              new Date(documento.fechasubida).toISOString().split('T')[0] === date;

            return matchesText && matchesDate;
          });
        },
        async obtenerCarpetas() {
            try {
                await this.folderStore.fetchFolders();
            } catch (error) {
                console.log('Error al obtener las carpetas', error);
            }
        },

        openModal(fileName) {
          this.selectedFileUrl = `http://localhost:3000/uploads/${fileName}`;
          this.isModalOpen = true;
        },

        // Método para cerrar el modal
        closeModal() {
          this.isModalOpen = false;
          this.selectedFileUrl = '';
        },

        abrirModalAsignarCarpeta(documento) {
          this.documentoSeleccionado = documento;
          this.isModalCarpetaOpen = true;
        },
        cerrarModalCarpeta() {
          this.isModalCarpetaOpen = false;
        },
        
        async asignarACarpeta(carpeta) {
          try {
            await axios.post('/api/documentos/asignar-carpeta', {
              iddocumento: this.documentoSeleccionado.iddocumento,
              idcarpeta: carpeta.idcarpeta,
            });
            await this.obtenerDocumentos(); // Actualiza la lista de documentos
            this.cerrarModalCarpeta(); // Cierra el modal de selección de carpeta
          } catch (error) {
            console.error('Error al asignar el archivo a la carpeta:', error);
            alert('Error al asignar el archivo a la carpeta');
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
            await axios.delete(`/api/documentos/${this.documentoAEliminar.iddocumento}`);
            this.isConfirmationModalOpen = false;
            this.isSuccessModalOpen = true;
            this.obtenerDocumentos();
          } catch (error) {
            console.error("Error al eliminar el documento:", error);
            alert("Error al eliminar el documento");
          }
        },
        cerrarModalExito() {
          this.isSuccessModalOpen = false;
        },
    },

    mounted(){
        this.obtenerDocumentos();
        this.obtenerCarpetas();
    }
}
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
.card-subtitle .carpeta-asignada {
  color: #28a745;
  font-weight: bold;
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