/*
 * 前端事件管理
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *
 */

const eventBus = {}

eventBus.clientList = {}

// 订阅事件，一个事件可以有多个对象订阅（通过name区分）
eventBus.addEventListener = function(event) {
  const params = Array.prototype.slice.call(arguments)
  if (params.length === 2) {
    params.splice(1, 0, null)
  }
  const _name = params[1] || 'noname'
  const _fn = params[2]
  if (!this.clientList[event]) {
    this.clientList[event] = {}
  }
  if (!this.clientList[event][_name]) {
    this.clientList[event][_name] = []
  }
  this.clientList[event][_name].push(_fn)
}

// 移除监听
eventBus.removeEventListener = function(event) {
  const params = Array.prototype.slice.call(arguments)
  if (params.length === 2) {
    params.splice(1, 0, null)
  }
  const _name = params[1] || 'noname'
  const _fn = params[2]
  if (!this.clientList[event]) {
    this.clientList[event] = {}
  }
  if (!this.clientList[event][_name]) {
    return
  }
  const arr = this.clientList[event][_name]
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === _fn) {
      arr.splice(i, 1)
    }
  }
}
// 发布事件
eventBus.dispatchEvent = function(event, name, ...rest) {
  const _name = name || 'noname'
  if (!eventBus.clientList[event] || !eventBus.clientList[event][_name]) {
    return true
  }
  if (!name) {
    eventBus.clientList[event][_name].forEach(fn => {
      fn(...rest)
    })
  } else {
    let result
    eventBus.clientList[event][_name].forEach(fn => {
      const b = fn(...rest)
      if (b === false) {
        result = b
      }
    })
    return result
  }
}

const EventBus = function() {
  return eventBus
}

EventBus.getInstance = (function() {
  let instance = null
  return function() {
    if (!instance) {
      instance = new EventBus()
    }
    return instance
  }
})()

export default EventBus.getInstance()
