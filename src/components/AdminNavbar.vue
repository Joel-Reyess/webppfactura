<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
    <!-- Logo -->
    <a class="navbar-brand" href="#">
      <img src="https://via.placeholder.com/100x30" alt="Logo" class="d-inline-block align-top">
    </a>

    <!-- Botón de menú para móviles -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Contenido de la Navbar -->
    <div class="collapse navbar-collapse" id="navbarContent">
      <!-- Campo de búsqueda -->
      <form class="form-inline mx-auto my-2 my-lg-0">
        <div class="input-group">
          <input type="search" class="form-control" placeholder="Buscar en Drive" aria-label="Search">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>

      <!-- Iconos de acciones -->
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">
            <i class="fas fa-bell"></i>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">
            <i class="fas fa-cog"></i>
          </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img src="https://via.placeholder.com/30x30" alt="User" class="rounded-circle">
          </a>
          <!-- Menú desplegable del perfil -->
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Mi perfil</a>
            <a class="dropdown-item" href="#">Configuración</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" @click="logout">Cerrar sesión</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name:'AdminNavbar'
}

</script>

<style scoped>
.navbar-brand img {
  height: 30px;
}

.nav-link img {
  height: 30px;
}

.dropdown-menu {
  min-width: 200px;
}
</style>