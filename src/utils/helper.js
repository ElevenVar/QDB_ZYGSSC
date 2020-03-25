import lodash from 'lodash'
/*
 * 工具函数
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 *  @objToString 请求的时候 对象自动拼接
 *  @decimal  保留两位小数
 *  @getOptionsValue  获取option对应的值
 *  @setStyle   传入元素和要设置的值
 */

export default {
  objToString,
  decimal,
  getOptionsValue,
  setStyle
}
// 对象转为字符串  访问请求时用
export function objToString(obj) {
  let str = '?'
  for (const item in obj) {
    str = str + item + '=' + obj[item] + '&'
  }
  const strs = str.substring(0, str.length - 1).replace(/\+/g, '%2B').replace(/\#/g, '%23')
  return strs
}
// 保留2位小数
export function decimal(floatvar) {
  var fX = parseFloat(floatvar)
  if (isNaN(fX)) {
    return ''
  }
  fX = Math.round(fX * 100) / 100
  var sX = fX.toString()
  var posDecimal = sX.indexOf('.')
  if (posDecimal < 0) {
    posDecimal = sX.length
    sX += '.'
  }
  while (sX.length <= posDecimal + 2) {
    sX += '0'
  }
  return sX
}
//

export function getOptionsValue(options, obj) {
  let data = ''
  if (options[obj.name]) {
    options[obj.name].forEach(element => {
      if (obj.value && toString(element.value) === toString(obj.value)) {
        data = element.label
      }
    })
  }
  return data
}

function forEach(data, callback) {
  if (data && typeof callback === 'function') {
    if (Array.isArray(data) || lodash.isNumber(data.length) /* array-like */) {
      const {
        length
      } = data
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

export function setStyle(element, styles) {
  const REGEXP_SUFFIX = /^(?:width|height|left|top|marginLeft|marginTop)$/

  const {
    style
  } = element
  forEach(styles, (value, property) => {
    if (REGEXP_SUFFIX.test(property) && lodash.isNumber(value)) {
      value += 'px'
    }
    style[property] = value
  })
}
