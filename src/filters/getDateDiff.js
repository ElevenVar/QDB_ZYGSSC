/*
 * 时间过滤器 传入 stringTime为:年-月-日 时:分:秒
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @timeFilter
 */
export default (stringTime) => {
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const time1 = new Date().getTime(); // 当前的时间戳
  const time2 = Date.parse(new Date(stringTime)); // 指定时间的时间戳
  const time = time1 - time2;

  let result = null;
  if (time < 0) {
    result = '--';
  } else if (time / month >= 1) {
    result = parseInt(time / month) + '月前';
  } else if (time / week >= 1) {
    result = parseInt(time / week) + '周前';
  } else if (time / day >= 1) {
    result = parseInt(time / day) + '天前';
  } else if (time / hour >= 1) {
    result = parseInt(time / hour) + '小时前';
  } else if (time / minute >= 1) {
    result = parseInt(time / minute) + '分钟前';
  } else {
    result = '刚刚';
  }
  return result;
}
