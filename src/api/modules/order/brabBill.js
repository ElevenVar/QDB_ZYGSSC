import method from '@/api/method'
import {
  objToString
} from '@/utils/helper'
// åˆ—è¡¨
export function get_grab_order_page(params) {
  return method.post('qdsproduction/api/portal/production/sc_order/v1/get_grab_order_page.do', params)
}

// 动态搜索
export function find_product(params) {
  return method.post(`qdsflsc/api/white/common/v1/search_product.do`, params)
}

// 获取抢单中列表
export function find_grab_order_with_page(params) {
  return method.post(`qdsproduction/api/portal/production/sc_order/v1/find_grab_order_with_page.do`, params)
}

