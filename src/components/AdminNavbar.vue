<template>
  <nav class="navbar navbar-expand-lg  px-3 fixed-top">
    <button class="navbar-toggler d-md-none" type="button" @click="toggleSidebar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <button class="navbar-brand btn btn-link" @click="goToHome">
      <img src="../assets/pastelesdegaby.png" alt="Los Pasteles Caseros de Gaby" class="logo-img">
    </button>
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }">
      <form class="d-flex mx-auto" @submit.prevent="handleSearch">
        <input 
      class="form-control me-2" 
      type="search" 
      placeholder="Buscar por nombre" 
      aria-label="Buscar"
      v-model="searchTerm"
    >
    <input
      class="form-control me-2"
      type="date"
      v-model="searchDate"
      placeholder="Buscar por fecha"
    >
        <button class="btn btn-success" type="submit">Buscar</button>
        <button 
      class="btn btn-outline-secondary ms-2" 
      type="button" 
      @click="resetSearch"
      v-if="searchTerm || searchDate"
    >
      Limpiar
    </button>
      </form>
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
import myLogoUser from "../assets/usericon.svg?url";
import { isOnline, setupNetworkListener } from '../utils/network';

export default {
  setup(props, {emit}) {
    const isNavbarOpen = ref(false);
    const isDropdownOpen = ref(false);
    const isDropdownLeft = ref();
    const dropdown = ref(null);
    const dropdownMenu = ref(null);
    const searchTerm = ref("");
    const searchDate = ref("");

    const onlineStatus = ref(isOnline());

    const updateNetworkStatus = () => {
      onlineStatus.value = isOnline();
    };

    const goToHome = () => {
      router.push({ name: "HomeAdmin" });
    };

    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    };

    const toggleSidebar = () => {
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
        isDropdownLeft.value = spaceRight < menuRect.width;
      }
    };

    const logout = () => {
      console.log("Cerrando sesión...");
      // Elimina el token del localStorage
      localStorage.removeItem('token');
      // Redirige al usuario a la página de inicio de sesión
      router.push({ name: "Home" });
    };
    const handleSearch = () => {
      emit("search", {
        term: searchTerm.value,
        date: searchDate.value
      }); // Emite el término de búsqueda
    };
    const resetSearch = () => {
      searchTerm.value = "";
      searchDate.value = "";
      emit("search", { term: "", date: "" });
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
      setupNetworkListener(updateNetworkStatus);
    });

    onUnmounted(() => {
      document.removeEventListener("click", closeDropdown);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
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
      myLogoUser,
      searchTerm,
      searchDate,
      handleSearch,
      resetSearch,
      onlineStatus,
    };
  },
};
</script>

<style scoped>
/* Asegura que el dropdown se vea correctamente */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 160px;
  background-color: #dc3545;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 5px 0;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  display: block;
}
.dropdown-menu.dropdown-menu-left {
  right: auto;
  left: 0;
}
/* Oculta el dropdown cuando no está activo */
.dropdown {
  position: relative;
  overflow: visible;
}
.dropdown-item:hover {
  background-color: #c82333;
}

nav {
  overflow: visible;
  width: 100%;
  background-color: #F7F0F0;
  height: 80px; 
  z-index: 1001;
}

/* Imagen del logo responsiva */
.logo-img {
  width: 150px;
  height: auto;
  max-width: 100%;
}

/* Ajuste de tamaño en pantallas pequeñas */
@media (max-width: 768px) {
  .logo-img {
    width: 110px;
  }
  .navbar-collapse {
    position: fixed;
    top: 80px; /* Ajusta este valor según la altura del navbar */
    left: 0;
    width: 100%;
    background-color: #F7F0F0;
    z-index: 1000; /* Asegura que el menú esté por encima del contenido */
  }
  nav{
    background-color: #F7F0F0;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1001; /* Asegura que el menú esté por encima del navbar */
  }
}

.user-img {
  width: 24px;
  height: auto;
}

.navbar-collapse {
  transition: all 0.3s ease;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  outline: none;
}

</style>