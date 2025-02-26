import { createRouter, createWebHistory } from 'vue-router'
import  Login  from "../views/LoginAdmin.vue";
import  HomeAdmin  from "../views/HomeAdmin.vue";

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
