// methods 统一封装

/*
 * 请求封装
 * @author kraml
 * @date 2019年8月2日
 *
 *----------------------------------------------------------------------
 *
 * @get  get请求
 * @post post请求
 * @put  put请求
 * @del  del请求
 */
import axios from '@/service/interceptor'

export default {
    get,
    post,
    put,
    del
}

function get(url, options) {
    return axios.get(url, options)
}

function post(url, params, options) {
    return axios.post(url, params, options)
}

function put(url, params, options) {
    return axios.put(url, params, options)
}

function del(url, params, options) {
    return axios.delete(url, params, options)
}