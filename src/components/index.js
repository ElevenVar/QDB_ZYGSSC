/* eslint-disable */
import Vue from 'vue'
//------------------------------------特殊引用
import carousel from './other/dgg-carousel-item/item.vue'; // 单独引用 --dgg-carousel-item
import upload from './dgg-upload/src/main'
import bar from './baseComponent/dgg-tabs/tab-bar.vue'
import nav from './baseComponent/dgg-tabs/tab-nav.vue'
import pane from './baseComponent/dgg-tabs/tab-pane.vue'
import tooltip from './other/dgg-tooltip/main.js'
import pagination from './baseComponent/dgg-pagination/pagination.js'
// import switchs from './baseComponent/dgg-tabs/index.vue'

Vue.component('dgg-carousel-item', carousel);
Vue.component('dgg-upload', upload);
Vue.component('dgg-tooltip', tooltip);
Vue.component('dgg-tab-bar', bar);
Vue.component('dgg-tab-nav', nav);
Vue.component('dgg-tab-pane', pane);
Vue.component('dgg-pagination', pagination);
// Vue.component('dgg-switch', switchs);
//------------------------------------自动引用 所有index.vue的文件 ------------------
const files = require.context('.', true, /\index.vue$/)
try {
  files.keys().forEach(path => {
    if(files(path).default.name === 'dgg-milepost'){
    }
    if (path === './index.js') return
    Vue.component(files(path).default.name, files(path).default)
  })
} catch (e) {
  console.error('componet加载失败', e)
}


//------------------------------------手动引用
import Row from './baseComponent/dgg-row'; // --行
import Col from './baseComponent/dgg-col'; //
import Select from './baseComponent/dgg-select/select.vue'; //
import OptionGroup from './baseComponent/dgg-select/option-group.vue'; //
import Option from './baseComponent/dgg-select/option.vue'; //
import SelectDropdown from './baseComponent/dgg-select/select-dropdown.vue'; //

let components = [
  Row,
  Col,
  Select,
  OptionGroup,
  Option,
  SelectDropdown,
]

components.forEach(com => {
  Vue.component(com.name, com)
})
