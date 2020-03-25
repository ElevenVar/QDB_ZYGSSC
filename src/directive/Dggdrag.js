// import * as Rx from 'rxjs/Rx'

// 给元素绑定 鼠标事件
/* eslint-disable */


let drag = {
  inserted: function (el, binding, vnode) {
    el.style.cssText = 'position:absolute;z-index:1000;user-select:none;'
    el.style.cssText += binding.value.style || ''
    if (binding.value.frontier && binding.value.cursor === true) {
      el.style.cursor = 'move';
    }

    let $bg = document.createElement('div')
    $bg.id = 'bg'
    $bg.style.cssText = 'position:absolute;margin:auto;width:100%;top:0;left:0;right:0;'
    el.parentNode.appendChild($bg)

    let bg = document.getElementById('bg');
    bg.style.zIndex = el.style.zIndex - 1
  },
  bind: function (el, binding, vnode) {
    el.onmousedown = (e) => {
      let disx = e.pageX - el.offsetLeft
      let disy = e.pageY - el.offsetTop
      let overX = el.parentNode.clientWidth - el.clientWidth
      let overY = el.parentNode.clientHeight - el.clientHeight
      document.onmousemove = function (e) {
        let moveX = e.pageX - disx
        let moveY = e.pageY - disy
        let $bg = document.getElementById('bg');
        $bg.style.height = '100%'
        if (binding.value.frontier && binding.value.frontier === true) {
          if (moveX <= 0) {
            moveX = 0;
          }
          if (moveX > overX) {
            moveX = overX;
          }
          if (moveY <= 0) {
            moveY = 0
          }
          if (moveY > overY) {
            moveY = overY;
          }
        }

        if (binding.value.mode && binding.value.mode === 'updown') {
          el.style.top = moveY + 'px'
        } else if (binding.value.mode && binding.value.mode === 'leftright') {
          el.style.left = moveX + 'px'
        } else {
          el.style.left = moveX + 'px'
          el.style.top = moveY + 'px'
        }
      }
      document.onmouseup = function () {
        let $bg = document.getElementById('bg');
        document.onmousemove = document.onmouseup = null
        $bg.style.height = null
      }
    }

    // el.style.position = 'fixed'
    // el.style.zIndex = 10000
    // el.style.left = 200 + "px"
    //
    //
    // // 计算视口宽高、拖拽元素的宽高
    // var winWidth = document.documentElement.clientWidth,
    //   winHeight = document.documentElement.clientHeight,
    //   elWidth = el.offsetWidth,
    //   elHeight = el.offsetHeight
    //
    // el.onmousedown = function (event) {
    //   event = event || window.event
    //   event.preventDefault ? event.preventDefault() : event.returnValue = false
    //   // 获取元素在body中的光标坐标
    //   var _offsetX = event.offsetX,
    //     _offsetY = event.offsetY
    //
    //   document.onmousemove = function (event) {
    //     event = event || window.event
    //     var _clientX = event.clientX,
    //       _clientY = event.clientY
    //
    //     //计算拖拽元素的定位
    //     var _left = _clientX - _offsetX,
    //       _top = _clientY - _offsetY
    //
    //     // 判断，限定范围
    //     if (_left < 0) // 左
    //     // _left = 0
    //       return
    //     else if (_left > winWidth - elWidth) // 右
    //     // _left = winWidth - elWidth
    //       return
    //     if (_top < 0) // 上
    //       _top = 0
    //     else if (_top > winHeight - elHeight) // 下
    //       _top = winHeight - elHeight
    //
    //     // 设置元素的CSS定位
    //     el.style.left = _left + 'px',
    //       el.style.top = _top + 'px'
    //   }
    // },
    //   document.onmouseup = function (event) {
    //     document.onmousemove = null
    //   }
  },

}


export default drag
