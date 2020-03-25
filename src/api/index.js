// api出口文件

/*
 * api 引用
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @modules 动态自动引出全部请求文件
 */
import Notification from '@/componentsEl/notification/index.js';
const files = require.context('.', true, /\.js$/)

const modules = {}

try {
  files.keys().forEach(path => {
    if (path === './index.js' || path === './method.js') return
    modules[path.split('/').pop().replace(/(\.\/|\.js)/g, '')] = files(path)
  })
} catch (e) {
  console.log('api加载失败', e)
}

export default modules
