import Vue from 'vue'
import Router from 'vue-router'
import homePage from '@/components/home/index'
import testPage from '@/components/test/chart'

Vue.use(Router)
let router = {
    routes: [
        {
            path: '/',
            name: 'homePage',
            component: homePage
        },
        {
            path: '/test',
            name: 'test',
            component: testPage
        },
    ]
};

export default new Router(router);