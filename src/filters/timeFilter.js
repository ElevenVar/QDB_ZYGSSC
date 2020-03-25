import moment from 'moment'
/*
 * 时间过滤器
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @timeFilter
 */
export default (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!value) {
    return ''
  }
  if (moment(value).format(format) === 'Invalid date') {
    return ''
  }
  return moment(value).format(format)
}
