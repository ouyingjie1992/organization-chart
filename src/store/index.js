import "babel-polyfill";
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

let tData = {
    showList: [

        {
            title: 'J',
            value: 'post'
        }, {
            title: 'D2',
            value: 'twoLevelDepartment'
        }, {
            title: '工号',
            value: 'jobNumber'
        }, {
            title: 'B',
            value: 'birthday'
        }, {
            title: 'E',
            value: 'education'
        }, {
            title: 'G',
            value: 'graduationTime'
        }, {
            title: 'OD',
            value: 'dateOfEntry'
        }, {
            title: 'L',
            value: 'workingPlace'
        }, {
            title: 'P',
            value: 'currentMonthlySalary'
        }, {
            title: 'PT',
            value: 'recentSalary'
        }, {
            title: 'PJ',
            value: 'abilityLevel'
        }, {
            title: 'QL',
            value: 'potentialRating'
        }, {
            title: '绩效',
            value: 'performance'
        }, {
            title: 'ps',
            value: 'ps'
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