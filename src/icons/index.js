/*
 * icon注册
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *
 */

import Vue from 'vue'
import dggIcon from '@/components/other/dgg-icon' // svg组件

// 全局注册
Vue.component('dgg-icon', dggIcon)

const hasColor = require.context('./svg/hasColor', true, /\.svg$/) // 获取 自带颜色的svg库 true读子文件夹 false不读子文件夹
const noColor = require.context('./svg/noColor', true, /\.svg$/) //  获取 不带颜色的svg库 true读子文件夹  false不读子文件夹

const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(noColor)
requireAll(noColor).forEach(item => { // 默认清空 path 文件的 fill 属性
    if (item.default.node && item.default.node.childNodes) {
        item.default.node.childNodes.forEach(el => {
            if (el.nodeName === 'title') {
                item.default.node.removeChild(el)
            }
            el.nodeName === 'path' && el.setAttribute('fill', '')
        })
    }
})
requireAll(hasColor)

requireAll(hasColor).forEach(item => { // 默认清空 path 文件的 fill 属性
    if (item.default.node && item.default.node.childNodes) {
        item.default.node.childNodes.forEach(el => {
            if (el.nodeName === 'title') {
                item.default.node.removeChild(el)
            }
        })
    }
})