<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    
    <!-- Botón Navbar -->
    <button class="navbar-brand btn btn-link" @click="goToHome">Navbar</button>

    <!-- Botón para colapsar en móviles -->
    <button class="navbar-toggler" type="button" @click="toggleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" v-show="isNavbarOpen">
      
      <!-- Buscador -->
      <form class="d-flex mx-auto">
        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Buscar">
        <button class="btn btn-outline-success" type="submit">Buscar</button>
      </form>

      <!-- Dropdown -->
      <div class="dropdown position-relative" ref="dropdown">
        <button class="btn btn-secondary dropdown-toggle" @click="toggleDropdown">
          <img :src="myLogoUser" alt="Usuario" style="width: 24px; height: auto" />
        </button>
        <ul class="dropdown-menu" v-show="isDropdownOpen">
          <li><button class="dropdown-item" @click="logout">Cerrar Sesión</button></li>
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
  setup() {
    const isNavbarOpen = ref(false);
    const isDropdownOpen = ref(false);
    const dropdown = ref(null);

    const goToHome = () => {
      router.push({ name: "HomeAdmin" });
    };

    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    };

    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    const logout = () => {
      console.log("Cerrando sesión...");
      // Aquí puedes agregar la lógica para cerrar sesión
    };

    const closeDropdown = (event) => {
      if (dropdown.value && !dropdown.value.contains(event.target)) {
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
      goToHome,
      toggleNavbar,
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
  display: block;
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
}

/* Oculta el dropdown cuando no está activo */
.dropdown-menu:not([v-show="true"]) {
  display: none;
}
</style>