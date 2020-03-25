import TEMPLATE from './template'
// import { setStyle } from '@/utils/helper.js'
const NAMESPACE = 'contentBox'
import lodash from 'lodash'


function forEach(data, callback) {
    if (data && typeof callback === 'function') {
        if (Array.isArray(data) || lodash.isNumber(data.length) /* array-like */ ) {
            const { length } = data
            let i

            for (i = 0; i < length; i += 1) {
                if (callback.call(data, data[i], i, data) === false) {
                    break
                }
            }
        } else if (lodash.isObject(data)) {
            Object.keys(data).forEach((key) => {
                callback.call(data, data[key], key, data)
            })
        }
    }
    return data
}

function setStyle(element, styles) {
    const REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/

    const { style } = element
    forEach(styles, (value, property) => {
        if (REGEXP_SUFFIX.test(property) && lodash.isNumber(value)) {
            value += 'px'
        }
        style[property] = value
    })
}




const defaultList = [{
        type: 'delAll',
        title: '删除全部',
    }]
    // example option
    // contentBoxOption: {
    //     parentClass: 'el-tabs__nav',
    //     menuList:[
    //       {
    //         title: '11111',
    //         type: '1',
    //         callback:(el)=>{
    //           console.log(el, 'tt11111')
    //         },
    //       },
    //       {
    //         title: '2222',
    //         type: '2',
    //         callback:(el)=>{
    //           console.log(el, 'tt22222')
    //         },
    //       },
    //     ],
    //   },
class ContentBox　 {
    constructor(element, options = {}, vnode = null) {
        if (!element || element.nodeType !== 1) {
            throw new Error('The first argument is required and must be an element.')
        }
        this.element = element
        this.options = options
        this.vnode = vnode
        this.init()
    }
    init() {
        const { element, options, vnode } = this
        let el = null
        let template = null
        if (this.options && this.options.parentClass) {
            el = element.querySelector('.' + this.options.parentClass)
        }
        const parent = el ? el : element.parentNode
        if (element.querySelector(`.${NAMESPACE}-waper`)) {
            return
        }
        template = document.createElement('div')
        template.innerHTML = TEMPLATE
        this.parent = parent
        const contentBox = element.querySelector(`.${NAMESPACE}-waper`) ? element.querySelector(`.${NAMESPACE}-waper`) : template.querySelector(`.${NAMESPACE}-waper`)
        if (!options.menuList) {
            defaultList.forEach((item, index) => {
                contentBox.innerHTML += `<li class="${NAMESPACE}-list" contentboxindex=${index} >${item.title}` + `</li>`
            })
        } else {
            options.menuList.forEach((item, index) => {
                let addClass = ''
                if (typeof item.disable === 'function') {
                    addClass = item.disable(item, index) ? `${NAMESPACE}-disable` : ''
                }
                contentBox.innerHTML += `<li class="${NAMESPACE}-list  ${addClass}" contentboxindex=${index} >${item.title}` + `</li>`
            })
        }

        // 
        setStyle(contentBox, { position: 'absolute', zIndex: 100 })
        setStyle(parent, { position: 'relative' })
            // 插入元素
        parent.insertBefore(contentBox, element.nextSibling)
        setStyle(contentBox, { display: 'none' })

        this.contentBox = contentBox
            // 监听所有鼠标事件
        this.linstenAll()

    }
    linstenAll() {
        this.element.addEventListener('mousedown', e => { this.rlinstenHandle(e) })
            // 监听全局左键事件
        window.addEventListener('mousedown', e => { this.alinstenHandle(e) })
            // 监听鼠标左键事件
        this.contentBox.addEventListener('click', e => { this.llinstenHandle(e) })
    }
    removeAll() {
        // 移除监听事件
        this.element.removeEventListener('mousedown', e => { this.rlinstenHandle(e) })
        window.removeEventListener('mousedown', e => { this.alinstenHandle(e) })
        this.element.removeEventListener('click', e => { this.llinstenHandle(e) })
    }
    rlinstenHandle(e) {
        let x = e.clientX
        let y = e.clientY
        if (e.button !== 2) return

        if (e) {
            e.stopPropagation()
            this.element.oncontextmenu = event => {　 return false }
        }
        setStyle(this.contentBox, { left: x - this.parent.getBoundingClientRect().x, top: y - this.parent.getBoundingClientRect().y })
        getComputedStyle(this.contentBox)['display'] === 'none' && setStyle(this.contentBox, { display: '' })
    }
    alinstenHandle(e) {
        if (e.button === 2) { return }

        if (!e.path.includes(this.contentBox)) setStyle(this.contentBox, { display: 'none' })
    }
    llinstenHandle(e) {
        e.preventDefault()
        if (e.button === 2) return
        let activIndex = Object.getOwnPropertyDescriptor(e['target'].attributes, 'contentboxindex').value.value
        if (!this.options.menuList) {
            defaultList.forEach((item, index) => {
                parseInt(index) === parseInt(activIndex) && this.vnode.componentInstance.$emit('contentBoxClick', item) && setStyle(this.contentBox, { display: 'none' })
            })
        } else {
            this.options.menuList.forEach((item, index) => {
                if (typeof item.disable !== 'function' || (typeof item.disable === 'function' && !item.disable(item, index))) {
                    parseInt(index) === parseInt(activIndex) && typeof item.callback === 'function' && item.callback(item) && setStyle(this.contentBox, { display: 'none' })
                }
            })
        }
    }
    destroy() {
        //  
        this.removeAll()
    }
}
export default ContentBox