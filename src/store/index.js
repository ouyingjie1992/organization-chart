import "babel-polyfill";
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

let tData = {
    showList: [

        {
            title: '二级部门',
            value: 'twoLevelDepartment'
        }, {
            title: '工号',
            value: 'jobNumber'
        }, {
            title: '出生日期',
            value: 'birthday'
        }, {
            title: '学历',
            value: 'education'
        }, {
            title: '院校层级',
            value: 'institutionalLevel'
        }, {
            title: '毕业时间',
            value: 'graduationTime'
        }, {
            title: '入职日期',
            value: 'dateOfEntry'
        }, {
            title: '工作地点',
            value: 'workingPlace'
        }, {
            title: '直接上级',
            value: 'directSuperior'
        }, {
            title: '目前月薪',
            value: 'currentMonthlySalary'
        }, {
            title: '最近调薪时间',
            value: 'recentSalary'
        }, {
            title: '能力等级',
            value: 'abilityLevel'
        }, {
            title: '绩效',
            value: 'performance'
        }
    ]

};
const store = new Vuex.Store({
    state: {
        tData: tData, //全局变量
    },
    mutations: {},
    actions: {}
});
export default store;