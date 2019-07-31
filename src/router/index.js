import Vue from 'vue'
import Router from 'vue-router'
import d3Page from '@/components/d3/index'
import tablePage from '@/components/table/index'

Vue.use(Router)
let router = {
    routes: [
        {
            path: '/',
            redirect: '/tablePage'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: {title: '自述文件'},
            children:[
                {
                    path: '/d3Page',
                    name: 'd3Page',
                    component: d3Page
                },
                {
                    path: '/tablePage',
                    name: 'tablePage',
                    component: tablePage
                },
            ]
        },
    ]
};

export default new Router(router);