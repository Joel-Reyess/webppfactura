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
        component: HomeAdmin
    },
    {
        path:'/CarpetasAdmin',
        name:'CarpetasAdmin',
        component: CarpetasAdmin
    },
    {
        path:'/RegisterUser',
        name:'RegisterUser',
        component: RegisterUser
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
