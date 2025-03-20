<template>
  <div>
    <h2>Resultados de búsqueda</h2>
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
</template>

<script>
export default {
  props: {
    filteredDocumentos: {
      type: Array,
      required: true,
    },
  },
  methods: {
    openModal(fileName) {
      this.$emit('open-modal', fileName);
    },
    abrirModalAsignarCarpeta(documento) {
      this.$emit('abrir-modal-asignar-carpeta', documento);
    },
    abrirModalConfirmacion(documento) {
      this.$emit('abrir-modal-confirmacion', documento);
    },
  },
};
</script>