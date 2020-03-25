// 自定义右键菜单

import {
  default as ContentBox
} from '@/components/other/contentBox/contentBox.js'
import Vue from 'vue'

function createContentBox(el, binding, vnode) {
  el[`$${name}`] && el[`$${name}`].destroy()
  Vue.nextTick(() => {
    const options = binding.value
    el[`$${name}`] = new ContentBox(el, options, vnode)
  })
}
const contentBox = {
  bind(el, binding) {
    // console.log('contentBox bind')
  },
  inserted: function(el, binding, vnode) {
    createContentBox(el, binding, vnode)
  },
  componentUpdated: function(el, binding, vnode) {
    // console.log('contentBox componentUpdated')
    createContentBox(el, binding, vnode)
  },
  unbind(el, binding) {
    // console.log('contentBox unbind')
    el[`$${name}`] && el[`$${name}`].destroy()
  }
}

export default contentBox
