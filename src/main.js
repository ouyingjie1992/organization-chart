// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';

Vue.use(ElementUI, { size: 'small' });
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
            realOption = {...this.default, ... { message: option } };
        } else if ((typeof option == 'object') && option.constructor == Object) {
            // 传参为对象
            realOption = {...this.default, ...option };
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

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})