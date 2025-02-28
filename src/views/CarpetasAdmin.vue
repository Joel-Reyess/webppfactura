<template>
    <div>
        <AdminNavbar></AdminNavbar>
        <p>Carpetas</p>
        <AdminSidebar></AdminSidebar>
    </div>
</template>

<script>
import AdminNavbar from '../components/AdminNavbar.vue';
import AdminSidebar from '../components/AdminSidebar.vue';

    export default {
        name:'App',
        components:{
            AdminNavbar,
            AdminSidebar
        }

    }
</script>

<style lang="scss" scoped>

</style>