// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import store from './store';
import router from './router';
import ElementUI from 'element-ui';

Vue.use(ElementUI, {size: 'small'});
Vue.config.productionTip = false;
// 覆写element-ui的message提示框
const msg = {
    default: {
        // 默认配置
        duration: 1000, //弹窗消失时间
        showClose: true //是否显示关闭按钮
    },
    initOption(option) {
        // 初始化配置
        let realOption = {};
        if ((typeof option == 'string') && option.constructor == String || (typeof option == 'number') && option.constructor == Number) {
            // 传参为字符串或者数字
            realOption = {...this.default, ... {message: option}};
        } else if ((typeof option == 'object') && option.constructor == Object) {
            // 传参为对象
            realOption = {...this.default, ...option};
        } else {
            return false;
        }
        return realOption;
    },
    error(option) {
        let realOption = this.initOption(option);
        if (realOption) {
            Vue.prototype.$message.error(realOption)
        }
    },
    info(option) {
        let realOption = this.initOption(option);
        if (realOption) {
            Vue.prototype.$message.info(realOption);
        }
    },
    success(option) {
        let realOption = this.initOption(option);
        if (realOption) {
            Vue.prototype.$message.success(realOption);
        }
    },
    warning(option) {
        let realOption = this.initOption(option);
        if (realOption) {
            Vue.prototype.$message.warning(realOption);
        }
    }
}
const message = function(option) {
    let realOption = msg.initOption(option);
    if (realOption) {
        Vue.prototype.$message(realOption)
    }
}
Object.assign(message, msg);
Vue.prototype.$msg = message;

//生成GUID
Vue.prototype.$generateUUID = function() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

// 广度遍历树，并分级。
Vue.prototype.$breadthTraversal = (data) => {
    if(data == null) {
        return [];
    }
    let result = [];
    let index = 0;
    // 深拷贝
    const resultParents = JSON.parse(JSON.stringify(data));

    const fn = (resultParents) => {
        if(resultParents.length > 0) {
            result.push({
                arr: resultParents,
                index: index
            });
            index++;
            let resultChildren = [];
            for(let i=0; i<resultParents.length; i++) {
                let item = resultParents[i];
                if(item.children!=null && item.children.length>0) {
                    resultChildren.push(...item.children);
                }
            }
            fn(resultChildren);
        }
    };
    
    fn(resultParents);

    return result;
};

// loading
const loadOj = {
    // 展示loading遮罩
    show() {
        store.commit('mLoadingCount', store.state.loadingCount+1);
    },
    // 隐藏loading遮罩
    hide() {
        store.commit('mLoadingCount', store.state.loadingCount-1);
    }
};
Vue.prototype.$loading = loadOj;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})