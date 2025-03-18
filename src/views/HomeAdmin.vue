<template>
    <div>
        <AdminNavbar @toggle-sidebar="toggleSidebar"></AdminNavbar>
        <div class="container-fluid">
            <div class="row flex-nowrap">
                <AdminSidebar :is-sidebar-open="isSidebarOpen"></AdminSidebar>
                <div class="col main-content" :class="{ 'expanded': !isSidebarOpen }">
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
    </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';
import axios from '../utils/axios.js';
import ModalDoc from '../components/ModalDoc.vue';
import SeleccionarCarpetaModal from '../components/SeleccionarCarpetaModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';

export default {
    name: 'HomeAdmin',
    components: {
        AdminNavbar,
        AdminSidebar,
        ModalDoc,
        SeleccionarCarpetaModal,
        ConfirmationModal
    },
    data() {
        return {
            isSidebarOpen: true,
            documentos: [],
            isModalOpen: false,
            selectedFileUrl: '',
            isModalCarpetaOpen: false,
            carpetas: [],
            documentoSeleccionado: null,
            isConfirmationModalOpen: false, // Estado para el modal de confirmación
            isSuccessModalOpen: false, // Estado para el modal de éxito
            documentoAEliminar: null,
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },

        async obtenerDocumentos(){
            try {
                const response = await axios.get('/api/documentos');
                this.documentos = response.data;
                this.obtenerDocumentos();
            } catch (error) {
                console.log("Error al obtener los documentos", error);
            }
        },

        async obtenerCarpetas() {
          try {
            const response = await axios.get('/api/folders');
            this.carpetas = response.data;
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
            alert('Archivo asignado a la carpeta correctamente');
            this.cerrarModalCarpeta();
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