<template>
    <div class="container-fluid">
        <div class="row flex-nowrap">
            <!-- Botón para colapsar el sidebar en móviles -->
            <button class="navbar-toggler d-md-none" type="button" @click="toggleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Sidebar -->
            <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light sidebar" :class="{ 'd-none': !isNavbarOpen, 'd-md-block': true }">
                <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
                    <!-- Dropdown -->
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
                    <button type="button" class="btn btn-light">Página principal</button> 
                    <button type="button" class="btn btn-light" @click="goToCarpetas">Carpetas</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import router from '../router/index.js';


export default {
    setup() {
        const isDropdownOpen = ref(false);
        const isDropdownRight = ref(true); // Siempre se abre a la derecha
        const isNavbarOpen = ref(false); // Estado para controlar la visibilidad del sidebar
        const dropdown = ref(null);
        const dropdownMenu = ref(null);

        const toggleDropdown = (event) => {
            event.stopPropagation();
            isDropdownOpen.value = !isDropdownOpen.value;

            // Verifica si el menú se desborda a la derecha
            if (dropdownMenu.value && isDropdownOpen.value) {
                const dropdownRect = dropdown.value.getBoundingClientRect();
                const menuRect = dropdownMenu.value.getBoundingClientRect();
                const spaceRight = window.innerWidth - dropdownRect.right;

                // Si no hay suficiente espacio a la derecha, abre el menú hacia la izquierda
                isDropdownRight.value = spaceRight >= menuRect.width;
            }
        };

        const toggleNavbar = () => {
            isNavbarOpen.value = !isNavbarOpen.value; // Alternar la visibilidad del sidebar
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
        router.push({ name:'CarpetasAdmin'})
        }

        return {
            isDropdownOpen,
            isDropdownRight,
            isNavbarOpen,
            toggleDropdown,
            toggleNavbar,
            dropdown,
            goToCarpetas
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

/* Estilos para el botón de toggler en móviles */
.navbar-toggler {
    display: none; /* Ocultar por defecto */
}

@media (max-width: 767.98px) {
    .navbar-toggler {
        display: block; /* Mostrar solo en móviles */
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 1001; /* Asegurar que esté por encima del sidebar */
    }

    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 1000;
        transition: transform 0.3s ease;
    }

    .sidebar:not(.d-none) {
        transform: translateX(0); /* Mostrar el sidebar */
    }

    .sidebar.d-none {
        transform: translateX(-100%); /* Ocultar el sidebar */
    }
}
</style>