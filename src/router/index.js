import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SelectDataView from '@/views/SelectDataView.vue'
import GradeTableView from '@/views/GradeTableView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/select',
        name: 'select',
        component: SelectDataView
    },
    {
        path: '/grade',
        name: 'grade',
        component: GradeTableView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
