import method from '@/api/method'
export function postLogin(params) {
  return method.post('https://api.apiopen.top/getJoke?page=1&count=2&type=video', params, { isloading: true }) //  测试接口
}
