const DialogDrag = {
  inserted: function(el, binding, vnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    // dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;user-select:none;'
    dragDom.style.cssText += ';position:absolute;margin:auto;top:15vh;left:0;right:0;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    // const sty = (function () {
    //   if (window.document.currentStyle) {
    //     return (dom, attr) => dom.currentStyle[attr]
    //   } else {
    //     return (dom, attr) => getComputedStyle(dom, false)[attr]
    //   }
    // })()

    dialogHeaderEl.onmousedown = (e) => {
      const disx = e.pageX - dragDom.offsetLeft
      const disy = e.pageY - dragDom.offsetTop
      const overX = document.body.clientWidth - dragDom.clientWidth
      const overY = document.body.clientHeight - dragDom.clientHeight
      // console.log('X:' + e.pageX + ' | Y:' + e.pageY + '\n' +
      //   'offsetLeft:' + dragDom.offsetLeft + ' | offsetTop:' + dragDom.offsetTop)
      document.onmousemove = function(e) {
        let moveX = e.pageX - disx
        let moveY = e.pageY - disy
        if (binding.value.frontier && binding.value.frontier === true) {
          if (moveX <= 0) {
            moveX = 0
          }
          if (moveX > overX) {
            moveX = overX
          }
          if (moveY <= 0) {
            moveY = 0
          }
          if (moveY > overY) {
            moveY = overY
          }
        }
        dragDom.style.left = moveX + 'px'
        dragDom.style.top = moveY + 'px'
        dragDom.style.right = null
        el.style.height = '100%'
      }
      document.onmouseup = function() {
        document.onmousemove = document.onmouseup = null
        el.style.height = null
      }
    }

    // dialogHeaderEl.onmousedown = (e) => {
    //   // 鼠标按下，计算当前元素距离可视区的距离
    //   const disX = e.clientX - dialogHeaderEl.offsetLeft
    //   const disY = e.clientY - dialogHeaderEl.offsetTop
    //
    //   const screenWidth = document.body.clientWidth // body当前宽度
    //   const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)
    //
    //   const dragDomWidth = dragDom.offsetWidth // 对话框宽度
    //   const dragDomheight = dragDom.offsetHeight // 对话框高度
    //
    //   const minDragDomLeft = dragDom.offsetLeft
    //   const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
    //
    //   const minDragDomTop = dragDom.offsetTop
    //   const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight
    //
    //
    //   // 获取到的值带px 正则匹配替换
    //   let styL = sty(dragDom, 'left')
    //   let styT = sty(dragDom, 'top')
    //
    //   // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    //   if(styL.includes('%')) {
    //     styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
    //     styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
    //   }else {
    //     styL = +styL.replace(/\px/g, '')
    //     styT = +styT.replace(/\px/g, '')
    //   };
    //
    //   document.onmousemove = function (e) {
    //     // 通过事件委托，计算移动的距离
    //     let left = e.clientX - disX
    //     let top = e.clientY - disY
    //
    //     // 边界处理
    //     if (-(left) > minDragDomLeft) {
    //       left = -(minDragDomLeft)
    //     } else if (left > maxDragDomLeft) {
    //       left = maxDragDomLeft
    //     }
    //
    //     if (-(top) > minDragDomTop) {
    //       top = -(minDragDomTop)
    //     } else if (top > maxDragDomTop) {
    //       top = maxDragDomTop
    //     }
    //
    //     // 移动当前元素
    //     dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
    //   }
    //
    //   document.onmouseup = function (e) {
    //     document.onmousemove = null
    //     document.onmouseup = null
    //   }
    // }
  }
}
export default DialogDrag
