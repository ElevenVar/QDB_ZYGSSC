// import * as Rx from 'rxjs/Rx'

// 给元素绑定 鼠标事件
/* eslint-disable */

let select2 = {
  inserted: function(el, binding, vnode) {
    let options = binding.value || {};

    $(el).select2(options).on('select2:select', (e) => {
      // v-model looks for
      // - an event named "change"
      // - a value with property path "$event.target.value"
      el.dispatchEvent(new Event('change', { target: e.target })); //说好的双向绑定，竟然不安套路
    });
  },
  update: function(el, binding, vnode) {
    $(el).trigger('change');
  }
}

export default select2
