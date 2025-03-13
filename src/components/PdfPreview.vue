<template>
  <div>
    <canvas ref="pdfCanvas" class="pdf-canvas"></canvas>
    <a :href="pdfUrl" target="_blank" class="btn btn-primary mt-3">Ver PDF completo</a>
  </div>
</template>

<script>
import * as pdfjsLib from 'pdfjs-dist';

// Configura el worker usando una URL de la CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.js';

export default {
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pdfDoc: null,
      pageRendering: false,
      pageNum: 1, // Mostrar la primera página
      scale: 1.5, // Escala para la vista previa
    };
  },
  mounted() {
    this.loadPdf();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    async loadPdf() {
      try {
        const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
        this.pdfDoc = await loadingTask.promise;
        this.renderPage(this.pageNum);
      } catch (error) {
        console.error('Error al cargar el PDF:', error);
      }
    },
    async renderPage(pageNum) {
      this.pageRendering = true;
      const page = await this.pdfDoc.getPage(pageNum);

      // Escala el canvas para que se ajuste al ancho del contenedor
      const viewport = page.getViewport({ scale: this.scale });
      const canvas = this.$refs.pdfCanvas;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Renderiza la página en el canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      this.pageRendering = false;
    },
    handleResize() {
    if (this.pdfDoc) {
      this.renderPage(this.pageNum);
    }
  },
  },
  beforeUnmount() {
  window.removeEventListener('resize', this.handleResize);
},
};
</script>

<style scoped>
.pdf-canvas {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>