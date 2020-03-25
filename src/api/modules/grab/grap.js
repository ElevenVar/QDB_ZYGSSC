import method from '@/api/method'
import { objToString } from '@/utils/helper'
// 获取待抢单列表
export function get_grap_list(params) {
  return method.post('qdsproduction/api/portal/production/sc_order/v1/get_grab_order_page.do', params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取订单详情
export function get_order_detail(params) {
  return method.get(`qdsflsc/api/portal/order/v1/get_production_order_details.do${objToString(params)}`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取订单详情
export function get_sc_order_by_id(params) {
  return method.get(`qdsproduction/api/portal/production/sc_order/v1/get_sc_order_by_id.do${objToString(params)}`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 抢单
export function rob_order(params) {
  return method.post('qdsproduction/api/portal/production/sc_order/v1/save_grab_store.do', params, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

// 获取二级业态
export function get_level2_yt(params) {
  return method.get(`qdsproduction/api/portal/production/sc_order/v1/tree_book_list.do${objToString(params)}`, {
    isXAuthToken: true,
    isXReqUserId: true
  })
}

