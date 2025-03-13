<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <span class="close-button" @click="closeModal">&times;</span>
      <div v-if="isPdf(fileUrl)" class="modal-iframe-container">
        <iframe :src="fileUrl" frameborder="0" class="modal-iframe" name="pdf-viewer"></iframe>
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
    fileUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fileContent: '', // Contenido del archivo de texto
    };
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
    },
    isPdf(url) {
      return url.endsWith('.pdf');
    },
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
    },
    isVideo(url) {
      return /\.(mp4|webm|ogg)$/i.test(url);
    },
    isText(url) {
      return /\.(txt|json|xml|html|css|js)$/i.test(url);
    },
    getVideoType(url) {
      if (url.endsWith('.mp4')) return 'video/mp4';
      if (url.endsWith('.webm')) return 'video/webm';
      if (url.endsWith('.ogg')) return 'video/ogg';
      return '';
    },
    async loadTextFile(url) {
      const response = await fetch(url);
      this.fileContent = await response.text();
    },
  },
  watch: {
    fileUrl: {
      immediate: true,
      handler(url) {
        if (this.isText(url)) {
          this.loadTextFile(url);
        }
      },
    },
  },
};
</script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-iframe-container,
.modal-image-container,
.modal-video-container,
.modal-text-container {
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-iframe,
.modal-image,
.modal-video {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-text-container pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: monospace;
}

.modal-unsupported {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

@media (max-width: 767.98px) {
  .modal-content {
    width: 95%;
    padding: 10px;
  }

  .modal-iframe-container,
  .modal-image-container,
  .modal-video-container,
  .modal-text-container {
    height: 60vh;
  }

  iframe {
    width: 100%,
  }
}
</style>