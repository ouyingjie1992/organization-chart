import Vue from 'vue'
import Router from 'vue-router'
import d3Page from '@/components/d3/index'
import tablePage from '@/components/table/index'

Vue.use(Router)
let router = {
    routes: [
        {
            path: '/d3Page',
            name: 'd3Page',
            component: d3Page
        },
        {
            path: '/',
            name: 'tablePage',
            component: tablePage
        },
    ]
};

export default new Router(router);