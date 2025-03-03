<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <button class="navbar-toggler d-md-none" type="button" @click="toggleSidebar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <!-- Botón Navbar -->
    <button class="navbar-brand btn btn-link" @click="goToHome">
      <img src="../assets/pastelesdegaby.png" alt="Los Pasteles Caseros de Gaby" class="logo-img">
    </button>

    <!-- Botón para colapsar en móviles -->
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }">
      
      <!-- Buscador -->
      <form class="d-flex mx-auto">
        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
        <button class="btn btn-success" type="submit">Buscar</button>
      </form>

      <!-- Dropdown -->
      <div class="dropdown position-relative " ref="dropdown">
        <button class="btn btn-secondary dropdown-toggle" @click="toggleDropdown">
          <img :src="myLogoUser" alt="Usuario" class="user-img"/>
        </button>
        <ul 
          class="dropdown-menu list-group" 
          :class="{ 'dropdown-menu-left': isDropdownLeft }" 
          v-show="isDropdownOpen" 
          ref="dropdownMenu"
        >
          <li class=""><button class="dropdown-item btn btn-danger" @click="logout">Cerrar Sesión</button></li>
        </ul>
      </div>

    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import router from "../router/index.js";
import myLogoUser from "../assets/usericon.svg";

export default {
  setup(props, {emit}) {
    const isNavbarOpen = ref(false);
    const isDropdownOpen = ref(false);
    const isDropdownLeft = ref();
    const dropdown = ref(null);
    const dropdownMenu = ref(null);

    const goToHome = () => {
      router.push({ name: "HomeAdmin" });
    };

    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    };

    const toggleSidebar = () => {
      // Emitir evento para alternar el sidebar
      emit('toggle-sidebar');
    };
    const toggleDropdown = (event) => {
      event.stopPropagation();
      isDropdownOpen.value = !isDropdownOpen.value;

      // Verifica si el menú se desborda a la derecha
      if (dropdownMenu.value && isDropdownOpen.value) {
        const dropdownRect = dropdown.value.getBoundingClientRect();
        const menuRect = dropdownMenu.value.getBoundingClientRect();
        const spaceRight = window.innerWidth - dropdownRect.right;

        // Si no hay suficiente espacio a la derecha, abre el menú hacia la izquierda
        isDropdownLeft.value = spaceRight < menuRect.width;
      }
    };

    const logout = () => {
      console.log("Cerrando sesión...");
      // Aquí puedes agregar la lógica para cerrar sesión
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

    return {
      isNavbarOpen,
      isDropdownOpen,
      isDropdownLeft,
      goToHome,
      toggleNavbar,
      toggleSidebar,
      toggleDropdown,
      logout,
      dropdown,
      myLogoUser
    };
  },
};
</script>

<style scoped>
/* Asegura que el dropdown se vea correctamente */
.dropdown-menu {
  position: absolute;
  top: 100%; /* Coloca el menú debajo del botón */
  right: 0; /* Alinea el menú a la derecha del contenedor */
  z-index: 1000;
  min-width: 160px;
  background-color: #dc3545;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 5px 0;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  display: block; /* Asegúrate de que el menú sea visible */
}
.dropdown-menu.dropdown-menu-left {
  right: auto;
  left: 0;
}
/* Oculta el dropdown cuando no está activo */
.dropdown {
  position: relative;
  overflow: visible; /* Asegúrate de que el menú no se corte */
}
.dropdown-item:hover {
  background-color: #c82333; /* Cambia el color de fondo al hacer hover */
}

nav {
  overflow: visible; /* Asegúrate de que el dropdown no se corte */
  width: 100%;
  background-color: #F7F0F0;
  height: 80px; 
}

/* Imagen del logo responsiva */
.logo-img {
  width: 150px;  /* Tamaño base */
  height: auto;
  max-width: 100%;
}

/* Ajuste de tamaño en pantallas pequeñas */
@media (max-width: 768px) {
  .logo-img {
    width: 40px;  /* Reducir en móviles */
  }
}

.user-img {
  width: 24px;
  height: auto;
}

.navbar-collapse {
  transition: all 0.3s ease; /* Agrega una transición suave */
}

.navbar-toggler {
  border: none; /* Elimina el borde del botón */
}

.navbar-toggler:focus {
  outline: none; /* Elimina el contorno al hacer clic */
}

</style>