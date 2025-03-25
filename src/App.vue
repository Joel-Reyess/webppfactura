<template>
  <router-link to="/"></router-link>
  <router-view></router-view>
</template>

<script>
import { onMounted, onUnmounted } from 'vue';
import { useDocumentStore } from './stores/documentStore';
import { useFolderStore } from './stores/folderStore';

export default {
  name: 'App',
  setup() {
    const documentStore = useDocumentStore();
    const folderStore = useFolderStore();

    const updateData = () => {
      if (navigator.onLine) {
        documentStore.fetchDocuments();
        folderStore.fetchFolders();
      }
    };

    onMounted(() => {
      // Actualizar al montar
      updateData();
      
      // Actualizar al conectar
      window.addEventListener('online', updateData);

      // Actualizar periódicamente
      const interval = setInterval(updateData, 300000); // 5 minutos

      onUnmounted(() => {
        clearInterval(interval);
        window.removeEventListener('online', updateData);
      });
    });
  }
}
</script>

<style>

</style>
