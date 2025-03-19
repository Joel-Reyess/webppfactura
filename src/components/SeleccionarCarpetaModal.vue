<template>
  <div class="modal" tabindex="-1" role="dialog" :class="{ 'd-block': isOpen }">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Seleccionar carpeta</h5>
          <button type="button" class="close" @click="cerrarModal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <li
              v-for="carpeta in carpetas"
              :key="carpeta.idcarpeta"
              class="list-group-item list-group-item-action"
              @click="seleccionarCarpeta(carpeta)"
            >
              {{ carpeta.nombrecarpeta }}
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cerrarModal">Cerrar</button>
        </div>
      </div>
    </div>
    <ConfirmationModal
      :isOpen="isConfirmationModalOpen"
      title="Asignar archivo"
      message="¿Estás seguro de que deseas asignar este archivo a la carpeta seleccionada?"
      @close-modal="cerrarModalConfirmacion"
      @confirm-action="confirmarAsignacion"
    />
  </div>
</template>

<script>
import ConfirmationModal from './ConfirmationModal.vue';
export default {
  components: {
    ConfirmationModal,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    carpetas: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isConfirmationModalOpen: false,
      carpetaSeleccionada: null,
    };
  },
  methods: {
    cerrarModal() {
      this.$emit('cerrar-modal');
    },
    seleccionarCarpeta(carpeta) {
      this.carpetaSeleccionada = carpeta; // Almacena la carpeta seleccionada
      this.isConfirmationModalOpen = true; // Abre el modal de confirmación
    },
    cerrarModalConfirmacion() {
      this.isConfirmationModalOpen = false; // Cierra el modal de confirmación
      this.carpetaSeleccionada = null; // Limpia la carpeta seleccionada
    },
    confirmarAsignacion() {
      if (this.carpetaSeleccionada) {
        this.$emit('seleccionar-carpeta', this.carpetaSeleccionada); // Emite el evento de confirmación
        this.isConfirmationModalOpen = false; // Cierra el modal de confirmación
      }
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>