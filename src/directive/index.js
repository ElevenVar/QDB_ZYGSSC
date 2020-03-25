// 指令加载器
import Vue from 'vue'
/* eslint-disable */
const files = require.context('.', true, /\.js$/)

try {
    files.keys().forEach(path => {
        if (path === './index.js') return
        const key = path.split('/').pop().replace(/(\.\/|\.js)/g, '')
        Vue.directive(key, files(path).default)
    })
} catch (e) {
    console.error('directives加载失败', e)
}