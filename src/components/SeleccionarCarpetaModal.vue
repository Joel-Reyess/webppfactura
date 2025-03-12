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
  </div>
</template>

<script>
export default {
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
  methods: {
    cerrarModal() {
      this.$emit('cerrar-modal');
    },
    seleccionarCarpeta(carpeta) {
      this.$emit('seleccionar-carpeta', carpeta);
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>