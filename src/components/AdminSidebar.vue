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
            <li><button type="button" class="dropdown-item btn btn-outline-secondary">Subir archivo</button></li>
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
        goToCarpetas,
        goToHome
      };
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el sidebar */
.bg-light {
    background-color: #f8f9fa; /* Color de fondo claro */
}

/* Estilos para el dropdown */
.dropdown {
    position: relative;
}

.dropdown-menu {
    position: absolute;
    top: 100%; /* Coloca el menú debajo del botón */
    left: 0; /* Alinea el menú a la izquierda por defecto */
    z-index: 1000;
    min-width: 160px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 5px 0;
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
    display: block; /* Asegúrate de que el menú sea visible */
}

.dropdown-menu.dropdown-menu-right {
    right: auto;
    left: 0; /* Alinea el menú a la derecha */
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
    text-align: left; /* Alinea el texto a la izquierda */
}

.dropdown-item:hover {
    background-color: #f8f9fa; /* Cambia el color de fondo al hacer hover */
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
    width: 250px; /* Ancho fijo para el sidebar */
    position: fixed; /* Posición fija para que no se mueva con el scroll */
    top: 80px; /* Ajusta este valor según la altura del navbar */
    left: 0;
    height: calc(100vh - 60px); /* Altura completa de la ventana menos la altura del navbar */
    z-index: 1000; /* Asegura que esté por encima del contenido */
    background-color: #f8f9fa; /* Color de fondo */
 /* Permite el scroll si el contenido es muy largo */
    transition: transform 0.3s ease; /* Transición suave */
  }
  
  @media (max-width: 767.98px) {
    .sidebar {
      transform: translateX(-100%); /* Oculta el sidebar por defecto en móviles */
    }
  
    .sidebar:not(.d-none) {
      transform: translateX(0); /* Muestra el sidebar cuando está abierto */
    }
  }
  </style>