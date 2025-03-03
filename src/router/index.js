import { createRouter, createWebHistory } from 'vue-router'
import  Login  from "../views/LoginAdmin.vue";
import  HomeAdmin  from "../views/HomeAdmin.vue";
import CarpetasAdmin from '../views/CarpetasAdmin.vue';

const routes = [
    {
        path:'/',
        name:'Home',
        component: Login
    },
    {
        path:'/HomeAdmin',
        name:'HomeAdmin',
        component: HomeAdmin
    },
    {
        path:'/CarpetasAdmin',
        name:'CarpetasAdmin',
        component: CarpetasAdmin
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
