
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

import Vue from 'vue'
import Mint from 'mint-ui';
Vue.use(Mint);
import 'mint-ui/lib/style.css'
import App from './App'
import router from './router'

// import layer from 'vue2-layer-mobile'//此插件有毒
// Vue.use(layer)



import axios from 'axios' //引入axios
Vue.prototype.$ajax=axios //修改Vue的原型属性
Vue.config.productionTip = false

Vue.use(require('vue-wechat-title'))//每个页面设置标题
import store from './store/store.js';


// 在全局路由守卫中设置
router.beforeEach((to, from, next) => {
  if ((to.fullPath !== window.location.hash.slice(1)) && to.meta.isShare) {
    let href = window.location.href;
    href = href.replace(href.hash, ('#' + to.fullPath)); // hash模式下的页面路径拼接方式
    window.location.replace(href);
    next();
  }else{
    next();
  }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
