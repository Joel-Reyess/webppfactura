<template>
    <div class="sidebar" :class="{ 'd-none': !isSidebarOpen, 'd-md-block': true }">
      <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
        <div class="dropdown pb-4" ref="dropdown">
          <button type="button" class="btn btn-light" @click="toggleDropdown">Nuevo</button>  
          <ul 
            class="dropdown-menu" 
            :class="{ 'dropdown-menu-right': isDropdownRight }" 
            v-show="isDropdownOpen" 
            ref="dropdownMenu"
          >
            <li><button type="button" class="dropdown-item btn btn-outline-secondary" @click="triggerFileInput">Subir archivo</button>
              <input type="file" ref="fileInput" style="display: none;" @change="handleFileUpload" /></li>
            <li><button type="button" class="dropdown-item btn btn-outline-secondary">Crear carpeta</button></li>
          </ul>      
        </div>
        <button type="button" class="btn btn-light" @click="goToHome">Página principal</button> 
        <button type="button" class="btn btn-light" @click="goToCarpetas">Carpetas</button>
      </div>
    </div>
  </template>
  <script>
  import { ref, onMounted, onUnmounted } from "vue";
  import router from '../router/index.js';
  //import axios from 'axios';

  export default {
    props: {
      isSidebarOpen: {
        type: Boolean,
        required: true
      }
    },
    setup() {
      const isDropdownOpen = ref(false);
      const isDropdownRight = ref(true);
      const dropdown = ref(null);
      const dropdownMenu = ref(null);
      //const fileInput = ref(null);
      //const selectedFile = ref(null);
  
      const toggleDropdown = (event) => {
        event.stopPropagation();
        isDropdownOpen.value = !isDropdownOpen.value;
  
        if (dropdownMenu.value && isDropdownOpen.value) {
          const dropdownRect = dropdown.value.getBoundingClientRect();
          const menuRect = dropdownMenu.value.getBoundingClientRect();
          const spaceRight = window.innerWidth - dropdownRect.right;
          isDropdownRight.value = spaceRight >= menuRect.width;
        }
      };
  
      const closeDropdown = (event) => {
        if (
          dropdown.value &&
          dropdownMenu.value &&
          !dropdown.value.contains(event.target) &&
          !dropdownMenu.value.contains(event.target)
        ) {
          isDropdownOpen.value = false;
        }
      };

    //   const triggerFileInput = () => {
    //   fileInput.value.click(); // Simula el clic en el input de archivo
    // };

    // const handleFileUpload = (event) => {
    //   selectedFile.value = event.target.files[0]; // Almacena el archivo seleccionado
    //   uploadFile(); // Llama a la función para subir el archivo
    // };

    // const uploadFile = async () => {
    //   if (!selectedFile.value) return;

    //   const formData = new FormData();
    //   formData.append('file', selectedFile.value);

    //   try {
    //     const response = await axios.post('http://tu-api.com/upload', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });
    //     console.log('Archivo subido con éxito:', response.data);
    //   } catch (error) {
    //     console.error('Error al subir el archivo:', error);
    //   }
    // };
  
      onMounted(() => {
        document.addEventListener("click", closeDropdown);
      });
  
      onUnmounted(() => {
        document.removeEventListener("click", closeDropdown);
      });
  
      const goToCarpetas = () => {
        router.push({ name: 'CarpetasAdmin' });
      };
  
      const goToHome = () => {
        router.push({ name: 'HomeAdmin' });
      };
  
      return {
        isDropdownOpen,
        isDropdownRight,
        toggleDropdown,
        dropdown,
        //fileInput,
        //triggerFileInput,
        //handleFileUpload,
        goToCarpetas,
        goToHome
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el sidebar */
.bg-light {
    background-color: #f8f9fa;
}

/* Estilos para el dropdown */
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%; 
    left: 0; 
    z-index: 1000;
    min-width: 160px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 5px 0;
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    display: block; 
}

.dropdown-menu.dropdown-menu-right {
    right: auto;
    left: 0; 
}

/* Estilos para los elementos del dropdown */
.dropdown-item {
    display: block;
    width: 100%;
    padding: 0.5rem 1rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    text-align: left; 
}

.dropdown-item:hover {
    background-color: #f8f9fa; 
}

.btn-light {
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}

.btn-light:hover {
    background-color: #e2e6ea;
    border-color: #dae0e5;
}
  .sidebar {
    width: 250px; 
    position: fixed; 
    top: 80px; 
    left: 0;
    height: calc(100vh - 60px); 
    z-index: 1000; 
    background-color: #f8f9fa; 
    transition: transform 0.3s ease; 
  }
  
  @media (max-width: 767.98px) {
    .sidebar {
      transform: translateX(-100%); 
    }
  
    .sidebar:not(.d-none) {
      transform: translateX(0);
    }
  }
  </style>