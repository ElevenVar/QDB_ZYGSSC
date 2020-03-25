/*
 * mainjs
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *  初始化vue
 */

import Vue from 'vue'
import '@/assets/theme/index.css'
import '@/assets/less/preset.less'
import '@/assets/less/public.less'
import 'zTree/css/zTreeStyle/zTreeStyle.css'
// import '@/assets/less/dggpublic.less'
import '@/assets/less/main.less'
import 'select2/src/scss/core.scss'

// 3.0兼容
// import 'static/dggui.js'
import '@/assets/3.0/dggui.scss'

import App from './App'
import store from './store'
import router from './router'
// import Element from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import 'jquery'

// 加载i18n

import {
  i18n
} from '@/store/plugins/i18n'

import './icons'

// 加载组件
import '@/components'
import '@/componentsEl/src'

// 加载指令
import '@/directive'

// 加载过滤器
import '@/filters'

// 加载事件监听器
import eventBus from '@/service/eventBus'
Date.myTime = function(time) {
  console.log(time);
  let day = parseInt(time / (1000 * 60 * 60 * 24));
  let hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  hours = hours + day * 24;
  hours < 0 && (hours = 0);
  hours < 10 && (hours = '0' + hours.toString());
  let minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  minutes < 0 && (minutes = 0);
  minutes < 10 && (minutes = '0' + minutes.toString());
  let seconds = parseInt((time % (1000 * 60)) / 1000);
  seconds < 0 && (seconds = 0);
  seconds < 10 && (seconds = '0' + seconds.toString());
  return hours + ':' + minutes + ':' + seconds;
}
// Date.myFormat = function(timestamp, formats) {
//     // formats格式包括
//     // 1. Y-m-d
//     // 2. Y-m-d H:i:s
//     // 3. Y年m月d日
//     // 4. Y年m月d日 H时i分
//     formats = formats || 'Y-m-d';
//
//     var zero = function (value) {
//       if (value < 10) {
//         return '0' + value;
//       }
//       return value;
//     };
//
//     var myDate = timestamp? new Date(timestamp): new Date();
//
//     var year = myDate.getFullYear();
//     var month = zero(myDate.getMonth() + 1);
//     var day = zero(myDate.getDate());
//
//     var hour = zero(myDate.getHours());
//     var minite = zero(myDate.getMinutes());
//     var second = zero(myDate.getSeconds());
//
//     return formats.replace(/Y|m|d|H|i|s/ig, function (matches) {
//       return ({
//         Y: year,
//         m: month,
//         d: day,
//         H: hour,
//         i: minite,
//         s: second
//       })[matches];
//     });
//   };

Vue.prototype.$eventBus = eventBus
Vue.prototype.$bus = new Vue()

/*eslint no-extend-native: ["error", { "exceptions": ["Number"] }]*/
Number.prototype.toFixed = function (n = 2) {
  n = n ? parseInt(n) : 0;
  if (n <= 0) {
    return Math.round(this);
  }
  return Math.round(this * Math.pow(10, n)) / Math.pow(10, n);
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
