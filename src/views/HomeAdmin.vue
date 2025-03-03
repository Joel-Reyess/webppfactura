<template>
    <div>
        <!-- Navbar -->
        <AdminNavbar @toggle-sidebar="toggleSidebar"></AdminNavbar>

        <!-- Contenedor principal -->
        <div class="container-fluid">
            <div class="row flex-nowrap">
                <!-- Sidebar -->
                <AdminSidebar :is-sidebar-open="isSidebarOpen"></AdminSidebar>

                <!-- Contenido principal -->
                <div class="xl-6 main-content" :class="{ 'expanded': !isSidebarOpen }">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Archivos</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';

export default {
    name: 'HomeAdmin',
    components: {
        AdminNavbar,
        AdminSidebar
    },
    data() {
        return {
            isSidebarOpen: true, // Estado para controlar la visibilidad del sidebar
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen; // Alternar la visibilidad del sidebar
        }
    }
}
</script>

<style scoped>
/* Asegúrate de que el contenido principal ocupe el espacio restante */
.main-content {
    margin-left: 250px; /* Ajusta este valor según el ancho de tu sidebar */
    width: calc(100% - 250px); /* Asegura que el contenido no se desborde */
    padding: 20px; /* Espaciado interno */
    transition: margin-left 0.3s ease, width 0.3s ease; /* Transición suave */
}

.main-content.expanded {
    margin-left: 0; /* Cuando el sidebar está oculto */
    width: 100%; /* Ocupa todo el ancho */
}

@media (max-width: 767.98px) {
    .main-content {
        margin-left: 0; /* En móviles, el contenido ocupa todo el ancho */
        width: 100%; /* Asegura que el contenido ocupe todo el ancho */
    }

    .main-content.expanded {
        margin-left: 0; /* Asegura que no haya margen en móviles */
        width: 100%; /* Ocupa todo el ancho */
    }
}
</style>