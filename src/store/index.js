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
// loading遮罩清除定时器
let loadingCountSetTime = null;
const store = new Vuex.Store({
    state: {
        tData: tData, //全局变量
        loadingCount: 0,//loading遮罩请求计数，>0则展示遮罩
    },
    mutations: {
        mLoadingCount(state, n) {
            let val = n;
            // 预防意外情况下计算错误出现负数，从而影响之后的loading使用
            if(val < 0) {
                val = 0;
            }
            state.loadingCount = val;
            // 清除遮罩-定时器，防止特殊场景下遮罩状态错误
            clearTimeout(loadingCountSetTime);
            // 超时时间设定与axios.defaults.timeout保持一致
            const overtime = 60000;
            loadingCountSetTime = setTimeout(()=>{
                state.loadingCount = 0;
            }, overtime);
        },
    },
    actions: {},
});
export default store;