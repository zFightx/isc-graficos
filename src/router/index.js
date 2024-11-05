import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SelectDataView from '@/views/SelectDataView.vue'
import GradeTableView from '@/views/GradeTableView.vue'
import store from '@/store'

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
});

router.beforeEach((to, from, next) => {
    if((to.name === 'select' || to.name === 'grade') && store.state.fileTable.length == 0){
        next({name: 'home'});
    }
    else{
        next();
    }
});

export default router
