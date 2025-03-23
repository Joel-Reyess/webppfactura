import { createRouter, createWebHistory } from 'vue-router'
import  Login  from "../views/LoginAdmin.vue";
import  HomeAdmin  from "../views/HomeAdmin.vue";
import CarpetasAdmin from '../views/CarpetasAdmin.vue';
import RegisterUser from '../views/RegisterUser.vue';

const routes = [
    {
        path:'/',
        name:'Home',
        component: Login
    },
    {
        path:'/HomeAdmin',
        name:'HomeAdmin',
        component: HomeAdmin,
        meta: { requiresAuth: true },
    },
    {
        path:'/CarpetasAdmin',
        name:'CarpetasAdmin',
        component: CarpetasAdmin,
        meta: { requiresAuth: true },
    },
    {
        path:'/RegisterUser',
        name:'RegisterUser',
        component: RegisterUser
    },
    {
      path: '/carpeta/:id',
      name: 'ArchivosCarpeta',
      component: () => import('../views/ArchivosCarpeta.vue'),
      meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('token'); // Verifica si hay un token en localStorage
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      // Si la ruta requiere autenticación y el usuario no está autenticado
      next({ name: 'Home', query: { redirect: to.fullPath } }); // Redirige al usuario a la página de inicio de sesión
    } else {
      next(); // Permite el acceso a la ruta
    }
  });

export default router;
