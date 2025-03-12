<template>
  <div>
    <AdminNavbar></AdminNavbar>
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <AdminSidebar :is-sidebar-open="true"></AdminSidebar>
        <div class="col main-content">
          <h2>Archivos de la carpeta</h2>
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
    };
  },
  methods: {
    async obtenerDocumentosDeCarpeta() {
      try {
        const response = await axios.get(`/api/documentos/carpeta/${this.$route.params.id}`);
        this.documentos = response.data;
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
  },
  mounted() {
    this.obtenerDocumentosDeCarpeta();
  },
};
</script>