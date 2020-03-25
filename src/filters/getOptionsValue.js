/**
 * 过滤器
 *
 */
export default (options, obj) => {
  let data = ''
  options[obj.name] &&
    options[obj.name].forEach(element => {
      if (obj.value && toString(element.value) === toString(obj.value)) {
        data = element.label
      }
    })
  return data
}
