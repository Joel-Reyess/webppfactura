<template>
    <div>
        <AdminNavbar @toggle-sidebar="toggleSidebar"></AdminNavbar>
        <div class="container-fluid">
            <div class="row flex-nowrap">
                <AdminSidebar :is-sidebar-open="isSidebarOpen"></AdminSidebar>
                <div class="col main-content" :class="{ 'expanded': !isSidebarOpen }">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Archivo 1</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" class="card-link">Card link</a>
                                    <a href="#" class="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Archivo 2</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" class="card-link">Card link</a>
                                    <a href="#" class="card-link">Another link</a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Archivo 3</h5>
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
            isSidebarOpen: true,
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        }
    }
}
</script>

<style scoped>
.main-content {
    margin-left: 250px;
    width: calc(100% - 250px);
    padding: 20px;
    transition: margin-left 0.3s ease, width 0.3s ease;
    margin-top: 80px;
}

.main-content.expanded {
    margin-left: 0;
    width: 100%;
}

@media (max-width: 767.98px) {
    .main-content {
        margin-left: 0;
        width: 100%;
        margin-top: 80px;
    }

    .main-content.expanded {
        margin-left: 0;
        width: 100%;
    }
}
</style>