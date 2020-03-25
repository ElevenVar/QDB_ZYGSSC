import * as Rx from 'rxjs/Rx'

// 给元素绑定 键盘enter事件
const enter = {
  inserted: function(el, binding, vnode) {
    const keyDown$ = Rx.Observable.fromEvent(document, 'keydown')
    keyDown$
      .throttleTime(2000)
      .subscribe((e) => {
        e && e.keyCode === 13 && typeof binding.value === 'function' && binding.value()
      })
  }
}

export default enter
