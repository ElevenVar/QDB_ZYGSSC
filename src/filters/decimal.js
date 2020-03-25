/*
 * 保留小数两位
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @decimal
 */
export default (floatvar) => {
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
